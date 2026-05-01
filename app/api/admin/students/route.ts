import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

interface Student {
  id: number;
  user_id: number;
  student_id: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  education_level: string;
  institution: string;
  field_of_study: string;
  is_active: boolean;
  application_count: number;
  certificate_count: number;
}

// GET - Fetch all students
export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const students = await query<Student[]>(
      `SELECT 
        s.id,
        s.user_id,
        s.student_id,
        u.name,
        u.email,
        u.phone,
        u.is_active,
        s.date_of_birth,
        s.education_level,
        s.institution,
        s.field_of_study,
        COUNT(DISTINCT a.id) as application_count,
        COUNT(DISTINCT c.id) as certificate_count
       FROM students s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN applications a ON s.id = a.student_id
       LEFT JOIN certificates c ON s.id = c.student_id
       GROUP BY s.id
       ORDER BY u.created_at DESC`
    );

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
