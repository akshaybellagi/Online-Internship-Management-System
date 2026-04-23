'use client';
import { useEffect, useState } from 'react';
import { AlertTriangle, Umbrella, CheckCircle, Info, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'attendance' | 'holiday' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
}

export default function NotificationBanner() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isTeacher = window.location.pathname.startsWith('/teacher');
    const endpoint = isTeacher ? '/api/teacher/notifications' : '/api/student/notifications';
    fetch(endpoint)
      .then(r => r.json())
      .then(data => { setNotifications(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const visible = notifications.filter(n => !dismissed.includes(n.id));
  if (loading || visible.length === 0) return null;

  const configs = {
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      icon: <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />,
      badge: 'bg-amber-100 text-amber-700',
      link: '/student/attendance',
      linkText: 'View Attendance',
    },
    attendance: {
      bg: 'bg-emerald-50 border-emerald-200',
      icon: <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />,
      badge: 'bg-emerald-100 text-emerald-700',
      link: '/student/attendance',
      linkText: 'View Details',
    },
    holiday: {
      bg: 'bg-blue-50 border-blue-200',
      icon: <Umbrella size={18} className="text-blue-500 flex-shrink-0" />,
      badge: 'bg-blue-100 text-blue-700',
      link: '/student/holidays',
      linkText: 'View Holidays',
    },
    info: {
      bg: 'bg-gray-50 border-gray-200',
      icon: <Info size={18} className="text-gray-500 flex-shrink-0" />,
      badge: 'bg-gray-100 text-gray-600',
      link: '/student/timetable',
      linkText: 'View Timetable',
    },
  };

  return (
    <div className="space-y-2 mb-6">
      {visible.map(n => {
        const cfg = configs[n.type];
        return (
          <div key={n.id} className={`flex items-start gap-3 p-4 rounded-xl border ${cfg.bg} animate-in slide-in-from-top-2`}>
            {cfg.icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${cfg.badge}`}>{n.type}</span>
              </div>
              <p className="text-xs text-gray-600">{n.message}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href={cfg.link} className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-0.5 whitespace-nowrap">
                {cfg.linkText} <ChevronRight size={12} />
              </Link>
              <button onClick={() => setDismissed(p => [...p, n.id])} className="p-1 rounded hover:bg-black/5">
                <X size={14} className="text-gray-400" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
