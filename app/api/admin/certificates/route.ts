import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

interface Certificate {
  id: number;
  certificate_number: string;
  student_id: number;
  student_name: string;
  internship_id: number;
  internship_title: string;
  issue_date: string;
  completion_date: string;
  grade: string;
  performance_score: number;
  verification_code: string;
}

// GET - Fetch all certificates
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const internshipId = searchParams.get('internship_id');
    const studentId = searchParams.get('student_id');

    let sql = `
      SELECT 
        c.*,
        u.name as student_name,
        i.title as internship_title
      FROM certificates c
      JOIN students s ON c.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN internships i ON c.internship_id = i.id
      WHERE 1=1
    `;

    const params: string[] = [];

    if (internshipId) {
      sql += ' AND c.internship_id = ?';
      params.push(internshipId);
    }

    if (studentId) {
      sql += ' AND c.student_id = ?';
      params.push(studentId);
    }

    sql += ' ORDER BY c.issue_date DESC';

    const certificates = await query<Certificate[]>(sql, params);
    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Generate new certificate
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      student_id,
      internship_id,
      completion_date,
      grade,
      performance_score,
      remarks
    } = body;

    if (!student_id || !internship_id || !completion_date) {
      return NextResponse.json(
        { error: 'Student ID, internship ID, and completion date required' },
        { status: 400 }
      );
    }

    // Check if certificate already exists
    const existing = await query<any[]>(
      'SELECT id FROM certificates WHERE student_id = ? AND internship_id = ?',
      [student_id, internship_id]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Certificate already exists for this student and internship' },
        { status: 400 }
      );
    }

    // Check if student has passed the exam for this internship
    const examCheck = await query<any[]>(
      `SELECT e.id, e.title, se.is_passed, se.score, se.percentage
       FROM exams e
       LEFT JOIN student_exams se ON e.id = se.exam_id AND se.student_id = ?
       WHERE e.internship_id = ? AND e.is_active = 1
       ORDER BY se.percentage DESC
       LIMIT 1`,
      [student_id, internship_id]
    );

    if (examCheck.length === 0) {
      return NextResponse.json(
        { error: 'No exam found for this internship' },
        { status: 400 }
      );
    }

    if (!examCheck[0].is_passed) {
      return NextResponse.json(
        { 
          error: 'Student has not passed the exam for this internship',
          details: {
            exam_title: examCheck[0].title,
            score: examCheck[0].score,
            percentage: examCheck[0].percentage,
            status: 'not_passed'
          }
        },
        { status: 400 }
      );
    }

    // Generate certificate number
    const year = new Date().getFullYear();
    const count = await query<any[]>(
      'SELECT COUNT(*) as count FROM certificates WHERE YEAR(issue_date) = ?',
      [year]
    );
    const certNumber = `CERT-${year}-${String(count[0].count + 1).padStart(4, '0')}`;

    // Generate verification code
    const verificationCode = `VERIFY-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

    const result = await query(
      `INSERT INTO certificates (
        certificate_number, student_id, internship_id, issue_date,
        completion_date, grade, performance_score, verification_code,
        issued_by, remarks
      ) VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, ?)`,
      [
        certNumber,
        student_id,
        internship_id,
        completion_date,
        grade || 'Pass',
        performance_score || null,
        verificationCode,
        session.id,
        remarks || null
      ]
    );

    // Create notification for student
    const student = await query<any[]>(
      'SELECT user_id FROM students WHERE id = ?',
      [student_id]
    );

    if (student.length > 0) {
      const internship = await query<any[]>(
        'SELECT title FROM internships WHERE id = ?',
        [internship_id]
      );

      await query(
        `INSERT INTO notifications (user_id, title, message, type, related_id, priority)
         VALUES (?, ?, ?, 'certificate', ?, 'high')`,
        [
          student[0].user_id,
          'Certificate Ready',
          `Your certificate for "${internship[0].title}" is ready for download!`,
          (result as any).insertId
        ]
      );
    }

    return NextResponse.json({
      message: 'Certificate generated successfully',
      certificate_number: certNumber,
      verification_code: verificationCode,
      id: (result as any).insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE - Delete certificate
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Certificate ID required' }, { status: 400 });
    }

    await query('DELETE FROM certificates WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
