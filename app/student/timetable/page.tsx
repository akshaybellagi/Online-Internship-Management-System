'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';

interface TimetableEntry {
  id: number; day_of_week: string; start_time: string; end_time: string;
  subject_name: string; subject_code: string; teacher_name: string; room: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const subjectColors = ['bg-violet-50 border-violet-200 text-violet-700', 'bg-blue-50 border-blue-200 text-blue-700', 'bg-teal-50 border-teal-200 text-teal-700', 'bg-emerald-50 border-emerald-200 text-emerald-700', 'bg-amber-50 border-amber-200 text-amber-700', 'bg-rose-50 border-rose-200 text-rose-700'];

export default function StudentTimetablePage() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    fetch('/api/student/timetable').then(r => r.json()).then(setEntries);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setSelectedDay(days[new Date().getDay()] || 'Monday');
  }, []);

  const today = DAYS[new Date().getDay() - 1] || '';

  return (
    <div>
      <PageHeader title="My Timetable" subtitle="Your weekly class schedule" />

      {/* Day tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {DAYS.map(day => (
          <button key={day} onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedDay === day ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {day} {day === today && '•'}
          </button>
        ))}
      </div>

      {selectedDay && (() => {
        const dayEntries = entries.filter(e => e.day_of_week === selectedDay);
        return dayEntries.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm bg-white rounded-xl border border-gray-100">
            No classes on {selectedDay}
          </div>
        ) : (
          <div className="space-y-3">
            {dayEntries.map((e, i) => (
              <div key={e.id} className={`border rounded-xl p-4 flex items-center gap-4 ${subjectColors[i % subjectColors.length]}`}>
                <div className="text-center min-w-[80px]">
                  <p className="text-xs font-medium opacity-70">{e.start_time}</p>
                  <p className="text-xs opacity-50">to</p>
                  <p className="text-xs font-medium opacity-70">{e.end_time}</p>
                </div>
                <div className="w-px h-12 bg-current opacity-20" />
                <div className="flex-1">
                  <p className="font-semibold">{e.subject_name}</p>
                  <p className="text-xs opacity-70 mt-0.5">Teacher: {e.teacher_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono opacity-60">{e.subject_code}</p>
                  {e.room && <p className="text-xs opacity-60 mt-0.5">{e.room}</p>}
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}
