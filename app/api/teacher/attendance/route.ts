import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'teacher') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('class_id');
  const subjectId = searchParams.get('subject_id');
  const date = searchParams.get('date');

  const [teacher] = await query<[{ id: number }]>('SELECT id FROM teachers WHERE user_id=?', [session.id]);
  if (!teacher) return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });

  if (classId && subjectId && date) {
    // Get students for this class with their attendance for the date
    const students = await query(`
      SELECT u.name, s.id as student_id, s.roll_number,
             a.status, a.remarks
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN attendance a ON a.student_id = s.id AND a.subject_id=? AND a.date=?
      WHERE s.class_id=? AND u.is_active=1
      ORDER BY s.roll_number
    `, [subjectId, date, classId]);
    return NextResponse.json(students);
  }

  // History
  const rows = await query(`
    SELECT a.*, u.name as student_name, s2.roll_number, sub.name as subject_name, c.name as class_name
    FROM attendance a
    JOIN students s2 ON a.student_id = s2.id
    JOIN users u ON s2.user_id = u.id
    JOIN subjects sub ON a.subject_id = sub.id
    JOIN classes c ON a.class_id = c.id
    WHERE a.teacher_id=?
    ORDER BY a.date DESC, a.marked_at DESC
    LIMIT 200
  `, [teacher.id]);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'teacher') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { records, subject_id, class_id, date } = await req.json();
  const [teacher] = await query<[{ id: number }]>('SELECT id FROM teachers WHERE user_id=?', [session.id]);
  if (!teacher) return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });

  for (const r of records) {
    await query(`
      INSERT INTO attendance (student_id, subject_id, teacher_id, class_id, date, status, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE status=VALUES(status), remarks=VALUES(remarks)
    `, [r.student_id, subject_id, teacher.id, class_id, date, r.status, r.remarks || null]);
  }
  return NextResponse.json({ success: true });
}
