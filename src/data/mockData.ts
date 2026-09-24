// FDE Control Plane - Mock Data
// This data represents what the real system would produce from PostgreSQL + Redis + Ollama

export interface Tenant {
  id: string;
  name: string;
  created_at: string;
  status: 'active' | 'inactive';
  config: {
    model: string;
    temperature: number;
    top_k: number;
    similarity_threshold: number;
    confidence_threshold: number;
  };
  workflows_count: number;
  documents_count: number;
  runs_count: number;
}

export interface Workflow {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  steps: string[];
  created_at: string;
  updated_at: string;
  total_runs: number;
  success_rate: number;
  avg_latency_ms: number;
}

export interface WorkflowRun {
  id: string;
  tenant_id: string;
  workflow_id: string;
  workflow_name: string;
  status: 'completed' | 'failed' | 'running' | 'pending' | 'timeout';
  input: string;
  output: string;
  started_at: string;
  completed_at: string | null;
  latency_ms: number | null;
  model: string;
  tokens_input: number;
  tokens_output: number;
  confidence: number | null;
  tool_calls: ToolCall[];
  retrieved_documents: RetrievedDoc[];
  guardrails_triggered: string[];
  trace_id: string;
  error: string | null;
}

export interface ToolCall {
  tool: string;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  status: 'success' | 'failed' | 'pending_approval';
  latency_ms: number;
  risk_level: 'READ_ONLY' | 'LOW_RISK' | 'HIGH_RISK';
}

export interface RetrievedDoc {
  document_id: string;
  chunk_id: string;
  content: string;
  score: number;
  source: string;
}

export interface Document {
  id: string;
  tenant_id: string;
  name: string;
  type: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  chunks_count: number;
  size_bytes: number;
  created_at: string;
  processing_time_ms: number | null;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  risk_level: 'READ_ONLY' | 'LOW_RISK' | 'HIGH_RISK';
  permissions: string[];
  tenant_scope: string;
  timeout_ms: number;
  calls_total: number;
  calls_failed: number;
}

export interface Evaluation {
  id: string;
  name: string;
  workflow_id: string;
  status: 'completed' | 'running' | 'failed';
  total_cases: number;
  passed: number;
  failed: number;
  accuracy: number;
  relevance: number;
  groundedness: number;
  avg_latency_ms: number;
  created_at: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3' | 'SEV-4';
  status: 'open' | 'investigating' | 'mitigated' | 'resolved';
  affected_workflow: string;
  created_at: string;
  resolved_at: string | null;
  root_cause: string;
  mitigation: string;
  simulated: boolean;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  tenant_id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: string;
  ip_address: string;
}

export interface MetricPoint {
  timestamp: string;
  value: number;
}

// Tenants
export const tenants: Tenant[] = [
  {
    id: 'tenant-001',
    name: 'Acme Support',
    created_at: '2026-01-15T10:00:00Z',
    status: 'active',
    config: {
      model: 'qwen2.5:7b',
      temperature: 0.1,
      top_k: 5,
      similarity_threshold: 0.75,
      confidence_threshold: 0.75,
    },
    workflows_count: 3,
    documents_count: 10,
    runs_count: 1247,
  },
  {
    id: 'tenant-002',
    name: 'Globex Corp',
    created_at: '2026-02-01T14:30:00Z',
    status: 'active',
    config: {
      model: 'qwen2.5:7b',
      temperature: 0.2,
      top_k: 3,
      similarity_threshold: 0.80,
      confidence_threshold: 0.80,
    },
    workflows_count: 2,
    documents_count: 6,
    runs_count: 583,
  },
  {
    id: 'tenant-003',
    name: 'Initech',
    created_at: '2026-03-10T09:00:00Z',
    status: 'active',
    config: {
      model: 'llama3.1:8b',
      temperature: 0.15,
      top_k: 5,
      similarity_threshold: 0.70,
      confidence_threshold: 0.70,
    },
    workflows_count: 1,
    documents_count: 4,
    runs_count: 215,
  },
];

