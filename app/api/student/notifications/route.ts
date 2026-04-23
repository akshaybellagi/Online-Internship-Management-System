import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'student') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const students = await query<{ id: number }[]>('SELECT id FROM students WHERE user_id=?', [session.id]);
  if (!students.length) return NextResponse.json([]);
  const studentId = students[0].id;

  const notifications: {
    id: string;
    type: 'attendance' | 'holiday' | 'warning' | 'info';
    title: string;
    message: string;
    time: string;
    read: boolean;
  }[] = [];

  // 1. Recent attendance marked (last 7 days)
  const recentAtt = await query<{ subject_name: string; status: string; date: string }[]>(`
    SELECT sub.name as subject_name, a.status, a.date
    FROM attendance a
    JOIN subjects sub ON a.subject_id = sub.id
    WHERE a.student_id = ? AND a.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    ORDER BY a.date DESC
    LIMIT 5
  `, [studentId]);

  recentAtt.forEach((a, i) => {
    const statusLabel = a.status === 'present' ? '✅ Present' : a.status === 'absent' ? '❌ Absent' : '⏰ Late';
    notifications.push({
      id: `att_${i}`,
      type: a.status === 'present' ? 'attendance' : a.status === 'absent' ? 'warning' : 'info',
      title: `Attendance Marked — ${a.subject_name}`,
      message: `You were marked ${statusLabel} on ${new Date(a.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}`,
      time: a.date,
      read: false,
    });
  });

  // 2. Low attendance warning (below 75%)
  const lowAtt = await query<{ subject_name: string; percentage: number; present: number; total: number }[]>(`
    SELECT sub.name as subject_name,
           ROUND(SUM(a.status='present') / COUNT(*) * 100, 1) as percentage,
           SUM(a.status='present') as present,
           COUNT(*) as total
    FROM attendance a
    JOIN subjects sub ON a.subject_id = sub.id
    WHERE a.student_id = ?
    GROUP BY a.subject_id
    HAVING percentage < 75 AND total >= 3
  `, [studentId]);

  lowAtt.forEach((l, i) => {
    notifications.push({
      id: `low_${i}`,
      type: 'warning',
      title: `Low Attendance — ${l.subject_name}`,
      message: `Your attendance is ${l.percentage}% (${l.present}/${l.total} classes). Minimum required is 75%.`,
      time: new Date().toISOString(),
      read: false,
    });
  });

  // 3. Upcoming holidays (next 30 days)
  const holidays = await query<{ title: string; date: string; type: string }[]>(`
    SELECT title, date, type
    FROM holidays
    WHERE date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    ORDER BY date ASC
    LIMIT 3
  `);

  holidays.forEach((h, i) => {
    const daysLeft = Math.ceil((new Date(h.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    notifications.push({
      id: `hol_${i}`,
      type: 'holiday',
      title: `Upcoming Holiday — ${h.title}`,
      message: `${new Date(h.date).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })} · ${daysLeft === 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow!' : `In ${daysLeft} days`}`,
      time: h.date,
      read: false,
    });
  });

  // 4. Today's classes from timetable
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  const student = await query<{ class_id: number }[]>('SELECT class_id FROM students WHERE id=?', [studentId]);

  if (student[0]?.class_id) {
    const todayClasses = await query<{ subject_name: string; start_time: string; teacher_name: string }[]>(`
      SELECT sub.name as subject_name, t.start_time, u.name as teacher_name
      FROM timetable t
      JOIN subjects sub ON t.subject_id = sub.id
      JOIN teachers te ON t.teacher_id = te.id
      JOIN users u ON te.user_id = u.id
      WHERE t.class_id = ? AND t.day_of_week = ?
      ORDER BY t.start_time
    `, [student[0].class_id, today]);

    if (todayClasses.length > 0) {
      notifications.push({
        id: 'today_classes',
        type: 'info',
        title: `${todayClasses.length} Class${todayClasses.length > 1 ? 'es' : ''} Today`,
        message: todayClasses.map(c => `${c.subject_name} at ${c.start_time}`).join(' · '),
        time: new Date().toISOString(),
        read: false,
      });
    }
  }

  // Sort: warnings first, then by time desc
  notifications.sort((a, b) => {
    if (a.type === 'warning' && b.type !== 'warning') return -1;
    if (b.type === 'warning' && a.type !== 'warning') return 1;
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });

  return NextResponse.json(notifications);
}
