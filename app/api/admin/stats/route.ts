import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [students] = await query<[{ count: number }]>('SELECT COUNT(*) as count FROM users WHERE role="student" AND is_active=1');
  const [teachers] = await query<[{ count: number }]>('SELECT COUNT(*) as count FROM users WHERE role="teacher" AND is_active=1');
  const [subjects] = await query<[{ count: number }]>('SELECT COUNT(*) as count FROM subjects WHERE is_active=1');
  const [holidays] = await query<[{ count: number }]>('SELECT COUNT(*) as count FROM holidays WHERE YEAR(date)=YEAR(CURDATE())');
  const [todayAtt] = await query<[{ present: number; total: number }]>(
    'SELECT SUM(status="present") as present, COUNT(*) as total FROM attendance WHERE date=CURDATE()'
  );

  return NextResponse.json({
    students: students.count,
    teachers: teachers.count,
    subjects: subjects.count,
    holidays: holidays.count,
    todayPresent: todayAtt.present || 0,
    todayTotal: todayAtt.total || 0,
  });
}
