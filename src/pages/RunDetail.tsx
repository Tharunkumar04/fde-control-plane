import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Clock, AlertTriangle, Database, Wrench, Shield, Cpu, FileText } from 'lucide-react';
import { workflowRuns } from '../data/mockData';

export default function RunDetail() {
  const { id } = useParams<{ id: string }>();
  const run = workflowRuns.find(r => r.id === id);

  if (!run) {
    return (
      <div className="p-6">
        <p className="text-gray-400">Run not found</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    completed: 'bg-emerald-500/20 text-emerald-400',
    failed: 'bg-red-500/20 text-red-400',
    running: 'bg-blue-500/20 text-blue-400',
    pending: 'bg-gray-500/20 text-gray-400',
    timeout: 'bg-amber-500/20 text-amber-400',
  };

  const riskColors: Record<string, string> = {
    READ_ONLY: 'bg-emerald-500/20 text-emerald-400',
    LOW_RISK: 'bg-amber-500/20 text-amber-400',
    HIGH_RISK: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <Link to="/workflows" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200">
        <ArrowLeft className="h-4 w-4" /> Back to Workflows
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-100">{run.id}</h1>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[run.status]}`}>
            {run.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-400">
          Workflow: {run.workflow_name} • Tenant: {run.tenant_id} • Model: {run.model}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">Trace: {run.trace_id}</p>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-3">
          <p className="text-xs text-gray-500">Latency</p>
          <p className="text-lg font-bold text-gray-100">
            {run.latency_ms ? `${(run.latency_ms / 1000).toFixed(1)}s` : '—'}
          </p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-3">
          <p className="text-xs text-gray-500">Confidence</p>
          <p className="text-lg font-bold text-gray-100">
            {run.confidence ? `${(run.confidence * 100).toFixed(0)}%` : '—'}
          </p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-3">
          <p className="text-xs text-gray-500">Input Tokens</p>
          <p className="text-lg font-bold text-gray-100">{run.tokens_input.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-3">
          <p className="text-xs text-gray-500">Output Tokens</p>
          <p className="text-lg font-bold text-gray-100">{run.tokens_output.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-3">
          <p className="text-xs text-gray-500">Tool Calls</p>
          <p className="text-lg font-bold text-gray-100">{run.tool_calls.length}</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-3">
          <p className="text-xs text-gray-500">Retrieved Docs</p>
          <p className="text-lg font-bold text-gray-100">{run.retrieved_documents.length}</p>
        </div>
      </div>

      {/* Execution Timeline */}
      <div className="space-y-6">
        {/* Input */}
        <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-400" /> Input
          </h3>
          <div className="rounded-lg bg-gray-950 border border-gray-800 p-4">
            <p className="text-sm text-gray-200 font-mono">{run.input}</p>
          </div>
        </section>

        {/* Retrieved Documents (RAG) */}
        {run.retrieved_documents.length > 0 && (
          <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Database className="h-4 w-4 text-purple-400" /> Retrieved Documents (RAG)
            </h3>
            <div className="space-y-3">
              {run.retrieved_documents.map((doc) => (
                <div key={doc.chunk_id} className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-purple-400">{doc.source}</span>
                    <span className="text-xs text-gray-500">Score: {doc.score.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-300">{doc.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Model Response */}
        {run.output && (
          <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-400" /> Model Response
            </h3>
            <div className="rounded-lg bg-gray-950 border border-gray-800 p-4">
              <p className="text-sm text-gray-200">{run.output}</p>
            </div>
            {run.retrieved_documents.length > 0 && (
              <div className="mt-3 rounded-lg bg-gray-950 border border-gray-800 p-3">
                <p className="text-xs text-gray-500 mb-1">Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(run.retrieved_documents.map(d => d.source))].map(src => (
                    <span key={src} className="inline-flex items-center rounded bg-purple-500/10 px-2 py-0.5 text-xs text-purple-400">
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Tool Calls */}
        {run.tool_calls.length > 0 && (
          <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-400" /> Tool Calls
            </h3>
            <div className="space-y-3">
              {run.tool_calls.map((tc, idx) => (
                <div key={idx} className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-200">{tc.tool}</span>
                      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs ${riskColors[tc.risk_level]}`}>
                        {tc.risk_level}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{tc.latency_ms}ms</span>
                      {tc.status === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      {tc.status === 'failed' && <XCircle className="h-4 w-4 text-red-400" />}
                      {tc.status === 'pending_approval' && <Clock className="h-4 w-4 text-amber-400" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Input</p>
                      <pre className="text-xs text-gray-300 bg-gray-900 rounded p-2 overflow-x-auto">
                        {JSON.stringify(tc.input, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Output</p>
                      <pre className="text-xs text-gray-300 bg-gray-900 rounded p-2 overflow-x-auto">
                        {tc.output ? JSON.stringify(tc.output, null, 2) : 'null'}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Guardrails */}
        {run.guardrails_triggered.length > 0 && (
          <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
            <h3 className="text-sm font-medium text-amber-400 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" /> Guardrails Triggered
            </h3>
            <div className="flex flex-wrap gap-2">
              {run.guardrails_triggered.map((g) => (
                <span key={g} className="inline-flex items-center rounded bg-amber-500/20 px-2 py-1 text-xs text-amber-400">
                  {g}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Error */}
        {run.error && (
          <section className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
            <h3 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
              <XCircle className="h-4 w-4" /> Error
            </h3>
            <p className="text-sm text-red-300 font-mono">{run.error}</p>
          </section>
        )}

        {/* Trace Info */}
        <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-cyan-400" /> Trace Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Trace ID</p>
              <p className="text-sm text-gray-200 font-mono">{run.trace_id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Started</p>
              <p className="text-sm text-gray-200">{new Date(run.started_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-sm text-gray-200">{run.completed_at ? new Date(run.completed_at).toLocaleString() : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Model</p>
              <p className="text-sm text-gray-200 font-mono">{run.model}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
