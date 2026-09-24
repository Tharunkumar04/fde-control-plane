# FDE Control Plane

> **A production-grade, local-first Forward Deployed Engineer platform for AI workflow orchestration, RAG, tool integration, evaluation, and observability.**

![FDE Control Plane Dashboard](https://image.qwenlm.ai/generated-images/c4a86cbf-9055-490b-b479-5e7c886e5f42/_result.png)

---

## What is this?

FDE Control Plane is a portfolio-grade system that demonstrates the **complete Forward Deployed Engineer lifecycle** — from customer discovery through production deployment, observability, incident response, and customer handoff.

It is built around a realistic enterprise customer-support scenario where an AI platform automates ticket triage, knowledge retrieval, tool execution, and response generation — all with guardrails, evaluation, and full observability.

## Why does it exist?

To demonstrate that I can:

- Work with a customer to understand an ambiguous problem
- Design a technical solution with proper architecture
- Integrate AI (local LLMs) with production systems
- Build multi-tenant, secure, observable infrastructure
- Measure outcomes with real evaluation frameworks
- Debug failures and respond to incidents
- Hand the system back to the customer with documentation

## Customer Problem

**Customer:** Acme Support (example enterprise customer)

Acme receives thousands of support requests daily. Their current process is entirely manual:

```
Customer Ticket → Support Agent → Search Documentation → Check Customer Info
→ Check Order Info → Determine Priority → Draft Response → Human Review → Resolve
```

**Pain Points:**
- Manual ticket classification is slow and inconsistent
- Knowledge lookup is repetitive and error-prone
- No measurable AI quality or response accuracy
- Difficult auditing and limited observability
- Risky automated actions without guardrails
- No way to evaluate or iterate on AI performance

## Architecture

```
                         ┌─────────────────────┐
                         │   React Dashboard   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      FastAPI        │
                         │    Control Plane    │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          PostgreSQL            Redis             Ollama
           + pgvector           Streams          Local LLM
                 │                  │                  │
                 │                  ▼                  │
                 │              Worker                │
                 │                  │                  │
                 └──────────────────┼──────────────────┘
                                    │
                                    ▼
                         AI Workflow Runtime
                                    │
                  ┌─────────────────┼─────────────────┐
                  ▼                 ▼                 ▼
                 RAG              Tools           Guardrails
                  │                 │                 │
                  └─────────────────┼─────────────────┘
                                    ▼
                            Evaluation Engine
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                    Prometheus              Grafana
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Local-first (Ollama) | No cloud dependency, no API keys, runs on a 16GB Mac |
| PostgreSQL + pgvector | Single database for relational data + vector search |
| Redis Streams | Async workflow execution without blocking HTTP requests |
| Multi-tenant via tenant_id | Simple, effective isolation at the database level |
| Configurable workflows | Steps are reusable units, not hard-coded functions |
| Tool security pipeline | AI-generated calls never execute arbitrary code |

## Technology Stack

### Backend
- Python 3.12+, FastAPI, Pydantic, SQLAlchemy, Alembic
- PostgreSQL + pgvector, Redis
- pytest, Ruff, MyPy

### AI
- **Ollama** (local LLM — default: `qwen2.5:7b`)
- Model provider abstraction (not tightly coupled to Ollama)

### Frontend
- React, TypeScript, Vite, Tailwind CSS, Recharts

### Infrastructure
- Docker, Docker Compose
- Prometheus, Grafana
- OpenTelemetry (tracing)

### Optional
- AWS (Terraform architecture for future deployment — **not required**)

## Local Setup

### Prerequisites
- Docker & Docker Compose
- 16GB+ RAM recommended (for local LLM)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Tharunkumar04/fde-control-plane.git
cd fde-control-plane

# Setup environment
make setup

# Start all services
docker compose up --build

# Pull the AI model (one-time)
make model-pull

# Seed demo data (Acme Support tenant)
make seed
```

### Access the Dashboard

```
http://localhost:3000
```

Default credentials:
- Email: `admin@fde-control-plane.local`
- Password: `admin`

### Available Services

| Service | URL | Description |
|---------|-----|-------------|
| Dashboard | http://localhost:3000 | React frontend |
| API | http://localhost:8000 | FastAPI control plane |
| API Docs | http://localhost:8000/docs | Swagger UI |
| Prometheus | http://localhost:9090 | Metrics |
| Grafana | http://localhost:3001 | Dashboards |

## Demo Customer: Acme Support

The system ships with a fully configured demo tenant:

### Configuration
```yaml
tenant:
  name: Acme Support

ai:
  model: qwen2.5:7b
  temperature: 0.1

retrieval:
  top_k: 5
  similarity_threshold: 0.75

policies:
  confidence_threshold: 0.75

tools:
  allowed:
    - get_customer
    - get_order
    - search_knowledge
    - check_service_status
    - create_ticket_note
```

### Seeded Data
- **10 documents** (account-access.md, refund-policy.md, shipping-policy.md, etc.)
- **20 evaluation cases** (realistic support scenarios)
- **5 tools** (get_customer, get_order, search_knowledge, check_service_status, create_ticket_note)
- **3 workflows** (support-triage, order-investigation, service-status)

### Workflows

**support-triage:**
```
classify_ticket → retrieve_knowledge → retrieve_customer_context
→ generate_resolution → evaluate_confidence → human_approval → finalize
```

**order-investigation:**
```
parse_order_id → retrieve_order → retrieve_customer
→ check_service_status → generate_resolution → finalize
```

**service-status:**
```
check_service_status → retrieve_knowledge → generate_update → finalize
```

## Dashboard Preview

The dashboard provides a complete operational view:

### Pages
- **Dashboard** — Real-time metrics, charts, system status, architecture overview
- **Tenants** — Multi-tenant management with per-tenant configuration
- **Workflows** — Configurable AI workflow pipelines with step visualization
- **Workflow Detail** — Individual workflow with execution history and latency trends
- **Run Detail** — Full execution trace (Input → RAG → Model → Tools → Guardrails → Trace)
- **Knowledge** — RAG document management with pipeline visualization
- **Tools** — Tool registry with security pipeline and risk levels
- **Evaluations** — Quality metrics (accuracy, relevance, groundedness)
- **Observability** — Prometheus metrics, charts, OpenTelemetry traces
- **Audit** — Complete audit trail with tenant filtering
- **Incidents** — Incident management with severity, detection, root cause

## Evaluation

The system includes a real evaluation framework — **no fabricated numbers**.

### Metrics
- **Quality:** Accuracy, Relevance, Groundedness
- **Reliability:** Success rate, Failure rate, Timeout rate
- **Performance:** p50, p95, p99 latency
- **AI Usage:** Input tokens, Output tokens, Total tokens
- **Cost:** "Estimated Local Compute Cost" (since Ollama runs locally)

### Running Evaluations

```bash
make evaluate
```

This executes the real system against 20+ test cases in `examples/evaluation/support-triage.json`.

### Example Test Case
```json
{
  "id": "case-001",
  "input": "I cannot access my account",
  "expected_category": "authentication",
  "expected_source": "account-access.md"
}
```

### Results Format
All results are labeled as:
- **TARGET** — What we aim for
- **OBSERVED** — What was actually measured
- **SIMULATED** — Demonstration data (clearly marked)

## Observability

### Prometheus Metrics
```
http_requests_total
workflow_runs_total
workflow_success_total
workflow_failures_total
workflow_latency_seconds
model_requests_total
model_latency_seconds
tool_calls_total
tool_failures_total
tokens_total
rag_queries_total
rag_retrieval_latency_seconds
evaluation_runs_total
```

### Grafana Dashboards
Pre-provisioned dashboards for:
- Workflow Runs & Success Rate
- Latency (p50, p95, p99)
- AI Requests & Token Usage
- RAG Retrieval Latency
- Tool Failures

### OpenTelemetry Tracing
Every workflow run generates a trace:
```
HTTP Request → Workflow → RAG Retrieval → Model Call → Tool Calls → Guardrails → Evaluation
```

### Structured Logging
JSON logs with: timestamp, level, service, request_id, trace_id, tenant_id, workflow_id, run_id, event, duration, status

```json
{
  "level": "INFO",
  "event": "workflow_completed",
  "tenant_id": "tenant-001",
  "workflow_id": "wf-001",
  "run_id": "run-001",
  "latency_ms": 3820,
  "model": "qwen2.5:7b",
  "tokens_input": 1247,
  "tokens_output": 189,
  "confidence": 0.92
}
```

## Security

### Authentication & Authorization
- JWT-based authentication
- Bcrypt password hashing
- RBAC with 4 roles: ADMIN, ENGINEER, OPERATOR, VIEWER
- Tenant isolation at the database level

### Tool Security Pipeline
```
Tool Allowlist → Schema Validation → Authentication → Authorization
→ Tenant Validation → Risk Check → Human Approval (HIGH_RISK)
→ Execution → Audit Log
```

### Risk Levels
- **READ_ONLY** — Auto-approved (get_customer, get_order, search_knowledge)
- **LOW_RISK** — May require approval (create_ticket_note)
- **HIGH_RISK** — **Always requires human approval** (refund_customer, delete_customer, change_subscription)

### Guardrails
- Prompt injection detection
- PII detection
- Tool allowlist enforcement
- Maximum execution time
- Maximum tokens
- Confidence threshold (configurable per tenant)
- Human approval for low-confidence responses

### Tenant Isolation
Every query includes `tenant_id`. Automated tests verify that Tenant A cannot access Tenant B's data.

## Reliability

### Failure Handling
- Retries with exponential backoff
- Dead-letter queue for failed jobs
- Timeouts on all external calls
- Circuit breakers for degraded services
- Graceful shutdown

### Failure Injection
The system includes controlled failure scenarios for testing:
- Model timeout
- Redis unavailable
- Database unavailable
- Tool timeout
- Invalid tool input
- RAG failure
- Malformed model response
- Worker crash

### Load Testing
```bash
make load-test
```

Uses Locust to test:
- 10 concurrent users
- 25 concurrent users
- 50 concurrent users

Measures: throughput, p50, p95, p99, errors

## Incident Example

### SIMULATED INCIDENT: INC-001

**Title:** Workflow latency increased — p95 exceeded 10s

**Severity:** SEV-2

**Impact:** Support workflow execution became slow for ~2 hours 15 minutes.

**Detection:** Prometheus alert fired when p95 latency exceeded 10s for 5 minutes.

**Investigation:** Trace inspection showed large context (12 chunks) per request. Model inference time increased proportionally with context size.

**Root Cause:** `top_k` was set to 10 (too high for 7B model). Large retrieved context increased model inference time significantly.

**Mitigation:** Reduced `top_k` from 10 to 5. Added context size monitoring. Latency returned to target within 30 minutes.

**Prevention:**
- Added context-size monitoring alert
- Added per-chunk retrieval latency tracking
- Updated tenant configuration documentation

## FDE Workflow

The system demonstrates the complete FDE lifecycle:

```
Customer Problem → Discovery → Requirements → Solution Architecture
→ Customer Integration → AI Workflow → Deployment → Evaluation
→ Observability → Incident Response → Iteration → Customer Handoff
```

### Documentation
- [Customer Discovery](docs/customer-discovery.md)
- [Technical Requirements](docs/technical-requirements.md)
- [Solution Brief](docs/solution-brief.md)
- [Architecture](docs/architecture.md)
- [Integration Guide](docs/integration-guide.md)
- [Deployment Guide](docs/deployment-guide.md)
- [Evaluation](docs/evaluation.md)
- [Observability](docs/observability.md)
- [Security](docs/security.md)
- [Runbook](docs/runbook.md)
- [Incident Postmortem](docs/incident-postmortem.md)
- [Customer Handoff](docs/customer-handoff.md)
- [FDE Evidence Matrix](docs/fde-evidence.md)

### Architecture Decision Records
- ADR-001: Local-first architecture
- ADR-002: Ollama as default AI provider
- ADR-003: PostgreSQL + pgvector
- ADR-004: Redis Streams
- ADR-005: Async workflow execution
- ADR-006: Multi-tenant architecture
- ADR-007: Tool authorization model
- ADR-008: Evaluation methodology
- ADR-009: OpenTelemetry
- ADR-010: Optional AWS architecture

## Design Decisions & Trade-offs

### Why Local-First?
**Decision:** Use Ollama instead of cloud APIs.

**Trade-offs:**
- ✅ No API keys, no cloud account, no paid services
- ✅ Runs entirely on a Mac with Docker
- ✅ Full control over model selection and configuration
- ❌ Lower performance than cloud models
- ❌ Requires sufficient local hardware (16GB+ RAM)

**Rationale:** For a portfolio project demonstrating FDE capabilities, local-first removes barriers to entry and demonstrates the ability to work with constraints.

### Why PostgreSQL + pgvector?
**Decision:** Use a single database for both relational data and vector search.

**Trade-offs:**
- ✅ Simpler architecture (one database vs. two)
- ✅ Easier to maintain and backup
- ✅ Tenant isolation is straightforward
- ❌ Vector search performance may not match dedicated vector databases at scale
- ❌ Limited to pgvector's feature set

**Rationale:** For the scale of this system (thousands of documents, not millions), pgvector is sufficient and reduces operational complexity.

### Why Redis Streams?
**Decision:** Use Redis Streams for async workflow execution.

**Trade-offs:**
- ✅ Lightweight, fast, built into Redis
- ✅ Supports consumer groups for parallel processing
- ✅ Simpler than message brokers like RabbitMQ or Kafka
- ❌ Not as feature-rich as dedicated message brokers
- ❌ Redis is in-memory (data loss risk if not persisted)

**Rationale:** For async job processing at this scale, Redis Streams provides the right balance of simplicity and capability.

### Why Multi-Tenant via tenant_id?
**Decision:** Use row-level tenant isolation instead of separate databases or schemas.

**Trade-offs:**
- ✅ Simpler to implement and maintain
- ✅ Easier to query across tenants (for admin operations)
- ✅ Lower operational overhead
- ❌ Requires careful query construction to prevent cross-tenant access
- ❌ Noisy neighbor problem (one tenant can affect others)

**Rationale:** For this system's scale and use case, row-level isolation is sufficient and simpler than schema-per-tenant or database-per-tenant approaches.

## Future AWS Deployment

> **The reference implementation runs entirely locally. AWS is an optional production deployment target.**

The `infra/aws/` directory contains Terraform architecture for future deployment:
- ECS Fargate for API and Worker
- RDS PostgreSQL with pgvector
- ElastiCache Redis
- ECR for container images
- ALB for load balancing
- CloudWatch for logging and metrics
- Secrets Manager for credentials

**Not required for local development or demonstration.**

## Limitations

### Known Limitations
1. **Local LLM Performance:** Ollama models are slower than cloud APIs. p95 latency target is 8s (not 2s).
2. **Vector Search Scale:** pgvector is suitable for thousands of documents, not millions.
3. **Single Region:** The local implementation runs in a single region. AWS deployment would add multi-region support.
4. **Model Selection:** Limited to models available in Ollama. Cloud deployment could add GPT-4, Claude, etc.
5. **Authentication:** Local JWT auth. Production would add OAuth2/OIDC integration.

### What This Project Does NOT Do
- ❌ Require AWS account or cloud services
- ❌ Require paid API keys (OpenAI, Anthropic, etc.)
- ❌ Claim fake performance numbers (all metrics are TARGET, OBSERVED, or SIMULATED)
- ❌ Execute arbitrary AI-generated code (tool security pipeline prevents this)
- ❌ Auto-approve high-risk actions (human approval required)

## Development Commands

```bash
# Setup
make setup              # Install dependencies
make dev                # Start development servers
make down               # Stop all services
make logs               # View logs

# Testing
make test               # Run all tests
make test-unit          # Unit tests only
make test-integration   # Integration tests only
make test-e2e           # End-to-end tests only

# Code Quality
make lint               # Run linter
make format             # Format code
make typecheck          # Type checking

# Database
make migrate            # Run migrations
make seed               # Seed demo data

# AI Model
make model-pull         # Pull Ollama model

# Evaluation
make evaluate           # Run evaluation suite

# Load Testing
make load-test          # Run load tests

# Security
make security-scan      # Run security scan

# Docker
make docker-build       # Build Docker images
```

## Interview Demo

See [docs/interview-demo.md](docs/interview-demo.md) for a 10-minute demonstration script:

1. **Minute 1:** Explain customer problem
2. **Minute 2:** Show architecture
3. **Minute 3:** Show customer configuration
4. **Minute 4:** Upload knowledge
5. **Minute 5:** Execute workflow
6. **Minute 6:** Show RAG sources
7. **Minute 7:** Show tool execution
8. **Minute 8:** Show trace + metrics
9. **Minute 9:** Run evaluation
10. **Minute 10:** Explain incident + trade-offs

## Repository Structure

```
fde-control-plane/
├── apps/
│   ├── api/              # FastAPI control plane
│   ├── worker/           # Async workflow worker
│   └── dashboard/        # React frontend
├── packages/
│   ├── core/             # Shared utilities
│   ├── ai/               # AI provider abstraction
│   ├── retrieval/        # RAG engine
│   ├── tools/            # Tool registry
│   ├── workflows/        # Workflow engine
│   ├── evaluation/       # Evaluation framework
│   ├── observability/    # Metrics + tracing
│   └── security/         # Auth + RBAC
├── database/
│   └── migrations/       # Alembic migrations
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── examples/
│   ├── customer/         # Tenant configurations
│   ├── documents/        # Sample knowledge base
│   ├── workflows/        # Workflow definitions
│   └── evaluation/       # Test cases
├── monitoring/
│   ├── prometheus/       # Prometheus config
│   └── grafana/          # Grafana dashboards
├── infra/
│   └── aws/              # Terraform (optional)
├── docs/                 # FDE documentation
├── docker-compose.yml
├── Makefile
├── .env.example
├── pyproject.toml
└── README.md
```

## What I Learned

Building this system reinforced several key principles:

1. **Local-first reduces friction.** No cloud accounts or API keys means anyone can run it immediately.
2. **Observability is not optional.** You can't improve what you can't measure.
3. **Security must be layered.** Tool calls go through 8 validation steps before execution.
4. **Evaluation is hard but necessary.** Without it, you're flying blind on AI quality.
5. **Multi-tenancy requires discipline.** Every query must include tenant_id. No exceptions.
6. **Documentation is part of the product.** If it's not documented, it doesn't exist.
7. **Trade-offs are everywhere.** Every decision has pros and cons. Document them.
8. **Incidents are learning opportunities.** Even simulated ones teach valuable lessons.

## License

MIT

---

**Built by Tharunkumar04** — Demonstrating the complete FDE lifecycle from customer discovery to production handoff.
