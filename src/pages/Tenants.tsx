import { useState } from 'react';
import { Building2, Settings, GitBranch, FileText, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { tenants } from '../data/mockData';

export default function Tenants() {
  const [expandedTenant, setExpandedTenant] = useState<string | null>(null);

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Tenants</h1>
          <p className="mt-1 text-sm text-gray-400">Multi-tenant customer isolation — each tenant has isolated data, workflows, and policies</p>
        </div>
        <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors">
          + New Tenant
        </button>
      </div>

      <div className="space-y-4">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
            {/* Tenant Header */}
            <div
              className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-800/50 transition-colors"
              onClick={() => setExpandedTenant(expandedTenant === tenant.id ? null : tenant.id)}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Building2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-100">{tenant.name}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      tenant.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {tenant.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{tenant.id} • Created {new Date(tenant.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <GitBranch className="h-4 w-4" />
                    <span>{tenant.workflows_count}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <FileText className="h-4 w-4" />
                    <span>{tenant.documents_count}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Activity className="h-4 w-4" />
                    <span>{tenant.runs_count.toLocaleString()}</span>
                  </div>
                </div>
                {expandedTenant === tenant.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Expanded Config */}
            {expandedTenant === tenant.id && (
              <div className="border-t border-gray-800 p-5 bg-gray-950/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* AI Configuration */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-400" />
                      AI Configuration
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Model</span>
                        <span className="text-gray-200 font-mono text-xs">{tenant.config.model}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Temperature</span>
                        <span className="text-gray-200">{tenant.config.temperature}</span>
                      </div>
                    </div>
                  </div>

                  {/* Retrieval Configuration */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      Retrieval Configuration
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Top K</span>
                        <span className="text-gray-200">{tenant.config.top_k}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Similarity Threshold</span>
                        <span className="text-gray-200">{tenant.config.similarity_threshold}</span>
                      </div>
                    </div>
                  </div>

                  {/* Policies */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-400" />
                      Policies
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Confidence Threshold</span>
                        <span className="text-gray-200">{tenant.config.confidence_threshold}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Auto-approve</span>
                        <span className="text-gray-200">READ_ONLY only</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tenant Isolation Notice */}
                <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                  <p className="text-xs text-amber-400">
                    <strong>Tenant Isolation:</strong> All data for this tenant is isolated via tenant_id on every query.
                    Cross-tenant access is prevented at the database level. Automated tests verify isolation.
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
