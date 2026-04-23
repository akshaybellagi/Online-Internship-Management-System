'use client';
import { useEffect, useState } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Umbrella } from 'lucide-react';

interface Notification {
  id: string;
  type: 'attendance' | 'holiday' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // auto-detect role from URL
    const isTeacher = window.location.pathname.startsWith('/teacher');
    const endpoint = isTeacher ? '/api/teacher/notifications' : '/api/student/notifications';
    fetch(endpoint)
      .then(r => r.json())
      .then(data => { setNotifications(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'attendance': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'holiday': return <Umbrella size={16} className="text-blue-500" />;
      default: return <Info size={16} className="text-gray-500" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'attendance': return 'bg-emerald-50 border-emerald-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'holiday': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 w-96 max-h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <p className="text-xs text-gray-500">{unreadCount} unread</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  <Bell size={32} className="mx-auto mb-2 opacity-30" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-4 border-l-4 ${getColor(n.type)} hover:bg-gray-50 transition-colors`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">{getIcon(n.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 mb-0.5">{n.title}</p>
                          <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(n.time).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <button
                          onClick={() => dismiss(n.id)}
                          className="flex-shrink-0 p-1 rounded hover:bg-white/50 transition-colors"
                        >
                          <X size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setNotifications([])}
                  className="w-full text-xs text-gray-600 hover:text-gray-800 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
