import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Briefcase, Loader2, Plus, Trash2 } from "lucide-react";

const Admin_Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "", company: "", location: "", description: "",
    requirements: "", employment_type: "full-time", experience_level: "",
    salary_range: "", application_deadline: "", contact_email: "",
  });

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Error loading jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadJobs(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/admin/jobs", form);
      setShowForm(false);
      setForm({ title: "", company: "", location: "", description: "",
        requirements: "", employment_type: "full-time", experience_level: "",
        salary_range: "", application_deadline: "", contact_email: "" });
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create job");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this job?")) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      loadJobs();
    } catch (err) {
      alert("Failed to delete job");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase className="text-blue-600" /> Job Management
        </h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
          <Plus size={16} /> {showForm ? "Cancel" : "Post Job"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Title *" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
              className="px-3 py-2 border rounded-lg text-sm" required />
            <input placeholder="Company *" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})}
              className="px-3 py-2 border rounded-lg text-sm" required />
            <input placeholder="Location *" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})}
              className="px-3 py-2 border rounded-lg text-sm" required />
            <input placeholder="Employment Type" value={form.employment_type} onChange={(e) => setForm({...form, employment_type: e.target.value})}
              className="px-3 py-2 border rounded-lg text-sm" />
            <input placeholder="Experience Level" value={form.experience_level} onChange={(e) => setForm({...form, experience_level: e.target.value})}
              className="px-3 py-2 border rounded-lg text-sm" />
            <input placeholder="Salary Range" value={form.salary_range} onChange={(e) => setForm({...form, salary_range: e.target.value})}
              className="px-3 py-2 border rounded-lg text-sm" />
            <input placeholder="Application Deadline" value={form.application_deadline} onChange={(e) => setForm({...form, application_deadline: e.target.value})}
              className="px-3 py-2 border rounded-lg text-sm" />
            <input placeholder="Contact Email" value={form.contact_email} onChange={(e) => setForm({...form, contact_email: e.target.value})}
              className="px-3 py-2 border rounded-lg text-sm" />
          </div>
          <input placeholder="Requirements" value={form.requirements} onChange={(e) => setForm({...form, requirements: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-sm" />
          <textarea placeholder="Description *" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
            rows={4} className="w-full px-3 py-2 border rounded-lg text-sm" required />
          <button type="submit" disabled={creating}
            className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50">
            {creating ? "Posting..." : "Post Job"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Company</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Posted By</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-xs text-gray-500">{job.location}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{job.company}</td>
                <td className="px-4 py-3 text-gray-700">{job.posted_by_name || "Unknown"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {job.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(job.id)}
                    className="text-red-500 hover:text-red-700 transition p-1">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">No jobs posted yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin_Jobs;