// Workflows
export const workflows: Workflow[] = [
  {
    id: 'wf-001',
    tenant_id: 'tenant-001',
    name: 'support-triage',
    description: 'Classifies incoming support tickets, retrieves relevant knowledge, and generates resolution suggestions.',
    status: 'active',
    steps: ['classify_ticket', 'retrieve_knowledge', 'retrieve_customer_context', 'generate_resolution', 'evaluate_confidence', 'human_approval', 'finalize'],
    created_at: '2026-01-15T10:30:00Z',
    updated_at: '2026-03-01T08:00:00Z',
    total_runs: 847,
    success_rate: 94.2,
    avg_latency_ms: 3420,
  },
  {
    id: 'wf-002',
    tenant_id: 'tenant-001',
    name: 'order-investigation',
    description: 'Investigates order-related issues by retrieving customer and order data, then generating resolution.',
    status: 'active',
    steps: ['parse_order_id', 'retrieve_order', 'retrieve_customer', 'check_service_status', 'generate_resolution', 'finalize'],
    created_at: '2026-01-20T11:00:00Z',
    updated_at: '2026-02-28T15:00:00Z',
    total_runs: 256,
    success_rate: 91.8,
    avg_latency_ms: 2890,
  },
  {
    id: 'wf-003',
    tenant_id: 'tenant-001',
    name: 'service-status',
    description: 'Checks service health and generates customer-facing status updates.',
    status: 'active',
    steps: ['check_service_status', 'retrieve_knowledge', 'generate_update', 'finalize'],
    created_at: '2026-02-05T09:00:00Z',
    updated_at: '2026-03-05T10:00:00Z',
    total_runs: 144,
    success_rate: 97.1,
    avg_latency_ms: 1850,
  },
  {
    id: 'wf-004',
    tenant_id: 'tenant-002',
    name: 'billing-inquiry',
    description: 'Handles billing-related customer inquiries with tool calls to billing system.',
    status: 'active',
    steps: ['classify_inquiry', 'retrieve_billing_data', 'generate_response', 'evaluate_confidence', 'finalize'],
    created_at: '2026-02-01T15:00:00Z',
    updated_at: '2026-03-10T12:00:00Z',
    total_runs: 389,
    success_rate: 92.5,
    avg_latency_ms: 3100,
  },
  {
    id: 'wf-005',
    tenant_id: 'tenant-003',
    name: 'hr-policy-lookup',
    description: 'Retrieves and summarizes HR policy information for employee queries.',
    status: 'active',
    steps: ['classify_query', 'retrieve_policy', 'generate_summary', 'finalize'],
    created_at: '2026-03-10T09:30:00Z',
    updated_at: '2026-03-15T14:00:00Z',
    total_runs: 215,
    success_rate: 89.3,
    avg_latency_ms: 4200,
  },
];

