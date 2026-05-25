import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { User, Loader2, Save, Pencil, X } from 'lucide-react'

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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
    </div>
  )

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto md:px-4 px-1">
        <div className="flex items-center gap-3 mb-6">
          <User size={24} className="text-amber-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {profile?.full_name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{profile?.full_name}</h2>
              <p className="text-sm text-gray-500">{profile?.roll_number}</p>
            </div>
            <button onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 bg-amber-500 text-gray-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-600 transition">
              {editing ? <X size={14} /> : <Pencil size={14} />}
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              {['full_name', 'roll_number', 'branch', 'degree', 'bio', 'current_location', 'linkedin_url', 'github_url'].map(field => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5 capitalize">{field.replace(/_/g, ' ')}</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    value={form[field] || ''}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
              ))}
              <button onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 text-gray-900 font-semibold py-3 rounded-xl hover:bg-amber-600 transition">
                <Save size={16} /> Save Changes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 border-b border-gray-100 pb-4 mb-2">
                {profile?.bio && <p className="text-gray-700 text-sm">{profile.bio}</p>}
              </div>
              {[
                { label: 'Roll Number', value: profile?.roll_number },
                { label: 'Branch', value: profile?.branch },
                { label: 'Degree', value: profile?.degree },
                { label: 'Batch', value: profile?.batch_start_year && profile?.batch_end_year ? `${profile.batch_start_year} - ${profile.batch_end_year}` : 'N/A' },
                { label: 'Semester', value: profile?.current_semester || 'N/A' },
                { label: 'Location', value: profile?.current_location || 'N/A' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-medium text-gray-800">{item.value || 'N/A'}</p>
                </div>
              ))}
              {profile?.linkedin_url && (
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-400">LinkedIn</p>
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:underline">{profile.linkedin_url}</a>
                </div>
              )}
              {profile?.github_url && (
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-400">GitHub</p>
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:underline">{profile.github_url}</a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Student_Profile
