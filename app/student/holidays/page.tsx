'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Umbrella } from 'lucide-react';

interface Holiday { id: number; title: string; date: string; description: string; type: string; }

const typeColors: Record<string, string> = {
  national: 'bg-red-100 text-red-700',
  regional: 'bg-orange-100 text-orange-700',
  school: 'bg-blue-100 text-blue-700',
};

export default function StudentHolidaysPage() {
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
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Upcoming Holidays</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map(h => (
              <div key={h.id} className="bg-white border border-amber-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                    <span className="text-xs font-medium">{new Date(h.date).toLocaleDateString('en', { month: 'short' })}</span>
                    <span className="text-xl font-bold leading-none">{new Date(h.date).getDate()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{h.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{new Date(h.date).toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeColors[h.type] || 'bg-gray-100 text-gray-600'}`}>{h.type}</span>
                  </div>
                </div>
                {h.description && <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">{h.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Past Holidays</h2>
          <div className="space-y-2">
            {past.map(h => (
              <div key={h.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 opacity-60">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gray-500">{new Date(h.date).toLocaleDateString('en', { month: 'short' })}</span>
                  <span className="text-sm font-bold text-gray-600">{new Date(h.date).getDate()}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{h.title}</p>
                  {h.description && <p className="text-xs text-gray-400">{h.description}</p>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeColors[h.type] || 'bg-gray-100 text-gray-600'}`}>{h.type}</span>
              </div>
            ))}
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