// Workflow Runs
export const workflowRuns: WorkflowRun[] = [
  {
    id: 'run-001',
    tenant_id: 'tenant-001',
    workflow_id: 'wf-001',
    workflow_name: 'support-triage',
    status: 'completed',
    input: 'I cannot access my account. I have tried resetting my password but it says the link has expired.',
    output: 'Based on the account access documentation, password reset links expire after 24 hours. Please request a new password reset from the login page. If you continue to experience issues, verify your email address is correct in our system.',
    started_at: '2026-03-15T14:23:00Z',
    completed_at: '2026-03-15T14:23:04Z',
    latency_ms: 3820,
    model: 'qwen2.5:7b',
    tokens_input: 1247,
    tokens_output: 189,
    confidence: 0.92,
    tool_calls: [
      { tool: 'get_customer', input: { email: 'user@example.com' }, output: { id: 'cust-123', name: 'John Doe', status: 'active' }, status: 'success', latency_ms: 45, risk_level: 'READ_ONLY' },
      { tool: 'search_knowledge', input: { query: 'password reset expired' }, output: { results: 3 }, status: 'success', latency_ms: 120, risk_level: 'READ_ONLY' },
    ],
    retrieved_documents: [
      { document_id: 'doc-001', chunk_id: 'chunk-003', content: 'Password reset links expire after 24 hours. Users should request a new reset link from the login page.', score: 0.94, source: 'account-access.md' },
      { document_id: 'doc-002', chunk_id: 'chunk-007', content: 'If password reset fails, verify the email address matches the account registration.', score: 0.82, source: 'troubleshooting-guide.md' },
    ],
    guardrails_triggered: [],
    trace_id: 'trace-abc-001',
    error: null,
  },
  {
    id: 'run-002',
    tenant_id: 'tenant-001',
    workflow_id: 'wf-001',
    workflow_name: 'support-triage',
    status: 'completed',
    input: 'My order #ORD-4521 has not arrived. It was supposed to be delivered 3 days ago.',
    output: 'Order #ORD-4521 is currently in transit. The carrier shows it was delayed due to weather conditions. Expected delivery is now March 18. Would you like me to create a follow-up ticket if it does not arrive by then?',
    started_at: '2026-03-15T14:25:00Z',
    completed_at: '2026-03-15T14:25:03Z',
    latency_ms: 2950,
    model: 'qwen2.5:7b',
    tokens_input: 1580,
    tokens_output: 234,
    confidence: 0.88,
    tool_calls: [
      { tool: 'get_order', input: { order_id: 'ORD-4521' }, output: { id: 'ORD-4521', status: 'in_transit', eta: '2026-03-18' }, status: 'success', latency_ms: 67, risk_level: 'READ_ONLY' },
      { tool: 'get_customer', input: { order_id: 'ORD-4521' }, output: { id: 'cust-456', name: 'Jane Smith' }, status: 'success', latency_ms: 38, risk_level: 'READ_ONLY' },
      { tool: 'check_service_status', input: { service: 'shipping' }, output: { status: 'degraded', reason: 'weather_delay' }, status: 'success', latency_ms: 52, risk_level: 'READ_ONLY' },
    ],
    retrieved_documents: [
      { document_id: 'doc-003', chunk_id: 'chunk-012', content: 'Shipping delays due to weather are tracked in the service status dashboard. Customers should be informed of updated ETAs.', score: 0.89, source: 'shipping-policy.md' },
    ],
    guardrails_triggered: [],
    trace_id: 'trace-abc-002',
    error: null,
  },
  {
    id: 'run-003',
    tenant_id: 'tenant-001',
    workflow_id: 'wf-001',
    workflow_name: 'support-triage',
    status: 'completed',
    input: 'I want a refund for my subscription. I was charged twice this month.',
    output: 'I can see a duplicate charge on your account from March 1st. I am escalating this to our billing team for immediate refund processing. You should see the refund within 3-5 business days.',
    started_at: '2026-03-15T14:28:00Z',
    completed_at: '2026-03-15T14:28:05Z',
    latency_ms: 4650,
    model: 'qwen2.5:7b',
    tokens_input: 1890,
    tokens_output: 312,
    confidence: 0.71,
    tool_calls: [
      { tool: 'get_customer', input: { email: 'customer@example.com' }, output: { id: 'cust-789', name: 'Bob Wilson' }, status: 'success', latency_ms: 41, risk_level: 'READ_ONLY' },
      { tool: 'search_knowledge', input: { query: 'duplicate charge refund policy' }, output: { results: 2 }, status: 'success', latency_ms: 98, risk_level: 'READ_ONLY' },
    ],
    retrieved_documents: [
      { document_id: 'doc-004', chunk_id: 'chunk-018', content: 'Duplicate charges should be escalated to billing team for immediate refund. Standard refund timeline is 3-5 business days.', score: 0.91, source: 'refund-policy.md' },
    ],
    guardrails_triggered: ['confidence_below_threshold'],
    trace_id: 'trace-abc-003',
    error: null,
  },
  {
    id: 'run-004',
    tenant_id: 'tenant-001',
    workflow_id: 'wf-002',
    workflow_name: 'order-investigation',
    status: 'failed',
    input: 'Check order ORD-9999',
    output: '',
    started_at: '2026-03-15T14:30:00Z',
    completed_at: '2026-03-15T14:30:31Z',
    latency_ms: 31000,
    model: 'qwen2.5:7b',
    tokens_input: 0,
    tokens_output: 0,
    confidence: null,
    tool_calls: [
      { tool: 'get_order', input: { order_id: 'ORD-9999' }, output: null, status: 'failed', latency_ms: 30000, risk_level: 'READ_ONLY' },
    ],
    retrieved_documents: [],
    guardrails_triggered: ['timeout'],
    trace_id: 'trace-abc-004',
    error: 'Tool call timeout: get_order exceeded 30s limit',
  },
  {
    id: 'run-005',
    tenant_id: 'tenant-001',
    workflow_id: 'wf-003',
    workflow_name: 'service-status',
    status: 'completed',
    input: 'What is the current status of the payment processing service?',
    output: 'Payment processing service is currently operational. All systems are functioning normally. Last health check: 2 minutes ago. No incidents reported in the last 24 hours.',
    started_at: '2026-03-15T14:32:00Z',
    completed_at: '2026-03-15T14:32:02Z',
    latency_ms: 1850,
    model: 'qwen2.5:7b',
    tokens_input: 890,
    tokens_output: 156,
    confidence: 0.97,
    tool_calls: [
      { tool: 'check_service_status', input: { service: 'payment' }, output: { status: 'operational', last_check: '2m ago' }, status: 'success', latency_ms: 34, risk_level: 'READ_ONLY' },
    ],
    retrieved_documents: [
      { document_id: 'doc-005', chunk_id: 'chunk-022', content: 'Service status checks should include last health check time and incident history.', score: 0.88, source: 'service-status-guide.md' },
    ],
    guardrails_triggered: [],
    trace_id: 'trace-abc-005',
    error: null,
  },
  {
    id: 'run-006',
    tenant_id: 'tenant-001',
    workflow_id: 'wf-001',
    workflow_name: 'support-triage',
    status: 'running',
    input: 'The API integration is returning 500 errors intermittently. Our logs show timeouts on the /v2/data endpoint.',
    output: '',
    started_at: '2026-03-15T14:35:00Z',
    completed_at: null,
    latency_ms: null,
    model: 'qwen2.5:7b',
    tokens_input: 2340,
    tokens_output: 0,
    confidence: null,
    tool_calls: [
      { tool: 'get_customer', input: { api_key: 'ak_live_xxx' }, output: { id: 'cust-321', name: 'Tech Corp' }, status: 'success', latency_ms: 52, risk_level: 'READ_ONLY' },
      { tool: 'check_service_status', input: { service: 'api-v2' }, output: { status: 'investigating' }, status: 'success', latency_ms: 41, risk_level: 'READ_ONLY' },
    ],
    retrieved_documents: [
      { document_id: 'doc-006', chunk_id: 'chunk-031', content: 'API v2 intermittent 500 errors are typically related to database connection pool exhaustion.', score: 0.87, source: 'api-troubleshooting.md' },
      { document_id: 'doc-007', chunk_id: 'chunk-035', content: 'When investigating API errors, check service status dashboard first, then review customer-specific logs.', score: 0.83, source: 'incident-response.md' },
    ],
    guardrails_triggered: [],
    trace_id: 'trace-abc-006',
    error: null,
  },
];

