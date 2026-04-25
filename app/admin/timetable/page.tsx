'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface TimetableEntry {
  id: number; class_id: number; subject_id: number; teacher_id: number;
  class_name: string; section: string; subject_name: string;
  teacher_name: string; day_of_week: string; start_time: string; end_time: string; room: string;
}
interface SelectItem { id: number; name: string; section?: string; code?: string; teacher_id?: number; }

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const empty = { class_id: '', subject_id: '', teacher_id: '', day_of_week: 'Monday', start_time: '', end_time: '', room: '' };

export default function TimetablePage() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [classes, setClasses] = useState<SelectItem[]>([]);
  const [subjects, setSubjects] = useState<SelectItem[]>([]);
  const [teachers, setTeachers] = useState<SelectItem[]>([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<TimetableEntry | null>(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [t, c, s, te] = await Promise.all([
      fetch('/api/admin/timetable').then(r => r.json()),
      fetch('/api/admin/classes').then(r => r.json()),
      fetch('/api/admin/subjects').then(r => r.json()),
      fetch('/api/admin/teachers').then(r => r.json()),
    ]);
    setEntries(t); setClasses(c); setSubjects(s); setTeachers(te);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ ...empty, day_of_week: selectedDay }); setModal(true); };
  const openEdit = (e: TimetableEntry) => {
    setEditing(e);
    setForm({ class_id: String(e.class_id), subject_id: String(e.subject_id), teacher_id: String(e.teacher_id), day_of_week: e.day_of_week, start_time: e.start_time, end_time: e.end_time, room: e.room || '' });
    setModal(true);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setLoading(true);
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing.id } : form;
    await fetch('/api/admin/timetable', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setLoading(false); setModal(false); load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this entry?')) return;
    await fetch('/api/admin/timetable', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  const dayEntries = entries.filter(e => e.day_of_week === selectedDay);

  return (
    <div>
      <PageHeader title="Manage Timetable" subtitle="Schedule classes for each day"
        action={<button onClick={openAdd} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"><Plus size={16} />Add Entry</button>}
      />

      {/* Day tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {DAYS.map(day => (
          <button key={day} onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedDay === day ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {day}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {dayEntries.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No classes scheduled for {selectedDay}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100">
                {['Time', 'Subject', 'Class', 'Teacher', 'Room', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {dayEntries.map(e => (
                  <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded">
                        {e.start_time} – {e.end_time}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">{e.subject_name}</td>
                    <td className="py-3 px-4 text-gray-600">{e.class_name} {e.section}</td>
                    <td className="py-3 px-4 text-gray-600">{e.teacher_name}</td>
                    <td className="py-3 px-4 text-gray-500">{e.room || '—'}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-teal-50 text-teal-600"><Pencil size={13} /></button>
                        <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Timetable Entry' : 'Add Timetable Entry'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
              <select required value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">Select class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <select required value={form.subject_id} onChange={e => setForm({ ...form, subject_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">Select subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Teacher *</label>
              <select required value={form.teacher_id} onChange={e => setForm({ ...form, teacher_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">Select teacher</option>
                {teachers.map(t => <option key={t.id} value={t.teacher_id ?? t.id}>{t.name}</option>)}
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Day *</label>
              <select required value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
              <input required type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
              <input required type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
              <input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="e.g. Room 101" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:opacity-60">{loading ? 'Saving...' : editing ? 'Update' : 'Add Entry'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
