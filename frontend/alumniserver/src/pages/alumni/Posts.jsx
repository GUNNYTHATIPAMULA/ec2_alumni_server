import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { FileText, Loader2, Plus, X, Heart, MessageCircle, Calendar, User } from 'lucide-react'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPost, setShowPost] = useState(false)
  const [posting, setPosting] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', tags: '' })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts')
      setPosts(res.data || [])
    } catch (err) {
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setPosting(true)
    try {
      await api.post('/posts', null, {
        params: { title: form.title, content: form.content, tags: form.tags || undefined }
      })
      setForm({ title: '', content: '', tags: '' })
      setShowPost(false)
      await fetchPosts()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create post')
    } finally {
      setPosting(false)
    }
  }

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return
    try {
      await api.delete(`/posts/${postId}`)
      setPosts(prev => prev.filter(p => p.id !== postId))
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete post')
    }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  }) : ''

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto md:px-4 px-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-amber-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Community Posts</h1>
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">{posts.length} posts</span>
          </div>
          <button onClick={() => setShowPost(!showPost)}
            className="flex items-center gap-2 bg-amber-500 text-gray-900 font-semibold px-4 py-2.5 rounded-xl hover:bg-amber-600 transition text-sm">
            {showPost ? <X size={16} /> : <Plus size={16} />}
            {showPost ? 'Cancel' : 'New Post'}
          </button>
        </div>

        {showPost && (
          <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <FileText size={18} className="text-amber-500" /> Create a Post
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Title</label>
                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Content</label>
                <textarea rows={5} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Tags (comma separated)</label>
                <input type="text" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                  placeholder="e.g. career, advice, networking"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <button type="submit" disabled={posting}
                className="flex items-center gap-2 bg-amber-500 text-gray-900 font-semibold px-6 py-2.5 rounded-xl hover:bg-amber-600 transition disabled:opacity-50">
                {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                {posting ? 'Posting...' : 'Publish Post'}
              </button>
            </div>
          </form>
        )}

        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-lg">No posts yet</p>
            <p className="text-gray-400 text-sm">Be the first to share something with the community.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold shrink-0">
                    <User size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{post.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Calendar size={11} /> {formatDate(post.created_at)}
                      {post.tags && <span>· {post.tags}</span>}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(post.id)}
                    className="p-1 text-gray-300 hover:text-red-500 transition">
                    <X size={14} />
                  </button>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-line">{post.content}</p>
                {post.like_count > 0 && (
                  <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                    <Heart size={12} className="text-red-400" /> {post.like_count}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Posts
