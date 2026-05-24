import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Calendar, MapPin, Users, Loader2, CheckCircle, Clock } from 'lucide-react'

const Events_alumni = () => {
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/events'),
      api.get('/events/my-registrations').catch(() => ({ data: [] }))
    ]).then(([eventsRes, regsRes]) => {
      setEvents(eventsRes.data || [])
      setRegistrations(regsRes.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleRegister = async (eventId) => {
    setRegistering(eventId)
    try {
      await api.post(`/events/${eventId}/register`)
      setRegistrations(prev => [...prev, { event_id: eventId }])
    } catch (err) {
      alert(err.response?.data?.detail || 'Registration failed')
    } finally {
      setRegistering(null)
    }
  }

  const isRegistered = (eventId) => registrations.some(r => r.event_id === eventId)

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  const formatTime = (d) => new Date(d).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
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
          <Calendar size={24} className="text-amber-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Events & Reunions</h1>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-lg">No upcoming events</p>
            <p className="text-gray-400 text-sm mt-1">Check back later for new events and reunions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => {
              const registered = isRegistered(event.id)
              return (
                <div key={event.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="h-36 bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center">
                    <Calendar size={48} className="text-amber-400/60" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-amber-500" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-amber-500" />
                        <span>{formatTime(event.event_date)}</span>
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
                      disabled={registering === event.id || registered}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition ${
                        registered
                          ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                          : 'bg-amber-500 text-gray-900 hover:bg-amber-600'
                      } disabled:opacity-60`}
                    >
                      {registering === event.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : registered ? (
                        <><CheckCircle size={16} /> Registered</>
                      ) : (
                        <><Users size={16} /> Register Now</>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {registrations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              My Registrations ({registrations.length})
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="space-y-2">
                {events.filter(e => isRegistered(e.id)).map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{event.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(event.event_date)}</p>
                    </div>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">Registered</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Events_alumni
