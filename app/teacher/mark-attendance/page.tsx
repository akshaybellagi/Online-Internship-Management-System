'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { CheckCircle, XCircle, Clock, Save } from 'lucide-react';

interface SubjectItem { subject_id: number; class_id: number; name: string; code: string; class_name: string; section: string; }
interface StudentRecord { student_id: number; name: string; roll_number: string; status: string; remarks: string; }

export default function MarkAttendancePage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/teacher/subjects').then(r => r.json()).then(setSubjects);
  }, []);

  const loadStudents = async () => {
    if (!selectedSubject || !selectedClass) return;
    setLoading(true);
    const data = await fetch(`/api/teacher/attendance?class_id=${selectedClass}&subject_id=${selectedSubject}&date=${date}`).then(r => r.json());
    setStudents(data.map((s: StudentRecord) => ({ ...s, status: s.status || 'present', remarks: s.remarks || '' })));
    setLoading(false); setSaved(false);
  };

  useEffect(() => { loadStudents(); }, [selectedSubject, selectedClass, date]);

  const setStatus = (studentId: number, status: string) => {
    setStudents(prev => prev.map(s => s.student_id === studentId ? { ...s, status } : s));
  };

  const markAll = (status: string) => setStudents(prev => prev.map(s => ({ ...s, status })));

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/teacher/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: students, subject_id: selectedSubject, class_id: selectedClass, date }),
    });
    setSaving(false); setSaved(true);
  };

  const selectedSubjectInfo = subjects.find(s => String(s.subject_id) === selectedSubject && String(s.class_id) === selectedClass);
  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;

  const statusBtn = (studentId: number, status: string, current: string) => {
    const configs: Record<string, { icon: React.ReactNode; active: string; inactive: string }> = {
      present: { icon: <CheckCircle size={16} />, active: 'bg-emerald-500 text-white', inactive: 'bg-gray-100 text-gray-400 hover:bg-emerald-50 hover:text-emerald-500' },
      absent: { icon: <XCircle size={16} />, active: 'bg-red-500 text-white', inactive: 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500' },
      late: { icon: <Clock size={16} />, active: 'bg-amber-500 text-white', inactive: 'bg-gray-100 text-gray-400 hover:bg-amber-50 hover:text-amber-500' },
    };
    const c = configs[status];
    return (
      <button key={status} onClick={() => setStatus(studentId, status)}
        className={`p-1.5 rounded-lg transition-all ${current === status ? c.active : c.inactive}`}>
        {c.icon}
      </button>
    );
  };

  return (
    <div>
      <PageHeader title="Mark Attendance" subtitle="Select a class and subject to mark attendance" />

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Subject & Class</label>
            <select value={`${selectedSubject}:${selectedClass}`}
              onChange={e => { const [sub, cls] = e.target.value.split(':'); setSelectedSubject(sub); setSelectedClass(cls); }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value=":">Select subject</option>
              {subjects.map(s => <option key={`${s.subject_id}:${s.class_id}`} value={`${s.subject_id}:${s.class_id}`}>{s.name} — {s.class_name} {s.section}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} max={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {students.length > 0 && (
            <div className="flex items-end gap-2">
              <button onClick={() => markAll('present')} className="flex-1 py-2 text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-100 font-medium">All Present</button>
              <button onClick={() => markAll('absent')} className="flex-1 py-2 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-medium">All Absent</button>
            </div>
          )}
        </div>
      </div>

      {students.length > 0 && (
        <>
          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <span className="text-gray-500">Total: <strong>{students.length}</strong></span>
            <span className="text-emerald-600">Present: <strong>{presentCount}</strong></span>
            <span className="text-red-500">Absent: <strong>{absentCount}</strong></span>
            <span className="text-amber-600">Late: <strong>{students.filter(s => s.status === 'late').length}</strong></span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Roll No</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Student Name</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium text-xs uppercase">Status</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Remarks</th>
              </tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.student_id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">{s.roll_number}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{s.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {['present', 'absent', 'late'].map(st => statusBtn(s.student_id, st, s.status))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input value={s.remarks} onChange={e => setStudents(prev => prev.map(st => st.student_id === s.student_id ? { ...st, remarks: e.target.value } : st))}
                        placeholder="Optional remark" className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <button onClick={handleSave} disabled={saving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} disabled:opacity-60`}>
              <Save size={16} />
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Attendance'}
            </button>
          </div>
        </>
      )}

      {!loading && students.length === 0 && selectedSubject && (
        <div className="text-center py-16 text-gray-400 text-sm">No students found in this class</div>
      )}
    </div>
  );
}
