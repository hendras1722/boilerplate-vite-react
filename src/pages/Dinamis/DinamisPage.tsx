import { useState, useMemo } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  Boxes,
  Activity,
  Layers,
  Trash2,
  ExternalLink,
  Code2
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { InputField } from '../../components/ui/InputField'
import './Dinamis.css'

export interface DynamicItem {
  id: string
  title: string
  category: 'Module' | 'Service' | 'Component' | 'Endpoint'
  status: 'Active' | 'Beta' | 'Deprecated'
  updatedAt: string
  description: string
  metrics: {
    views: number
    latency: string
  }
}

const INITIAL_ITEMS: DynamicItem[] = [
  {
    id: 'auth-jwt-guard',
    title: 'JWT Auth Security Guard',
    category: 'Service',
    status: 'Active',
    updatedAt: '2026-09-04',
    description: 'Dynamic token verification and claim extraction middleware with automated refresh cycle.',
    metrics: { views: 1420, latency: '12ms' },
  },
  {
    id: 'analytics-aggregator',
    title: 'Real-time Event Stream Aggregator',
    category: 'Module',
    status: 'Active',
    updatedAt: '2026-09-03',
    description: 'High throughput event processor calculating rolling window metrics and anomaly indicators.',
    metrics: { views: 890, latency: '24ms' },
  },
  {
    id: 'sales-tracker-engine',
    title: 'Sales Tracking & Pipeline Engine',
    category: 'Endpoint',
    status: 'Beta',
    updatedAt: '2026-09-02',
    description: 'Dynamic forecasting model connecting lead scoring with conversion probabilities.',
    metrics: { views: 630, latency: '18ms' },
  },
  {
    id: 'chart-data-pipeline',
    title: 'Dynamic Chart Pipeline Renderer',
    category: 'Component',
    status: 'Active',
    updatedAt: '2026-09-01',
    description: 'Vector-accelerated chart engine with dynamic series injection and zoom control.',
    metrics: { views: 1120, latency: '8ms' },
  },
]

type CategoryType = 'Module' | 'Service' | 'Component' | 'Endpoint'

