import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import StatsCard from '@/components/StatsCard';
import PageHeader from '@/components/PageHeader';
import { Briefcase, Users, FileCheck, Award, TrendingUp, Clock } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await getSession();

  // Get statistics
  const [totalStudents] = await query<[{ count: number }]>(
    'SELECT COUNT(*) as count FROM students'
  );
  
  const [totalInternships] = await query<[{ count: number }]>(
    'SELECT COUNT(*) as count FROM internships WHERE status = "active"'
  );
  
  const [totalApplications] = await query<[{ count: number }]>(
    'SELECT COUNT(*) as count FROM applications'
  );
  
  const [pendingApplications] = await query<[{ count: number }]>(
    'SELECT COUNT(*) as count FROM applications WHERE status = "pending"'
  );
  
  const [certificatesIssued] = await query<[{ count: number }]>(
    'SELECT COUNT(*) as count FROM certificates'
  );

  // Recent applications
  const recentApplications = await query<{
    id: number;
    student_name: string;
    internship_title: string;
    status: string;
    applied_at: string;
  }[]>(`
    SELECT 
      a.id,
      u.name as student_name,
      i.title as internship_title,
      a.status,
      a.applied_at
    FROM applications a
    JOIN students s ON a.student_id = s.id
    JOIN users u ON s.user_id = u.id
    JOIN internships i ON a.internship_id = i.id
    ORDER BY a.applied_at DESC
    LIMIT 8
  `);

  // Top internships by applications
  const topInternships = await query<{
    title: string;
    application_count: number;
    approved_count: number;
  }[]>(`
    SELECT 
      i.title,
      COUNT(a.id) as application_count,
      SUM(CASE WHEN a.status = 'approved' THEN 1 ELSE 0 END) as approved_count
    FROM internships i
    LEFT JOIN applications a ON i.id = a.internship_id
    WHERE i.status = 'active'
    GROUP BY i.id
    ORDER BY application_count DESC
    LIMIT 5
  `);

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    withdrawn: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${session?.name} 👋`}
        subtitle="Here's what's happening in your internship program today"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatsCard 
          title="Total Students" 
          value={totalStudents.count} 
          icon={<Users size={22} />} 
          color="bg-violet-500" 
        />
        <StatsCard 
          title="Active Internships" 
          value={totalInternships.count} 
          icon={<Briefcase size={22} />} 
          color="bg-blue-500" 
        />
        <StatsCard 
          title="Total Applications" 
          value={totalApplications.count} 
          icon={<FileCheck size={22} />} 
          color="bg-indigo-500" 
        />
        <StatsCard 
          title="Pending Review" 
          value={pendingApplications.count} 
          icon={<Clock size={22} />} 
          color="bg-amber-500" 
        />
        <StatsCard 
          title="Certificates Issued" 
          value={certificatesIssued.count} 
          icon={<Award size={22} />} 
          color="bg-emerald-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Recent Applications</h2>
            <a 
              href="/admin/applications" 
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all →
            </a>
          </div>
          
          {recentApplications.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No applications yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Student</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Internship</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Applied</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium text-gray-800">{app.student_name}</td>
                      <td className="py-2 px-3 text-gray-600">{app.internship_title}</td>
                      <td className="py-2 px-3 text-gray-500">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Internships */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-500" /> Top Internships
          </h2>
          
          {topInternships.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No internships yet</p>
          ) : (
            <div className="space-y-3">
              {topInternships.map((internship, i) => (
                <div key={i} className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    {internship.title}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {internship.application_count} applications
                    </span>
                    <span className="text-emerald-600 font-medium">
                      {internship.approved_count} approved
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ 
                        width: `${internship.application_count > 0 
                          ? (internship.approved_count / internship.application_count) * 100 
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a 
          href="/admin/internships" 
          className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl text-white hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-sm"
        >
          <Briefcase size={20} className="mb-2" />
          <h3 className="font-semibold text-sm">Manage Internships</h3>
          <p className="text-xs text-indigo-100 mt-1">Create and edit internships</p>
        </a>
        
        <a 
          href="/admin/applications" 
          className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white hover:from-amber-600 hover:to-amber-700 transition-all shadow-sm"
        >
          <FileCheck size={20} className="mb-2" />
          <h3 className="font-semibold text-sm">Review Applications</h3>
          <p className="text-xs text-amber-100 mt-1">Approve or reject applications</p>
        </a>
        
        <a 
          href="/admin/certificates" 
          className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm"
        >
          <Award size={20} className="mb-2" />
          <h3 className="font-semibold text-sm">Issue Certificates</h3>
          <p className="text-xs text-emerald-100 mt-1">Generate completion certificates</p>
        </a>
        
        <a 
          href="/admin/students" 
          className="p-4 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl text-white hover:from-violet-600 hover:to-violet-700 transition-all shadow-sm"
        >
          <Users size={20} className="mb-2" />
          <h3 className="font-semibold text-sm">Manage Students</h3>
          <p className="text-xs text-violet-100 mt-1">View student profiles</p>
        </a>
      </div>
    </div>
  );
}
