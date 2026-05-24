import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'

const Student_Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    api.get('/student/profile').then(r => {
      setProfile(r.data)
      setForm(r.data)
      setLoading(false)
    }).catch(() => {
      setProfile({ full_name: 'Student', roll_number: '', branch: '', degree: '' })
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    try {
      const res = await api.put('/student/profile', form)
      setProfile(res.data)
      setEditing(false)
      alert('Profile updated!')
    } catch (err) {
      alert(err.response?.data?.detail || 'Update failed')
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <button onClick={() => setEditing(!editing)} className="text-blue-900 font-medium hover:underline">
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editing ? (
          <div className="space-y-4">
            {['full_name', 'roll_number', 'branch', 'degree', 'bio', 'linkedin_url', 'github_url'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace(/_/g, ' ')}</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={form[field] || ''}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}
            <button onClick={handleSave} className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition font-medium">
              Save Changes
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile?.full_name?.charAt(0) || 'S'}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile?.full_name}</h2>
                <p className="text-gray-500">{profile?.roll_number}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-gray-500 text-sm">Branch</span><p className="font-medium">{profile?.branch}</p></div>
              <div><span className="text-gray-500 text-sm">Degree</span><p className="font-medium">{profile?.degree}</p></div>
              <div><span className="text-gray-500 text-sm">Batch</span><p className="font-medium">{profile?.batch_start_year} - {profile?.batch_end_year}</p></div>
              <div><span className="text-gray-500 text-sm">Semester</span><p className="font-medium">{profile?.current_semester || 'N/A'}</p></div>
            </div>
            {profile?.bio && <div><span className="text-gray-500 text-sm">Bio</span><p className="mt-1">{profile.bio}</p></div>}
          </div>
        )}
      </div>
    </div>
  )
}

export default Student_Profile
