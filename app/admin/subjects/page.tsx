'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Badge from '@/components/Badge';
import { Plus, Pencil, Trash2, Search, BookOpen } from 'lucide-react';

interface Subject { id: number; name: string; code: string; description: string; credits: number; is_active: number; }
const empty = { name: '', code: '', description: '', credits: '3' };

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => { const data = await fetch('/api/admin/subjects').then(r => r.json()); setSubjects(data); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setError(''); setModal(true); };
  const openEdit = (s: Subject) => {
    setEditing(s);
    setForm({ name: s.name, code: s.code, description: s.description || '', credits: String(s.credits) });
    setError(''); setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing.id, is_active: editing.is_active, credits: Number(form.credits) } : { ...form, credits: Number(form.credits) };
    const res = await fetch('/api/admin/subjects', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || 'Error'); return; }
    setModal(false); load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this subject?')) return;
    await fetch('/api/admin/subjects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader title="Manage Subjects" subtitle={`${subjects.length} subjects configured`}
        action={<button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"><Plus size={16} />Add Subject</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {subjects.slice(0, 3).map(s => (
          <div key={s.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"><BookOpen size={18} className="text-indigo-600" /></div>
              <div><p className="font-semibold text-gray-800 text-sm">{s.name}</p><p className="text-xs text-gray-500">{s.code}</p></div>
            </div>
            <p className="text-xs text-gray-500">{s.credits} credits</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subjects..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              {['Code', 'Name', 'Description', 'Credits', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No subjects found</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs font-medium text-indigo-600 bg-indigo-50 rounded">{s.code}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{s.name}</td>
                  <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{s.description || '—'}</td>
                  <td className="py-3 px-4 text-gray-600">{s.credits}</td>
                  <td className="py-3 px-4"><Badge label={s.is_active ? 'Active' : 'Inactive'} variant={s.is_active ? 'success' : 'danger'} /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Subject' : 'Add Subject'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject Name *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject Code *</label>
              <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
              <input type="number" min="1" max="10" value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-60">{loading ? 'Saving...' : editing ? 'Update' : 'Add Subject'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
