import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('class_id');
  const subjectId = searchParams.get('subject_id');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  let sql = `
    SELECT u.name as student_name, s2.roll_number,
           sub.name as subject_name,
           COUNT(*) as total,
           SUM(a.status = 'present') as present,
           SUM(a.status = 'absent') as absent,
           SUM(a.status = 'late') as late,
           ROUND(SUM(a.status = 'present') / COUNT(*) * 100, 1) as percentage
    FROM attendance a
    JOIN students s2 ON a.student_id = s2.id
    JOIN users u ON s2.user_id = u.id
    JOIN subjects sub ON a.subject_id = sub.id
    WHERE 1=1
  `;
  const params: unknown[] = [];

  if (classId) { sql += ' AND a.class_id = ?'; params.push(classId); }
  if (subjectId) { sql += ' AND a.subject_id = ?'; params.push(subjectId); }
  if (from) { sql += ' AND a.date >= ?'; params.push(from); }
  if (to) { sql += ' AND a.date <= ?'; params.push(to); }

  sql += ' GROUP BY a.student_id, a.subject_id ORDER BY u.name';

  const rows = await query(sql, params);
  return NextResponse.json(rows);
}
