'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Umbrella } from 'lucide-react';

interface Holiday { id: number; title: string; date: string; description: string; type: string; }

const typeColors: Record<string, string> = {
  national: 'bg-red-100 text-red-700 border-red-200',
  regional: 'bg-orange-100 text-orange-700 border-orange-200',
  school: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function TeacherHolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    fetch('/api/admin/holidays').then(r => r.json()).then(setHolidays);
  }, []);

  const upcoming = holidays.filter(h => new Date(h.date) >= new Date());
  const past = holidays.filter(h => new Date(h.date) < new Date());

  return (
    <div>
      <PageHeader title="Holiday List" subtitle={`${upcoming.length} upcoming holidays`} />

      {upcoming.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Upcoming</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map(h => (
              <div key={h.id} className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-amber-600 font-medium">{new Date(h.date).toLocaleDateString('en', { month: 'short' })}</span>
                    <span className="text-lg font-bold text-amber-700">{new Date(h.date).getDate()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{h.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize border ${typeColors[h.type] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>{h.type}</span>
                  </div>
                </div>
                {h.description && <p className="text-xs text-gray-500">{h.description}</p>}
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
                {['Date', 'Title', 'Type', 'Description'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {past.map(h => (
                  <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50 opacity-70">
                    <td className="py-3 px-4 text-gray-600">{new Date(h.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-medium text-gray-700">{h.title}</td>
                    <td className="py-3 px-4"><span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize border ${typeColors[h.type] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>{h.type}</span></td>
                    <td className="py-3 px-4 text-gray-500">{h.description || '—'}</td>
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
          <p>No holidays scheduled</p>
        </div>
      )}
    </div>
  );
}
