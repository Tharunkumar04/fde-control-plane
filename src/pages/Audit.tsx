import { ClipboardList, Shield, Filter } from 'lucide-react';
import { auditEvents } from '../data/mockData';
import { useState } from 'react';

export default function Audit() {
  const [filterTenant, setFilterTenant] = useState('all');

  const filteredEvents = filterTenant === 'all'
    ? auditEvents
    : auditEvents.filter(e => e.tenant_id === filterTenant);

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Audit Log</h1>
          <p className="mt-1 text-sm text-gray-400">Complete audit trail — every action is logged with tenant isolation</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterTenant}
            onChange={(e) => setFilterTenant(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Tenants</option>
            <option value="tenant-001">Acme Support</option>
            <option value="tenant-002">Globex Corp</option>
            <option value="tenant-003">Initech</option>
          </select>
        </div>
      </div>

      {/* Audit Info */}
      <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-medium text-emerald-400">Audit Policy</h3>
        </div>
        <p className="text-xs text-gray-400">
          Every action is logged with: timestamp, tenant_id, user_id, action, resource_type, resource_id, details, IP address.
          Logs are immutable and retained for compliance. Tenant isolation is enforced — users can only see events for their tenant.
        </p>
      </div>

      {/* Audit Events Table */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-950">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Tenant</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Resource</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredEvents.map((event) => (
              <tr key={event.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                  {new Date(event.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300 font-mono">
                    {event.tenant_id}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400 font-mono">{event.user_id}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                    event.action.includes('execute') ? 'bg-blue-500/20 text-blue-400' :
                    event.action.includes('approve') ? 'bg-amber-500/20 text-amber-400' :
                    event.action.includes('upload') ? 'bg-purple-500/20 text-purple-400' :
                    event.action.includes('update') ? 'bg-cyan-500/20 text-cyan-400' :
                    event.action.includes('register') ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {event.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  <span className="font-mono">{event.resource_type}/{event.resource_id}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-300 max-w-xs truncate">{event.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Structured Log Example */}
      <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-gray-400" />
          Structured Log Format (JSON)
        </h3>
        <div className="rounded-lg bg-gray-950 border border-gray-800 p-4">
          <pre className="text-xs text-gray-300 overflow-x-auto">
{`{
  "level": "INFO",
  "timestamp": "2026-03-15T14:35:00Z",
  "service": "fde-control-plane",
  "request_id": "req-abc-123",
  "trace_id": "trace-abc-001",
  "tenant_id": "tenant-001",
  "workflow_id": "wf-001",
  "run_id": "run-001",
  "event": "workflow_completed",
  "duration_ms": 3820,
  "status": "success",
  "model": "qwen2.5:7b",
  "tokens_input": 1247,
  "tokens_output": 189,
  "confidence": 0.92
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
