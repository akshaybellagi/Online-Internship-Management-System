import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password, student_id, institution, field_of_study } = await req.json();

    // Validation
    if (!name || !email || !password || !student_id) {
      return NextResponse.json({ error: 'Name, email, password, and student ID are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await query<any[]>('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Check if student_id already exists
    const existingStudent = await query<any[]>('SELECT id FROM students WHERE student_id = ?', [student_id]);
    if (existingStudent.length > 0) {
      return NextResponse.json({ error: 'Student ID already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userResult = await query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'student']
    );

    const userId = (userResult as any).insertId;

    // Create student record with optional fields
    await query(
      'INSERT INTO students (user_id, student_id, institution, field_of_study) VALUES (?, ?, ?, ?)',
      [userId, student_id, institution || null, field_of_study || null]
    );

    return NextResponse.json({ 
      message: 'Registration successful',
      user: { id: userId, name, email, role: 'student' }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
