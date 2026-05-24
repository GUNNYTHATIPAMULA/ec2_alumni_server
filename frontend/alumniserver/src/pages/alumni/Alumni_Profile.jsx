import React, { useState, useEffect } from "react"
import { api } from "../../services/api"
import { Pencil, MapPin, Mail, Briefcase, GraduationCap, Users, Loader2, Save, X, Plus, Trash2 } from "lucide-react"

const Alumni_Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})
  const [skills, setSkills] = useState([])
  const [education, setEducation] = useState([])
  const [newSkill, setNewSkill] = useState("")
  const [newEdu, setNewEdu] = useState({ degree: "", institution: "", field_of_study: "", start_year: "", end_year: "" })
  const [showEduForm, setShowEduForm] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const loadData = async () => {
    try {
      const [profileRes, skillsRes, eduRes] = await Promise.all([
        api.get('/alumni/profile'),
        api.get('/alumni/skills').catch(() => ({ data: [] })),
        api.get('/alumni/education').catch(() => ({ data: [] })),
      ])
      setProfile(profileRes.data)
      setForm({
        full_name: profileRes.data.full_name || '',
        bio: profileRes.data.bio || '',
        occupation: profileRes.data.occupation || '',
        company_name: profileRes.data.company_name || '',
        current_location: profileRes.data.current_location || '',
        linkedin_url: profileRes.data.linkedin_url || '',
        github_url: profileRes.data.github_url || '',
        profile_image: profileRes.data.profile_image || '',
      })
      setSkills(skillsRes.data || [])
      setEducation(eduRes.data || [])
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await api.put('/alumni/profile', form)
      setProfile(res.data)
      setEditing(false)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const addSkill = async () => {
    if (!newSkill.trim()) return
    setActionLoading(true)
    try {
      const res = await api.post('/alumni/add-skill', { skill_name: newSkill.trim() })
      setSkills(prev => [...prev, res.data])
      setNewSkill("")
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add skill')
    } finally {
      setActionLoading(false)
    }
  }

  const deleteSkill = async (id) => {
    setActionLoading(id)
    try {
      await api.delete(`/alumni/skills/${id}`)
      setSkills(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      alert('Failed to delete skill')
    } finally {
      setActionLoading(null)
    }
  }

  const addEducation = async () => {
    if (!newEdu.degree || !newEdu.institution || !newEdu.start_year) return
    setActionLoading(true)
    try {
      const res = await api.post('/alumni/add-education', {
        ...newEdu,
        start_year: parseInt(newEdu.start_year),
        end_year: newEdu.end_year ? parseInt(newEdu.end_year) : null,
      })
      setEducation(prev => [...prev, res.data])
      setNewEdu({ degree: "", institution: "", field_of_study: "", start_year: "", end_year: "" })
      setShowEduForm(false)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add education')
    } finally {
      setActionLoading(false)
    }
  }

  const deleteEducation = async (id) => {
    setActionLoading(id)
    try {
      await api.delete(`/alumni/education/${id}`)
      setEducation(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      alert('Failed to delete education')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <Users size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 text-lg">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto md:px-4 px-1 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start md:items-center gap-3 md:gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-bold text-2xl shrink-0 overflow-hidden">
                {profile.profile_image ? (
                  <img src={profile.profile_image} alt="" className="h-full w-full object-cover" />
                ) : (
                  profile.full_name?.charAt(0) || "A"
                )}
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-semibold leading-tight text-gray-900">
                  {profile.full_name}{" "}
                  <span className="text-gray-400 text-sm">'{profile.batch_end_year?.toString().slice(-2)}</span>
                </h1>
                <p className="text-xs md:text-sm text-gray-500">
                  {profile.occupation || "Alumni"}{profile.company_name ? ` · ${profile.company_name}` : ""}
                </p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{profile.bio}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button onClick={() => editing ? setEditing(false) : setEditing(true)}
                className="flex items-center justify-center gap-2 bg-amber-500 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-semibold w-full sm:w-auto hover:bg-amber-600 transition">
                {editing ? <X size={16} /> : <Pencil size={16} />}
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold w-full sm:w-auto hover:bg-gray-50 transition">
                <Mail size={16} /> Contact
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Personal Information" icon={Users}>
            {editing ? (
              <div className="space-y-3">
                <EditField label="Full Name" value={form.full_name} onChange={v => setForm(p => ({ ...p, full_name: v }))} />
                <EditField label="Bio" value={form.bio} onChange={v => setForm(p => ({ ...p, bio: v }))} textarea />
                <EditField label="Occupation" value={form.occupation} onChange={v => setForm(p => ({ ...p, occupation: v }))} />
                <EditField label="Company" value={form.company_name} onChange={v => setForm(p => ({ ...p, company_name: v }))} />
                <EditField label="Location" value={form.current_location} onChange={v => setForm(p => ({ ...p, current_location: v }))} />
                <EditField label="LinkedIn" value={form.linkedin_url} onChange={v => setForm(p => ({ ...p, linkedin_url: v }))} />
                <EditField label="GitHub" value={form.github_url} onChange={v => setForm(p => ({ ...p, github_url: v }))} />
                <EditField label="Profile Image URL" value={form.profile_image} onChange={v => { setForm(p => ({ ...p, profile_image: v })); setProfile(prev => ({ ...prev, profile_image: v })) }} />
                <button onClick={handleSave} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 text-gray-900 font-semibold py-3 rounded-xl hover:bg-amber-600 transition disabled:opacity-50 mt-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                  Save Changes
                </button>
              </div>
            ) : (
              <>
                <Field label="Full Name" value={profile.full_name} />
                <Field label="Roll Number" value={profile.roll_number} />
                <Field label="Department" value={profile.branch} />
                <Field label="Degree" value={profile.degree} />
                <Field label="Batch" value={`${profile.batch_start_year} - ${profile.batch_end_year}`} />
                <Field label="Location" value={profile.current_location || 'N/A'} icon={MapPin} />
                {profile.linkedin_url && <Field label="LinkedIn" value={profile.linkedin_url} />}
                {profile.github_url && <Field label="GitHub" value={profile.github_url} />}
              </>
            )}
          </Card>

          <Card title="Work Experience" icon={Briefcase}>
            {profile.occupation ? (
              <Timeline role={profile.occupation} company={profile.company_name || 'Unknown'} date="Current" />
            ) : (
              <p className="text-sm text-gray-400">No work experience added</p>
            )}
          </Card>

          <Card title="Education" icon={GraduationCap}>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id} className="flex items-start justify-between group">
                  <div className="border-l-2 border-blue-300 pl-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
                    <p className="text-xs text-gray-500">{edu.institution}{edu.field_of_study ? ` · ${edu.field_of_study}` : ''}</p>
                    <p className="text-xs text-blue-600">{edu.start_year}{edu.end_year ? ` - ${edu.end_year}` : ''}</p>
                  </div>
                  <button onClick={() => deleteEducation(edu.id)}
                    className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                    {actionLoading === edu.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              ))}
              {education.length === 0 && (
                <p className="text-sm text-gray-400">No education added</p>
              )}
              {!showEduForm ? (
                <button onClick={() => setShowEduForm(true)}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2">
                  <Plus size={12} /> Add Education
                </button>
              ) : (
                <div className="space-y-2 mt-2 p-3 bg-gray-50 rounded-xl">
                  <input placeholder="Degree" value={newEdu.degree} onChange={e => setNewEdu(p => ({ ...p, degree: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                  <input placeholder="Institution" value={newEdu.institution} onChange={e => setNewEdu(p => ({ ...p, institution: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                  <input placeholder="Field of study (optional)" value={newEdu.field_of_study} onChange={e => setNewEdu(p => ({ ...p, field_of_study: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                  <div className="flex gap-2">
                    <input placeholder="Start year" type="number" value={newEdu.start_year} onChange={e => setNewEdu(p => ({ ...p, start_year: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                    <input placeholder="End year" type="number" value={newEdu.end_year} onChange={e => setNewEdu(p => ({ ...p, end_year: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addEducation} disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-900 text-white py-1.5 rounded-lg text-xs hover:bg-blue-800 transition">
                      {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus size={12} />} Add
                    </button>
                    <button onClick={() => setShowEduForm(false)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card title="Skills">
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map(skill => (
                <span key={skill.id} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium group">
                  {skill.skill_name}
                  <button onClick={() => deleteSkill(skill.id)}
                    className="text-blue-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                    {actionLoading === skill.id ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <X size={12} />}
                  </button>
                </span>
              ))}
              {skills.length === 0 && <p className="text-sm text-gray-400 w-full">No skills added</p>}
            </div>
            <div className="flex gap-2">
              <input placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={addSkill} disabled={actionLoading || !newSkill.trim()}
                className="flex items-center gap-1 bg-amber-500 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-amber-600 transition disabled:opacity-50">
                {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus size={14} />} Add
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

const Card = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon size={16} className="text-blue-600" />}
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
    </div>
    {children}
  </div>
)

const Field = ({ label, value, icon: Icon }) => (
  <div className="mb-3">
    <p className="text-xs text-gray-400">{label}</p>
    <div className="flex items-center gap-2 text-sm text-gray-700">
      {Icon && <Icon size={14} />}
      {value}
    </div>
  </div>
)

const EditField = ({ label, value, onChange, textarea }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-0.5">{label}</label>
    {textarea ? (
      <textarea rows={3} value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
    ) : (
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
    )}
  </div>
)

const Timeline = ({ role, company, date }) => (
  <div className="mb-4 border-l-2 border-blue-300 pl-3">
    <p className="text-sm font-medium text-gray-900">{role}</p>
    <p className="text-xs text-gray-500">{company}</p>
    <p className="text-xs text-blue-600">{date}</p>
  </div>
)

export default Alumni_Profile