// Documents
export const documents: Document[] = [
  { id: 'doc-001', tenant_id: 'tenant-001', name: 'account-access.md', type: 'md', status: 'COMPLETED', chunks_count: 12, size_bytes: 4520, created_at: '2026-01-16T09:00:00Z', processing_time_ms: 2340 },
  { id: 'doc-002', tenant_id: 'tenant-001', name: 'troubleshooting-guide.md', type: 'md', status: 'COMPLETED', chunks_count: 24, size_bytes: 12800, created_at: '2026-01-16T09:05:00Z', processing_time_ms: 5670 },
  { id: 'doc-003', tenant_id: 'tenant-001', name: 'shipping-policy.md', type: 'md', status: 'COMPLETED', chunks_count: 8, size_bytes: 3200, created_at: '2026-01-17T10:00:00Z', processing_time_ms: 1890 },
  { id: 'doc-004', tenant_id: 'tenant-001', name: 'refund-policy.md', type: 'md', status: 'COMPLETED', chunks_count: 6, size_bytes: 2100, created_at: '2026-01-17T10:30:00Z', processing_time_ms: 1450 },
  { id: 'doc-005', tenant_id: 'tenant-001', name: 'service-status-guide.md', type: 'md', status: 'COMPLETED', chunks_count: 10, size_bytes: 5600, created_at: '2026-01-18T11:00:00Z', processing_time_ms: 2890 },
  { id: 'doc-006', tenant_id: 'tenant-001', name: 'api-troubleshooting.md', type: 'md', status: 'COMPLETED', chunks_count: 18, size_bytes: 8900, created_at: '2026-01-19T09:00:00Z', processing_time_ms: 4230 },
  { id: 'doc-007', tenant_id: 'tenant-001', name: 'incident-response.md', type: 'md', status: 'COMPLETED', chunks_count: 15, size_bytes: 7200, created_at: '2026-01-20T10:00:00Z', processing_time_ms: 3560 },
  { id: 'doc-008', tenant_id: 'tenant-001', name: 'billing-faq.pdf', type: 'pdf', status: 'COMPLETED', chunks_count: 20, size_bytes: 15600, created_at: '2026-01-21T11:00:00Z', processing_time_ms: 6780 },
  { id: 'doc-009', tenant_id: 'tenant-001', name: 'product-catalog.txt', type: 'txt', status: 'COMPLETED', chunks_count: 32, size_bytes: 24000, created_at: '2026-01-22T09:00:00Z', processing_time_ms: 8900 },
  { id: 'doc-010', tenant_id: 'tenant-001', name: 'onboarding-guide.md', type: 'md', status: 'PROCESSING', chunks_count: 0, size_bytes: 6700, created_at: '2026-03-15T14:00:00Z', processing_time_ms: null },
];

