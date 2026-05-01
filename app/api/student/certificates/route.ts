import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

interface Certificate {
  id: number;
  certificate_number: string;
  internship_id: number;
  internship_title: string;
  company_name: string;
  issue_date: string;
  completion_date: string;
  grade: string;
  performance_score: number;
  verification_code: string;
  certificate_url: string | null;
  remarks: string | null;
}

// GET - Fetch student's certificates
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get student ID from users table
    const [student] = await query<[{ id: number }]>(
      'SELECT id FROM students WHERE user_id = ?',
      [session.id]
    );

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const certificates = await query<Certificate[]>(
      `SELECT 
        c.*,
        i.title as internship_title,
        i.company_name
       FROM certificates c
       JOIN internships i ON c.internship_id = i.id
       WHERE c.student_id = ?
       ORDER BY c.issue_date DESC`,
      [student.id]
    );

    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
