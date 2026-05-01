'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Badge from '@/components/Badge';
import { Search, Mail, Phone, Calendar, Award } from 'lucide-react';

interface Student {
  id: number;
  user_id: number;
  student_id: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  education_level: string;
  institution: string;
  field_of_study: string;
  is_active: boolean;
  application_count: number;
  certificate_count: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/students');
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.student_id?.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader 
        title="Manage Students" 
        subtitle={`${students.length} students registered`}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search students..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" 
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Student ID</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Name</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Contact</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Education</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Applications</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Certificates</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filtered.map(student => (
                    <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs text-gray-600">{student.student_id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-800">{student.name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Mail size={12} />
                            <span className="text-xs">{student.email}</span>
                          </div>
                          {student.phone && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone size={12} />
                              <span className="text-xs">{student.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs text-gray-600">
                          <p className="font-medium">{student.education_level || '—'}</p>
                          <p>{student.institution || '—'}</p>
                          <p className="text-gray-500">{student.field_of_study || '—'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-800 font-medium">{student.application_count || 0}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Award size={14} className="text-amber-500" />
                          <span className="text-gray-800 font-medium">{student.certificate_count || 0}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          text={student.is_active ? 'Active' : 'Inactive'} 
                          className={student.is_active 
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                          } 
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
