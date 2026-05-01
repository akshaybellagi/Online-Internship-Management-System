import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

interface Internship {
  id: number;
  title: string;
  description: string;
  company_name: string;
  category: string;
  duration_weeks: number;
  start_date: string;
  end_date: string;
  stipend: number;
  currency: string;
  location: string;
  is_remote: boolean;
  requirements: string;
  responsibilities: string;
  learning_outcomes: string;
  max_students: number;
  status: string;
  application_count: number;
  has_applied: boolean;
  application_status?: string;
}

// GET - Browse available internships
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let sql = `
      SELECT 
        i.*,
        COUNT(DISTINCT a.id) as application_count,
        MAX(CASE WHEN a.student_id = ? THEN 1 ELSE 0 END) as has_applied,
        MAX(CASE WHEN a.student_id = ? THEN a.status ELSE NULL END) as application_status
      FROM internships i
      LEFT JOIN applications a ON i.id = a.internship_id
      WHERE i.status = 'active'
    `;

    const params: any[] = [session.studentId, session.studentId];

    if (category && category !== 'all') {
      sql += ' AND i.category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (i.title LIKE ? OR i.description LIKE ? OR i.company_name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' GROUP BY i.id ORDER BY i.created_at DESC';

    const internships = await query<Internship[]>(sql, params);
    
    // Parse JSON fields
    const parsedInternships = internships.map(i => ({
      ...i,
      requirements: typeof i.requirements === 'string' ? JSON.parse(i.requirements) : i.requirements,
      has_applied: Boolean(i.has_applied)
    }));

    return NextResponse.json(parsedInternships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Apply for internship
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { internship_id, cover_letter } = body;

    if (!internship_id) {
      return NextResponse.json(
        { error: 'Internship ID required' },
        { status: 400 }
      );
    }

    // Check if already applied
    const existing = await query<any[]>(
      'SELECT id FROM applications WHERE internship_id = ? AND student_id = ?',
      [internship_id, session.studentId]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'You have already applied for this internship' },
        { status: 400 }
      );
    }

    // Check max students limit
    const internship = await query<any[]>(
      `SELECT 
        i.max_students,
        COUNT(a.id) as current_applications
       FROM internships i
       LEFT JOIN applications a ON i.id = a.internship_id AND a.status = 'approved'
       WHERE i.id = ?
       GROUP BY i.id`,
      [internship_id]
    );

    if (internship.length === 0) {
      return NextResponse.json(
        { error: 'Internship not found' },
        { status: 404 }
      );
    }

    if (internship[0].current_applications >= internship[0].max_students) {
      return NextResponse.json(
        { error: 'This internship has reached maximum capacity' },
        { status: 400 }
      );
    }

    // Create application
    const result = await query(
      `INSERT INTO applications (internship_id, student_id, cover_letter, status)
       VALUES (?, ?, ?, 'pending')`,
      [internship_id, session.studentId, cover_letter || null]
    );

    // Create notification for admin
    const internshipData = await query<any[]>(
      'SELECT title FROM internships WHERE id = ?',
      [internship_id]
    );

    await query(
      `INSERT INTO notifications (user_id, title, message, type, related_id, priority)
       VALUES (1, 'New Application', ?, 'application', ?, 'medium')`,
      [
        `New application received for "${internshipData[0].title}"`,
        (result as any).insertId
      ]
    );

    return NextResponse.json({
      message: 'Application submitted successfully',
      id: (result as any).insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Error applying for internship:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
