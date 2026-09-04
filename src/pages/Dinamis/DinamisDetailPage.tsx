import { useMemo, useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  Globe,
  Database,
  ShieldCheck,
  Layers,
  Activity
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import './Dinamis.css'

export function DinamisDetailPage() {
  const params = useParams({ from: '/_admin/dinamis/$id' })
  const currentId = params.id || 'unknown-id'

  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<'Active' | 'Under Review' | 'Maintenance'>('Active')

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const mockResolvedData = useMemo(() => {
    return {
      paramId: currentId,
      resolvedRoute: `/dinamis/${currentId}`,
      fetchedAt: new Date().toISOString(),
      protocol: 'TanStack Router v1 (File-based Dynamic Segment)',
      environment: 'Client-Side Dynamic Evaluator',
      payload: {
        status,
        nodeType: 'Dynamic Resource Leaf',
        capabilities: ['URL Sync', 'SSR Ready', 'State Hydrated'],
        metadata: {
          timestamp: new Date().toISOString(),
          segmentLength: currentId.length,
          isNumeric: /^\d+$/.test(currentId),
        },
      },
    }
  }, [currentId, status])

  return (
    <div className="dinamis-detail-wrapper">
      <Link to="/dinamis" className="dinamis-back-btn">
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Ringkasan Dinamis</span>
      </Link>

      <div className="dinamis-detail-card">
        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-4 border-b border-slate-700/40 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-tag badge-purple font-mono">Dynamic Param: $id</span>
              <span className="text-xs text-slate-400">Status: {status}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span>Detail Dynamic ID: <span className="text-purple-400 font-mono">"{currentId}"</span></span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Data halaman ini di-render secara dinamis berdasarkan path parameter URL di browser.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="soft"
              size="2"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Salin URL'}</span>
            </Button>
          </div>
        </div>

        {/* Dynamic Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Current URL Path</span>
            </div>
            <div className="font-mono text-sm font-semibold text-slate-200 truncate">
              /dinamis/{currentId}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Database className="w-4 h-4 text-purple-400" />
              <span>Parameter Length</span>
            </div>
            <div className="font-mono text-sm font-semibold text-slate-200">
              {currentId.length} Karakter
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Param Type</span>
            </div>
            <div className="font-mono text-sm font-semibold text-slate-200">
              {/^\d+$/.test(currentId) ? 'Numeric ID' : 'String / Slug'}
            </div>
          </div>
        </div>

        {/* Dynamic Controls Demo */}
        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/30 mb-6">
          <h3 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Ubah Status Runtime Dinamis</span>
          </h3>
          <div className="flex gap-2 flex-wrap">
            {(['Active', 'Under Review', 'Maintenance'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${status === st
                  ? 'bg-purple-600 border-purple-500 text-white shadow'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-purple-500'
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* JSON Payload Inspection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Resolved Route Context & Payload</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">application/json</span>
          </div>

          <pre className="dinamis-json-viewer">
            {JSON.stringify(mockResolvedData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
