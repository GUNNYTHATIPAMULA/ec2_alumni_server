import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Calendar, MapPin, Clock, Users, Loader2, CheckCircle } from 'lucide-react'

const Student_Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(null)

  useEffect(() => {
    api.get('/events').then(r => {
      setEvents(r.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleRegister = async (eventId) => {
    setRegistering(eventId)
    try {
      await api.post(`/events/${eventId}/register`)
      alert('Registered successfully!')
    } catch (err) {
      alert(err.response?.data?.detail || 'Registration failed')
    } finally {
      setRegistering(null)
    }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

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
          <Calendar size={24} className="text-amber-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Events</h1>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-lg">No events available</p>
            <p className="text-gray-400 text-sm">Check back later for new events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-32 bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center">
                  <Calendar size={44} className="text-amber-400/60" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>
                  <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-amber-500" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-amber-500" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-amber-500" />
                        <span>{event.venue}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRegister(event.id)}
                    disabled={registering === event.id}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 text-gray-900 font-semibold py-2.5 rounded-xl hover:bg-amber-600 transition disabled:opacity-50"
                  >
                    {registering === event.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <><Users size={16} /> Register Now</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Student_Events
