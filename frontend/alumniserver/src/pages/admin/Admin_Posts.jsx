import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { FileText, Loader2, Trash2 } from "lucide-react";

const Admin_Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/admin/posts/${id}`);
      loadPosts();
    } catch (err) {
      alert("Failed to delete post");
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
        <FileText className="text-blue-600" /> Post Management
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Author</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Likes</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{post.title}</td>
                <td className="px-4 py-3 text-gray-700">{post.author_name || "Unknown"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {post.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{post.like_count || 0}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{new Date(post.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(post.id)}
                    className="text-red-500 hover:text-red-700 transition p-1">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No posts yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin_Posts;