// Tools
export const tools: Tool[] = [
  { id: 'tool-001', name: 'get_customer', description: 'Retrieve customer information by ID or email', risk_level: 'READ_ONLY', permissions: ['read:customer'], tenant_scope: 'tenant-001', timeout_ms: 5000, calls_total: 2341, calls_failed: 12 },
  { id: 'tool-002', name: 'get_order', description: 'Retrieve order details by order ID', risk_level: 'READ_ONLY', permissions: ['read:order'], tenant_scope: 'tenant-001', timeout_ms: 5000, calls_total: 1876, calls_failed: 23 },
  { id: 'tool-003', name: 'get_ticket', description: 'Retrieve support ticket details', risk_level: 'READ_ONLY', permissions: ['read:ticket'], tenant_scope: 'tenant-001', timeout_ms: 5000, calls_total: 1543, calls_failed: 8 },
  { id: 'tool-004', name: 'search_knowledge', description: 'Search the knowledge base using semantic search', risk_level: 'READ_ONLY', permissions: ['read:knowledge'], tenant_scope: 'tenant-001', timeout_ms: 10000, calls_total: 3210, calls_failed: 45 },
  { id: 'tool-005', name: 'check_service_status', description: 'Check the operational status of internal services', risk_level: 'READ_ONLY', permissions: ['read:status'], tenant_scope: 'tenant-001', timeout_ms: 3000, calls_total: 987, calls_failed: 5 },
  { id: 'tool-006', name: 'create_ticket_note', description: 'Add a note to an existing support ticket', risk_level: 'LOW_RISK', permissions: ['write:ticket'], tenant_scope: 'tenant-001', timeout_ms: 5000, calls_total: 432, calls_failed: 3 },
  { id: 'tool-007', name: 'refund_customer', description: 'Process a refund for a customer', risk_level: 'HIGH_RISK', permissions: ['write:billing', 'admin:refund'], tenant_scope: 'tenant-001', timeout_ms: 15000, calls_total: 23, calls_failed: 1 },
  { id: 'tool-008', name: 'change_subscription', description: 'Modify a customer subscription plan', risk_level: 'HIGH_RISK', permissions: ['write:subscription'], tenant_scope: 'tenant-001', timeout_ms: 10000, calls_total: 8, calls_failed: 0 },
];

