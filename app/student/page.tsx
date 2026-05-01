import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import StatsCard from '@/components/StatsCard';
import PageHeader from '@/components/PageHeader';
import { Briefcase, FileCheck, Award, Users, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function StudentDashboard() {
  const session = await getSession();

  // Get student info
  const students = await query<any[]>(`
    SELECT s.id, s.student_id, s.institution, s.field_of_study
    FROM students s
    WHERE s.user_id = ?
  `, [session!.id]);
  const student = students[0];

  let stats = {
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    certificates: 0,
    attendanceRate: 0
  };

  let recentApplications: any[] = [];
  let upcomingExams: any[] = [];

  if (student) {
    // Get application stats
    const [appStats] = await query<any[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved
      FROM applications 
      WHERE student_id = ?
    `, [student.id]);
    
    stats.totalApplications = appStats.total || 0;
    stats.pendingApplications = appStats.pending || 0;
    stats.approvedApplications = appStats.approved || 0;

    // Get certificate count
    const [certCount] = await query<any[]>(`
      SELECT COUNT(*) as count 
      FROM certificates 
      WHERE student_id = ?
    `, [student.id]);
    stats.certificates = certCount.count || 0;

    // Get attendance rate
    const [attStats] = await query<any[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present
      FROM attendance 
      WHERE student_id = ?
    `, [student.id]);
    
    if (attStats.total > 0) {
      stats.attendanceRate = Math.round((attStats.present / attStats.total) * 100);
    }

    // Get recent applications
    recentApplications = await query(`
      SELECT 
        a.id,
        i.title as internship_title,
        a.status,
        a.applied_at
      FROM applications a
      JOIN internships i ON a.internship_id = i.id
      WHERE a.student_id = ?
      ORDER BY a.applied_at DESC
      LIMIT 5
    `, [student.id]);

    // Get upcoming exams
    upcomingExams = await query(`
      SELECT 
        e.id,
        e.title,
        e.exam_date,
        i.title as internship_title
      FROM exams e
      JOIN internships i ON e.internship_id = i.id
      JOIN applications a ON i.id = a.internship_id
      WHERE a.student_id = ? 
        AND a.status = 'approved'
        AND e.exam_date > NOW()
        AND e.is_active = 1
      ORDER BY e.exam_date ASC
      LIMIT 3
    `, [student.id]);
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    withdrawn: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <div>
      <PageHeader 
        title={`Welcome back, ${session?.name} 👋`} 
        subtitle={student ? `${student.student_id} · ${student.institution || 'Student'}` : 'Welcome to InternHub'} 
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard 
          title="Applications" 
          value={stats.totalApplications} 
          icon={<FileCheck size={22} />} 
          color="bg-blue-500" 
        />
        <StatsCard 
          title="Pending" 
          value={stats.pendingApplications} 
          icon={<Calendar size={22} />} 
          color="bg-amber-500" 
        />
        <StatsCard 
          title="Approved" 
          value={stats.approvedApplications} 
          icon={<Briefcase size={22} />} 
          color="bg-emerald-500" 
        />
        <StatsCard 
          title="Certificates" 
          value={stats.certificates} 
          icon={<Award size={22} />} 
          color="bg-indigo-500" 
        />
        <StatsCard 
          title="Attendance" 
          value={`${stats.attendanceRate}%`} 
          icon={<TrendingUp size={22} />} 
          color="bg-violet-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Recent Applications</h2>
            <Link 
              href="/student/applications" 
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all →
            </Link>
          </div>
          
          {recentApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileCheck size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">No applications yet</p>
              <Link 
                href="/student/internships"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Browse internships →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{app.internship_title}</p>
                    <p className="text-xs text-gray-500">
                      Applied {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[app.status]}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-indigo-500" /> Upcoming Exams
          </h2>
          
          {upcomingExams.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No upcoming exams</p>
          ) : (
            <div className="space-y-3">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                  <p className="text-sm font-medium text-gray-800 mb-1">{exam.title}</p>
                  <p className="text-xs text-gray-600 mb-2">{exam.internship_title}</p>
                  <div className="flex items-center gap-1 text-xs text-indigo-600">
                    <Calendar size={12} />
                    <span>{new Date(exam.exam_date).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link 
          href="/student/internships" 
          className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl text-white hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-sm"
        >
          <Briefcase size={20} className="mb-2" />
          <h3 className="font-semibold text-sm">Browse Internships</h3>
          <p className="text-xs text-indigo-100 mt-1">Find opportunities</p>
        </Link>
        
        <Link 
          href="/student/applications" 
          className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white hover:from-amber-600 hover:to-amber-700 transition-all shadow-sm"
        >
          <FileCheck size={20} className="mb-2" />
          <h3 className="font-semibold text-sm">My Applications</h3>
          <p className="text-xs text-amber-100 mt-1">Track your applications</p>
        </Link>
        
        <Link 
          href="/student/certificates" 
          className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm"
        >
          <Award size={20} className="mb-2" />
          <h3 className="font-semibold text-sm">My Certificates</h3>
          <p className="text-xs text-emerald-100 mt-1">View achievements</p>
        </Link>
        
        <Link 
          href="/student/materials" 
          className="p-4 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl text-white hover:from-violet-600 hover:to-violet-700 transition-all shadow-sm"
        >
          <Users size={20} className="mb-2" />
          <h3 className="font-semibold text-sm">Learning Materials</h3>
          <p className="text-xs text-violet-100 mt-1">Access resources</p>
        </Link>
      </div>
    </div>
  );
}
