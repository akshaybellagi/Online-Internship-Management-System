import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

interface Material {
  id: number;
  internship_id: number;
  title: string;
  description: string;
  type: string;
  external_url: string | null;
  order_index: number;
  is_mandatory: boolean;
}

// GET - Fetch learning materials for an internship (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const internshipId = searchParams.get('internship_id');

    if (!internshipId) {
      return NextResponse.json({ error: 'Internship ID required' }, { status: 400 });
    }

    const sql = `
      SELECT 
        id,
        internship_id,
        title,
        description,
        type,
        external_url,
        order_index,
        is_mandatory
      FROM learning_materials
      WHERE internship_id = ?
      ORDER BY order_index
    `;

    const materials = await query<Material[]>(sql, [internshipId]);
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