export function DinamisPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<DynamicItem[]>(INITIAL_ITEMS)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [customParam, setCustomParam] = useState('')

  // New item form state
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState<CategoryType>('Module')
  const [newDescription, setNewDescription] = useState('')

  const categories = ['All', 'Module', 'Service', 'Component', 'Endpoint']

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory
      return matchSearch && matchCategory
    })
  }, [items, search, selectedCategory])

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const newItem: DynamicItem = {
      id: slug || `item-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      status: 'Active',
      updatedAt: new Date().toISOString().split('T')[0],
      description: newDescription.trim() || 'Dynamic item generated at runtime.',
      metrics: { views: 1, latency: '10ms' },
    }

    setItems((prev) => [newItem, ...prev])
    setNewTitle('')
    setNewDescription('')
  }

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleNavigateCustom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customParam.trim()) return
    navigate({
      to: '/dinamis/$id',
      params: { id: customParam.trim() },
    })
  }

  return (
    <div className="dinamis-container">
      {/* Header */}
      <div className="dinamis-header">
        <div className="dinamis-title-section">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="text-purple-500 w-6 h-6" />
            <h1>Halaman Dinamis</h1>
          </div>
          <p>
            Demonstrasi routing dinamis <code className="text-purple-400 bg-purple-950/30 px-2 py-0.5 rounded font-mono">/dinamis/$id</code> dengan TanStack Router dan manipulasi state runtime interaktif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/dinamis/$id"
            params={{ id: 'sample-dynamic-route' }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Buka /dinamis/sample-dynamic-route
          </Link>
        </div>
      </div>

      {/* Dynamic Stats Row */}
      <div className="dinamis-stats-grid">
        <div className="dinamis-stat-card">
          <div className="dinamis-stat-icon-wrapper bg-purple-500/10 text-purple-500">
            <Boxes className="w-5 h-5" />
          </div>
          <div className="dinamis-stat-content">
            <h4>Total Item Dinamis</h4>
            <div className="stat-number">{items.length}</div>
          </div>
        </div>

        <div className="dinamis-stat-card">
          <div className="dinamis-stat-icon-wrapper bg-blue-500/10 text-blue-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="dinamis-stat-content">
            <h4>Filter Terpasang</h4>
            <div className="stat-number">{filteredItems.length}</div>
          </div>
        </div>

        <div className="dinamis-stat-card">
          <div className="dinamis-stat-icon-wrapper bg-emerald-500/10 text-emerald-500">
            <Activity className="w-5 h-5" />
          </div>
          <div className="dinamis-stat-content">
            <h4>Router Engine</h4>
            <div className="stat-number text-emerald-500 text-lg">TanStack v1</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dinamis-grid">
        {/* Left Column: Interactive List */}
        <div className="dinamis-panel">
          <div className="dinamis-panel-header">
            <div className="dinamis-panel-title">
              <Layers className="w-5 h-5 text-purple-500" />
              <span>Daftar Parameter Dinamis</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Klik item untuk membuka rute spesifik
            </span>
          </div>

          {/* Controls */}
          <div className="dinamis-controls">
            <div className="dinamis-search-bar">
              <InputField
                label=""
                placeholder="Cari ID, Judul, atau Deskripsi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            <div className="dinamis-filter-chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="dinamis-item-list">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Code2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Tidak ada item yang cocok dengan pencarian.</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <Link
                  key={item.id}
                  to="/dinamis/$id"
                  params={{ id: item.id }}
                  className="dinamis-item-card"
                >
                  <div className="dinamis-item-info">
                    <div className="dinamis-item-header">
                      <span className="dinamis-item-id">/{item.id}</span>
                      <span className="dinamis-item-name">{item.title}</span>
                      <span
                        className={`badge-tag ${item.category === 'Module'
                          ? 'badge-blue'
                          : item.category === 'Service'
                            ? 'badge-purple'
                            : item.category === 'Component'
                              ? 'badge-green'
                              : 'badge-amber'
                          }`}
                      >
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {item.description}
                    </p>
                    <div className="dinamis-item-meta mt-2">
                      <span>Diperbarui: {item.updatedAt}</span>
                      <span>Latency: {item.metrics.latency}</span>
                      <span>Views: {item.metrics.views}</span>
                    </div>
                  </div>

                  <div className="dinamis-item-actions">
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-500/10 transition"
                      title="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-purple-500 p-1">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Custom Route Navigator & Creator */}
        <div className="flex flex-col gap-4">
          {/* Quick Param Tester */}
          <div className="dinamis-panel">
            <div className="dinamis-panel-title">
              <Code2 className="w-5 h-5 text-purple-500" />
              <span>Coba URL Dinamis Langsung</span>
            </div>
            <p className="text-xs text-slate-400">
              Ketik parameter apa saja untuk melakukan navigasi ke <code className="font-mono text-purple-400">/dinamis/[id]</code>.
            </p>

            <form onSubmit={handleNavigateCustom} className="flex flex-col gap-3">
              <InputField
                label="Custom ID / Slug"
                placeholder="misal: produk-123 atau user-alex"
                value={customParam}
                onChange={(e) => setCustomParam(e.target.value)}
              />
              <Button type="submit" variant="solid" color="purple" disabled={!customParam.trim()}>
                Navigasi ke /dinamis/{customParam.trim() || ':id'}
              </Button>
            </form>
          </div>

          {/* Add New Item Panel */}
          <div className="dinamis-panel">
            <div className="dinamis-panel-title">
              <Plus className="w-5 h-5 text-emerald-500" />
              <span>Tambah Item Baru</span>
            </div>

            <form onSubmit={handleCreateItem} className="flex flex-col gap-3">
              <InputField
                label="Judul Item"
                placeholder="e.g. Real-time Notification Engine"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-400">Kategori</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CategoryType)}
                  className="w-full bg-slate-900/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="Module">Module</option>
                  <option value="Service">Service</option>
                  <option value="Component">Component</option>
                  <option value="Endpoint">Endpoint</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-400">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Keterangan singkat fungsi..."
                  className="w-full bg-slate-900/50 border border-slate-700/60 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <Button type="submit" variant="soft" color="purple" disabled={!newTitle.trim()}>
                Simpan & Tambah ke List
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
