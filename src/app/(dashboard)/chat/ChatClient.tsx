'use strict'
'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, Image, Heart, Smile, Sparkles, Trash2, ArrowDown } from 'lucide-react'

interface ChatClientProps {
  initialMessages: any[]
  currentUserName: string
}

export default function ChatClient({ initialMessages, currentUserName }: ChatClientProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<any[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on load and new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Set up real-time subscription for message syncing
  useEffect(() => {
    const channel = supabase
      .channel('realtime_chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() && !imageUrl.trim()) return

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          sender_name: currentUserName,
          message: newMessage.trim(),
          image_url: imageUrl.trim() || null
        }])

      if (error) throw error
      setNewMessage('')
      setImageUrl('')
      setShowImageInput(false)
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const handleDeleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessages(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      console.error('Failed to delete message:', err)
    }
  }

  // Quick love reactions
  const reactToMessage = async (id: string, reaction: string) => {
    // Local animation trigger or message update
    alert(`Reacted with ${reaction}! ❤️`)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto rounded-3xl border border-rose-100 bg-white/80 backdrop-blur-xl shadow-lg shadow-rose-500/5 overflow-hidden">
      
      {/* Romantic Chat Header */}
      <div className="p-4 border-b border-rose-50 bg-gradient-to-r from-rose-50 to-pink-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shadow-rose-500/10 text-sm">
              💞
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800">Our Private Space</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bala & Sudha &bull; Connected</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-rose-500 fill-current animate-pulse" />
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6 space-y-3">
            <span className="text-4xl animate-bounce">💌</span>
            <p className="text-xs font-semibold">Our chat history is empty. Start our conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_name === currentUserName
            return (
              <div 
                key={msg.id || index} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 group`}
              >
                <div className={`flex items-center space-x-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Sender Initial Bubble */}
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                    isMe ? 'bg-rose-500 text-white' : 'bg-pink-400 text-white'
                  }`}>
                    {msg.sender_name[0].toUpperCase()}
                  </div>

                  {/* Message bubble */}
                  <div className={`max-w-xs md:max-w-md rounded-2xl p-3 px-4 text-xs font-semibold leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-rose-50 rounded-tl-none'
                  }`}>
                    {msg.image_url && (
                      <img 
                        src={msg.image_url} 
                        alt="Shared memory" 
                        className="rounded-xl max-h-48 object-cover mb-2 border border-slate-100" 
                      />
                    )}
                    <p>{msg.message}</p>
                  </div>
                </div>

                {/* Subtext info (date / actions) */}
                <div className="flex items-center space-x-2 text-[8px] text-slate-400 font-bold uppercase tracking-wider px-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && (
                    <button 
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input panel */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-rose-50 bg-white space-y-3">
        {showImageInput && (
          <div className="flex items-center space-x-2 animate-fade-in">
            <Image className="h-4.5 w-4.5 text-rose-500" />
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste shared photo URL here..."
              className="flex-1 rounded-xl border border-rose-100 px-3 py-2 text-xs text-slate-800 bg-rose-50/20 outline-none focus:border-rose-400"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button 
            type="button"
            onClick={() => setShowImageInput(!showImageInput)}
            className={`p-2.5 rounded-xl border transition-all ${
              showImageInput ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
            }`}
            title="Attach memory photo"
          >
            <Image className="h-4.5 w-4.5" />
          </button>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a loving message..."
            className="flex-1 rounded-xl border border-rose-100 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-rose-400 bg-rose-50/10 placeholder-slate-400"
          />

          <button 
            type="submit"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20 active:scale-95 transition-all"
          >
            <Send className="h-4.5 w-4.5 ml-0.5" />
          </button>
        </div>
      </form>
    </div>
  )
}
