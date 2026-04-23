import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const classes = await query(`
    SELECT c.*, 
           COUNT(DISTINCT s.id) as student_count
    FROM classes c
    LEFT JOIN students s ON s.class_id = c.id
    GROUP BY c.id
    ORDER BY c.name, c.section
  `);
  return NextResponse.json(classes);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, section, academic_year } = await req.json();
  if (!name) return NextResponse.json({ error: 'Class name is required' }, { status: 400 });

  try {
    await query(
      'INSERT INTO classes (name, section, academic_year) VALUES (?, ?, ?)',
      [name, section || '', academic_year || '']
    );
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, name, section, academic_year } = await req.json();
  if (!id || !name) return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });

  await query(
    'UPDATE classes SET name=?, section=?, academic_year=? WHERE id=?',
    [name, section || '', academic_year || '', id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();

  // Check if class has students
  const students = await query<{ count: number }[]>(
    'SELECT COUNT(*) as count FROM students WHERE class_id=?', [id]
  );
  if (students[0].count > 0) {
    return NextResponse.json({ error: `Cannot delete — ${students[0].count} student(s) are assigned to this class` }, { status: 400 });
  }

  await query('DELETE FROM classes WHERE id=?', [id]);
  return NextResponse.json({ success: true });
}
