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
  created_at: string;
  application_count?: number;
}

// GET - Fetch all internships
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let sql = `
      SELECT 
        i.*,
        COUNT(a.id) as application_count
      FROM internships i
      LEFT JOIN applications a ON i.id = a.internship_id
    `;

    const params: string[] = [];
    const whereClauses: string[] = [];
    
    if (status && status !== 'all') {
      whereClauses.push('i.status = ?');
      params.push(status);
    }

    if (whereClauses.length > 0) {
      sql += ' WHERE ' + whereClauses.join(' AND ');
    }

    sql += ' GROUP BY i.id ORDER BY i.created_at DESC';

    const internships = await query<Internship[]>(sql, params);
    return NextResponse.json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Create new internship
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      company_name,
      category,
      duration_weeks,
      start_date,
      end_date,
      stipend,
      currency = 'INR',
      location,
      is_remote,
      requirements,
      responsibilities,
      learning_outcomes,
      max_students,
      status = 'active',
      materials = []
    } = body;

    // Validation
    if (!title || !description || !duration_weeks) {
      return NextResponse.json(
        { error: 'Title, description, and duration are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO internships (
        title, description, company_name, category, duration_weeks,
        start_date, end_date, stipend, currency, location, is_remote,
        requirements, responsibilities, learning_outcomes, max_students,
        status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        company_name,
        category,
        duration_weeks,
        start_date,
        end_date,
        stipend || 0,
        currency,
        location,
        is_remote ? 1 : 0,
        JSON.stringify(requirements),
        responsibilities,
        learning_outcomes,
        max_students || 50,
        status,
        session.id
      ]
    );

    const internshipId = (result as any).insertId;

    // Insert learning materials if provided
    if (materials && materials.length > 0) {
      for (let i = 0; i < materials.length; i++) {
        const material = materials[i];
        await query(
          `INSERT INTO learning_materials (
            internship_id, title, description, type, external_url,
            order_index, is_mandatory, uploaded_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            internshipId,
            material.title,
            material.description || '',
            material.type,
            material.external_url,
            i + 1,
            material.is_mandatory ? 1 : 0,
            session.id
          ]
        );
      }
    }

    return NextResponse.json({
      message: 'Internship created successfully',
      id: internshipId,
      materials_added: materials.length
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating internship:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT - Update internship
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, materials, ...updates } = body;

    console.log('PUT /api/admin/internships - ID:', id);
    console.log('Materials count:', materials?.length || 0);
    console.log('Updates:', Object.keys(updates));

    if (!id) {
      return NextResponse.json({ error: 'Internship ID required' }, { status: 400 });
    }

    // Handle JSON fields before building query
    if (updates.requirements && typeof updates.requirements === 'object') {
      updates.requirements = JSON.stringify(updates.requirements);
    }

    // Handle boolean fields
    if (typeof updates.is_remote === 'boolean') {
      updates.is_remote = updates.is_remote ? 1 : 0;
    }

    // Build dynamic update query
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0 && (!materials || materials.length === 0)) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Update internship fields if any
    if (fields.length > 0) {
      const setClause = fields.map(f => `${f} = ?`).join(', ');
      console.log('Updating internship fields:', fields);
      await query(
        `UPDATE internships SET ${setClause} WHERE id = ?`,
        [...values, id]
      );
    }

    // Update learning materials if provided
    if (materials && Array.isArray(materials)) {
      console.log('Updating materials, count:', materials.length);
      
      // Delete existing materials for this internship
      await query('DELETE FROM learning_materials WHERE internship_id = ?', [id]);
      
      // Insert new materials
      for (let i = 0; i < materials.length; i++) {
        const material = materials[i];
        console.log(`Inserting material ${i + 1}:`, material.title);
        
        await query(
          `INSERT INTO learning_materials (
            internship_id, title, description, type, external_url,
            order_index, is_mandatory, uploaded_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            material.title,
            material.description || '',
            material.type,
            material.external_url,
            i + 1,
            material.is_mandatory ? 1 : 0,
            session.id
          ]
        );
      }
    }

    console.log('Update successful');
    return NextResponse.json({ 
      message: 'Internship updated successfully',
      materials_updated: materials ? materials.length : 0
    });
  } catch (error) {
    console.error('Error updating internship:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : '');
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Delete internship
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Internship ID required' }, { status: 400 });
    }

    await query('DELETE FROM internships WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    console.error('Error deleting internship:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
