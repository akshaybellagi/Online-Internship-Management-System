import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');
  if (!userId) return NextResponse.json([]);

  const rows = await query(`
    SELECT ts.subject_id, ts.class_id
    FROM teacher_subjects ts
    JOIN teachers t ON ts.teacher_id = t.id
    WHERE t.user_id = ?
  `, [userId]);

  return NextResponse.json(rows);
}
