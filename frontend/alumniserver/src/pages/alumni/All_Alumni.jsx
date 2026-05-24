import React, { useState, useEffect, useMemo } from 'react'
import { api } from '../../services/api'
import { Loader2, Search, Users, UserPlus, Check, MessageCircle } from 'lucide-react'

const All_Alumni = () => {
  const [alumni, setAlumni] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 6

  useEffect(() => {
    api.get('/alumni/directory').then(r => {
      setAlumni(r.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => alumni.filter(a => a.full_name?.toLowerCase().includes(search.toLowerCase())),
    [search, alumni]
  )
  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <Users size={24} className="text-amber-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Alumni Directory</h1>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">{alumni.length} members</span>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search alumni by name..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-700 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Cards grid */}
        {paginated.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <Users size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-lg">No alumni found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((a) => (
                <div key={a.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                      {a.full_name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg truncate">{a.full_name}</h3>
                      <p className="text-xs text-gray-500">{a.branch} · {'\''}{a.batch_end_year?.toString().slice(-2)}</p>
                      {a.occupation && <p className="text-xs text-amber-600 mt-0.5">{a.occupation}{a.company_name ? ` at ${a.company_name}` : ''}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-1">
                      <MessageCircle size={13} /> Message
                    </button>
                    <button className="flex-1 rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-amber-600 transition flex items-center justify-center gap-1">
                      <UserPlus size={13} /> Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40">
                ‹ Prev
              </button>
              {Array.from({ length: Math.max(totalPages, 1) }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-xl text-sm font-medium ${
                    page === i + 1 ? 'bg-amber-500 text-gray-900' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40">
                Next ›
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default All_Alumni
