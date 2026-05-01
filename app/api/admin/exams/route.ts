import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

interface Exam {
  id: number;
  internship_id: number;
  internship_title?: string;
  title: string;
  description: string;
  exam_date: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  questions: string;
  instructions: string;
  is_proctored: boolean;
  max_attempts: number;
  is_active: boolean;
  created_at: string;
  attempt_count?: number;
}

// GET - Fetch all exams
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const internshipId = searchParams.get('internship_id');

    let sql = `
      SELECT 
        e.*,
        i.title as internship_title,
        COUNT(se.id) as attempt_count
      FROM exams e
      JOIN internships i ON e.internship_id = i.id
      LEFT JOIN student_exams se ON e.id = se.exam_id
      WHERE 1=1
    `;

    const params: string[] = [];

    if (internshipId) {
      sql += ' AND e.internship_id = ?';
      params.push(internshipId);
    }

    sql += ' GROUP BY e.id ORDER BY e.exam_date DESC';

    const exams = await query<Exam[]>(sql, params);
    return NextResponse.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Create new exam
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      internship_id,
      title,
      description,
      exam_date,
      duration_minutes,
      total_marks,
      passing_marks,
      questions,
      instructions,
      is_proctored = false,
      max_attempts = 1,
      is_active = true
    } = body;

    if (!internship_id || !title || !exam_date || !duration_minutes || !total_marks || !questions) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO exams (
        internship_id, title, description, exam_date, duration_minutes,
        total_marks, passing_marks, questions, instructions, is_proctored,
        max_attempts, is_active, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        internship_id,
        title,
        description,
        exam_date,
        duration_minutes,
        total_marks,
        passing_marks || Math.floor(total_marks * 0.5),
        JSON.stringify(questions),
        instructions,
        is_proctored ? 1 : 0,
        max_attempts,
        is_active ? 1 : 0,
        session.id
      ]
    );

    return NextResponse.json({
      message: 'Exam created successfully',
      id: (result as any).insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT - Update exam
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Exam ID required' }, { status: 400 });
    }

    // Handle JSON fields
    if (updates.questions && typeof updates.questions === 'object') {
      updates.questions = JSON.stringify(updates.questions);
    }

    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    await query(
      `UPDATE exams SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return NextResponse.json({ message: 'Exam updated successfully' });
  } catch (error) {
    console.error('Error updating exam:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE - Delete exam
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Exam ID required' }, { status: 400 });
    }

    await query('DELETE FROM exams WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
