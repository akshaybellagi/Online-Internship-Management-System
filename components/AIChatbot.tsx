'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  time: Date;
}

const QUICK_PROMPTS = [
  { label: '📊 My Attendance', text: 'Show my attendance' },
  { label: '📅 Today\'s Classes', text: 'What classes do I have today?' },
  { label: '🏖️ Holidays', text: 'Show upcoming holidays' },
  { label: '📚 My Subjects', text: 'What subjects do I have?' },
];

function formatText(text: string) {
  // Convert **bold**, newlines, bullet points
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const parts = line.split(/\*\*(.+?)\*\*/g);
    const formatted = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    );
    return (
      <span key={i}>
        {formatted}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: "👋 Hi! I'm your SmartAttend assistant.\n\nAsk me about your **attendance**, **timetable**, **holidays**, or **subjects**.\n\nOr tap a quick option below!",
      time: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus();
  }, [open, minimized]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim(), time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/student/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '_bot',
        role: 'bot',
        text: data.reply || 'Sorry, something went wrong.',
        time: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '_err',
        role: 'bot',
        text: '❌ Connection error. Please try again.',
        time: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className={`fixed bottom-6 right-6 z-50 w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 ${minimized ? 'h-14' : 'h-[560px]'}`}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-t-2xl">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">SmartAttend AI</p>
              <p className="text-xs text-white/70">Answers from your school data</p>
            </div>
            <button onClick={() => setMinimized(!minimized)} className="p-1 rounded hover:bg-white/20 text-white">
              <Minimize2 size={15} />
            </button>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/20 text-white">
              <X size={15} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      msg.role === 'bot' ? 'bg-emerald-100' : 'bg-blue-100'
                    }`}>
                      {msg.role === 'bot'
                        ? <Bot size={14} className="text-emerald-600" />
                        : <User size={14} className="text-blue-600" />
                      }
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[78%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-sm'
                        : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm'
                    }`}>
                      {msg.role === 'bot' ? formatText(msg.text) : msg.text}
                      <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/60 text-right' : 'text-gray-400'}`}>
                        {msg.time.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Bot size={14} className="text-emerald-600" />
                    </div>
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1 items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick prompts */}
              {messages.length <= 1 && (
                <div className="px-3 py-2 border-t border-gray-100 bg-white">
                  <div className="grid grid-cols-2 gap-1.5">
                    {QUICK_PROMPTS.map(q => (
                      <button
                        key={q.text}
                        onClick={() => sendMessage(q.text)}
                        className="text-xs px-2.5 py-2 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200 rounded-lg text-left transition-colors font-medium"
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 bg-white rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask about attendance, timetable..."
                    disabled={loading}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 bg-gray-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="w-9 h-9 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
