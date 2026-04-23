import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rows = await query(`
    SELECT t.*, c.name as class_name, c.section, s.name as subject_name, s.code as subject_code,
           u.name as teacher_name
    FROM timetable t
    JOIN classes c ON t.class_id = c.id
    JOIN subjects s ON t.subject_id = s.id
    JOIN teachers te ON t.teacher_id = te.id
    JOIN users u ON te.user_id = u.id
    ORDER BY FIELD(t.day_of_week,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), t.start_time
  `);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room } = await req.json();
  await query(
    'INSERT INTO timetable (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room) VALUES (?,?,?,?,?,?,?)',
    [class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room]
  );
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room } = await req.json();
  await query(
    'UPDATE timetable SET class_id=?, subject_id=?, teacher_id=?, day_of_week=?, start_time=?, end_time=?, room=? WHERE id=?',
    [class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room, id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await query('DELETE FROM timetable WHERE id=?', [id]);
  return NextResponse.json({ success: true });
}
