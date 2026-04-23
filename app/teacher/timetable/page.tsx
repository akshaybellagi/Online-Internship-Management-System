'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';

interface TimetableEntry {
  id: number; day_of_week: string; start_time: string; end_time: string;
  subject_name: string; subject_code: string; class_name: string; section: string; room: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayColors = ['bg-violet-50 border-violet-200', 'bg-blue-50 border-blue-200', 'bg-teal-50 border-teal-200', 'bg-emerald-50 border-emerald-200', 'bg-amber-50 border-amber-200', 'bg-orange-50 border-orange-200'];

export default function TeacherTimetablePage() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);

  useEffect(() => {
    fetch('/api/teacher/timetable').then(r => r.json()).then(setEntries);
  }, []);

  const today = DAYS[new Date().getDay() - 1] || '';

  return (
    <div>
      <PageHeader title="My Timetable" subtitle="Your weekly class schedule" />

      <div className="space-y-6">
        {DAYS.map((day, di) => {
          const dayEntries = entries.filter(e => e.day_of_week === day);
          const isToday = day === today;
          return (
            <div key={day}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>{day}</h2>
                {isToday && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">Today</span>}
                {dayEntries.length === 0 && <span className="text-xs text-gray-400">No classes</span>}
              </div>
              {dayEntries.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dayEntries.map(e => (
                    <div key={e.id} className={`border rounded-xl p-4 ${dayColors[di]} ${isToday ? 'ring-2 ring-blue-300' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono text-xs text-gray-600">{e.start_time} – {e.end_time}</span>
                        {e.room && <span className="text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded">{e.room}</span>}
                      </div>
                      <p className="font-semibold text-gray-800">{e.subject_name}</p>
                      <p className="text-xs text-gray-500 mt-1">{e.class_name} {e.section} · {e.subject_code}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
