'use client';
import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import Badge from '@/components/Badge';
import { FileCheck, MapPin, Calendar, DollarSign, XCircle } from 'lucide-react';

interface Application {
  id: number;
  internship_id: number;
  internship_title: string;
  company_name: string;
  category: string;
  duration_weeks: number;
  stipend: number;
  location: string;
  is_remote: boolean;
  cover_letter: string;
  status: string;
  applied_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      const url = statusFilter === 'all' 
        ? '/api/student/applications'
        : `/api/student/applications?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id: number) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    
    try {
      const res = await fetch(`/api/student/applications?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error('Error withdrawing application:', error);
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
        title="My Applications"
        subtitle="Track your internship applications"
      />

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'approved', 'rejected'].map(status => (
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
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{app.internship_title}</h3>
                  <p className="text-sm text-gray-600">{app.company_name}</p>
                  {app.category && (
                    <span className="inline-block mt-2 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                      {app.category}
                    </span>
                  )}
                </div>
                <Badge text={app.status} className={statusColors[app.status]} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} />
                  {app.is_remote ? 'Remote' : app.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  {app.duration_weeks} weeks
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign size={14} />
                  ₹{app.stipend.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Applied {new Date(app.applied_at).toLocaleDateString()}
                </div>
              </div>

              {app.cover_letter && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-1">Cover Letter</p>
                  <p className="text-sm text-gray-600">{app.cover_letter}</p>
                </div>
              )}

              {app.review_notes && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-medium text-blue-700 mb-1">Review Notes</p>
                  <p className="text-sm text-blue-600">{app.review_notes}</p>
                </div>
              )}

              {app.status === 'pending' && (
                <button
                  onClick={() => handleWithdraw(app.id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium"
                >
                  <XCircle size={16} />
                  Withdraw Application
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
