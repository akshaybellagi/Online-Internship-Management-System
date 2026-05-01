'use client';
import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Badge from '@/components/Badge';
import { FileCheck, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Application {
  id: number;
  internship_id: number;
  internship_title: string;
  student_id: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  student_roll_number: string;
  cover_letter: string;
  status: string;
  applied_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`/api/admin/applications?status=${statusFilter}`);
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, review_notes: reviewNotes })
      });

      if (res.ok) {
        setShowModal(false);
        setSelectedApp(null);
        setReviewNotes('');
        fetchApplications();
      }
    } catch (error) {
      console.error('Error reviewing application:', error);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    withdrawn: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <div>
      <PageHeader
        title="Review Applications"
        subtitle="Approve or reject student applications"
      />

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['pending', 'approved', 'rejected', 'all'].map(status => (
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

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FileCheck size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No applications found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Internship</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Applied</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{app.student_name}</p>
                      <p className="text-sm text-gray-500">{app.student_email}</p>
                      <p className="text-xs text-gray-400">{app.student_roll_number}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{app.internship_title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge text={app.status} className={statusColors[app.status]} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setReviewNotes(app.review_notes || '');
                          setShowModal(true);
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setShowModal(true);
                            }}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setShowModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedApp(null);
          setReviewNotes('');
        }}
        title="Application Details"
      >
        {selectedApp && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Student</h3>
              <p className="text-gray-900">{selectedApp.student_name}</p>
              <p className="text-sm text-gray-600">{selectedApp.student_email}</p>
              <p className="text-sm text-gray-600">{selectedApp.student_phone}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Internship</h3>
              <p className="text-gray-900">{selectedApp.internship_title}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Cover Letter</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {selectedApp.cover_letter || 'No cover letter provided'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Applied On</h3>
              <p className="text-sm text-gray-600">
                {new Date(selectedApp.applied_at).toLocaleString()}
              </p>
            </div>

            {selectedApp.status !== 'pending' && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Review Status</h3>
                <Badge text={selectedApp.status} className={statusColors[selectedApp.status]} />
                {selectedApp.review_notes && (
                  <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg">
                    {selectedApp.review_notes}
                  </p>
                )}
              </div>
            )}

            {selectedApp.status === 'pending' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={reviewNotes}
                    onChange={e => setReviewNotes(e.target.value)}
                    placeholder="Add notes about your decision..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleReview(selectedApp.id, 'rejected')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                  <button
                    onClick={() => handleReview(selectedApp.id, 'approved')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
