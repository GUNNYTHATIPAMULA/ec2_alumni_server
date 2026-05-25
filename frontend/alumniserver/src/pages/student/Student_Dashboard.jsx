import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { Users, Calendar, ArrowRight, Loader2, GraduationCap } from 'lucide-react'

const Student_Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ events: 0, alumni: 0 })
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/events').catch(() => ({ data: [] })),
      api.get('/alumni/directory').catch(() => ({ data: [] })),
    ]).then(([eventsRes, alumniRes]) => {
      setEvents(eventsRes.data || [])
      setStats({ events: eventsRes.data?.length || 0, alumni: alumniRes.data?.length || 0 })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto md:px-4 px-1">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap size={24} className="text-amber-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Student Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users size={20} className="text-blue-900" />
              <h3 className="text-sm font-semibold text-gray-600">Total Alumni</h3>
            </div>
            <p className="text-3xl font-bold text-blue-900">{stats.alumni}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={20} className="text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-600">Upcoming Events</h3>
            </div>
            <p className="text-3xl font-bold text-amber-600">{stats.events}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-gray-900">
            <h3 className="text-sm font-semibold mb-2">Quick Links</h3>
            <div className="space-y-2">
              <button onClick={() => navigate('/studentdashboard/events')}
                className="flex items-center gap-2 text-sm font-medium hover:underline">
                <Calendar size={14} /> View Events <ArrowRight size={14} />
              </button>
              <button onClick={() => navigate('/studentdashboard/profile')}
                className="flex items-center gap-2 text-sm font-medium hover:underline">
                <Users size={14} /> My Profile <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-amber-500" /> Upcoming Events
          </h2>
          {events.length === 0 ? (
            <p className="text-gray-400 text-sm">No upcoming events</p>
          ) : (
            <div className="space-y-2">
              {events.slice(0, 5).map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500">{new Date(event.event_date).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => navigate('/studentdashboard/events')}
                    className="text-amber-600 text-xs font-medium hover:underline">View</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Student_Dashboard
