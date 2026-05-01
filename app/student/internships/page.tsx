'use client';
import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Badge from '@/components/Badge';
import { Briefcase, MapPin, Calendar, DollarSign, Search, Send } from 'lucide-react';

interface Internship {
  id: number;
  title: string;
  description: string;
  company_name: string;
  category: string;
  duration_weeks: number;
  stipend: number;
  currency: string;
  location: string;
  is_remote: boolean;
  requirements: string[];
  max_students: number;
  application_count: number;
  has_applied: boolean;
  application_status?: string;
}

export default function BrowseInternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchInternships();
  }, [search]);

  const fetchInternships = async () => {
    try {
      const url = search 
        ? `/api/student/internships?search=${encodeURIComponent(search)}`
        : '/api/student/internships';
      const res = await fetch(url);
      const data = await res.json();
      setInternships(data);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedInternship) return;
    
    setApplying(true);
    try {
      const res = await fetch('/api/student/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internship_id: selectedInternship.id,
          cover_letter: coverLetter
        })
      });

      if (res.ok) {
        setShowModal(false);
        setCoverLetter('');
        fetchInternships();
        alert('Application submitted successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error applying:', error);
      alert('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div>
      <PageHeader
        title="Browse Internships"
        subtitle="Find and apply for internship opportunities"
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search internships..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
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
                  {internship.category && (
                    <span className="inline-block mt-2 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                      {internship.category}
                    </span>
                  )}
                </div>
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
                <div className="text-sm text-gray-600">
                  {internship.application_count} applications
                </div>
              </div>

              {internship.has_applied ? (
                <div className="flex items-center justify-center gap-2 py-2">
                  <Badge 
                    text={`Applied - ${internship.application_status}`} 
                    className={statusColors[internship.application_status || 'pending']} 
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedInternship(internship);
                    setShowModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                >
                  <Send size={16} />
                  Apply Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setCoverLetter('');
          setSelectedInternship(null);
        }}
        title="Apply for Internship"
      >
        {selectedInternship && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">{selectedInternship.title}</h3>
              <p className="text-sm text-gray-600">{selectedInternship.company_name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                rows={6}
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                placeholder="Tell us why you're interested in this internship..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setCoverLetter('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-60"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
