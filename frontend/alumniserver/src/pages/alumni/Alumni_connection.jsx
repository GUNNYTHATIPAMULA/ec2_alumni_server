import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Users, UserPlus, Loader2, Check, X, MessageCircle, Search } from 'lucide-react'

const Alumni_connection = () => {
  const [connections, setConnections] = useState([])
  const [pending, setPending] = useState([])
  const [alumni, setAlumni] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/alumni/directory').catch(() => ({ data: [] })),
      api.get('/connections').catch(() => ({ data: [] })),
      api.get('/connections/pending').catch(() => ({ data: [] })),
    ]).then(([alumniRes, connRes, pendingRes]) => {
      setAlumni(alumniRes.data || [])
      setConnections(connRes.data || [])
      setPending(pendingRes.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleConnect = async (userId) => {
    setActionLoading(userId)
    try {
      await api.post(`/connections/request/${userId}`)
      alert('Connection request sent!')
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to send request')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRespond = async (requestId, status) => {
    setActionLoading(requestId)
    try {
      await api.patch(`/connections/request/${requestId}`, { status })
      setPending(prev => prev.filter(p => p.id !== requestId))
      if (status === 'accepted') {
        const updated = await api.get('/connections')
        setConnections(updated.data || [])
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to respond')
    } finally {
      setActionLoading(null)
    }
  }

  const connectedIds = new Set([
    ...connections.map(c => c.sender_id || c.receiver_id),
    ...pending.map(p => p.sender_id || p.receiver_id),
  ])

  const filteredAlumni = alumni.filter(a => {
    const q = search.toLowerCase()
    return a.full_name?.toLowerCase().includes(q) || a.occupation?.toLowerCase().includes(q) || a.company_name?.toLowerCase().includes(q)
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Users size={24} className="text-amber-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Alumni Spotlights</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { key: 'all', label: 'All Alumni' },
            { key: 'connected', label: `Connected (${connections.length})` },
            { key: 'pending', label: `Pending (${pending.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                tab === t.key ? 'bg-amber-500 text-gray-900' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'pending' && pending.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <UserPlus size={18} className="text-amber-500" />
              Pending Requests
            </h2>
            <div className="space-y-2">
              {pending.map(req => (
                <div key={req.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-700">
                      {req.full_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{req.full_name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">Wants to connect</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRespond(req.id, 'accepted')}
                      disabled={actionLoading === req.id}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {actionLoading === req.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check size={13} />}
                      Accept
                    </button>
                    <button onClick={() => handleRespond(req.id, 'rejected')}
                      disabled={actionLoading === req.id}
                      className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs hover:bg-red-200 transition disabled:opacity-50"
                    >
                      <X size={13} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        {tab !== 'pending' && (
          <div className="relative mb-4">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search alumni by name, role, or company..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white" />
          </div>
        )}

        {/* Alumni Grid */}
        {tab !== 'pending' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlumni.map(a => {
              const isConnected = connectedIds.has(a.id)
              return (
                <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {a.full_name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{a.full_name}</h3>
                      <p className="text-xs text-gray-500 truncate">{a.occupation || 'Alumni'}</p>
                      {a.company_name && <p className="text-xs text-amber-600 truncate">{a.company_name}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span>{a.branch}</span>
                    <span>·</span>
                    <span>Batch {a.batch_start_year}-{a.batch_end_year}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleConnect(a.id)}
                      disabled={actionLoading === a.id || isConnected}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
                        isConnected
                          ? 'bg-gray-100 text-gray-400 cursor-default'
                          : 'bg-amber-500 text-gray-900 hover:bg-amber-600'
                      } disabled:opacity-50`}
                    >
                      {actionLoading === a.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : isConnected ? (
                        <><Check size={13} /> Connected</>
                      ) : (
                        <><UserPlus size={13} /> Connect</>
                      )}
                    </button>
                    <button className="flex items-center justify-center gap-1.5 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition">
                      <MessageCircle size={13} /> Message
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'connected' && connections.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <Users size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-lg">No connections yet</p>
            <p className="text-gray-400 text-sm">Connect with fellow alumni to grow your network.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Alumni_connection
