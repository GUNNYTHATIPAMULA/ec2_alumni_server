import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Heart, Loader2, Plus, Gift, Calendar, CheckCircle } from 'lucide-react'

const Contributions = () => {
  const [contributions, setContributions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ amount: '', purpose: '' })

  useEffect(() => {
    api.get('/contributions/my').then(r => {
      setContributions(r.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await api.post('/contributions', {
        amount: parseFloat(form.amount),
        purpose: form.purpose
      })
      setContributions(prev => [res.data, ...prev])
      setForm({ amount: '', purpose: '' })
      setShowForm(false)
      alert('Thank you for your contribution!')
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit contribution')
    } finally {
      setSubmitting(false)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Heart size={24} className="text-amber-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Giving Back</h1>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 text-gray-900 mb-6 shadow-lg">
          <Heart size={40} className="mb-3 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">Support Your Alma Mater</h2>
          <p className="text-lg opacity-90 mb-4">Every contribution helps shape the future of TKR College. Give back to the community that helped build your career.</p>
          <button onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-white text-amber-700 font-bold px-6 py-3 rounded-2xl hover:bg-gray-100 transition shadow-md"
          >
            <Plus size={18} /> {showForm ? 'Cancel' : 'Make a Contribution'}
          </button>
        </div>

        {/* Contribution Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <Gift size={18} className="text-amber-500" /> New Contribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input type="number" min="1" step="0.01" value={form.amount}
                  onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <input type="text" value={form.purpose}
                  onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))} required placeholder="e.g. Scholarship Fund"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 bg-amber-500 text-gray-900 font-semibold px-6 py-2.5 rounded-xl hover:bg-amber-600 transition disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart size={16} />}
              {submitting ? 'Processing...' : 'Contribute Now'}
            </button>
          </form>
        )}

        {/* My Contributions */}
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600" />
          My Contributions ({contributions.length})
        </h2>

        {contributions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Gift size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-lg">No contributions yet</p>
            <p className="text-gray-400 text-sm">Be the first to give back to your college community.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contributions.map(c => (
              <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Heart size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">₹{c.amount?.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{c.purpose}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Calendar size={11} /> {formatDate(c.created_at)}
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">{c.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Contributions
