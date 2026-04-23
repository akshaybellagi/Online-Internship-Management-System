import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'teacher') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [teacher] = await query<[{ id: number }]>('SELECT id FROM teachers WHERE user_id=?', [session.id]);
  if (!teacher) return NextResponse.json([]);

  const subjects = await query(`
    SELECT ts.id, sub.name, sub.code, sub.credits, sub.description,
           c.name as class_name, c.section, c.id as class_id, sub.id as subject_id
    FROM teacher_subjects ts
    JOIN subjects sub ON ts.subject_id = sub.id
    JOIN classes c ON ts.class_id = c.id
    WHERE ts.teacher_id=?
  `, [teacher.id]);
  return NextResponse.json(subjects);
}
