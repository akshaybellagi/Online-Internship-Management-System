'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Badge from '@/components/Badge';
import { Plus, Pencil, Trash2, Search, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface Teacher {
  id: number; name: string; email: string; phone: string;
  employee_id: string; department: string; is_active: number; created_at: string;
}
interface Subject { id: number; name: string; code: string; }
interface ClassItem { id: number; name: string; section: string; }
interface Assignment { subject_id: number; class_id: number; }

const empty = { name: '', email: '', phone: '', password: '', employee_id: '', department: '', joining_date: '' };

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState(empty);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [expandedSubject, setExpandedSubject] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    const [t, s, c] = await Promise.all([
      fetch('/api/admin/teachers').then(r => r.json()),
      fetch('/api/admin/subjects').then(r => r.json()),
      fetch('/api/admin/classes').then(r => r.json()),
    ]);
    setTeachers(t); setSubjects(s); setClasses(c);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setAssignments([]);
    setExpandedSubject(null);
    setError('');
    setModal(true);
  };

  const openEdit = async (t: Teacher) => {
    setEditing(t);
    setForm({ name: t.name, email: t.email, phone: t.phone || '', password: '', employee_id: t.employee_id, department: t.department || '', joining_date: '' });
    setExpandedSubject(null);
    setError('');
    // Load existing assignments
    const existing = await fetch(`/api/admin/teacher-assignments?user_id=${t.id}`).then(r => r.json());
    setAssignments(existing);
    setModal(true);
  };

  // Toggle a subject+class checkbox
  const toggleAssignment = (subject_id: number, class_id: number) => {
    setAssignments(prev => {
      const exists = prev.some(a => a.subject_id === subject_id && a.class_id === class_id);
      if (exists) return prev.filter(a => !(a.subject_id === subject_id && a.class_id === class_id));
      return [...prev, { subject_id, class_id }];
    });
  };

  const isAssigned = (subject_id: number, class_id: number) =>
    assignments.some(a => a.subject_id === subject_id && a.class_id === class_id);

  // Select all classes for a subject
  const toggleAllClassesForSubject = (subject_id: number) => {
    const allAssigned = classes.every(c => isAssigned(subject_id, c.id));
    if (allAssigned) {
      setAssignments(prev => prev.filter(a => a.subject_id !== subject_id));
    } else {
      const newOnes = classes
        .filter(c => !isAssigned(subject_id, c.id))
        .map(c => ({ subject_id, class_id: c.id }));
      setAssignments(prev => [...prev, ...newOnes]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    const method = editing ? 'PUT' : 'POST';
    const body = editing
      ? { ...form, id: editing.id, is_active: editing.is_active, assignments }
      : { ...form, assignments };

    const res = await fetch('/api/admin/teachers', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || 'Error'); return; }
    setModal(false); load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this teacher?')) return;
    await fetch('/api/admin/teachers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.employee_id?.includes(search) ||
    t.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Manage Teachers"
        subtitle={`${teachers.length} teachers registered`}
        action={
          <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> Add Teacher
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Employee ID', 'Name', 'Email', 'Phone', 'Department', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No teachers found</td></tr>
              ) : filtered.map(t => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs text-gray-600">{t.employee_id}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{t.name}</td>
                  <td className="py-3 px-4 text-gray-600">{t.email}</td>
                  <td className="py-3 px-4 text-gray-600">{t.phone || '—'}</td>
                  <td className="py-3 px-4 text-gray-600">{t.department || '—'}</td>
                  <td className="py-3 px-4"><Badge label={t.is_active ? 'Active' : 'Inactive'} variant={t.is_active ? 'success' : 'danger'} /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Teacher' : 'Add Teacher'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

          {/* Basic info */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Basic Information</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                <input required value={form.employee_id} onChange={e => setForm({ ...form, employee_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" placeholder="Default: teacher123" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                <input type="date" value={form.joining_date} onChange={e => setForm({ ...form, joining_date: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Subject + Class assignments */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <BookOpen size={13} /> Subject & Class Assignments
              </p>
              {assignments.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {assignments.length} assigned
                </span>
              )}
            </div>

            {subjects.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-lg">
                No subjects found. Add subjects first.
              </p>
            ) : classes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-lg">
                No classes found. Add classes first.
              </p>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                {subjects.map(sub => {
                  const assignedCount = classes.filter(c => isAssigned(sub.id, c.id)).length;
                  const allSelected = classes.length > 0 && classes.every(c => isAssigned(sub.id, c.id));
                  const isExpanded = expandedSubject === sub.id;

                  return (
                    <div key={sub.id} className="bg-white">
                      {/* Subject header row */}
                      <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedSubject(isExpanded ? null : sub.id)}
                      >
                        <div className="flex items-center gap-3">
                          {/* Select-all checkbox for this subject */}
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={e => { e.stopPropagation(); toggleAllClassesForSubject(sub.id); }}
                            onClick={e => e.stopPropagation()}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{sub.name}</p>
                            <p className="text-xs text-gray-400 font-mono">{sub.code}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {assignedCount > 0 && (
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                              {assignedCount} class{assignedCount > 1 ? 'es' : ''}
                            </span>
                          )}
                          {isExpanded ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                        </div>
                      </div>

                      {/* Classes checkboxes — expanded */}
                      {isExpanded && (
                        <div className="px-4 pb-3 bg-blue-50/40">
                          <p className="text-xs text-gray-500 mb-2 pt-1">Select classes for <strong>{sub.name}</strong>:</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {classes.map(cls => (
                              <label
                                key={cls.id}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm ${
                                  isAssigned(sub.id, cls.id)
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isAssigned(sub.id, cls.id)}
                                  onChange={() => toggleAssignment(sub.id, cls.id)}
                                  className="sr-only"
                                />
                                <span className="font-medium truncate">
                                  {cls.name}{cls.section ? ` ${cls.section}` : ''}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={() => setModal(false)}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60">
              {loading ? 'Saving...' : editing ? 'Update Teacher' : 'Add Teacher'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
