import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');
  if (session.role !== 'teacher') redirect(`/${session.role}`);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="teacher" userName={session.name} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar role="teacher" userName={session.name} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
