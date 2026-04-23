'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Users } from 'lucide-react';

interface SubjectItem { subject_id: number; class_id: number; name: string; code: string; class_name: string; section: string; }

export default function TeacherClassesPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  useEffect(() => {
    fetch('/api/teacher/subjects').then(r => r.json()).then(setSubjects);
  }, []);

  // Group by class
  const classMap = subjects.reduce<Record<string, { class_name: string; section: string; subjects: SubjectItem[] }>>((acc, s) => {
    const key = `${s.class_id}`;
    if (!acc[key]) acc[key] = { class_name: s.class_name, section: s.section, subjects: [] };
    acc[key].subjects.push(s);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title="My Classes" subtitle={`Teaching in ${Object.keys(classMap).length} class(es)`} />

      {Object.keys(classMap).length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p>No classes assigned yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(classMap).map(([key, cls]) => (
            <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{cls.class_name}</h3>
                  <p className="text-xs text-gray-500">Section {cls.section}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subjects</p>
                {cls.subjects.map(s => (
                  <div key={s.subject_id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-sm text-gray-700">{s.name}</span>
                    <span className="text-xs font-mono text-gray-400">{s.code}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
