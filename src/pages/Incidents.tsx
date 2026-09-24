import { AlertTriangle, CheckCircle2, Clock, Search, AlertCircle } from 'lucide-react';
import { incidents } from '../data/mockData';

export default function Incidents() {
  const severityColors: Record<string, string> = {
    'SEV-1': 'bg-red-500/20 text-red-400 border-red-500/30',
    'SEV-2': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'SEV-3': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'SEV-4': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    open: <AlertCircle className="h-4 w-4 text-red-400" />,
    investigating: <Search className="h-4 w-4 text-amber-400" />,
    mitigated: <Clock className="h-4 w-4 text-blue-400" />,
    resolved: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  };

  const statusColors: Record<string, string> = {
    open: 'bg-red-500/20 text-red-400',
    investigating: 'bg-amber-500/20 text-amber-400',
    mitigated: 'bg-blue-500/20 text-blue-400',
    resolved: 'bg-emerald-500/20 text-emerald-400',
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Incidents</h1>
          <p className="mt-1 text-sm text-gray-400">Incident management — detection, investigation, mitigation, resolution</p>
        </div>
        <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 transition-colors flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" /> Report Incident
        </button>
      </div>

      {/* Incident Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="text-xs text-gray-500">Open</p>
          <p className="text-xl font-bold text-red-400">{incidents.filter(i => i.status === 'open').length}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="text-xs text-gray-500">Investigating</p>
          <p className="text-xl font-bold text-amber-400">{incidents.filter(i => i.status === 'investigating').length}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="text-xs text-gray-500">Mitigated</p>
          <p className="text-xl font-bold text-blue-400">{incidents.filter(i => i.status === 'mitigated').length}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="text-xs text-gray-500">Resolved</p>
          <p className="text-xl font-bold text-emerald-400">{incidents.filter(i => i.status === 'resolved').length}</p>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {incidents.map((inc) => (
          <div key={inc.id} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                {statusIcons[inc.status]}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-100">{inc.title}</h3>
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-bold ${severityColors[inc.severity]}`}>
                      {inc.severity}
                    </span>
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${statusColors[inc.status]}`}>
                      {inc.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {inc.id} • Affected: {inc.affected_workflow} • Created: {new Date(inc.created_at).toLocaleString()}
                  </p>
                  {inc.resolved_at && (
                    <p className="text-xs text-gray-500">Resolved: {new Date(inc.resolved_at).toLocaleString()}</p>
                  )}
                </div>
              </div>
              {inc.simulated && (
                <span className="inline-flex items-center rounded bg-gray-800 px-2 py-1 text-xs text-gray-400 border border-gray-700">
                  SIMULATED
                </span>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-950 border border-gray-800 p-3">
                <p className="text-xs text-gray-500 mb-1">Root Cause</p>
                <p className="text-sm text-gray-300">{inc.root_cause}</p>
              </div>
              <div className="rounded-lg bg-gray-950 border border-gray-800 p-3">
                <p className="text-xs text-gray-500 mb-1">Mitigation</p>
                <p className="text-sm text-gray-300">{inc.mitigation}</p>
              </div>
            </div>

            {/* Detection Method */}
            <div className="mt-3 rounded-lg bg-gray-950 border border-gray-800 p-3">
              <p className="text-xs text-gray-500 mb-1">Detection</p>
              <p className="text-sm text-gray-300">
                {inc.id === 'INC-001' && 'Prometheus alert — p95 latency exceeded threshold (>10s for 5 minutes)'}
                {inc.id === 'INC-002' && 'Redis connection pool monitoring — active connections at 95% capacity'}
                {inc.id === 'INC-003' && 'Tool failure rate alert — get_order failures exceeded 5% in 10 minutes'}
                {inc.id === 'INC-004' && 'Health check failure — Ollama /api/tags endpoint returning 503'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Postmortem Reference */}
      <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Incident Postmortem Template</h3>
        <div className="rounded-lg bg-gray-950 border border-gray-800 p-4">
          <pre className="text-xs text-gray-300 overflow-x-auto">
{`# Incident Postmortem: INC-001

## Summary
AI workflow latency increased — p95 exceeded 10s.

## Impact
- Support workflow execution became slow
- Customer response time degraded
- Duration: ~2 hours 15 minutes

## Detection
Prometheus alert fired when p95 latency exceeded 10s for 5 minutes.

## Investigation
- Trace inspection showed large context (12 chunks) per request
- Model inference time increased proportionally with context size
- top_k was set to 10 (too high for 7B model)

## Root Cause
Large retrieved context increased model inference time significantly.

## Mitigation
- Reduced top_k from 10 to 5
- Added context size monitoring
- Latency returned to target within 30 minutes

## Prevention
- Added context-size monitoring alert
- Added per-chunk retrieval latency tracking
- Updated tenant configuration documentation

## Labels
SIMULATED INCIDENT — for demonstration purposes`}
          </pre>
        </div>
      </div>
    </div>
  );
}
