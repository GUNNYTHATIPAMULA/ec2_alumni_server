import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'

const Student_Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/events').then(r => {
      setEvents(r.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/register`)
      alert('Registered successfully!')
    } catch (err) {
      alert(err.response?.data?.detail || 'Registration failed')
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading events...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Events</h1>
      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No events available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>📅 {new Date(event.event_date).toLocaleDateString()}</p>
                  {event.location && <p>📍 {event.location}</p>}
                  {event.venue && <p>🏛️ {event.venue}</p>}
                </div>
                <button
                  onClick={() => handleRegister(event.id)}
                  className="mt-4 w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Student_Events
