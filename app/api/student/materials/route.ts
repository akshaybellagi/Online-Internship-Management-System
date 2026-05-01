import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

interface Material {
  id: number;
  internship_id: number;
  internship_title: string;
  title: string;
  description: string;
  type: string;
  file_url: string | null;
  external_url: string | null;
  content: string | null;
  file_size_kb: number | null;
  duration_minutes: number | null;
  order_index: number;
  is_mandatory: boolean;
  progress_percentage: number;
  is_completed: boolean;
}

// GET - Fetch learning materials for student's internships
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

    const studentId = student.id;

    const { searchParams } = new URL(req.url);
    const internshipId = searchParams.get('internship_id');

    let sql = `
      SELECT 
        lm.*,
        i.title as internship_title,
        COALESCE(mp.progress_percentage, 0) as progress_percentage,
        COALESCE(mp.is_completed, 0) as is_completed
      FROM learning_materials lm
      JOIN internships i ON lm.internship_id = i.id
      JOIN applications a ON lm.internship_id = a.internship_id
      LEFT JOIN material_progress mp ON lm.id = mp.material_id AND mp.student_id = ?
      WHERE a.student_id = ? AND a.status = 'approved' AND lm.is_active = 1
    `;

    const params: any[] = [studentId, studentId];

    if (internshipId) {
      sql += ' AND lm.internship_id = ?';
      params.push(internshipId);
    }

    sql += ' ORDER BY lm.internship_id, lm.order_index';

    const materials = await query<Material[]>(sql, params);
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Update material progress
export async function POST(req: NextRequest) {
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

    const studentId = student.id;

    const body = await req.json();
    const { material_id, progress_percentage } = body;

    if (!material_id || progress_percentage === undefined) {
      return NextResponse.json(
        { error: 'Material ID and progress percentage required' },
        { status: 400 }
      );
    }

    const isCompleted = progress_percentage >= 100;

    await query(
      `INSERT INTO material_progress (student_id, material_id, progress_percentage, is_completed, completed_at)
       VALUES (?, ?, ?, ?, ${isCompleted ? 'NOW()' : 'NULL'})
       ON DUPLICATE KEY UPDATE 
         progress_percentage = VALUES(progress_percentage),
         is_completed = VALUES(is_completed),
         completed_at = ${isCompleted ? 'NOW()' : 'completed_at'}`,
      [studentId, material_id, progress_percentage, isCompleted ? 1 : 0]
    );

    return NextResponse.json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
