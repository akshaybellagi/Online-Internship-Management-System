import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import StatsCard from '@/components/StatsCard';
import PageHeader from '@/components/PageHeader';
import { BookOpen, Users, ClipboardList, Calendar } from 'lucide-react';

export default async function TeacherDashboard() {
  const session = await getSession();

  const teachers = await query<[{ id: number }]>('SELECT id FROM teachers WHERE user_id=?', [session!.id]);
  const teacher = teachers[0];

  let subjectCount = 0, classCount = 0, todayClasses = 0, markedToday = 0;

  if (teacher) {
    const [sc] = await query<[{ count: number }]>('SELECT COUNT(DISTINCT subject_id) as count FROM teacher_subjects WHERE teacher_id=?', [teacher.id]);
    const [cc] = await query<[{ count: number }]>('SELECT COUNT(DISTINCT class_id) as count FROM teacher_subjects WHERE teacher_id=?', [teacher.id]);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const [tc] = await query<[{ count: number }]>('SELECT COUNT(*) as count FROM timetable WHERE teacher_id=? AND day_of_week=?', [teacher.id, today]);
    const [mt] = await query<[{ count: number }]>('SELECT COUNT(DISTINCT CONCAT(subject_id,class_id)) as count FROM attendance WHERE teacher_id=? AND date=CURDATE()', [teacher.id]);
    subjectCount = sc.count; classCount = cc.count; todayClasses = tc.count; markedToday = mt.count;
  }

  const recentMarked = teacher ? await query<{ student_name: string; subject_name: string; status: string; date: string }[]>(`
    SELECT u.name as student_name, sub.name as subject_name, a.status, a.date
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    JOIN users u ON s.user_id = u.id
    JOIN subjects sub ON a.subject_id = sub.id
    WHERE a.teacher_id=?
    ORDER BY a.marked_at DESC LIMIT 10
  `, [teacher.id]) : [];

  const statusColors: Record<string, string> = {
    present: 'bg-emerald-100 text-emerald-700',
    absent: 'bg-red-100 text-red-700',
    late: 'bg-amber-100 text-amber-700',
  };

  return (
    <div>
      <PageHeader title={`Hello, ${session?.name} 👋`} subtitle="Manage your classes and attendance" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="My Subjects" value={subjectCount} icon={<BookOpen size={22} />} color="bg-blue-500" />
        <StatsCard title="My Classes" value={classCount} icon={<Users size={22} />} color="bg-indigo-500" />
        <StatsCard title="Today's Classes" value={todayClasses} icon={<Calendar size={22} />} color="bg-teal-500" />
        <StatsCard title="Marked Today" value={markedToday} icon={<ClipboardList size={22} />} color="bg-emerald-500" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Attendance Marked</h2>
        {recentMarked.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No attendance marked yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100">
                {['Student', 'Subject', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-gray-500 font-medium text-xs uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {recentMarked.map((r, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium text-gray-800">{r.student_name}</td>
                    <td className="py-2 px-3 text-gray-600">{r.subject_name}</td>
                    <td className="py-2 px-3 text-gray-500">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[r.status] || 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
