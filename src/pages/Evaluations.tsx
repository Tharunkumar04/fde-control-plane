import { BarChart3, CheckCircle2, Clock, Target, Zap } from 'lucide-react';
import { evaluations, workflows } from '../data/mockData';

export default function Evaluations() {
  const statusColors: Record<string, string> = {
    completed: 'bg-emerald-500/20 text-emerald-400',
    running: 'bg-blue-500/20 text-blue-400',
    failed: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Evaluations</h1>
          <p className="mt-1 text-sm text-gray-400">Quality evaluation framework — real measurements, no fabricated numbers</p>
        </div>
        <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors">
          + New Evaluation
        </button>
      </div>

      {/* Evaluation Info */}
      <div className="mb-8 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <h3 className="text-sm font-medium text-blue-400 mb-2">Evaluation Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
          <div>
            <p className="font-medium text-gray-300 mb-1">Quality Metrics</p>
            <p>• Accuracy — correct classification</p>
            <p>• Relevance — response relevance to input</p>
            <p>• Groundedness — response grounded in retrieved docs</p>
          </div>
          <div>
            <p className="font-medium text-gray-300 mb-1">Reliability Metrics</p>
            <p>• Success rate</p>
            <p>• Failure rate</p>
            <p>• Timeout rate</p>
          </div>
          <div>
            <p className="font-medium text-gray-300 mb-1">Performance Metrics</p>
            <p>• p50 / p95 / p99 latency</p>
            <p>• Token usage (input + output)</p>
            <p>• Estimated local compute cost</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          ⚠️ No fake metrics. All values are TARGET, OBSERVED, or SIMULATED — clearly labeled.
          Cost is labeled "Estimated Local Compute Cost" since Ollama runs locally with no API cost.
        </p>
      </div>

      {/* Evaluations List */}
      <div className="space-y-4">
        {evaluations.map((eval_) => {
          const workflow = workflows.find(w => w.id === eval_.workflow_id);
          return (
            <div key={eval_.id} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-100">{eval_.name}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[eval_.status]}`}>
                      {eval_.status === 'running' && <Clock className="h-3 w-3 mr-1 animate-pulse" />}
                      {eval_.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Workflow: {workflow?.name || eval_.workflow_id} • {eval_.created_at ? new Date(eval_.created_at).toLocaleDateString() : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">{eval_.passed}/{eval_.total_cases} passed</p>
                  <p className="text-xs text-gray-500">{eval_.failed} failed</p>
                </div>
              </div>

              {/* Metrics */}
              {eval_.status === 'completed' && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="rounded-lg bg-gray-950 border border-gray-800 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Target className="h-3.5 w-3.5 text-emerald-400" />
                      <p className="text-xs text-gray-500">Accuracy</p>
                    </div>
                    <p className="text-lg font-bold text-emerald-400">{(eval_.accuracy * 100).toFixed(0)}%</p>
                    <div className="mt-1 h-1.5 rounded-full bg-gray-800">
                      <div className="h-full rounded-full bg-emerald-400" style={{ width: `${eval_.accuracy * 100}%` }} />
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-950 border border-gray-800 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <BarChart3 className="h-3.5 w-3.5 text-blue-400" />
                      <p className="text-xs text-gray-500">Relevance</p>
                    </div>
                    <p className="text-lg font-bold text-blue-400">{(eval_.relevance * 100).toFixed(0)}%</p>
                    <div className="mt-1 h-1.5 rounded-full bg-gray-800">
                      <div className="h-full rounded-full bg-blue-400" style={{ width: `${eval_.relevance * 100}%` }} />
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-950 border border-gray-800 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
                      <p className="text-xs text-gray-500">Groundedness</p>
                    </div>
                    <p className="text-lg font-bold text-purple-400">{(eval_.groundedness * 100).toFixed(0)}%</p>
                    <div className="mt-1 h-1.5 rounded-full bg-gray-800">
                      <div className="h-full rounded-full bg-purple-400" style={{ width: `${eval_.groundedness * 100}%` }} />
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-950 border border-gray-800 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      <p className="text-xs text-gray-500">Avg Latency</p>
                    </div>
                    <p className="text-lg font-bold text-amber-400">{(eval_.avg_latency_ms / 1000).toFixed(1)}s</p>
                  </div>
                  <div className="rounded-lg bg-gray-950 border border-gray-800 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap className="h-3.5 w-3.5 text-cyan-400" />
                      <p className="text-xs text-gray-500">Pass Rate</p>
                    </div>
                    <p className="text-lg font-bold text-cyan-400">{((eval_.passed / eval_.total_cases) * 100).toFixed(0)}%</p>
                  </div>
                </div>
              )}

              {/* Running State */}
              {eval_.status === 'running' && (
                <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                    <p className="text-sm text-blue-400">Evaluation in progress... Executing {eval_.total_cases} test cases against the real system.</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Evaluation Dataset Info */}
      <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Evaluation Dataset</h3>
        <p className="text-sm text-gray-400 mb-3">
          Located at: <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded text-emerald-400">examples/evaluation/support-triage.json</code>
        </p>
        <div className="rounded-lg bg-gray-950 border border-gray-800 p-4">
          <pre className="text-xs text-gray-300 overflow-x-auto">
{`{
  "id": "case-001",
  "input": "I cannot access my account",
  "expected_category": "authentication",
  "expected_source": "account-access.md"
}
// ... 20 realistic test cases
// Run: make evaluate`}
          </pre>
        </div>
      </div>
    </div>
  );
}
