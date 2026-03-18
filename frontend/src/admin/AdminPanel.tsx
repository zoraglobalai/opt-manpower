import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Briefcase, Users, FileText, LogOut, Menu, X,
  TrendingUp, PlusCircle, Pencil, Trash2, Download, BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AdminJobForm from './AdminJobForm';

const ACCENT = '#000000';
const CHART_COLORS = ['#000000', '#60a5fa', '#34d399', '#a78bfa', '#f87171', '#fb923c', '#38bdf8', '#4ade80'];

// ── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Briefcase, label: 'Jobs', path: '/admin/jobs' },
  { icon: FileText, label: 'Applications', path: '/admin/applications' },
  { icon: Users, label: 'Candidates', path: '/admin/candidates' },
  { icon: Briefcase, label: 'Employers', path: '/admin/employers' },
  { icon: FileText, label: 'Enquiries', path: '/admin/enquiries' },
  { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
];

const Sidebar = ({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) => {
  const { user, logout } = useAuth();
  const loc = useLocation();
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/70 z-30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-light z-40 transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-light">
          <div className="w-7 h-7 bg-black flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="font-display font-black text-sm text-black tracking-tight">OPTIMUS</p>
            <p className="text-gray-medium font-display font-light text-xs">ADMIN</p>
          </div>
        </div>
        <nav className="p-4 space-y-1 mt-2">
          {NAV.map(({ icon: Icon, label, path }) => {
            const active = loc.pathname === path;
            return (
              <Link key={path} to={path} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-body transition-all duration-150 ${active ? 'bg-black/10 text-black border-r-2 border-black' : 'text-gray-medium hover:text-black hover:bg-gray-50'
                  }`}>
                <Icon className="w-4 h-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-light">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center font-display font-bold text-black text-xs">
              {user?.first_name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-black text-xs font-heading font-medium truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-gray-medium text-xs font-body">Admin</p>
            </div>
            <button onClick={logout} className="text-gray-medium hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { data, isLoading } = useQuery({ queryKey: ['admin-dashboard'], queryFn: adminAPI.getStats });
  const stats = data?.data;

  const STATUS_COLOR: Record<string, string> = {
    Applied: 'bg-blue-500/15 text-blue-400',
    'Under Review': 'bg-yellow-500/15 text-yellow-400',
    Shortlisted: 'bg-green-500/15 text-green-400',
    'Interview Scheduled': 'bg-purple-500/15 text-purple-400',
    Rejected: 'bg-red-500/15 text-red-400',
    Hired: 'bg-emerald-500/15 text-emerald-400',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-2xl text-black">Dashboard</h1>
        <p className="text-gray-medium text-sm font-body mt-1">Welcome back, Admin</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          { label: 'Total Jobs', value: stats?.total_jobs, icon: Briefcase, color: 'text-black' },
          { label: 'Published Jobs', value: stats?.published_jobs, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Applications', value: stats?.total_applications, icon: FileText, color: 'text-blue-400' },
          { label: 'Candidates', value: stats?.total_candidates, icon: Users, color: 'text-purple-400' },
          { label: 'Employers', value: stats?.total_employers, icon: Briefcase, color: 'text-yellow-400' },
          { label: 'Enquiries', value: stats?.total_enquiries, icon: FileText, color: 'text-pink-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-medium text-xs font-body mb-2">{label}</p>
                <p className={`font-display font-black text-3xl ${color}`}>{isLoading ? '...' : (value ?? '—')}</p>
              </div>
              <Icon className={`w-5 h-5 ${color} opacity-50 mt-1`} />
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-heading font-semibold text-black text-sm mb-5">Recent Applications</h2>
        {stats?.recent_applications?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  {['Applicant', 'Job', 'Status', 'Date'].map((h) => (
                    <th key={h} className="pb-3 text-xs font-display text-gray-medium uppercase tracking-wide font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-light">
                {stats.recent_applications.map((app: any) => (
                  <tr key={app.id}>
                    <td className="py-3 font-body text-gray-dark text-xs">{app.full_name}</td>
                    <td className="py-3 font-body text-gray-medium text-xs">{app.job_title}</td>
                    <td className="py-3">
                      <span className={`status-badge text-xs ${STATUS_COLOR[app.status] || 'bg-gray-100 text-gray-medium'}`}>{app.status}</span>
                    </td>
                    <td className="py-3 font-body text-gray-medium text-xs">{new Date(app.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-light font-body text-sm">No recent applications</p>
        )}
      </div>
    </div>
  );
};

// ── Analytics ─────────────────────────────────────────────────────────────────
const Analytics = () => {
  const { data, isLoading } = useQuery({ queryKey: ['admin-analytics'], queryFn: adminAPI.getAnalytics });
  const analytics = data?.data;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-light px-3 py-2 text-xs font-body">
          <p className="text-gray-medium mb-1">{label}</p>
          {payload.map((p: any) => (
            <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-2xl text-black">Analytics</h1>
        <p className="text-gray-medium text-sm font-body mt-1">Platform insights (last 12 months)</p>
      </div>

      {/* Monthly Applications + Jobs Chart */}
      <div className="card p-6">
        <h2 className="font-heading font-semibold text-black text-sm mb-6">Monthly Activity</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={analytics?.monthly_applications || []} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(0,0,0,0.5)', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: 'rgba(0,0,0,0.5)', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(0,0,0,0.6)' }} />
            <Line type="monotone" dataKey="count" name="Applications" stroke={ACCENT} strokeWidth={2} dot={{ fill: ACCENT, r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="card p-6">
          <h2 className="font-heading font-semibold text-black text-sm mb-6">Jobs by Category</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analytics?.top_categories || []} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis dataKey="category" type="category" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Jobs" radius={[0, 3, 3, 0]}>
                {(analytics?.top_categories || []).map((_: any, i: number) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Application Status Breakdown */}
        <div className="card p-6">
          <h2 className="font-heading font-semibold text-black text-sm mb-6">Application Status Distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={analytics?.status_breakdown || []}
                dataKey="count"
                nameKey="status"
                cx="50%" cy="50%"
                outerRadius={90}
                label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              >
                {(analytics?.status_breakdown || []).map((_: any, i: number) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Locations */}
        <div className="card p-6">
          <h2 className="font-heading font-semibold text-black text-sm mb-6">Jobs by Country</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analytics?.top_locations || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="country" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Jobs" radius={[3, 3, 0, 0]}>
                {(analytics?.top_locations || []).map((_: any, i: number) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Industries */}
        <div className="card p-6">
          <h2 className="font-heading font-semibold text-black text-sm mb-6">Jobs by Industry</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analytics?.top_industries || []} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis dataKey="industry" type="category" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} axisLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Jobs" radius={[0, 3, 3, 0]}>
                {(analytics?.top_industries || []).map((_: any, i: number) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ── Jobs Manager ──────────────────────────────────────────────────────────────
const JobsManager = () => {
  const { data, refetch } = useQuery({ queryKey: ['admin-jobs'], queryFn: adminAPI.getJobs });
  const [formOpen, setFormOpen] = useState(false);
  const [editJob, setEditJob] = useState<any>(null);
  const jobs = data?.data?.results || data?.data || [];

  const deleteJob = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    await adminAPI.deleteJob(id);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-black">Jobs</h1>
          <p className="text-gray-light text-sm font-body">{jobs.length} total positions</p>
        </div>
        <button onClick={() => { setEditJob(null); setFormOpen(true); }} className="btn-primary text-sm">
          <PlusCircle className="w-4 h-4" /> Add Job
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                {['Title', 'Company', 'Location', 'Industry', 'Type', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-display text-gray-light uppercase tracking-wide font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {jobs.map((job: any) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-gray-dark font-body text-xs">{job.title}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-medium font-body text-xs">{job.company_name}</td>
                  <td className="px-4 py-3 text-gray-medium font-body text-xs">{job.location}</td>
                  <td className="px-4 py-3 text-gray-medium font-body text-xs">{job.industry || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="status-badge bg-gray-50 text-gray-medium text-xs">{job.job_type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`status-badge text-xs ${job.status === 'Published' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditJob(job); setFormOpen(true); }}
                        className="p-1.5 text-gray-light hover:text-black transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteJob(job.id)}
                        className="p-1.5 text-gray-light hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && <AdminJobForm job={editJob} onClose={() => { setFormOpen(false); refetch(); }} />}
    </div>
  );
};

const ApplicationsManager = () => {
  const { data, refetch } = useQuery({ queryKey: ['admin-applications'], queryFn: adminAPI.getApplications });
  const apps = data?.data?.results || data?.data || [];
  const [forwardModalApp, setForwardModalApp] = useState<any>(null);

  const STATUS_OPTIONS = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'];
  const STATUS_COLOR: Record<string, string> = {
    Applied: 'bg-blue-500/15 text-blue-400',
    'Under Review': 'bg-yellow-500/15 text-yellow-400',
    Shortlisted: 'bg-green-500/15 text-green-400',
    'Interview Scheduled': 'bg-purple-500/15 text-purple-400',
    Rejected: 'bg-red-500/15 text-red-400',
    Hired: 'bg-emerald-500/15 text-emerald-400',
  };

  const updateStatus = async (id: string, status: string) => {
    await adminAPI.updateApplicationStatus(id, status);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl text-black">Applications</h1>
        <p className="text-gray-light text-sm font-body">{apps.length} total applications</p>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50">
              <tr className="text-left">
                {['Applicant', 'Email', 'Phone', 'Applied For', 'Experience', 'CV', 'Date', 'Status', 'Forward'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-display text-gray-light uppercase tracking-wide font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {apps.map((app: any) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-dark font-body text-xs">{app.full_name}</td>
                  <td className="px-4 py-3 text-gray-medium font-body text-xs">{app.email}</td>
                  <td className="px-4 py-3 text-gray-medium font-body text-xs">{app.phone}</td>
                  <td className="px-4 py-3 text-gray-medium font-body text-xs">{app.job_title}</td>
                  <td className="px-4 py-3 text-gray-medium font-body text-xs">{app.experience}</td>
                  <td className="px-4 py-3">
                    {app.cv_file && (
                      <a href={app.cv_file} download className="inline-flex items-center gap-1 text-black hover:text-black-light text-xs font-body transition-colors">
                        <Download className="w-3.5 h-3.5" /> CV
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-light font-body text-xs">{new Date(app.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border-0 font-display font-semibold tracking-wide cursor-pointer focus:outline-none ${STATUS_COLOR[app.status] || 'bg-gray-50 text-gray-medium'}`}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setForwardModalApp(app)} className="btn-outline py-1 px-3 text-xs whitespace-nowrap">
                      Forward →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {forwardModalApp && (
        <ForwardCandidateModal
          application={forwardModalApp}
          onClose={() => setForwardModalApp(null)}
          onSuccess={() => { setForwardModalApp(null); refetch(); }}
        />
      )}
    </div>
  );
};

// ── Forward Candidate Modal ───────────────────────────────────────────────────
const ForwardCandidateModal = ({ application, onClose, onSuccess }: any) => {
  const { data } = useQuery({ queryKey: ['admin-employers-forward'], queryFn: adminAPI.getEmployers });
  const employers = data?.data?.results || data?.data || [];

  const [selectedEmp, setSelectedEmp] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForward = async () => {
    if (!selectedEmp) return;
    setLoading(true);
    try {
      await adminAPI.forwardCandidate(application.id, parseInt(selectedEmp, 10), notes);
      onSuccess();
    } catch (err) {
      alert('Failed to forward candidate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-gray-light p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display font-bold text-lg text-black">Forward Candidate</h3>
          <button onClick={onClose} className="text-gray-medium hover:text-black"><X className="w-5 h-5" /></button>
        </div>

        <div className="mb-6 p-3 bg-gray-50 border border-gray-light text-sm font-body">
          <p className="text-gray-dark font-semibold mb-1">{application.full_name}</p>
          <p className="text-gray-medium text-xs">Applied for: {application.job_title}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-medium text-xs font-body block mb-1">Select Employer *</label>
            <select value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)} className="input-field w-full">
              <option value="">-- Choose Employer --</option>
              {employers.map((emp: any) => (
                <option key={emp.id} value={emp.id}>{emp.company_name} ({emp.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-gray-medium text-xs font-body block mb-1">Admin Notes (visible to employer)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="input-field w-full resize-none" placeholder="e.g. Strong React skills, within budget." />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-outline flex-1 py-2">Cancel</button>
          <button onClick={handleForward} disabled={!selectedEmp || loading} className="btn-primary flex-1 py-2 justify-center disabled:opacity-50">
            {loading ? 'Forwarding...' : 'Forward'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Candidates Manager ────────────────────────────────────────────────────────
const CandidatesManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['admin-candidates', searchTerm],
    queryFn: () => adminAPI.getCandidates({ search: searchTerm })
  });

  const candidates = data?.data?.results || data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-black">Registered Candidates</h1>
          <p className="text-gray-light text-sm font-body">Candidate Talent Pool</p>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field text-sm w-full sm:w-64"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50">
              <tr className="text-left">
                {['Name', 'Email', 'Role', 'Joined Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-display text-gray-light uppercase tracking-wide font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={4} className="p-8 text-center"><div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : candidates.length > 0 ? (
                candidates.map((cand: any) => (
                  <tr key={cand.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-gray-dark font-heading font-semibold text-xs">{cand.first_name} {cand.last_name}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-medium font-body text-xs">{cand.email}</td>
                    <td className="px-4 py-3">
                      <span className="status-badge bg-gray-50 text-gray-medium text-xs">{cand.role}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-light font-body text-xs">{new Date(cand.date_joined).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-light font-body text-sm">
                    No candidates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── Employers Manager ────────────────────────────────────────────────────────
const AdminEmployersView = () => {
  const { data, refetch } = useQuery({ queryKey: ['admin-employers'], queryFn: adminAPI.getEmployers });
  const employers = data?.data?.results || data?.data || [];
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const handleSave = async (id: number) => {
    await adminAPI.updateEmployer(id, { active_requirements: editNotes });
    setEditingId(null);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl text-black">Registered Employers</h1>
        <p className="text-gray-light text-sm font-body">{employers.length} active employers</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {employers.map((emp: any) => (
          <div key={emp.id} className="card p-5">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="font-heading font-semibold text-black text-lg">{emp.company_name}</h3>
                <p className="text-gray-medium text-sm font-body">{emp.first_name} {emp.last_name} · {emp.email}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-light font-body">
                  {emp.phone && <span>📞 {emp.phone}</span>}
                  {emp.industry && <span>🏢 {emp.industry}</span>}
                  {emp.location && <span>📍 {emp.location}</span>}
                </div>
              </div>
              <div className="min-w-[300px]">
                <p className="text-gray-medium text-xs font-display uppercase tracking-wide mb-2">Active Requirements (Admin Notes)</p>
                {editingId === emp.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editNotes}
                      onChange={e => setEditNotes(e.target.value)}
                      className="input-field w-full text-sm"
                      rows={3}
                      placeholder="e.g. Needs 5 Python devs in Mumbai"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditingId(null)} className="text-gray-medium hover:text-black text-xs px-3 py-1">Cancel</button>
                      <button onClick={() => handleSave(emp.id)} className="bg-black text-black font-semibold text-xs px-3 py-1 rounded">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="group relative bg-gray-50 p-3 rounded border border-gray-light hover:border-gray-light transition-colors">
                    <p className="text-gray-medium text-sm font-body whitespace-pre-line pr-8">
                      {emp.active_requirements || <span className="text-gray-light italic">No notes added yet...</span>}
                    </p>
                    <button onClick={() => { setEditingId(emp.id); setEditNotes(emp.active_requirements || ''); }}
                      className="absolute top-2 right-2 p-1.5 text-gray-light hover:text-black opacity-0 group-hover:opacity-100 transition-all">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Enquiries Manager ─────────────────────────────────────────────────────────
const EnquiriesManager = () => {
  const { data } = useQuery({ queryKey: ['admin-enquiries'], queryFn: adminAPI.getEnquiries });
  const enquiries = data?.data?.results || data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl text-black">Business Enquiries</h1>
        <p className="text-gray-light text-sm font-body">{enquiries.length} total enquiries</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {enquiries.map((enq: any) => (
          <div key={enq.id} className="card p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
              <div>
                <p className="font-heading font-semibold text-black text-sm">{enq.company_name}</p>
                <p className="text-gray-medium text-xs font-body">{enq.contact_person} · {enq.email} · {enq.phone}</p>
              </div>
              <span className="text-gray-light text-xs font-body">{new Date(enq.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-body text-gray-medium mb-3">
              <span>📋 {enq.hiring_requirement}</span>
              <span>👤 {enq.number_of_positions} positions</span>
              <span>📍 {enq.job_location}</span>
            </div>
            {enq.message && <p className="text-gray-light text-xs font-body leading-relaxed">{enq.message}</p>}
          </div>
        ))}
        {!enquiries.length && <div className="text-gray-light font-body text-sm py-10 text-center">No enquiries yet</div>}
      </div>
    </div>
  );
};

// ── Admin Login Gate ────────────────────────────────────────────────────────
const AdminLoginGate = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-black mx-auto flex items-center justify-center mb-4">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-black text-2xl text-black tracking-tight">OPTIMUS ADMIN</h1>
          <p className="text-gray-medium font-body text-sm mt-1">Sign in to access the admin panel</p>
        </div>
        <div className="bg-white border border-gray-light shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-display font-bold text-gray-dark mb-2 tracking-wide uppercase">Email Address</label>
              <input
                type="email"
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@optimusmanpower.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-light text-black placeholder-gray-medium text-sm font-body focus:outline-none focus:border-black focus:bg-white transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-display font-bold text-gray-dark mb-2 tracking-wide uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-light text-black placeholder-gray-medium text-sm font-body focus:outline-none focus:border-black focus:bg-white transition-all duration-200"
                required
              />
            </div>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-body">
                {error}
              </motion.p>
            )}
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 justify-center mt-2 disabled:opacity-60">
              {loading ? 'Signing In...' : 'Sign In to Admin Panel'}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-light text-xs font-body mt-6">Optimus Manpower — Administration Only</p>
      </motion.div>
    </div>
  );
};

// ── Admin Layout & Router ─────────────────────────────────────────────────────
const AdminPanel = () => {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-light font-body">Loading...</div>;
  if (!user) return <AdminLoginGate />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 lg:ml-64 min-h-screen">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-light px-4 py-4 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-medium hover:text-black">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-black text-sm text-black">OPTIMUS ADMIN</span>
        </div>
        <div className="p-6 md:p-8">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="jobs" element={<JobsManager />} />
            <Route path="applications" element={<ApplicationsManager />} />
            <Route path="candidates" element={<CandidatesManager />} />
            <Route path="employers" element={<AdminEmployersView />} />
            <Route path="enquiries" element={<EnquiriesManager />} />
            <Route path="analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;


