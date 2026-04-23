'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import { Plus, Pencil, Trash2, School, Users } from 'lucide-react';

interface ClassItem {
  id: number;
  name: string;
  section: string;
  academic_year: string;
  student_count: number;
}

const empty = { name: '', section: '', academic_year: '' };

const sectionColors = [
  'bg-violet-50 border-violet-200 text-violet-700',
  'bg-blue-50 border-blue-200 text-blue-700',
  'bg-teal-50 border-teal-200 text-teal-700',
  'bg-emerald-50 border-emerald-200 text-emerald-700',
  'bg-amber-50 border-amber-200 text-amber-700',
  'bg-rose-50 border-rose-200 text-rose-700',
];

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<ClassItem | null>(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const load = async () => {
    const data = await fetch('/api/admin/classes').then(r => r.json());
    setClasses(data);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setError('');
    setModal(true);
  };

  const openEdit = (c: ClassItem) => {
    setEditing(c);
    setForm({ name: c.name, section: c.section || '', academic_year: c.academic_year || '' });
    setError('');
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing.id } : form;

    const res = await fetch('/api/admin/classes', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error || 'Something went wrong'); return; }
    setModal(false);
    load();
  };

  const handleDelete = async (id: number) => {
    setDeleteError('');
    if (!confirm('Delete this class?')) return;
    const res = await fetch('/api/admin/classes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) { setDeleteError(data.error); return; }
    load();
  };

  // Group classes by name
  const grouped = classes.reduce<Record<string, ClassItem[]>>((acc, c) => {
    if (!acc[c.name]) acc[c.name] = [];
    acc[c.name].push(c);
    return acc;
  }, {});

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    `${currentYear - 1}-${String(currentYear).slice(2)}`,
    `${currentYear}-${String(currentYear + 1).slice(2)}`,
    `${currentYear + 1}-${String(currentYear + 2).slice(2)}`,
  ];

  return (
    <div>
      <PageHeader
        title="Manage Classes"
        subtitle={`${classes.length} class sections configured`}
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Add Class
          </button>
        }
      />

      {deleteError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {deleteError}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
            <School size={18} className="text-violet-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{Object.keys(grouped).length}</p>
            <p className="text-xs text-gray-500">Unique Classes</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <School size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{classes.length}</p>
            <p className="text-xs text-gray-500">Total Sections</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Users size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {classes.reduce((a, c) => a + (c.student_count || 0), 0)}
            </p>
            <p className="text-xs text-gray-500">Total Students</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Users size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {classes.length > 0 ? Math.round(classes.reduce((a, c) => a + (c.student_count || 0), 0) / classes.length) : 0}
            </p>
            <p className="text-xs text-gray-500">Avg per Section</p>
          </div>
        </div>
      </div>

      {/* Grouped class cards */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <School size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm">No classes added yet</p>
          <button onClick={openAdd} className="mt-4 text-violet-600 text-sm hover:underline">
            Add your first class
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([className, sections]) => (
            <div key={className}>
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                <School size={14} /> {className}
                <span className="text-gray-400 font-normal normal-case">({sections.length} section{sections.length > 1 ? 's' : ''})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sections.map((c, i) => (
                  <div key={c.id} className={`border rounded-xl p-5 hover:shadow-md transition-shadow ${sectionColors[i % sectionColors.length]}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{c.name}</h3>
                        {c.section && (
                          <span className="text-xs font-medium bg-white/60 px-2 py-0.5 rounded-full">
                            Section {c.section}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-1.5 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 rounded-lg bg-white/50 hover:bg-red-100 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-current/10">
                      <div className="flex items-center gap-1.5">
                        <Users size={13} className="opacity-60" />
                        <span className="text-sm font-medium">{c.student_count || 0} students</span>
                      </div>
                      {c.academic_year && (
                        <span className="text-xs opacity-60">{c.academic_year}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table view */}
      {classes.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">All Classes — Table View</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['#', 'Class Name', 'Section', 'Academic Year', 'Students', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classes.map((c, i) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-400 text-xs">{i + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{c.name}</td>
                    <td className="py-3 px-4">
                      {c.section ? (
                        <span className="bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          Section {c.section}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{c.academic_year || '—'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Users size={13} className="text-gray-400" />
                        <span className="text-gray-700 font-medium">{c.student_count || 0}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-violet-50 text-violet-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Class' : 'Add New Class'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-100 p-3 rounded-lg">{error}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Class 10, Grade 5, Year 2"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {['A', 'B', 'C', 'D', 'E'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, section: s })}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-colors ${
                    form.section === s
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-violet-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <input
              value={form.section}
              onChange={e => setForm({ ...form, section: e.target.value })}
              placeholder="Or type custom section"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {yearOptions.map(y => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setForm({ ...form, academic_year: y })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    form.academic_year === y
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-violet-400'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
            <input
              value={form.academic_year}
              onChange={e => setForm({ ...form, academic_year: e.target.value })}
              placeholder="e.g. 2024-25"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Preview */}
          {form.name && (
            <div className="bg-violet-50 border border-violet-100 rounded-lg p-3">
              <p className="text-xs text-violet-500 font-medium mb-1">Preview</p>
              <p className="text-sm font-semibold text-violet-800">
                {form.name}{form.section ? ` — Section ${form.section}` : ''}{form.academic_year ? ` (${form.academic_year})` : ''}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModal(false)}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-60 transition-colors"
            >
              {loading ? 'Saving...' : editing ? 'Update Class' : 'Add Class'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
