import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const subjects = await query('SELECT * FROM subjects ORDER BY created_at DESC');
  return NextResponse.json(subjects);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name, code, description, credits } = await req.json();
  await query('INSERT INTO subjects (name, code, description, credits) VALUES (?, ?, ?, ?)', [name, code, description, credits || 3]);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, name, code, description, credits, is_active } = await req.json();
  await query('UPDATE subjects SET name=?, code=?, description=?, credits=?, is_active=? WHERE id=?', [name, code, description, credits, is_active, id]);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await query('DELETE FROM subjects WHERE id=?', [id]);
  return NextResponse.json({ success: true });
}
