'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Home() {
  const [status, setStatus] = useState('idle')
  const [posts, setPosts] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [config, setConfig] = useState({
    username: '',
    autoPost: false,
    postingInterval: 4
  })

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status')
      const data = await res.json()
      setStatus(data.status)
      setPosts(data.recentPosts || [])
      setMessages(data.recentMessages || [])
    } catch (err) {
      console.error('Failed to fetch status:', err)
    }
  }

  const handleStartAutomation = async () => {
    try {
      const res = await fetch('/api/automation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      const data = await res.json()
      if (data.success) {
        setStatus('running')
        alert('Automation started successfully!')
      } else {
        alert('Failed to start automation: ' + data.error)
      }
    } catch (err) {
      alert('Error starting automation')
    }
  }

  const handleStopAutomation = async () => {
    try {
      const res = await fetch('/api/automation/stop', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setStatus('stopped')
        alert('Automation stopped')
      }
    } catch (err) {
      alert('Error stopping automation')
    }
  }

  const handleManualPost = async () => {
    try {
      const res = await fetch('/api/post/generate', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        alert('Post created and queued!')
        fetchStatus()
      } else {
        alert('Failed to generate post: ' + data.error)
      }
    } catch (err) {
      alert('Error generating post')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
            Instagram AI Assistant
          </h1>
          <p className="text-xl text-gray-300">
            Automated UI/Logo Posting & Client Management
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${status === 'running' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
              Control Panel
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Instagram Username</label>
                <input
                  type="text"
                  value={config.username}
                  onChange={(e) => setConfig({...config, username: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-400 focus:outline-none"
                  placeholder="your_username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Posting Interval (hours)
                </label>
                <input
                  type="number"
                  value={config.postingInterval}
                  onChange={(e) => setConfig({...config, postingInterval: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-400 focus:outline-none"
                  min="1"
                  max="24"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.autoPost}
                  onChange={(e) => setConfig({...config, autoPost: e.target.checked})}
                  className="w-5 h-5 rounded"
                />
                <label className="text-sm">Enable Auto-Posting</label>
              </div>

              <div className="flex gap-3 pt-4">
                {status !== 'running' ? (
                  <button
                    onClick={handleStartAutomation}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                  >
                    Start Automation
                  </button>
                ) : (
                  <button
                    onClick={handleStopAutomation}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                  >
                    Stop Automation
                  </button>
                )}

                <button
                  onClick={handleManualPost}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  Manual Post
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Status:</span>
                <span className="font-semibold capitalize">{status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Posts:</span>
                <span className="font-semibold">{posts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Pending Messages:</span>
                <span className="font-semibold">{messages.filter(m => !m.replied).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Next Post:</span>
                <span className="font-semibold text-sm">
                  {config.autoPost ? `In ${config.postingInterval}h` : 'Manual'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {posts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No posts yet</p>
              ) : (
                posts.map((post, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm">{post.type}</span>
                      <span className="text-xs text-gray-400">{post.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300">{post.caption?.substring(0, 100)}...</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold mb-4">Client Messages</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No messages yet</p>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm">{msg.from}</span>
                      <span className={`text-xs px-2 py-1 rounded ${msg.replied ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                        {msg.replied ? 'Replied' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{msg.message}</p>
                    {msg.reply && (
                      <p className="text-xs text-purple-300 italic">Reply: {msg.reply}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold mb-3">Features</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
              <div>
                <h4 className="font-semibold mb-1">Auto Content Generation</h4>
                <p className="text-sm text-gray-400">AI generates trending UI designs and logos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-pink-400 mt-2"></div>
              <div>
                <h4 className="font-semibold mb-1">Smart Timing</h4>
                <p className="text-sm text-gray-400">Posts at optimal engagement times</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
              <div>
                <h4 className="font-semibold mb-1">AI Client Handler</h4>
                <p className="text-sm text-gray-400">Automatically responds to client inquiries</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
