import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Settings as SettingsIcon, User, Bell, Shield, Save, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Settings = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mentorship, setMentorship] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    api.get('/alumni/profile').then(r => {
      setProfile(r.data)
      setForm({
        full_name: r.data.full_name || '',
        bio: r.data.bio || '',
        current_location: r.data.current_location || '',
        linkedin_url: r.data.linkedin_url || '',
        github_url: r.data.github_url || '',
      })
      setMentorship(r.data.mentorship_available || false)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await api.put('/alumni/profile', { ...form, mentorship_available: mentorship })
      setProfile(res.data)
      alert('Settings updated successfully!')
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon size={24} className="text-amber-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="space-y-5">
          {/* Profile Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <User size={18} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={form.full_name}
                  onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea rows={3} value={form.bio}
                  onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                <input type="text" value={form.current_location}
                  onChange={e => setForm(p => ({ ...p, current_location: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input type="url" value={form.linkedin_url}
                  onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                <input type="url" value={form.github_url}
                  onChange={e => setForm(p => ({ ...p, github_url: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Mentorship Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield size={18} className="text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">Mentorship Preferences</h2>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setMentorship(!mentorship)}
                className={`w-11 h-6 rounded-full transition-colors relative ${mentorship ? 'bg-amber-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${mentorship ? 'translate-x-5' : ''}`} />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Available for Mentorship</p>
                <p className="text-xs text-gray-500">Allow students and alumni to request mentorship sessions</p>
              </div>
            </label>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bell size={18} className="text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Event Reminders', desc: 'Get notified about upcoming events and reunions' },
                { label: 'Mentorship Requests', desc: 'Receive alerts when someone requests mentorship' },
                { label: 'Connection Requests', desc: 'Get notified when someone wants to connect' },
                { label: 'Job Alerts', desc: 'Receive notifications about new job postings' },
              ].map(item => (
                <label key={item.label} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button onClick={handleSave} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 text-gray-900 font-semibold py-3.5 rounded-2xl hover:bg-amber-600 transition disabled:opacity-50 shadow-sm"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
