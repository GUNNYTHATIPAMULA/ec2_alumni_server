import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'

const Student_Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ events: 0, alumni: 0 })
  const [events, setEvents] = useState([])

  useEffect(() => {
    api.get('/events').then(r => {
      setEvents(r.data || [])
      setStats(s => ({ ...s, events: r.data?.length || 0 }))
    }).catch(() => {})
    api.get('/alumni/directory').then(r => {
      setStats(s => ({ ...s, alumni: r.data?.length || 0 }))
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Total Alumni</h3>
          <p className="text-4xl font-bold text-blue-900 mt-2">{stats.alumni}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Upcoming Events</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats.events}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Quick Links</h3>
          <div className="mt-3 space-y-2">
            <button onClick={() => navigate('/studentdashboard/events')} className="block w-full text-left text-blue-900 hover:underline">View Events</button>
            <button onClick={() => navigate('/studentdashboard/profile')} className="block w-full text-left text-blue-900 hover:underline">My Profile</button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No upcoming events</p>
        ) : (
          <div className="space-y-3">
            {events.slice(0, 5).map(event => (
              <div key={event.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{event.title}</p>
                  <p className="text-sm text-gray-500">{new Date(event.event_date).toLocaleDateString()}</p>
                </div>
                <button className="text-indigo-600 text-sm font-medium">View</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Student_Dashboard
