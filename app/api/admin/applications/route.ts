import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

interface Application {
  id: number;
  internship_id: number;
  internship_title: string;
  student_id: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  cover_letter: string;
  status: string;
  applied_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
}

// GET - Fetch all applications
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const internshipId = searchParams.get('internship_id');

    let sql = `
      SELECT 
        a.*,
        i.title as internship_title,
        u.name as student_name,
        u.email as student_email,
        u.phone as student_phone,
        s.student_id as student_roll_number
      FROM applications a
      JOIN internships i ON a.internship_id = i.id
      JOIN students s ON a.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;

    const params: string[] = [];

    if (status && status !== 'all') {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    if (internshipId) {
      sql += ' AND a.internship_id = ?';
      params.push(internshipId);
    }

    sql += ' ORDER BY a.applied_at DESC';

    const applications = await query<Application[]>(sql, params);
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT - Update application status (approve/reject)
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, review_notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Application ID and status required' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be approved or rejected' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE applications 
       SET status = ?, reviewed_at = NOW(), reviewed_by = ?, review_notes = ?
       WHERE id = ?`,
      [status, session.id, review_notes || null, id]
    );

    // Create notification for student
    const app = await query<any[]>(
      'SELECT student_id, internship_id FROM applications WHERE id = ?',
      [id]
    );

    if (app.length > 0) {
      const student = await query<any[]>(
        'SELECT user_id FROM students WHERE id = ?',
        [app[0].student_id]
      );

      if (student.length > 0) {
        const internship = await query<any[]>(
          'SELECT title FROM internships WHERE id = ?',
          [app[0].internship_id]
        );

        const message = status === 'approved'
          ? `Your application for "${internship[0].title}" has been approved! You can now start your internship.`
          : `Your application for "${internship[0].title}" has been reviewed. Please check for details.`;

        await query(
          `INSERT INTO notifications (user_id, title, message, type, related_id, priority)
           VALUES (?, ?, ?, 'application', ?, 'high')`,
          [student[0].user_id, 'Application Update', message, id]
        );
      }
    }

    return NextResponse.json({
      message: `Application ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
