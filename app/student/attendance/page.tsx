'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';

interface AttRecord { date: string; status: string; subject_name: string; subject_code: string; remarks: string; }
interface Summary { subject_name: string; code: string; total: number; present: number; absent: number; late: number; percentage: number; }

const statusColors: Record<string, string> = {
  present: 'bg-emerald-100 text-emerald-700',
  absent: 'bg-red-100 text-red-700',
  late: 'bg-amber-100 text-amber-700',
  excused: 'bg-blue-100 text-blue-700',
};

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<AttRecord[]>([]);
  const [summary, setSummary] = useState<Summary[]>([]);
  const [view, setView] = useState<'summary' | 'detail'>('summary');
  const [filterSubject, setFilterSubject] = useState('');

  useEffect(() => {
    fetch('/api/student/attendance').then(r => r.json()).then(data => {
      setRecords(data.records || []); setSummary(data.summary || []);
    });
  }, []);

  const filteredRecords = filterSubject ? records.filter(r => r.subject_code === filterSubject) : records;
  const subjects = [...new Set(records.map(r => r.subject_code))];

  return (
    <div>
      <PageHeader title="My Attendance" subtitle="Track your attendance across all subjects" />

      {/* View toggle */}
      <div className="flex gap-2 mb-6">
        {(['summary', 'detail'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${view === v ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {v === 'summary' ? 'Subject Summary' : 'Detailed Records'}
          </button>
        ))}
      </div>

      {view === 'summary' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.length === 0 ? (
            <div className="col-span-3 text-center py-16 text-gray-400 text-sm">No attendance records yet</div>
          ) : summary.map((s, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{s.subject_name}</p>
                  <p className="text-xs text-gray-500 font-mono">{s.code}</p>
                </div>
                <span className={`text-lg font-bold ${s.percentage >= 75 ? 'text-emerald-600' : s.percentage >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{s.percentage}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full ${s.percentage >= 75 ? 'bg-emerald-500' : s.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.percentage}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-emerald-50 rounded-lg p-2"><p className="font-bold text-emerald-700">{s.present}</p><p className="text-gray-500">Present</p></div>
                <div className="bg-red-50 rounded-lg p-2"><p className="font-bold text-red-600">{s.absent}</p><p className="text-gray-500">Absent</p></div>
                <div className="bg-amber-50 rounded-lg p-2"><p className="font-bold text-amber-600">{s.late}</p><p className="text-gray-500">Late</p></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100">
                {['Date', 'Subject', 'Status', 'Remarks'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-12 text-gray-400">No records</td></tr>
                ) : filteredRecords.map((r, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{r.subject_name} <span className="text-xs text-gray-400 font-mono">({r.subject_code})</span></td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[r.status] || 'bg-gray-100 text-gray-600'}`}>{r.status}</span></td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{r.remarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
