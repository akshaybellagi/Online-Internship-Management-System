'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import { Plus, Pencil, Trash2, Umbrella } from 'lucide-react';

interface Holiday { id: number; title: string; date: string; description: string; type: string; }
const empty = { title: '', date: '', description: '', type: 'school' };
const typeColors: Record<string, string> = {
  national: 'bg-red-100 text-red-700',
  regional: 'bg-orange-100 text-orange-700',
  school: 'bg-blue-100 text-blue-700',
};

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Holiday | null>(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  const load = async () => { const data = await fetch('/api/admin/holidays').then(r => r.json()); setHolidays(data); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (h: Holiday) => { setEditing(h); setForm({ title: h.title, date: h.date?.split('T')[0], description: h.description || '', type: h.type }); setModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing.id } : form;
    await fetch('/api/admin/holidays', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setLoading(false); setModal(false); load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this holiday?')) return;
    await fetch('/api/admin/holidays', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  const upcoming = holidays.filter(h => new Date(h.date) >= new Date());
  const past = holidays.filter(h => new Date(h.date) < new Date());

  return (
    <div>
      <PageHeader title="Manage Holidays" subtitle={`${holidays.length} holidays this year`}
        action={<button onClick={openAdd} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"><Plus size={16} />Add Holiday</button>}
      />

      {upcoming.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Upcoming</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map(h => (
              <div key={h.id} className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-xs text-amber-600 font-medium">{new Date(h.date).toLocaleDateString('en', { month: 'short' })}</span>
                      <span className="text-lg font-bold text-amber-700">{new Date(h.date).getDate()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{h.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeColors[h.type] || 'bg-gray-100 text-gray-600'}`}>{h.type}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(h)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600"><Pencil size={13} /></button>
                    <button onClick={() => handleDelete(h.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                  </div>
                </div>
                {h.description && <p className="text-xs text-gray-500 mt-2">{h.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Past Holidays</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100">
                {['Date', 'Title', 'Type', 'Description', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {past.map(h => (
                  <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50 opacity-70">
                    <td className="py-3 px-4 text-gray-600">{new Date(h.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-medium text-gray-700">{h.title}</td>
                    <td className="py-3 px-4"><span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeColors[h.type] || 'bg-gray-100 text-gray-600'}`}>{h.type}</span></td>
                    <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{h.description || '—'}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(h)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600"><Pencil size={13} /></button>
                        <button onClick={() => handleDelete(h.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {holidays.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Umbrella size={48} className="mx-auto mb-4 opacity-30" />
          <p>No holidays added yet</p>
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Holiday' : 'Add Holiday'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="school">School</option>
                <option value="national">National</option>
                <option value="regional">Regional</option>
              </select></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg disabled:opacity-60">{loading ? 'Saving...' : editing ? 'Update' : 'Add Holiday'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
