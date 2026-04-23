import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'student') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [student] = await query<[{ class_id: number }]>('SELECT class_id FROM students WHERE user_id=?', [session.id]);
  if (!student?.class_id) return NextResponse.json([]);

  const rows = await query(`
    SELECT t.*, s.name as subject_name, s.code as subject_code, u.name as teacher_name
    FROM timetable t
    JOIN subjects s ON t.subject_id = s.id
    JOIN teachers te ON t.teacher_id = te.id
    JOIN users u ON te.user_id = u.id
    WHERE t.class_id=?
    ORDER BY FIELD(t.day_of_week,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), t.start_time
  `, [student.class_id]);
  return NextResponse.json(rows);
}
