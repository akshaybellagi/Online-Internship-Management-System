import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { signToken } from '@/lib/auth';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    const users = await query<User[]>('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);
    if (!users.length) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = await signToken({ id: user.id, email: user.email, role: user.role, name: user.name });

    const res = NextResponse.json({ role: user.role, name: user.name });
    res.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7, path: '/' });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
