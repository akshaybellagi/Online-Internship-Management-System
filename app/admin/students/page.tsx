'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Badge from '@/components/Badge';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

interface Student {
  id: number; name: string; email: string; phone: string;
  roll_number: string; class_name: string; section: string;
  is_active: number; created_at: string;
}
interface ClassItem { id: number; name: string; section: string; }

const empty = { name: '', email: '', phone: '', password: '', roll_number: '', class_id: '', admission_date: '' };

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    const [s, c] = await Promise.all([fetch('/api/admin/students').then(r => r.json()), fetch('/api/admin/classes').then(r => r.json())]);
    setStudents(s); setClasses(c);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setError(''); setModal(true); };
  const openEdit = (s: Student) => {
    setEditing(s);
    setForm({ name: s.name, email: s.email, phone: s.phone || '', password: '', roll_number: s.roll_number, class_id: '', admission_date: '' });
    setError(''); setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing.id, is_active: editing.is_active } : form;
    const res = await fetch('/api/admin/students', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || 'Error'); return; }
    setModal(false); load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this student?')) return;
    await fetch('/api/admin/students', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.roll_number?.includes(search) || s.email.includes(search));

  return (
    <div>
      <PageHeader title="Manage Students" subtitle={`${students.length} students enrolled`}
        action={<button onClick={openAdd} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"><Plus size={16} />Add Student</button>}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              {['Roll No', 'Name', 'Email', 'Phone', 'Class', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No students found</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs text-gray-600">{s.roll_number}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{s.name}</td>
                  <td className="py-3 px-4 text-gray-600">{s.email}</td>
                  <td className="py-3 px-4 text-gray-600">{s.phone || '—'}</td>
                  <td className="py-3 px-4 text-gray-600">{s.class_name || '—'}</td>
                  <td className="py-3 px-4"><Badge label={s.is_active ? 'Active' : 'Inactive'} variant={s.is_active ? 'success' : 'danger'} /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-violet-50 text-violet-600"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Roll Number *</label>
              <input required value={form.roll_number} onChange={e => setForm({ ...form, roll_number: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" /></div>
            {!editing && <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" placeholder="Default: student123" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" /></div>}
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Class & Section</label>
              <select value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="">Select class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.section ? ` — Section ${c.section}` : ''}
                  </option>
                ))}
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
              <input type="date" value={form.admission_date} onChange={e => setForm({ ...form, admission_date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-60">{loading ? 'Saving...' : editing ? 'Update' : 'Add Student'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
