'use client';
import { usePathname } from 'next/navigation';
import NotificationPanel from './NotificationPanel';

interface TopBarProps {
  role: 'admin' | 'teacher' | 'student';
  userName: string;
}

const pageTitles: Record<string, string> = {
  '/student': 'Dashboard',
  '/student/attendance': 'My Attendance',
  '/student/timetable': 'My Timetable',
  '/student/holidays': 'Holiday List',
  '/student/profile': 'My Profile',
  '/teacher': 'Dashboard',
  '/teacher/subjects': 'My Subjects',
  '/teacher/classes': 'My Classes',
  '/teacher/mark-attendance': 'Mark Attendance',
  '/teacher/history': 'Attendance History',
  '/teacher/timetable': 'My Timetable',
  '/teacher/holidays': 'Holiday List',
};

export default function TopBar({ role, userName }: TopBarProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || '';

  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-3 flex items-center justify-between">
      <div>
        {title && <p className="text-sm font-semibold text-gray-700">{title}</p>}
      </div>
      <div className="flex items-center gap-3">
        {/* Show notifications for students and teachers */}
        {(role === 'student' || role === 'teacher') && <NotificationPanel />}

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br ${
            role === 'teacher' ? 'from-blue-400 to-indigo-600' : 'from-emerald-400 to-teal-600'
          }`}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">{userName}</span>
        </div>
      </div>
    </div>
  );
}
