'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Search, Download } from 'lucide-react';

interface ReportRow {
  student_name: string; roll_number: string; subject_name: string;
  total: number; present: number; absent: number; late: number; percentage: number;
}
interface SelectItem { id: number; name: string; section?: string; }

export default function ReportsPage() {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [classes, setClasses] = useState<SelectItem[]>([]);
  const [subjects, setSubjects] = useState<SelectItem[]>([]);
  const [filters, setFilters] = useState({ class_id: '', subject_id: '', from: '', to: '' });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetch('/api/admin/classes').then(r => r.json()), fetch('/api/admin/subjects').then(r => r.json())])
      .then(([c, s]) => { setClasses(c); setSubjects(s); });
  }, []);

  const loadReport = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.class_id) params.set('class_id', filters.class_id);
    if (filters.subject_id) params.set('subject_id', filters.subject_id);
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);
    const data = await fetch(`/api/admin/reports?${params}`).then(r => r.json());
    setRows(data); setLoading(false);
  };

  const filtered = rows.filter(r =>
    r.student_name.toLowerCase().includes(search.toLowerCase()) ||
    r.roll_number?.includes(search) ||
    r.subject_name.toLowerCase().includes(search.toLowerCase())
  );

  const getColor = (pct: number) => pct >= 75 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600';
  const getBg = (pct: number) => pct >= 75 ? 'bg-emerald-50' : pct >= 50 ? 'bg-amber-50' : 'bg-red-50';

  const exportCSV = () => {
    const header = 'Student,Roll No,Subject,Total,Present,Absent,Late,Percentage\n';
    const csv = filtered.map(r => `${r.student_name},${r.roll_number},${r.subject_name},${r.total},${r.present},${r.absent},${r.late},${r.percentage}%`).join('\n');
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'attendance-report.csv'; a.click();
  };

  return (
    <div>
      <PageHeader title="Attendance Reports" subtitle="View and export attendance data"
        action={<button onClick={exportCSV} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"><Download size={16} />Export CSV</button>}
      />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <select value={filters.class_id} onChange={e => setFilters({ ...filters, class_id: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="">All Classes</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
          </select>
          <select value={filters.subject_id} onChange={e => setFilters({ ...filters, subject_id: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input type="date" value={filters.from} onChange={e => setFilters({ ...filters, from: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="From" />
          <input type="date" value={filters.to} onChange={e => setFilters({ ...filters, to: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="To" />
          <button onClick={loadReport} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60">
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {rows.length > 0 && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Records', value: rows.length, color: 'bg-violet-500' },
              { label: 'Avg Attendance', value: `${Math.round(rows.reduce((a, r) => a + r.percentage, 0) / rows.length)}%`, color: 'bg-emerald-500' },
              { label: 'Below 75%', value: rows.filter(r => r.percentage < 75).length, color: 'bg-red-500' },
              { label: 'Perfect (100%)', value: rows.filter(r => r.percentage === 100).length, color: 'bg-blue-500' },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                <div className={`w-10 h-10 ${c.color} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>{c.value}</div>
                <p className="text-sm text-gray-600">{c.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <div className="relative max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100">
                  {['Student', 'Roll No', 'Subject', 'Total', 'Present', 'Absent', 'Late', 'Attendance %'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{r.student_name}</td>
                      <td className="py-3 px-4 font-mono text-xs text-gray-500">{r.roll_number}</td>
                      <td className="py-3 px-4 text-gray-600">{r.subject_name}</td>
                      <td className="py-3 px-4 text-gray-600">{r.total}</td>
                      <td className="py-3 px-4 text-emerald-600 font-medium">{r.present}</td>
                      <td className="py-3 px-4 text-red-500">{r.absent}</td>
                      <td className="py-3 px-4 text-amber-600">{r.late}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getBg(r.percentage)} ${getColor(r.percentage)}`}>
                          {r.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {rows.length === 0 && !loading && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-sm">Select filters and click "Generate Report" to view attendance data</p>
        </div>
      )}
    </div>
  );
}
