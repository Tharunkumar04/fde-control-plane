import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Clock, CheckCircle2, XCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { workflows, workflowRuns, generateTimeSeriesData } from '../data/mockData';
import { useMemo } from 'react';

export default function WorkflowDetail() {
  const { id } = useParams<{ id: string }>();
  const workflow = workflows.find(w => w.id === id);
  const runs = workflowRuns.filter(r => r.workflow_id === id);
  const chartData = useMemo(() => {
    const data = generateTimeSeriesData(3);
    return data.filter((_, i) => i % 4 === 0).map(d => ({
      time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      latency: Math.round(d.latency_p50),
      runs: d.runs,
    }));
  }, []);

  if (!workflow) {
    return (
      <div className="p-6">
        <p className="text-gray-400">Workflow not found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <Link to="/workflows" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200">
        <ArrowLeft className="h-4 w-4" /> Back to Workflows
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-100">{workflow.name}</h1>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              workflow.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {workflow.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-400">{workflow.description}</p>
          <p className="mt-1 text-xs text-gray-500">{workflow.id} • Tenant: {workflow.tenant_id}</p>
        </div>
        <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors flex items-center gap-2">
          <Play className="h-4 w-4" /> Execute
        </button>
      </div>

      {/* Pipeline Steps */}
      <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Pipeline Steps</h3>
        <div className="flex flex-wrap items-center gap-2">
          {workflow.steps.map((step, idx) => (
            <div key={step} className="flex items-center gap-2">
              <div className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200">
                {step}
              </div>
              {idx < workflow.steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-8">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="text-xs text-gray-500">Total Runs</p>
          <p className="text-xl font-bold text-gray-100">{workflow.total_runs}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="text-xs text-gray-500">Success Rate</p>
          <p className="text-xl font-bold text-emerald-400">{workflow.success_rate}%</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="text-xs text-gray-500">Avg Latency</p>
          <p className="text-xl font-bold text-gray-100">{(workflow.avg_latency_ms / 1000).toFixed(1)}s</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="text-xs text-gray-500">Last Updated</p>
          <p className="text-xl font-bold text-gray-100">{new Date(workflow.updated_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Latency Chart */}
      <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Latency Trend (3 days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
            <YAxis stroke="#6b7280" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} dot={false} name="p50 (ms)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Execution History */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Execution History</h3>
        <div className="space-y-2">
          {runs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No executions yet</p>
          ) : (
            runs.map((run) => (
              <Link
                key={run.id}
                to={`/runs/${run.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 p-3 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {run.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  {run.status === 'failed' && <XCircle className="h-4 w-4 text-red-400" />}
                  {run.status === 'running' && <div className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />}
                  {run.status === 'pending' && <Clock className="h-4 w-4 text-gray-400" />}
                  {run.status === 'timeout' && <AlertTriangle className="h-4 w-4 text-amber-400" />}
                  <div>
                    <p className="text-sm font-medium text-gray-200">{run.id}</p>
                    <p className="text-xs text-gray-500 truncate max-w-md">{run.input.slice(0, 80)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {run.latency_ms ? `${(run.latency_ms / 1000).toFixed(1)}s` : 'Running...'}
                  </p>
                  {run.confidence && (
                    <p className="text-xs text-gray-500">Confidence: {(run.confidence * 100).toFixed(0)}%</p>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
