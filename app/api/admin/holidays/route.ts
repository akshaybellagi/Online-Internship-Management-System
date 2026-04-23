import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const holidays = await query('SELECT * FROM holidays ORDER BY date ASC');
  return NextResponse.json(holidays);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, date, description, type } = await req.json();
  await query('INSERT INTO holidays (title, date, description, type) VALUES (?, ?, ?, ?)', [title, date, description, type || 'school']);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, title, date, description, type } = await req.json();
  await query('UPDATE holidays SET title=?, date=?, description=?, type=? WHERE id=?', [title, date, description, type, id]);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await query('DELETE FROM holidays WHERE id=?', [id]);
  return NextResponse.json({ success: true });
}
