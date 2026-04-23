import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import StatsCard from '@/components/StatsCard';
import PageHeader from '@/components/PageHeader';
import NotificationBanner from '@/components/NotificationBanner';
import { ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react';

export default async function StudentDashboard() {
  const session = await getSession();

  const students = await query<[{ id: number; roll_number: string; class_name: string }]>(`
    SELECT s.id, s.roll_number, c.name as class_name
    FROM students s LEFT JOIN classes c ON s.class_id = c.id
    WHERE s.user_id=?
  `, [session!.id]);
  const student = students[0];

  let total = 0, present = 0, absent = 0, late = 0;
  let subjectSummary: { subject_name: string; present: number; total: number; percentage: number }[] = [];

  if (student) {
    const [stats] = await query<[{ total: number; present: number; absent: number; late: number }]>(`
      SELECT COUNT(*) as total, SUM(status='present') as present, SUM(status='absent') as absent, SUM(status='late') as late
      FROM attendance WHERE student_id=?
    `, [student.id]);
    total = stats.total; present = stats.present || 0; absent = stats.absent || 0; late = stats.late || 0;

    subjectSummary = await query(`
      SELECT sub.name as subject_name, SUM(a.status='present') as present, COUNT(*) as total,
             ROUND(SUM(a.status='present')/COUNT(*)*100,1) as percentage
      FROM attendance a JOIN subjects sub ON a.subject_id=sub.id
      WHERE a.student_id=? GROUP BY a.subject_id ORDER BY percentage ASC
    `, [student.id]);
  }

  const overallPct = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div>
      <PageHeader title={`Hi, ${session?.name} 👋`} subtitle={student ? `Roll: ${student.roll_number} · Class: ${student.class_name || 'N/A'}` : 'Welcome to SmartAttend'} />

      {/* Live notification banners */}
      <NotificationBanner />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Classes" value={total} icon={<ClipboardList size={22} />} color="bg-blue-500" />
        <StatsCard title="Present" value={present} icon={<CheckCircle size={22} />} color="bg-emerald-500" />
        <StatsCard title="Absent" value={absent} icon={<XCircle size={22} />} color="bg-red-500" />
        <StatsCard title="Late" value={late} icon={<Clock size={22} />} color="bg-amber-500" />
      </div>

      {/* Overall attendance ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
              <circle cx="60" cy="60" r="50" fill="none"
                stroke={overallPct >= 75 ? '#10b981' : overallPct >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - overallPct / 100)}`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">{overallPct}%</span>
              <span className="text-xs text-gray-500">Overall</span>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-700">Overall Attendance</p>
          <p className={`text-xs mt-1 font-medium ${overallPct >= 75 ? 'text-emerald-600' : overallPct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
            {overallPct >= 75 ? 'Good standing' : overallPct >= 50 ? 'Needs improvement' : 'Critical — below 50%'}
          </p>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Subject-wise Attendance</h2>
          {subjectSummary.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No attendance data yet</p>
          ) : (
            <div className="space-y-3">
              {subjectSummary.map((s, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{s.subject_name}</span>
                    <span className={`text-xs font-semibold ${s.percentage >= 75 ? 'text-emerald-600' : s.percentage >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{s.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${s.percentage >= 75 ? 'bg-emerald-500' : s.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${s.percentage}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{s.present}/{s.total} classes</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
