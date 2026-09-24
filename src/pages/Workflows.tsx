import { Link } from 'react-router-dom';
import { GitBranch, Clock, CheckCircle2, ArrowRight, Play } from 'lucide-react';
import { workflows } from '../data/mockData';

export default function Workflows() {
  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Workflows</h1>
          <p className="mt-1 text-sm text-gray-400">Configurable AI workflow pipelines — each step is a reusable, observable unit</p>
        </div>
        <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors">
          + New Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {workflows.map((wf) => (
          <Link
            key={wf.id}
            to={`/workflows/${wf.id}`}
            className="group rounded-xl border border-gray-800 bg-gray-900 p-5 hover:border-gray-700 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <GitBranch className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100 group-hover:text-emerald-400 transition-colors">{wf.name}</h3>
                  <p className="text-xs text-gray-500">{wf.id} • {wf.tenant_id}</p>
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                wf.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                wf.status === 'draft' ? 'bg-gray-500/20 text-gray-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {wf.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 mb-4">{wf.description}</p>

            {/* Steps Pipeline */}
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-1">
                {wf.steps.map((step, idx) => (
                  <div key={step} className="flex items-center gap-1">
                    <span className="inline-flex items-center rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300">
                      {step}
                    </span>
                    {idx < wf.steps.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-gray-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-4 border-t border-gray-800 pt-4">
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Play className="h-3.5 w-3.5" />
                <span>{wf.total_runs} runs</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{wf.success_rate}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                <span>{(wf.avg_latency_ms / 1000).toFixed(1)}s avg</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
