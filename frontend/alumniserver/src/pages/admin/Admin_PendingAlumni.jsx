import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Loader2, Check, UserCheck } from 'lucide-react'

const Admin_PendingAlumni = () => {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    fetchPending()
  }, [])

  const fetchPending = async () => {
    try {
      const res = await api.get('/admin/pending-users')
      setPending(res.data)
    } catch (err) {
      console.error('Error fetching pending:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId) => {
    setActionLoading(userId)
    try {
      await api.put(`/admin/verify-user/${userId}`)
      setPending(prev => prev.filter(p => p.user_id !== userId))
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to approve')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <UserCheck size={20} className="text-amber-500" />
        <h1 className="text-xl font-bold text-gray-900">Pending Approvals</h1>
      </div>

      {pending.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <UserCheck size={36} className="mx-auto text-green-400 mb-2" />
          <p className="text-gray-500">No pending approvals</p>
          <p className="text-gray-400 text-xs mt-1">All alumni registrations have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((alumni) => (
            <div key={alumni.user_id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0 text-sm">
                    {alumni.full_name?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{alumni.full_name}</h3>
                    <p className="text-xs text-gray-500 truncate">{alumni.email} · {alumni.roll_number}</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500 shrink-0">
                  <span>{alumni.branch}</span>
                  <span>{alumni.batch_start_year}-{alumni.batch_end_year}</span>
                </div>
                <button onClick={() => handleApprove(alumni.user_id)}
                  disabled={actionLoading === alumni.user_id}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-green-700 transition disabled:opacity-50 shrink-0"
                >
                  {actionLoading === alumni.user_id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check size={13} />}
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Admin_PendingAlumni
