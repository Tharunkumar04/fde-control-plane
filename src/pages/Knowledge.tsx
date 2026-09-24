import { FileText, CheckCircle2, Clock, XCircle, Loader2, Database } from 'lucide-react';
import { documents } from '../data/mockData';

export default function Knowledge() {
  const statusIcons: Record<string, React.ReactNode> = {
    COMPLETED: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    PROCESSING: <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />,
    PENDING: <Clock className="h-4 w-4 text-gray-400" />,
    FAILED: <XCircle className="h-4 w-4 text-red-400" />,
  };

  const statusColors: Record<string, string> = {
    COMPLETED: 'bg-emerald-500/20 text-emerald-400',
    PROCESSING: 'bg-blue-500/20 text-blue-400',
    PENDING: 'bg-gray-500/20 text-gray-400',
    FAILED: 'bg-red-500/20 text-red-400',
  };

  const totalChunks = documents.reduce((sum, d) => sum + d.chunks_count, 0);
  const completedDocs = documents.filter(d => d.status === 'COMPLETED').length;

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Knowledge Base</h1>
          <p className="mt-1 text-sm text-gray-400">RAG documents — chunked, embedded with pgvector, and tenant-isolated</p>
        </div>
        <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors">
          + Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-8">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-blue-400" />
            <p className="text-xs text-gray-500">Total Documents</p>
          </div>
          <p className="text-xl font-bold text-gray-100">{documents.length}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <p className="text-xs text-gray-500">Processed</p>
          </div>
          <p className="text-xl font-bold text-emerald-400">{completedDocs}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-4 w-4 text-purple-400" />
            <p className="text-xs text-gray-500">Total Chunks</p>
          </div>
          <p className="text-xl font-bold text-gray-100">{totalChunks}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-amber-400" />
            <p className="text-xs text-gray-500">Avg Processing</p>
          </div>
          <p className="text-xl font-bold text-gray-100">
            {(documents.filter(d => d.processing_time_ms).reduce((s, d) => s + (d.processing_time_ms || 0), 0) /
              documents.filter(d => d.processing_time_ms).length / 1000).toFixed(1)}s
          </p>
        </div>
      </div>

      {/* RAG Pipeline Info */}
      <div className="mb-8 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
        <h3 className="text-sm font-medium text-purple-400 mb-2">RAG Pipeline</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Upload</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Validate</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Extract</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Chunk</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-gray-800 px-2 py-1 text-gray-300">Embed</span>
          <span className="text-gray-600">→</span>
          <span className="rounded bg-purple-800 px-2 py-1 text-purple-300">pgvector Store</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Each chunk contains: tenant_id, document_id, chunk_id, content, embedding (768-dim), metadata.
          Retrieval enforces tenant isolation — Tenant A cannot access Tenant B's documents.
        </p>
      </div>

      {/* Documents Table */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-950">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Document</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Chunks</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Size</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Processing</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-200">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300">
                    .{doc.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {statusIcons[doc.status]}
                    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs ${statusColors[doc.status]}`}>
                      {doc.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{doc.chunks_count}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{(doc.size_bytes / 1024).toFixed(1)} KB</td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {doc.processing_time_ms ? `${(doc.processing_time_ms / 1000).toFixed(1)}s` : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
