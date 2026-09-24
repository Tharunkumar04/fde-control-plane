import { useMemo } from 'react';
import { Activity, Cpu, Database, Zap, Clock, Server } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { generateTimeSeriesData } from '../data/mockData';

export default function Observability() {
  const timeSeriesData = useMemo(() => generateTimeSeriesData(7), []);
  const chartData = timeSeriesData.filter((_, i) => i % 3 === 0).map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    runs: d.runs,
    failures: d.failures,
    latency_p50: Math.round(d.latency_p50),
    latency_p95: Math.round(d.latency_p95),
    tokens: d.tokens,
    rag: Math.round(d.rag_latency),
  }));

  const prometheusMetrics = [
    { name: 'http_requests_total', value: '12,847', type: 'counter' },
    { name: 'workflow_runs_total', value: '1,247', type: 'counter' },
    { name: 'workflow_success_total', value: '1,172', type: 'counter' },
    { name: 'workflow_failures_total', value: '45', type: 'counter' },
    { name: 'workflow_latency_seconds', value: '3.42 (avg)', type: 'histogram' },
    { name: 'model_requests_total', value: '3,891', type: 'counter' },
    { name: 'model_latency_seconds', value: '2.84 (avg)', type: 'histogram' },
    { name: 'tool_calls_total', value: '8,921', type: 'counter' },
    { name: 'tool_failures_total', value: '97', type: 'counter' },
    { name: 'tokens_total', value: '4,892,340', type: 'counter' },
    { name: 'rag_queries_total', value: '3,210', type: 'counter' },
    { name: 'rag_retrieval_latency_seconds', value: '0.187 (avg)', type: 'histogram' },
    { name: 'evaluation_runs_total', value: '4', type: 'counter' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Observability</h1>
        <p className="mt-1 text-sm text-gray-400">Prometheus metrics + Grafana dashboards + OpenTelemetry traces</p>
      </div>

      {/* Infrastructure Status */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { name: 'API', status: 'healthy', icon: Server },
          { name: 'PostgreSQL', status: 'healthy', icon: Database },
          { name: 'Redis', status: 'healthy', icon: Zap },
          { name: 'Ollama', status: 'healthy', icon: Cpu },
          { name: 'Worker', status: 'healthy', icon: Activity },
          { name: 'Prometheus', status: 'healthy', icon: Clock },
        ].map((svc) => (
          <div key={svc.name} className="rounded-lg border border-gray-800 bg-gray-900 p-3">
            <div className="flex items-center gap-2 mb-1">
              <svc.icon className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-400">{svc.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400">{svc.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        {/* Workflow Throughput */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Workflow Throughput</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="runs" fill="#10b981" name="Total" radius={[2, 2, 0, 0]} />
              <Bar dataKey="failures" fill="#ef4444" name="Failures" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Latency Distribution */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Latency Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="latency_p50" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} name="p50" />
              <Area type="monotone" dataKey="latency_p95" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="p95" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Token Usage */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Token Usage</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="tokens" stroke="#06b6d4" strokeWidth={2} dot={false} name="Tokens" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RAG Latency */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">RAG Retrieval Latency (ms)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="rag" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} name="RAG (ms)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prometheus Metrics */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 mb-8">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Prometheus Metrics</h3>
        <div className="rounded-lg bg-gray-950 border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Metric</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {prometheusMetrics.map((m) => (
                <tr key={m.name} className="hover:bg-gray-800/50">
                  <td className="px-4 py-2 text-sm font-mono text-emerald-400">{m.name}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs ${
                      m.type === 'counter' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-right text-gray-200 font-mono">{m.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracing Info */}
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <h3 className="text-sm font-medium text-cyan-400 mb-2">OpenTelemetry Tracing</h3>
        <p className="text-xs text-gray-400 mb-3">Every workflow run generates a trace spanning the full execution path:</p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">HTTP Request</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Workflow</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">RAG Retrieval</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Model Call</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Tool Calls</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Guardrails</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Evaluation</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Structured JSON logs include: timestamp, level, service, request_id, trace_id, tenant_id, workflow_id, run_id, event, duration, status.
        </p>
      </div>
    </div>
  );
}
