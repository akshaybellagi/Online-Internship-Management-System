import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Total students
    const [totalStudents] = await query<[{ count: number }]>(
      'SELECT COUNT(*) as count FROM students'
    );

    // Total internships
    const [totalInternships] = await query<[{ count: number }]>(
      'SELECT COUNT(*) as count FROM internships WHERE status = "active"'
    );

    // Total applications
    const [totalApplications] = await query<[{ count: number }]>(
      'SELECT COUNT(*) as count FROM applications'
    );

    // Pending applications
    const [pendingApplications] = await query<[{ count: number }]>(
      'SELECT COUNT(*) as count FROM applications WHERE status = "pending"'
    );

    // Approved applications
    const [approvedApplications] = await query<[{ count: number }]>(
      'SELECT COUNT(*) as count FROM applications WHERE status = "approved"'
    );

    // Certificates issued
    const [certificatesIssued] = await query<[{ count: number }]>(
      'SELECT COUNT(*) as count FROM certificates'
    );

    // Average attendance
    const [avgAttendance] = await query<[{ percentage: number }]>(
      `SELECT 
        ROUND(
          (SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) * 100.0) / NULLIF(COUNT(*), 0),
          2
        ) as percentage
       FROM attendance`
    );

    // Recent applications
    const recentApplications = await query<any[]>(
      `SELECT 
        a.id,
        a.status,
        a.applied_at,
        u.name as student_name,
        i.title as internship_title
       FROM applications a
       JOIN students s ON a.student_id = s.id
       JOIN users u ON s.user_id = u.id
       JOIN internships i ON a.internship_id = i.id
       ORDER BY a.applied_at DESC
       LIMIT 5`
    );

    // Internship statistics
    const internshipStats = await query<any[]>(
      `SELECT 
        i.id,
        i.title,
        COUNT(a.id) as application_count,
        SUM(CASE WHEN a.status = 'approved' THEN 1 ELSE 0 END) as approved_count
       FROM internships i
       LEFT JOIN applications a ON i.id = a.internship_id
       WHERE i.status = 'active'
       GROUP BY i.id
       ORDER BY application_count DESC
       LIMIT 5`
    );

    return NextResponse.json({
      totalStudents: totalStudents.count,
      totalInternships: totalInternships.count,
      totalApplications: totalApplications.count,
      pendingApplications: pendingApplications.count,
      approvedApplications: approvedApplications.count,
      certificatesIssued: certificatesIssued.count,
      avgAttendance: avgAttendance.percentage || 0,
      recentApplications,
      internshipStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
