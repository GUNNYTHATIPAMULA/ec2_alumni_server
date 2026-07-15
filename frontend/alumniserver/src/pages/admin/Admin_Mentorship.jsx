import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { GraduationCap, Loader2, Check, X } from "lucide-react";

const Admin_Mentorship = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/mentorship");
      setRequests(res.data);
    } catch (err) {
      console.error("Error loading mentorship requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/admin/mentorship/${id}?status=${status}`);
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update request");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <GraduationCap className="text-blue-600" /> Mentorship Requests
      </h1>

      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white rounded-lg shadow p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-gray-900">Mentor: {req.mentor_name || req.mentor_id}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-sm font-semibold text-gray-900">Mentee: {req.mentee_name || req.mentee_id}</span>
                </div>
                {req.message && <p className="text-sm text-gray-600 mb-2">{req.message}</p>}
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    req.status === "accepted" ? "bg-green-100 text-green-700" :
                    req.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{req.status}</span>
                  <span className="text-xs text-gray-400">{new Date(req.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {req.status === "pending" && (
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleStatus(req.id, "accepted")}
                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition">
                    <Check size={16} />
                  </button>
                  <button onClick={() => handleStatus(req.id, "rejected")}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="text-center py-12 text-gray-400">No mentorship requests yet</div>
        )}
      </div>
    </div>
  );
};

export default Admin_Mentorship;
