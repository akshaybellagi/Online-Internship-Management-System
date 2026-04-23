'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, BookOpen, Calendar, Umbrella,
  BarChart3, ClipboardList, Clock, UserCircle, LogOut,
  GraduationCap, ChevronLeft, ChevronRight, School
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Students', href: '/admin/students', icon: <GraduationCap size={18} /> },
  { label: 'Teachers', href: '/admin/teachers', icon: <Users size={18} /> },
  { label: 'Classes', href: '/admin/classes', icon: <School size={18} /> },
  { label: 'Subjects', href: '/admin/subjects', icon: <BookOpen size={18} /> },
  { label: 'Timetable', href: '/admin/timetable', icon: <Calendar size={18} /> },
  { label: 'Holidays', href: '/admin/holidays', icon: <Umbrella size={18} /> },
  { label: 'Reports', href: '/admin/reports', icon: <BarChart3 size={18} /> },
];

const teacherNav: NavItem[] = [
  { label: 'Dashboard', href: '/teacher', icon: <LayoutDashboard size={18} /> },
  { label: 'My Subjects', href: '/teacher/subjects', icon: <BookOpen size={18} /> },
  { label: 'My Classes', href: '/teacher/classes', icon: <School size={18} /> },
  { label: 'Mark Attendance', href: '/teacher/mark-attendance', icon: <ClipboardList size={18} /> },
  { label: 'Attendance History', href: '/teacher/history', icon: <Clock size={18} /> },
  { label: 'Timetable', href: '/teacher/timetable', icon: <Calendar size={18} /> },
  { label: 'Holidays', href: '/teacher/holidays', icon: <Umbrella size={18} /> },
];

const studentNav: NavItem[] = [
  { label: 'Dashboard', href: '/student', icon: <LayoutDashboard size={18} /> },
  { label: 'My Attendance', href: '/student/attendance', icon: <ClipboardList size={18} /> },
  { label: 'My Timetable', href: '/student/timetable', icon: <Calendar size={18} /> },
  { label: 'Holidays', href: '/student/holidays', icon: <Umbrella size={18} /> },
  { label: 'Profile', href: '/student/profile', icon: <UserCircle size={18} /> },
];

interface SidebarProps {
  role: 'admin' | 'teacher' | 'student';
  userName: string;
}

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = role === 'admin' ? adminNav : role === 'teacher' ? teacherNav : studentNav;
  const roleColors = {
    admin: 'from-violet-600 to-purple-700',
    teacher: 'from-blue-600 to-indigo-700',
    student: 'from-emerald-600 to-teal-700',
  };

  return (
    <aside className={`relative flex flex-col h-screen bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className={`flex items-center gap-3 p-4 bg-gradient-to-r ${roleColors[role]}`}>
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <School size={18} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">SmartAttend</p>
            <p className="text-xs text-white/70 capitalize">{role} Panel</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center border border-gray-600 hover:bg-gray-600 z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-sm font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-gray-400 capitalize">{role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all text-sm
                ${isActive
                  ? `bg-gradient-to-r ${roleColors[role]} text-white shadow-lg`
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-gray-700">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-sm mb-1"
          title={collapsed ? 'Profile' : undefined}
        >
          <UserCircle size={18} className="flex-shrink-0" />
          {!collapsed && <span>Profile</span>}
        </Link>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-red-900/40 hover:text-red-400 transition-all text-sm"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
