'use client';
import { usePathname } from 'next/navigation';

interface TopBarProps {
  role: 'admin' | 'student' | 'teacher';
  userName: string;
}

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/internships': 'Manage Internships',
  '/admin/applications': 'Review Applications',
  '/admin/students': 'Manage Students',
  '/admin/certificates': 'Certificates',
  '/admin/exams': 'Exams',
  '/admin/attendance': 'Attendance',
  '/student': 'Dashboard',
  '/student/internships': 'Browse Internships',
  '/student/applications': 'My Applications',
  '/student/materials': 'Learning Materials',
  '/student/exams': 'Exams',
  '/student/certificates': 'My Certificates',
  '/student/attendance': 'Learning Performance',
  '/student/profile': 'My Profile',
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
        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br ${
            role === 'admin' ? 'from-violet-400 to-purple-600' : 'from-emerald-400 to-teal-600'
          }`}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">{userName}</span>
        </div>
      </div>
    </div>
  );
}
