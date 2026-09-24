import { Wrench, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { tools } from '../data/mockData';

export default function Tools() {
  const riskColors: Record<string, string> = {
    READ_ONLY: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    LOW_RISK: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    HIGH_RISK: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const riskIcons: Record<string, React.ReactNode> = {
    READ_ONLY: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    LOW_RISK: <Shield className="h-4 w-4 text-amber-400" />,
    HIGH_RISK: <AlertTriangle className="h-4 w-4 text-red-400" />,
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Tool Registry</h1>
          <p className="mt-1 text-sm text-gray-400">Secure tool framework — AI-generated tool calls are validated, authorized, and audited</p>
        </div>
        <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors">
          + Register Tool
        </button>
      </div>

      {/* Security Pipeline */}
      <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <h3 className="text-sm font-medium text-amber-400 mb-2">Tool Security Pipeline</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Allowlist</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Schema Validation</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Auth</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Tenant Check</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Risk Check</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-amber-800 px-2 py-1 text-amber-300">Human Approval (HIGH_RISK)</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-emerald-800 px-2 py-1 text-emerald-300">Execute</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Audit</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          AI-generated tool calls NEVER execute arbitrary code. All calls go through the security pipeline.
          HIGH_RISK tools (refund, delete, change subscription) require explicit human approval.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <div key={tool.id} className={`rounded-xl border p-5 ${riskColors[tool.risk_level]}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800">
                  <Wrench className="h-5 w-5 text-gray-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100">{tool.name}</h3>
                  <p className="text-xs text-gray-500">{tool.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {riskIcons[tool.risk_level]}
                <span className="text-xs font-medium">{tool.risk_level}</span>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-4">{tool.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-500">Timeout</p>
                <p className="text-sm text-gray-200">{tool.timeout_ms}ms</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Scope</p>
                <p className="text-sm text-gray-200 font-mono text-xs">{tool.tenant_scope}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-gray-700/50 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">Calls:</span>
                <span className="text-sm font-medium text-gray-200">{tool.calls_total.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">Failed:</span>
                <span className="text-sm font-medium text-red-400">{tool.calls_failed}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">Rate:</span>
                <span className="text-sm font-medium text-emerald-400">
                  {((1 - tool.calls_failed / tool.calls_total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Permissions */}
            <div className="mt-3 flex flex-wrap gap-1">
              {tool.permissions.map(p => (
                <span key={p} className="inline-flex items-center rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-400">
                  {p}
                </span>
              ))}
            </div>

            {tool.risk_level === 'HIGH_RISK' && (
              <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/20 p-2">
                <p className="text-xs text-red-400">
                  ⚠️ Requires human approval before execution. Cannot be auto-approved.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
