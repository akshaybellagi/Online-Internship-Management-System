'use client';
import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Badge from '@/components/Badge';
import { Briefcase, Plus, Edit, Trash2, MapPin, Calendar, DollarSign, Users } from 'lucide-react';

interface Internship {
  id: number;
  title: string;
  description: string;
  company_name: string;
  category: string;
  duration_weeks: number;
  start_date: string;
  end_date: string;
  stipend: number;
  currency: string;
  location: string;
  is_remote: boolean;
  requirements: string;
  responsibilities: string;
  learning_outcomes: string;
  max_students: number;
  status: string;
  application_count: number;
}

interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  type: string;
  external_url: string;
  is_mandatory: boolean;
}

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_name: '',
    category: '',
    duration_weeks: 12,
    start_date: '',
    end_date: '',
    stipend: 0,
    location: '',
    is_remote: false,
    requirements: '',
    responsibilities: '',
    learning_outcomes: '',
    max_students: 20,
    status: 'active'
  });

  useEffect(() => {
    fetchInternships();
  }, [statusFilter]);

  const fetchInternships = async () => {
    try {
      const res = await fetch(`/api/admin/internships?status=${statusFilter}`);
      const data = await res.json();
      setInternships(data);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/admin/internships';
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId 
        ? { ...formData, id: editingId, materials } 
        : { ...formData, materials };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setShowModal(false);
        resetForm();
        fetchInternships();
        alert('Internship saved successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save internship');
      }
    } catch (error) {
      console.error('Error saving internship:', error);
      alert('Failed to save internship');
    }
  };

  const addMaterial = () => {
    const newMaterial: LearningMaterial = {
      id: Date.now().toString(),
      title: '',
      description: '',
      type: 'video',
      external_url: '',
      is_mandatory: false
    };
    setMaterials([...materials, newMaterial]);
  };

  const updateMaterial = (id: string, field: keyof LearningMaterial, value: any) => {
    setMaterials(materials.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const handleEdit = async (internship: Internship) => {
    setEditingId(internship.id);
    
    // Format dates for date input (YYYY-MM-DD)
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return '';
      // Extract just the date part (YYYY-MM-DD) from datetime string
      return dateString.split('T')[0].split(' ')[0];
    };
    
    setFormData({
      title: internship.title,
      description: internship.description,
      company_name: internship.company_name,
      category: internship.category,
      duration_weeks: internship.duration_weeks,
      start_date: formatDateForInput(internship.start_date),
      end_date: formatDateForInput(internship.end_date),
      stipend: internship.stipend,
      location: internship.location,
      is_remote: internship.is_remote,
      requirements: typeof internship.requirements === 'string' ? internship.requirements : JSON.stringify(internship.requirements),
      responsibilities: internship.responsibilities,
      learning_outcomes: internship.learning_outcomes,
      max_students: internship.max_students,
      status: internship.status
    });
    
    // Fetch existing materials for this internship (admin endpoint)
    try {
      const res = await fetch(`/api/admin/internships/materials?internship_id=${internship.id}`);
      if (res.ok) {
        const existingMaterials = await res.json();
        // Convert to the format used in the form
        const formattedMaterials = existingMaterials.map((m: any) => ({
          id: m.id.toString(),
          title: m.title,
          description: m.description || '',
          type: m.type,
          external_url: m.external_url || '',
          is_mandatory: m.is_mandatory
        }));
        setMaterials(formattedMaterials);
      } else {
        console.error('Failed to fetch materials');
        setMaterials([]);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMaterials([]);
    }
    
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this internship?')) return;
    try {
      await fetch(`/api/admin/internships?id=${id}`, { method: 'DELETE' });
      fetchInternships();
    } catch (error) {
      console.error('Error deleting internship:', error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setMaterials([]);
    setFormData({
      title: '',
      description: '',
      company_name: '',
      category: '',
      duration_weeks: 12,
      start_date: '',
      end_date: '',
      stipend: 0,
      location: '',
      is_remote: false,
      requirements: '',
      responsibilities: '',
      learning_outcomes: '',
      max_students: 20,
      status: 'active'
    });
  };

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    closed: 'bg-red-100 text-red-700 border-red-200',
    completed: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  return (
    <div>
      <PageHeader
        title="Manage Internships"
        subtitle="Create and manage internship opportunities"
      />

      {/* Filters and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {['all', 'active', 'draft', 'closed', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
        >
          <Plus size={18} />
          Add Internship
        </button>
      </div>

      {/* Internships Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : internships.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No internships found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {internships.map(internship => (
            <div key={internship.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{internship.title}</h3>
                  <p className="text-sm text-gray-600">{internship.company_name}</p>
                </div>
                <Badge text={internship.status} className={statusColors[internship.status]} />
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{internship.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} />
                  {internship.is_remote ? 'Remote' : internship.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  {internship.duration_weeks} weeks
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign size={14} />
                  {internship.currency} {internship.stipend.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={14} />
                  {internship.application_count || 0} applications
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(internship)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all text-sm font-medium"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(internship.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-sm font-medium"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingId ? 'Edit Internship' : 'Add New Internship'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Web Development"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (weeks) *</label>
              <input
                type="number"
                required
                value={formData.duration_weeks || ''}
                onChange={e => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) || 12 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stipend</label>
              <input
                type="number"
                value={formData.stipend || ''}
                onChange={e => setFormData({ ...formData, stipend: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label>
              <input
                type="number"
                value={formData.max_students || ''}
                onChange={e => setFormData({ ...formData, max_students: parseInt(e.target.value) || 20 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_remote}
                  onChange={e => setFormData({ ...formData, is_remote: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Remote Internship</span>
              </label>
            </div>
          </div>

          {/* Learning Materials Section */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Learning Materials</h3>
              <button
                type="button"
                onClick={addMaterial}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-all"
              >
                <Plus size={16} />
                Add Material
              </button>
            </div>

            {materials.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-600 text-sm">No learning materials added yet</p>
                <p className="text-gray-500 text-xs mt-1">Click "Add Material" to add resources for students</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {materials.map((material, index) => (
                  <div key={material.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-700">Material {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeMaterial(material.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                        <input
                          type="text"
                          required
                          value={material.title}
                          onChange={e => updateMaterial(material.id, 'title', e.target.value)}
                          placeholder="e.g., Introduction to React"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={material.description}
                          onChange={e => updateMaterial(material.id, 'description', e.target.value)}
                          placeholder="Brief description of the material..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Type *</label>
                          <select
                            required
                            value={material.type}
                            onChange={e => updateMaterial(material.id, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="video">Video</option>
                            <option value="document">Document</option>
                            <option value="link">Link</option>
                            <option value="presentation">Presentation</option>
                            <option value="code">Code</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">URL *</label>
                          <input
                            type="url"
                            required
                            value={material.external_url}
                            onChange={e => updateMaterial(material.id, 'external_url', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={material.is_mandatory}
                            onChange={e => updateMaterial(material.id, 'is_mandatory', e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="text-xs text-gray-700">Mandatory material</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {materials.length > 0 && (
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-sm text-indigo-700">
                  <strong>{materials.length}</strong> learning material{materials.length !== 1 ? 's' : ''} added
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
            >
              {editingId ? 'Update' : 'Create'} Internship
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
