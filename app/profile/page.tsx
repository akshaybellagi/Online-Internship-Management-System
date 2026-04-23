'use client';
import { useEffect, useState } from 'react';
import { UserCircle, Save, Lock } from 'lucide-react';

interface UserProfile { id: number; name: string; email: string; phone: string; role: string; created_at: string; }

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [msg, setMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(data => {
      setProfile(data); setForm({ name: data.name, phone: data.phone || '' });
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg('');
    const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    setMsg(res.ok ? 'Profile updated successfully!' : 'Failed to update profile');
  };

  const handlePwSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwMsg('Passwords do not match'); return; }
    setSavingPw(true); setPwMsg('');
    const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, ...pwForm }) });
    const data = await res.json();
    setSavingPw(false);
    setPwMsg(res.ok ? 'Password changed successfully!' : data.error || 'Failed to change password');
    if (res.ok) setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const roleColors = { admin: 'bg-violet-100 text-violet-700', teacher: 'bg-blue-100 text-blue-700', student: 'bg-emerald-100 text-emerald-700' };

  if (!profile) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account information</p>
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-3xl font-bold">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
          <p className="text-gray-500 text-sm">{profile.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${roleColors[profile.role as keyof typeof roleColors] || 'bg-gray-100 text-gray-600'}`}>{profile.role}</span>
            <span className="text-xs text-gray-400">Member since {new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Edit profile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2"><UserCircle size={18} />Personal Information</h3>
        <form onSubmit={handleSave} className="space-y-4">
          {msg && <p className={`text-sm p-3 rounded-lg ${msg.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{msg}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={profile.email} disabled className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-60">
              <Save size={15} />{saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2"><Lock size={18} />Change Password</h3>
        <form onSubmit={handlePwSave} className="space-y-4">
          {pwMsg && <p className={`text-sm p-3 rounded-lg ${pwMsg.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{pwMsg}</p>}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input required type="password" value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input required type="password" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input required type="password" value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={savingPw} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium disabled:opacity-60">
              <Lock size={15} />{savingPw ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
