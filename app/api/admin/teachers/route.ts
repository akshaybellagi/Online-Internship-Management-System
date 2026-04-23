import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const teachers = await query(`
    SELECT u.id, u.name, u.email, u.phone, u.is_active, u.created_at,
           t.employee_id, t.department, t.joining_date, t.id as teacher_id
    FROM users u
    JOIN teachers t ON u.id = t.user_id
    WHERE u.role = 'teacher'
    ORDER BY u.created_at DESC
  `);
  return NextResponse.json(teachers);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, email, password, phone, employee_id, department, joining_date, assignments } = await req.json();
    const hashed = await bcrypt.hash(password || 'teacher123', 10);

    const result = await query<{ insertId: number }>(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, "teacher", ?)',
      [name, email, hashed, phone]
    );
    const teacherResult = await query<{ insertId: number }>(
      'INSERT INTO teachers (user_id, employee_id, department, joining_date) VALUES (?, ?, ?, ?)',
      [result.insertId, employee_id, department, joining_date || null]
    );

    // Save subject+class assignments
    if (assignments && assignments.length > 0) {
      for (const a of assignments) {
        await query(
          'INSERT IGNORE INTO teacher_subjects (teacher_id, subject_id, class_id) VALUES (?, ?, ?)',
          [teacherResult.insertId, a.subject_id, a.class_id]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, name, email, phone, employee_id, department, is_active, assignments } = await req.json();
  await query('UPDATE users SET name=?, email=?, phone=?, is_active=? WHERE id=?', [name, email, phone, is_active, id]);
  await query('UPDATE teachers SET employee_id=?, department=? WHERE user_id=?', [employee_id, department, id]);

  // Update assignments — get teacher_id first
  const teachers = await query<{ id: number }[]>('SELECT id FROM teachers WHERE user_id=?', [id]);
  if (teachers.length > 0 && assignments) {
    const tid = teachers[0].id;
    await query('DELETE FROM teacher_subjects WHERE teacher_id=?', [tid]);
    for (const a of assignments) {
      await query(
        'INSERT IGNORE INTO teacher_subjects (teacher_id, subject_id, class_id) VALUES (?, ?, ?)',
        [tid, a.subject_id, a.class_id]
      );
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  await query('DELETE FROM users WHERE id=?', [id]);
  return NextResponse.json({ success: true });
}
