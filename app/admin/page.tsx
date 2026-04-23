import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import StatsCard from '@/components/StatsCard';
import PageHeader from '@/components/PageHeader';
import { GraduationCap, Users, BookOpen, Umbrella, TrendingUp, Calendar } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await getSession();

  const [students] = await query<[{ count: number }]>('SELECT COUNT(*) as count FROM users WHERE role="student" AND is_active=1');
  const [teachers] = await query<[{ count: number }]>('SELECT COUNT(*) as count FROM users WHERE role="teacher" AND is_active=1');
  const [subjects] = await query<[{ count: number }]>('SELECT COUNT(*) as count FROM subjects WHERE is_active=1');
  const [holidays] = await query<[{ count: number }]>('SELECT COUNT(*) as count FROM holidays WHERE YEAR(date)=YEAR(CURDATE())');
  const [todayAtt] = await query<[{ present: number; total: number }]>(
    'SELECT COALESCE(SUM(status="present"),0) as present, COUNT(*) as total FROM attendance WHERE date=CURDATE()'
  );

  const recentAttendance = await query<{ student_name: string; subject_name: string; status: string; date: string }[]>(`
    SELECT u.name as student_name, sub.name as subject_name, a.status, a.date
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    JOIN users u ON s.user_id = u.id
    JOIN subjects sub ON a.subject_id = sub.id
    ORDER BY a.marked_at DESC LIMIT 8
  `);

  const upcomingHolidays = await query<{ title: string; date: string; type: string }[]>(
    'SELECT title, date, type FROM holidays WHERE date >= CURDATE() ORDER BY date LIMIT 5'
  );

  const attendanceRate = todayAtt.total > 0 ? Math.round((todayAtt.present / todayAtt.total) * 100) : 0;

  const statusColors: Record<string, string> = {
    present: 'bg-emerald-100 text-emerald-700',
    absent: 'bg-red-100 text-red-700',
    late: 'bg-amber-100 text-amber-700',
    excused: 'bg-blue-100 text-blue-700',
  };

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${session?.name} 👋`}
        subtitle="Here's what's happening in your school today"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatsCard title="Total Students" value={students.count} icon={<GraduationCap size={22} />} color="bg-violet-500" />
        <StatsCard title="Total Teachers" value={teachers.count} icon={<Users size={22} />} color="bg-blue-500" />
        <StatsCard title="Subjects" value={subjects.count} icon={<BookOpen size={22} />} color="bg-indigo-500" />
        <StatsCard title="Holidays (Year)" value={holidays.count} icon={<Umbrella size={22} />} color="bg-amber-500" />
        <StatsCard title="Today's Attendance" value={`${attendanceRate}%`} icon={<TrendingUp size={22} />} color="bg-emerald-500" subtitle={`${todayAtt.present}/${todayAtt.total} present`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Attendance */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Attendance</h2>
          {recentAttendance.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No attendance records yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Student</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Subject</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.map((r, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium text-gray-800">{r.student_name}</td>
                      <td className="py-2 px-3 text-gray-600">{r.subject_name}</td>
                      <td className="py-2 px-3 text-gray-500">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[r.status] || 'bg-gray-100 text-gray-600'}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upcoming Holidays */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-amber-500" /> Upcoming Holidays
          </h2>
          {upcomingHolidays.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No upcoming holidays</p>
          ) : (
            <div className="space-y-3">
              {upcomingHolidays.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="text-center min-w-[40px]">
                    <p className="text-xs text-amber-600 font-medium">{new Date(h.date).toLocaleDateString('en', { month: 'short' })}</p>
                    <p className="text-lg font-bold text-amber-700">{new Date(h.date).getDate()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{h.title}</p>
                    <p className="text-xs text-gray-500 capitalize">{h.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
