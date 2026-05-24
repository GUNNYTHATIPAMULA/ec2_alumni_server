import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Users, UserCheck, Calendar, ArrowRight, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Admin_Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard')
      setStats(res.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  const cards = [
    { label: 'Total Alumni', value: stats?.total_alumni || 0, icon: Users, color: 'bg-blue-500', path: '/admindashboard/alumni' },
    { label: 'Pending Approvals', value: stats?.pending_approvals || 0, icon: UserCheck, color: 'bg-amber-500', path: '/admindashboard/pending' },
    { label: 'Total Students', value: stats?.total_students || 0, icon: Users, color: 'bg-green-500', path: '/admindashboard/alumni' },
    { label: 'Events', value: stats?.total_events || 0, icon: Calendar, color: 'bg-purple-500', path: '/admindashboard/events' }
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {cards.map((card, i) => (
          <div key={i} onClick={() => navigate(card.path)}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-lg ${card.color}`}>
                <card.icon size={16} className="text-white" />
              </div>
              <ArrowRight size={14} className="text-gray-300" />
            </div>
            <p className="text-xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onClick={() => navigate('/admindashboard/pending')}
            className="flex items-center justify-center gap-1.5 bg-amber-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-amber-600 transition"
          >
            <UserCheck size={14} /> Approve Alumni
          </button>
          <button onClick={() => navigate('/admindashboard/alumni')}
            className="flex items-center justify-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-blue-700 transition"
          >
            <Users size={14} /> Manage Alumni
          </button>
          <button onClick={() => navigate('/admindashboard/events')}
            className="flex items-center justify-center gap-1.5 bg-green-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-green-700 transition"
          >
            <Calendar size={14} /> Manage Events
          </button>
        </div>
      </div>
    </div>
  )
}

export default Admin_Dashboard
