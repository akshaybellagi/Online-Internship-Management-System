import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'student') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [student] = await query<[{ id: number }]>('SELECT id FROM students WHERE user_id=?', [session.id]);
  if (!student) return NextResponse.json([]);

  const records = await query(`
    SELECT a.date, a.status, a.remarks, sub.name as subject_name, sub.code as subject_code
    FROM attendance a
    JOIN subjects sub ON a.subject_id = sub.id
    WHERE a.student_id=?
    ORDER BY a.date DESC
  `, [student.id]);

  const summary = await query(`
    SELECT sub.name as subject_name, sub.code,
           COUNT(*) as total,
           SUM(a.status='present') as present,
           SUM(a.status='absent') as absent,
           SUM(a.status='late') as late,
           ROUND(SUM(a.status='present')/COUNT(*)*100,1) as percentage
    FROM attendance a
    JOIN subjects sub ON a.subject_id = sub.id
    WHERE a.student_id=?
    GROUP BY a.subject_id
  `, [student.id]);

  return NextResponse.json({ records, summary });
}
