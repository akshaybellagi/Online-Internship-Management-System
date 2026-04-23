'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { BookOpen } from 'lucide-react';

interface SubjectItem {
  id: number; name: string; code: string; credits: number;
  description: string; class_name: string; section: string; class_id: number; subject_id: number;
}

export default function TeacherSubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  useEffect(() => {
    fetch('/api/teacher/subjects').then(r => r.json()).then(setSubjects);
  }, []);

  return (
    <div>
      <PageHeader title="My Subjects" subtitle={`You are teaching ${subjects.length} subject(s)`} />

      {subjects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p>No subjects assigned yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(s => (
            <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen size={18} className="text-blue-600" />
                </div>
                <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded">{s.code}</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{s.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{s.description || 'No description'}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-medium">{s.class_name} {s.section}</span>
                <span>{s.credits} credits</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