// Evaluations
export const evaluations: Evaluation[] = [
  {
    id: 'eval-001',
    name: 'Support Triage - Batch 1',
    workflow_id: 'wf-001',
    status: 'completed',
    total_cases: 20,
    passed: 17,
    failed: 3,
    accuracy: 0.85,
    relevance: 0.91,
    groundedness: 0.88,
    avg_latency_ms: 3420,
    created_at: '2026-03-10T10:00:00Z',
  },
  {
    id: 'eval-002',
    name: 'Support Triage - Batch 2',
    workflow_id: 'wf-001',
    status: 'completed',
    total_cases: 20,
    passed: 18,
    failed: 2,
    accuracy: 0.90,
    relevance: 0.93,
    groundedness: 0.91,
    avg_latency_ms: 3180,
    created_at: '2026-03-12T14:00:00Z',
  },
  {
    id: 'eval-003',
    name: 'Order Investigation - Batch 1',
    workflow_id: 'wf-002',
    status: 'completed',
    total_cases: 15,
    passed: 12,
    failed: 3,
    accuracy: 0.80,
    relevance: 0.87,
    groundedness: 0.84,
    avg_latency_ms: 2890,
    created_at: '2026-03-13T09:00:00Z',
  },
  {
    id: 'eval-004',
    name: 'Support Triage - Regression',
    workflow_id: 'wf-001',
    status: 'running',
    total_cases: 25,
    passed: 0,
    failed: 0,
    accuracy: 0,
    relevance: 0,
    groundedness: 0,
    avg_latency_ms: 0,
    created_at: '2026-03-15T14:00:00Z',
  },
];

// Incidents
export const incidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Workflow latency increased — p95 exceeded 10s',
    severity: 'SEV-2',
    status: 'resolved',
    affected_workflow: 'support-triage',
    created_at: '2026-03-08T16:30:00Z',
    resolved_at: '2026-03-08T18:45:00Z',
    root_cause: 'Large retrieved context (12 chunks) increased model inference time significantly. Default top_k was set too high for the 7B model.',
    mitigation: 'Reduced top_k from 10 to 5 and added context size monitoring. Latency returned to target.',
    simulated: true,
  },
  {
    id: 'INC-002',
    title: 'Redis connection pool exhaustion',
    severity: 'SEV-1',
    status: 'resolved',
    affected_workflow: 'all',
    created_at: '2026-03-10T03:15:00Z',
    resolved_at: '2026-03-10T04:30:00Z',
    root_cause: 'Worker process leak caused Redis connections to accumulate. Connection pool limit reached.',
    mitigation: 'Restarted workers, increased pool size, added connection monitoring alert.',
    simulated: true,
  },
  {
    id: 'INC-003',
    title: 'Tool timeout — get_order service degraded',
    severity: 'SEV-3',
    status: 'mitigated',
    affected_workflow: 'order-investigation',
    created_at: '2026-03-14T11:00:00Z',
    resolved_at: null,
    root_cause: 'Upstream order service experiencing high load, causing tool calls to exceed timeout.',
    mitigation: 'Increased timeout temporarily, added circuit breaker. Awaiting upstream fix.',
    simulated: true,
  },
  {
    id: 'INC-004',
    title: 'Ollama model loading failure after restart',
    severity: 'SEV-2',
    status: 'open',
    affected_workflow: 'all',
    created_at: '2026-03-15T08:00:00Z',
    resolved_at: null,
    root_cause: 'Investigating — model failed to load after container restart. Possible memory pressure.',
    mitigation: 'Manual model reload in progress. Fallback to cached responses enabled.',
    simulated: true,
  },
];

