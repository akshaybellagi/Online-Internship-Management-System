import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const students = await query(`
    SELECT u.id, u.name, u.email, u.phone, u.is_active, u.created_at,
           s.roll_number, s.section, s.admission_date, s.id as student_id,
           c.name as class_name
    FROM users u
    JOIN students s ON u.id = s.user_id
    LEFT JOIN classes c ON s.class_id = c.id
    WHERE u.role = 'student'
    ORDER BY u.created_at DESC
  `);
  return NextResponse.json(students);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, email, password, phone, roll_number, class_id, admission_date } = await req.json();
    const hashed = await bcrypt.hash(password || 'student123', 10);

    const result = await query<{ insertId: number }>(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, "student", ?)',
      [name, email, hashed, phone]
    );
    await query(
      'INSERT INTO students (user_id, roll_number, class_id, admission_date) VALUES (?, ?, ?, ?)',
      [result.insertId, roll_number, class_id || null, admission_date || null]
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

  const { id, name, email, phone, roll_number, class_id, is_active } = await req.json();
  await query('UPDATE users SET name=?, email=?, phone=?, is_active=? WHERE id=?', [name, email, phone, is_active, id]);
  await query('UPDATE students SET roll_number=?, class_id=? WHERE user_id=?', [roll_number, class_id || null, id]);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  await query('DELETE FROM users WHERE id=?', [id]);
  return NextResponse.json({ success: true });
}
