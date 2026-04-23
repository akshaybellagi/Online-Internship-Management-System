import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'teacher') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [teacher] = await query<[{ id: number }]>('SELECT id FROM teachers WHERE user_id=?', [session.id]);
  if (!teacher) return NextResponse.json([]);

  const rows = await query(`
    SELECT t.*, c.name as class_name, c.section, s.name as subject_name, s.code as subject_code
    FROM timetable t
    JOIN classes c ON t.class_id = c.id
    JOIN subjects s ON t.subject_id = s.id
    WHERE t.teacher_id=?
    ORDER BY FIELD(t.day_of_week,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), t.start_time
  `, [teacher.id]);
  return NextResponse.json(rows);
}
