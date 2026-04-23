import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [user] = await query<[Record<string, unknown>]>(
    'SELECT id, name, email, phone, role, created_at FROM users WHERE id=?', [session.id]
  );
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, phone, currentPassword, newPassword } = await req.json();

  if (newPassword) {
    const [user] = await query<[{ password: string }]>('SELECT password FROM users WHERE id=?', [session.id]);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    const hashed = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET name=?, phone=?, password=? WHERE id=?', [name, phone, hashed, session.id]);
  } else {
    await query('UPDATE users SET name=?, phone=? WHERE id=?', [name, phone, session.id]);
  }
  return NextResponse.json({ success: true });
}