// Audit Events
export const auditEvents: AuditEvent[] = [
  { id: 'audit-001', timestamp: '2026-03-15T14:35:00Z', tenant_id: 'tenant-001', user_id: 'user-001', action: 'workflow.execute', resource_type: 'workflow', resource_id: 'wf-001', details: 'Executed support-triage workflow', ip_address: '192.168.1.100' },
  { id: 'audit-002', timestamp: '2026-03-15T14:30:00Z', tenant_id: 'tenant-001', user_id: 'user-001', action: 'tool.approve', resource_type: 'tool_call', resource_id: 'tc-045', details: 'Approved high-risk tool: refund_customer', ip_address: '192.168.1.100' },
  { id: 'audit-003', timestamp: '2026-03-15T14:25:00Z', tenant_id: 'tenant-001', user_id: 'user-002', action: 'document.upload', resource_type: 'document', resource_id: 'doc-010', details: 'Uploaded onboarding-guide.md', ip_address: '192.168.1.101' },
  { id: 'audit-004', timestamp: '2026-03-15T14:20:00Z', tenant_id: 'tenant-001', user_id: 'user-001', action: 'workflow.update', resource_type: 'workflow', resource_id: 'wf-001', details: 'Updated confidence_threshold to 0.75', ip_address: '192.168.1.100' },
  { id: 'audit-005', timestamp: '2026-03-15T14:15:00Z', tenant_id: 'tenant-001', user_id: 'user-003', action: 'evaluation.run', resource_type: 'evaluation', resource_id: 'eval-004', details: 'Started evaluation: Support Triage - Regression', ip_address: '192.168.1.102' },
  { id: 'audit-006', timestamp: '2026-03-15T14:10:00Z', tenant_id: 'tenant-001', user_id: 'user-001', action: 'tenant.config.update', resource_type: 'tenant', resource_id: 'tenant-001', details: 'Updated retrieval top_k from 10 to 5', ip_address: '192.168.1.100' },
  { id: 'audit-007', timestamp: '2026-03-15T14:05:00Z', tenant_id: 'tenant-002', user_id: 'user-004', action: 'workflow.execute', resource_type: 'workflow', resource_id: 'wf-004', details: 'Executed billing-inquiry workflow', ip_address: '10.0.0.50' },
  { id: 'audit-008', timestamp: '2026-03-15T14:00:00Z', tenant_id: 'tenant-001', user_id: 'user-001', action: 'tool.register', resource_type: 'tool', resource_id: 'tool-007', details: 'Registered high-risk tool: refund_customer', ip_address: '192.168.1.100' },
];

// Metrics time series data
export const generateTimeSeriesData = (days: number = 7) => {
  const data = [];
  const now = new Date();
  for (let i = days * 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    data.push({
      timestamp: time.toISOString(),
      runs: Math.floor(Math.random() * 20) + 5,
      success: Math.floor(Math.random() * 18) + 4,
      failures: Math.floor(Math.random() * 3),
      latency_p50: 2000 + Math.random() * 1500,
      latency_p95: 4000 + Math.random() * 3000,
      tokens: Math.floor(Math.random() * 50000) + 10000,
      rag_latency: 100 + Math.random() * 200,
    });
  }
  return data;
};

export const metricsSummary = {
  total_runs: 1247,
  successful_runs: 1172,
  failed_runs: 45,
  running_runs: 3,
  pending_runs: 7,
  success_rate: 94.0,
  p50_latency_ms: 2840,
  p95_latency_ms: 5230,
  p99_latency_ms: 8100,
  total_tokens: 4_892_340,
  avg_rag_latency_ms: 187,
  total_tool_calls: 8921,
  tool_failure_rate: 1.2,
  open_incidents: 2,
  evaluations_completed: 3,
  avg_accuracy: 0.85,
  avg_relevance: 0.90,
  avg_groundedness: 0.88,
};
