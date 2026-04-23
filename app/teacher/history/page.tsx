'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Search } from 'lucide-react';

interface AttRecord {
  student_name: string; roll_number: string; subject_name: string;
  class_name: string; date: string; status: string; remarks: string;
}

const statusColors: Record<string, string> = {
  present: 'bg-emerald-100 text-emerald-700',
  absent: 'bg-red-100 text-red-700',
  late: 'bg-amber-100 text-amber-700',
  excused: 'bg-blue-100 text-blue-700',
};

export default function AttendanceHistoryPage() {
  const [records, setRecords] = useState<AttRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/teacher/attendance').then(r => r.json()).then(data => { setRecords(data); setLoading(false); });
  }, []);

  const filtered = records.filter(r =>
    r.student_name.toLowerCase().includes(search.toLowerCase()) ||
    r.subject_name.toLowerCase().includes(search.toLowerCase()) ||
    r.roll_number?.includes(search)
  );

  return (
    <div>
      <PageHeader title="Attendance History" subtitle={`${records.length} records found`} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              {['Date', 'Student', 'Roll No', 'Subject', 'Class', 'Status', 'Remarks'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No records found</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{r.student_name}</td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{r.roll_number}</td>
                  <td className="py-3 px-4 text-gray-600">{r.subject_name}</td>
                  <td className="py-3 px-4 text-gray-600">{r.class_name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[r.status] || 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{r.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
