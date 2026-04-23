import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'teacher') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const teachers = await query<{ id: number }[]>('SELECT id FROM teachers WHERE user_id=?', [session.id]);
  if (!teachers.length) return NextResponse.json([]);
  const teacherId = teachers[0].id;

  const notifications: {
    id: string;
    type: 'attendance' | 'holiday' | 'warning' | 'info';
    title: string;
    message: string;
    time: string;
  }[] = [];

  // 1. Today's classes
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];

  const todayClasses = await query<{ subject_name: string; start_time: string; end_time: string; class_name: string; section: string }[]>(`
    SELECT sub.name as subject_name, t.start_time, t.end_time, c.name as class_name, c.section
    FROM timetable t
    JOIN subjects sub ON t.subject_id = sub.id
    JOIN classes c ON t.class_id = c.id
    WHERE t.teacher_id = ? AND t.day_of_week = ?
    ORDER BY t.start_time
  `, [teacherId, today]);

  if (todayClasses.length > 0) {
    notifications.push({
      id: 'today_classes',
      type: 'info',
      title: `${todayClasses.length} Class${todayClasses.length > 1 ? 'es' : ''} Scheduled Today`,
      message: todayClasses.map(c => `${c.subject_name} (${c.class_name}${c.section ? ' ' + c.section : ''}) at ${c.start_time}`).join(' · '),
      time: new Date().toISOString(),
    });
  }

  // 2. Classes not marked today
  const unmarkedToday = await query<{ subject_name: string; class_name: string; section: string }[]>(`
    SELECT sub.name as subject_name, c.name as class_name, c.section
    FROM timetable t
    JOIN subjects sub ON t.subject_id = sub.id
    JOIN classes c ON t.class_id = c.id
    WHERE t.teacher_id = ? AND t.day_of_week = ?
    AND NOT EXISTS (
      SELECT 1 FROM attendance a
      WHERE a.teacher_id = ? AND a.subject_id = t.subject_id
      AND a.class_id = t.class_id AND a.date = CURDATE()
    )
    ORDER BY t.start_time
  `, [teacherId, today, teacherId]);

  if (unmarkedToday.length > 0) {
    notifications.push({
      id: 'unmarked_today',
      type: 'warning',
      title: `${unmarkedToday.length} Attendance${unmarkedToday.length > 1 ? 's' : ''} Not Marked Today`,
      message: unmarkedToday.map(c => `${c.subject_name} — ${c.class_name}${c.section ? ' ' + c.section : ''}`).join(', '),
      time: new Date().toISOString(),
    });
  }

  // 3. Recent attendance marked (last 3 days)
  const recentMarked = await query<{ subject_name: string; class_name: string; date: string; present: number; total: number }[]>(`
    SELECT sub.name as subject_name, c.name as class_name, a.date,
           SUM(a.status = 'present') as present, COUNT(*) as total
    FROM attendance a
    JOIN subjects sub ON a.subject_id = sub.id
    JOIN classes c ON a.class_id = c.id
    WHERE a.teacher_id = ? AND a.date >= DATE_SUB(CURDATE(), INTERVAL 3 DAY)
    GROUP BY a.subject_id, a.class_id, a.date
    ORDER BY a.date DESC
    LIMIT 4
  `, [teacherId]);

  recentMarked.forEach((r, i) => {
    const pct = Math.round((r.present / r.total) * 100);
    notifications.push({
      id: `marked_${i}`,
      type: 'attendance',
      title: `Attendance Saved — ${r.subject_name}`,
      message: `${r.class_name} · ${r.present}/${r.total} present (${pct}%) on ${new Date(r.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}`,
      time: r.date,
    });
  });

  // 4. Upcoming holidays
  const holidays = await query<{ title: string; date: string; type: string }[]>(`
    SELECT title, date, type FROM holidays
    WHERE date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    ORDER BY date ASC LIMIT 3
  `);

  holidays.forEach((h, i) => {
    const daysLeft = Math.ceil((new Date(h.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    notifications.push({
      id: `hol_${i}`,
      type: 'holiday',
      title: `Upcoming Holiday — ${h.title}`,
      message: `${new Date(h.date).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })} · ${daysLeft === 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow!' : `In ${daysLeft} days`}`,
      time: h.date,
    });
  });

  // 5. Students with low attendance in teacher's classes
  const lowStudents = await query<{ student_name: string; subject_name: string; percentage: number }[]>(`
    SELECT u.name as student_name, sub.name as subject_name,
           ROUND(SUM(a.status='present') / COUNT(*) * 100, 1) as percentage
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    JOIN users u ON s.user_id = u.id
    JOIN subjects sub ON a.subject_id = sub.id
    WHERE a.teacher_id = ?
    GROUP BY a.student_id, a.subject_id
    HAVING percentage < 75 AND COUNT(*) >= 3
    ORDER BY percentage ASC
    LIMIT 3
  `, [teacherId]);

  if (lowStudents.length > 0) {
    notifications.push({
      id: 'low_students',
      type: 'warning',
      title: `${lowStudents.length} Student${lowStudents.length > 1 ? 's' : ''} Below 75% Attendance`,
      message: lowStudents.map(s => `${s.student_name} in ${s.subject_name} (${s.percentage}%)`).join(' · '),
      time: new Date().toISOString(),
    });
  }

  // Sort: warnings first
  notifications.sort((a, b) => {
    if (a.type === 'warning' && b.type !== 'warning') return -1;
    if (b.type === 'warning' && a.type !== 'warning') return 1;
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });

  return NextResponse.json(notifications);
}
