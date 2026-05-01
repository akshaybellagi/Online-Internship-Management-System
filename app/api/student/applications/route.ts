import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

interface Application {
  id: number;
  internship_id: number;
  internship_title: string;
  company_name: string;
  category: string;
  duration_weeks: number;
  stipend: number;
  location: string;
  is_remote: boolean;
  cover_letter: string;
  status: string;
  applied_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
}

// GET - Fetch student's applications
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let sql = `
      SELECT 
        a.*,
        i.title as internship_title,
        i.company_name,
        i.category,
        i.duration_weeks,
        i.stipend,
        i.location,
        i.is_remote
      FROM applications a
      JOIN internships i ON a.internship_id = i.id
      WHERE a.student_id = ?
    `;

    const params: any[] = [session.studentId];

    if (status && status !== 'all') {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY a.applied_at DESC';

    const applications = await query<Application[]>(sql, params);
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE - Withdraw application
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Application ID required' }, { status: 400 });
    }

    // Check if application belongs to student and is pending
    const application = await query<any[]>(
      'SELECT status FROM applications WHERE id = ? AND student_id = ?',
      [id, session.studentId]
    );

    if (application.length === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application[0].status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only withdraw pending applications' },
        { status: 400 }
      );
    }

    await query(
      'UPDATE applications SET status = "withdrawn" WHERE id = ?',
      [id]
    );

    return NextResponse.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Error withdrawing application:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
