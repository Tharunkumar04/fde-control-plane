import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  GitBranch,
  TrendingUp,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { metricsSummary, workflowRuns, generateTimeSeriesData, incidents } from '../data/mockData';

function MetricCard({ title, value, subtitle, icon: Icon, color, trend }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  trend?: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-400',
    blue: 'bg-blue-500/10 text-blue-400',
    amber: 'bg-amber-500/10 text-amber-400',
    red: 'bg-red-500/10 text-red-400',
    purple: 'bg-purple-500/10 text-purple-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-100">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const timeSeriesData = useMemo(() => generateTimeSeriesData(7), []);
  const recentRuns = workflowRuns.slice(0, 5);
  const openIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating');

  const chartData = timeSeriesData.filter((_, i) => i % 3 === 0).map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    runs: d.runs,
    success: d.success,
    latency: Math.round(d.latency_p50),
  }));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">FDE Control Plane — Real-time system overview</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 mb-8">
        <MetricCard
          title="Total Runs"
          value={metricsSummary.total_runs.toLocaleString()}
          subtitle="All time"
          icon={GitBranch}
          color="blue"
        />
        <MetricCard
          title="Success Rate"
          value={`${metricsSummary.success_rate}%`}
          subtitle={`${metricsSummary.successful_runs} successful`}
          icon={CheckCircle2}
          color="emerald"
        />
        <MetricCard
          title="Failed Runs"
          value={metricsSummary.failed_runs}
          subtitle="Requires attention"
          icon={XCircle}
          color="red"
        />
        <MetricCard
          title="p50 Latency"
          value={`${(metricsSummary.p50_latency_ms / 1000).toFixed(1)}s`}
          subtitle="Target: <3s"
          icon={Clock}
          color="amber"
        />
        <MetricCard
          title="p95 Latency"
          value={`${(metricsSummary.p95_latency_ms / 1000).toFixed(1)}s`}
          subtitle="Target: <8s"
          icon={Activity}
          color="purple"
        />
        <MetricCard
          title="Open Incidents"
          value={openIncidents.length}
          subtitle="Active"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        {/* Workflow Runs Chart */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Workflow Runs (7 days)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Area type="monotone" dataKey="runs" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Total" />
              <Area type="monotone" dataKey="success" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Success" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Latency Chart */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">p50 Latency (ms)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Line type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} dot={false} name="p50 (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Tokens"
          value={`${(metricsSummary.total_tokens / 1_000_000).toFixed(1)}M`}
          subtitle="Local compute"
          icon={Cpu}
          color="cyan"
        />
        <MetricCard
          title="RAG Latency"
          value={`${metricsSummary.avg_rag_latency_ms}ms`}
          subtitle="Avg retrieval"
          icon={Database}
          color="purple"
        />
        <MetricCard
          title="Tool Calls"
          value={metricsSummary.total_tool_calls.toLocaleString()}
          subtitle={`${metricsSummary.tool_failure_rate}% failure rate`}
          icon={Zap}
          color="amber"
        />
        <MetricCard
          title="Eval Accuracy"
          value={`${(metricsSummary.avg_accuracy * 100).toFixed(0)}%`}
          subtitle="Last 3 evaluations"
          icon={BarChart3}
          color="emerald"
        />
      </div>

      {/* Recent Runs + Incidents */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Runs */}
        <div className="lg:col-span-2 rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">Recent Workflow Runs</h3>
            <Link to="/workflows" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentRuns.map((run) => (
              <Link
                key={run.id}
                to={`/runs/${run.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 p-3 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    run.status === 'completed' ? 'bg-emerald-400' :
                    run.status === 'failed' ? 'bg-red-400' :
                    run.status === 'running' ? 'bg-blue-400 animate-pulse' :
                    'bg-gray-400'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-200">{run.workflow_name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">{run.input.slice(0, 60)}...</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {run.latency_ms ? `${(run.latency_ms / 1000).toFixed(1)}s` : 'Running...'}
                  </p>
                  <p className="text-xs text-gray-500">{run.id}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Active Incidents */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">Active Incidents</h3>
            <Link to="/incidents" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {openIncidents.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No active incidents</p>
            ) : (
              openIncidents.map((inc) => (
                <div key={inc.id} className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
                      inc.severity === 'SEV-1' ? 'bg-red-500/20 text-red-400' :
                      inc.severity === 'SEV-2' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {inc.severity}
                    </span>
                    <span className="text-xs text-gray-500">{inc.id}</span>
                  </div>
                  <p className="text-sm text-gray-200">{inc.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Affects: {inc.affected_workflow}</p>
                  {inc.simulated && (
                    <span className="mt-2 inline-flex items-center rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-400">
                      SIMULATED
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* System Status Bar */}
      <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-400">API</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-400">PostgreSQL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-400">Redis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-400">Ollama</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-400">Worker</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-400">Prometheus</span>
            </div>
          </div>
          <span className="text-xs text-gray-500">All systems operational</span>
        </div>
      </div>

      {/* Architecture Overview */}
      <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">System Architecture</h3>
        <div className="rounded-lg bg-gray-950 border border-gray-800 p-6 overflow-x-auto">
          <pre className="text-xs text-gray-400 font-mono leading-relaxed">
{`                         ┌─────────────────────┐
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
                    Prometheus              Grafana`}
          </pre>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
            <p className="text-xs font-medium text-emerald-400 mb-1">Local-First</p>
            <p className="text-xs text-gray-500">Runs entirely on a Mac with Docker. No cloud account, no API keys, no paid services required.</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
            <p className="text-xs font-medium text-blue-400 mb-1">Multi-Tenant</p>
            <p className="text-xs text-gray-500">Every entity is tenant-scoped. Database-level isolation prevents cross-tenant access.</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
            <p className="text-xs font-medium text-purple-400 mb-1">Observable</p>
            <p className="text-xs text-gray-500">Prometheus metrics, Grafana dashboards, OpenTelemetry traces, structured JSON logs.</p>
          </div>
        </div>
      </div>

      {/* FDE Lifecycle */}
      <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">FDE Lifecycle — Complete Customer Journey</h3>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            'Customer Problem', 'Discovery', 'Requirements', 'Solution Architecture',
            'Customer Integration', 'AI Workflow', 'Deployment', 'Evaluation',
            'Observability', 'Incident Response', 'Iteration', 'Customer Handoff'
          ].map((step, idx, arr) => (
            <div key={step} className="flex items-center gap-1.5">
              <span className={`rounded px-2 py-1 ${
                idx === 0 ? 'bg-emerald-500/20 text-emerald-400' :
                idx === arr.length - 1 ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-800 text-gray-300'
              }`}>
                {step}
              </span>
              {idx < arr.length - 1 && <span className="text-gray-600">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
