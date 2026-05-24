import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Loader2, Calendar, Plus, X, Eye, Trash2, MapPin, Users } from 'lucide-react'

const Admin_Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [viewRegs, setViewRegs] = useState(null)
  const [regsLoading, setRegsLoading] = useState(false)
  const [regs, setRegs] = useState([])
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '' })

  useEffect(() => { fetchEvents() }, [])

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events')
      setEvents(res.data)
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await api.post('/events', { ...form, date: new Date(form.date).toISOString() })
      setForm({ title: '', description: '', date: '', location: '' })
      setShowCreate(false)
      await fetchEvents()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create event')
    } finally { setCreating(false) }
  }

  const handleDelete = async (eventId) => {
    if (!window.confirm('Delete this event and all registrations?')) return
    try {
      await api.delete(`/events/${eventId}`)
      setEvents(prev => prev.filter(e => e.id !== eventId))
      if (viewRegs === eventId) setViewRegs(null)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete event')
    }
  }

  const handleViewRegistrations = async (eventId) => {
    if (viewRegs === eventId) { setViewRegs(null); return }
    setViewRegs(eventId)
    setRegsLoading(true)
    setRegs([])
    try {
      const res = await api.get(`/events/${eventId}/registrations`)
      setRegs(res.data)
    } catch (err) {
      console.error(err)
      setRegs([])
    } finally { setRegsLoading(false) }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-green-600" />
          <h1 className="text-xl font-bold text-gray-900">Events</h1>
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-700 transition"
        >
          {showCreate ? <X size={13} /> : <Plus size={13} />}
          {showCreate ? 'Cancel' : 'Create'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-0.5">Title</label>
              <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-0.5">Description</label>
              <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-0.5">Date & Time</label>
              <input type="datetime-local" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-0.5">Location</label>
              <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} required
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button type="submit" disabled={creating}
            className="mt-3 bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-1"
          >
            {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus size={13} />}
            {creating ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      )}

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <Calendar size={36} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 text-sm">No events yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{event.description}</p>
                    <div className="flex gap-3 mt-1.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(event.event_date)}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} /> {event.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => handleViewRegistrations(event.id)}
                      className="flex items-center gap-1 text-blue-600 border border-blue-200 px-2 py-1 rounded text-xs hover:bg-blue-50 transition"
                    >
                      <Eye size={12} /> {viewRegs === event.id ? 'Hide' : 'Regs'}
                    </button>
                    <button onClick={() => handleDelete(event.id)}
                      className="flex items-center gap-1 text-red-600 border border-red-200 px-2 py-1 rounded text-xs hover:bg-red-50 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {viewRegs === event.id && (
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Users size={13} /> Registered ({regs.length})
                  </h4>
                  {regsLoading ? (
                    <div className="flex justify-center py-2"><Loader2 className="h-4 w-4 animate-spin text-blue-600" /></div>
                  ) : regs.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-2">No registrations yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-white border-b">
                            <th className="text-left px-2 py-1.5 font-medium text-gray-500">Name</th>
                            <th className="text-left px-2 py-1.5 font-medium text-gray-500 hidden sm:table-cell">Email</th>
                            <th className="text-left px-2 py-1.5 font-medium text-gray-500">Roll</th>
                            <th className="text-left px-2 py-1.5 font-medium text-gray-500 hidden md:table-cell">Branch</th>
                            <th className="text-left px-2 py-1.5 font-medium text-gray-500">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {regs.map((r, i) => (
                            <tr key={r.registration_id || i} className="hover:bg-white">
                              <td className="px-2 py-1.5 font-medium text-gray-800">{r.full_name}</td>
                              <td className="px-2 py-1.5 text-gray-600 hidden sm:table-cell">{r.email}</td>
                              <td className="px-2 py-1.5 text-gray-600">{r.roll_number || '-'}</td>
                              <td className="px-2 py-1.5 text-gray-600 hidden md:table-cell">{r.branch || '-'}</td>
                              <td className="px-2 py-1.5 text-gray-400 whitespace-nowrap">
                                {r.registered_at ? new Date(r.registered_at).toLocaleDateString() : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Admin_Events
