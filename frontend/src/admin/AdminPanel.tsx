import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
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

const ACCENT = '#0ea5e9';
const ACCENT_DARK = '#0284c7';
const CHART_COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444', '#3b82f6'];

// ── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Briefcase, label: 'Jobs', path: '/admin/jobs' },
  { icon: FileText, label: 'Applications', path: '/admin/applications' },
  { icon: FileText, label: 'Enquiries', path: '/admin/enquiries' },
];

const Sidebar = ({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) => {
  const { user, logout } = useAuth();
  const loc = useLocation();
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/70 z-30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 z-40 transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center rounded-lg">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-black text-sm text-white tracking-tight">OPTIMUS</p>
            <p className="text-cyan-400 font-light text-xs">ADMIN</p>
          </div>
        </div>
        <nav className="p-4 space-y-2 mt-2">
          {NAV.map(({ icon: Icon, label, path }) => {
            const active = loc.pathname === path;
            return (
              <Link key={path} to={path} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                  active 
                    ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-300 border-l-2 border-cyan-500' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}>
                <Icon className="w-4 h-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center font-black text-white text-xs">
              {user?.first_name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-slate-400 text-xs">Admin</p>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors">
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
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ['admin-dashboard'], queryFn: adminAPI.getStats });
  const stats = data?.data;
  
  const notifyAdmin = (message: string) => {
    // Send email notification to admin
    console.log('Admin notification:', message);
  };

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 p-8 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-600 font-semibold text-sm uppercase tracking-widest mb-2">Administration Dashboard</p>
              <h1 className="font-black text-4xl text-slate-900 mb-2">Welcome Back</h1>
              <p className="text-slate-600 text-base">Manage jobs, applications, and business enquiries</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'Total Jobs', value: stats?.total_jobs, icon: Briefcase, gradient: 'from-cyan-500 to-blue-600', path: '/admin/jobs' },
          { label: 'Published Jobs', value: stats?.published_jobs, icon: TrendingUp, gradient: 'from-emerald-500 to-green-600', path: '/admin/jobs' },
          { label: 'Applications', value: stats?.total_applications, icon: FileText, gradient: 'from-purple-500 to-pink-600', path: '/admin/applications' },
          { label: 'Enquiries', value: stats?.total_enquiries, icon: Briefcase, gradient: 'from-orange-500 to-red-600', path: '/admin/enquiries' },
        ].map(({ label, value, icon: Icon, gradient, path }) => (
          <motion.button
            key={label}
            onClick={() => navigate(path)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-cyan-400 hover:shadow-xl transition-all duration-300 cursor-pointer text-left w-full"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-semibold mb-2">{label}</p>
                <p className={`font-black text-4xl bg-gradient-to-r ${gradient} text-transparent bg-clip-text`}>
                  {isLoading ? '...' : (value ?? '—')}
                </p>
              </div>
              <div className={`bg-gradient-to-br ${gradient} p-3 rounded-xl`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white border-2 border-slate-200 rounded-2xl p-8"
      >
        <h2 className="font-black text-xl text-slate-900 mb-6">Recent Applications</h2>
        {stats?.recent_applications?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b-2 border-slate-200">
                  {['Applicant', 'Job', 'Status', 'Date'].map((h) => (
                    <th key={h} className="pb-4 px-4 text-xs font-black text-slate-700 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recent_applications.map((app: any) => {
                  const statusColors: Record<string, string> = {
                    Applied: 'bg-blue-100 text-blue-700',
                    'Under Review': 'bg-yellow-100 text-yellow-700',
                    Shortlisted: 'bg-green-100 text-green-700',
                    'Interview Scheduled': 'bg-purple-100 text-purple-700',
                    Rejected: 'bg-red-100 text-red-700',
                    Hired: 'bg-emerald-100 text-emerald-700',
                  };
                  return (
                    <tr key={app.id} className="hover:bg-cyan-50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-900">{app.full_name || app.name || 'Unknown'}</td>
                      <td className="py-4 px-4 text-slate-600">{app.job_title}</td>
                      <td className="py-4 px-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[app.status] || 'bg-slate-100 text-slate-700'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500">{new Date(app.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No recent applications</p>
        )}
      </motion.div>
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
    if (!confirm('Delete this job posting?')) return;
    await adminAPI.deleteJob(id);
    refetch();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-black text-3xl text-slate-900 mb-2">Job Postings</h1>
          <p className="text-slate-600 text-base">{jobs.length} active positions</p>
        </div>
        <button 
          onClick={() => { setEditJob(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 active:scale-95"
        >
          <PlusCircle className="w-5 h-5" /> Create Job
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden"
      >
        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-widest">Job Title</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-widest">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-widest">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-widest">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-black text-slate-700 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job: any) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 font-bold text-slate-900">{job.title}</td>
                    <td className="px-4 py-4 text-slate-600">{job.location}</td>
                    <td className="px-4 py-4"><span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">{job.job_type}</span></td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        job.status === 'Published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {job.status === 'Published' ? '✓ Published' : '⏸ Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => { setEditJob(job); setFormOpen(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteJob(job.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Briefcase className="w-16 h-16 text-slate-300 mb-4" />
            <p className="text-slate-600 font-semibold text-lg">No job postings yet</p>
            <p className="text-slate-500">Create your first job posting by clicking the "Create Job" button above</p>
          </div>
        )}
      </motion.div>

      {formOpen && <AdminJobForm job={editJob} onClose={() => { setFormOpen(false); refetch(); }} />}
    </div>
  );
};

const ApplicationsManager = () => {
  const { data, refetch } = useQuery({ queryKey: ['admin-applications'], queryFn: adminAPI.getApplications });
  const apps = data?.data?.results || data?.data || [];

  const STATUS_OPTIONS = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'];
  const STATUS_COLORS: Record<string, string> = {
    Applied: 'bg-blue-100 text-blue-700 border-blue-300',
    'Under Review': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    Shortlisted: 'bg-green-100 text-green-700 border-green-300',
    'Interview Scheduled': 'bg-purple-100 text-purple-700 border-purple-300',
    Rejected: 'bg-red-100 text-red-700 border-red-300',
    Hired: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  };

  const updateStatus = async (id: string, status: string) => {
    await adminAPI.updateApplicationStatus(id, status);
    refetch();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="font-black text-3xl text-slate-900 mb-2">Applications</h1>
          <p className="text-slate-600 text-base">{apps.length} total applications received</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-4"
      >
        {apps.length > 0 ? (
          apps.map((app: any, idx: number) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-cyan-400 hover:shadow-xl transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Candidate Details */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Full Name</p>
                    <p className="text-xl font-black text-slate-900">{app.full_name || app.name || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Email</p>
                      <p className="text-sm font-semibold text-slate-700">{app.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Phone</p>
                      <p className="text-sm font-semibold text-slate-700">{app.phone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Experience</p>
                      <p className="text-sm font-semibold text-slate-700">{app.experience}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Applied Date</p>
                      <p className="text-sm font-semibold text-slate-700">{new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Job & Status Info */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-4">
                    <p className="text-xs font-black text-cyan-600 uppercase tracking-widest mb-2">Applied For</p>
                    <p className="text-lg font-black text-slate-900">{app.job_title}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Status</p>
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg font-bold text-sm border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
                          STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Download CV Button */}
                    {app.cv_file || app.resume || app.file ? (
                      <a
                        href={app.cv_file || app.resume || app.file}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        Download CV
                      </a>
                    ) : (
                      <div className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-100 text-slate-500 font-bold rounded-lg border-2 border-slate-200">
                        <FileText className="w-4 h-4" />
                        No CV Uploaded
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-16 h-16 text-slate-300 mb-4" />
            <p className="text-slate-600 font-semibold text-lg">No applications yet</p>
            <p className="text-slate-500">Applications will appear here when candidates apply</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ── Enquiries Manager ─────────────────────────────────────────────────────────
const EnquiriesManager = () => {
  const { data } = useQuery({ queryKey: ['admin-enquiries'], queryFn: adminAPI.getEnquiries });
  const enquiries = data?.data?.results || data?.data || [];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="font-black text-3xl text-slate-900 mb-2">Business Enquiries</h1>
          <p className="text-slate-600 text-base">{enquiries.length} total enquiries</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 gap-4"
      >
        {enquiries.length > 0 ? (
          enquiries.map((enq: any, idx: number) => (
            <motion.div
              key={enq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-orange-400 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-black text-lg text-slate-900">{enq.company_name}</p>
                  <p className="text-sm text-slate-600 mt-1">{enq.contact_person} · {enq.email} · {enq.phone}</p>
                </div>
                <span className="text-xs font-semibold text-slate-500">{new Date(enq.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-700 mb-4">
                <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full">📋 {enq.hiring_requirement}</span>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">👤 {enq.number_of_positions} positions</span>
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">📍 {enq.job_location}</span>
              </div>
              {enq.message && <p className="text-slate-600 text-sm leading-relaxed">{enq.message}</p>}
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white border-2 border-slate-200 rounded-2xl">
            <Briefcase className="w-16 h-16 text-slate-300 mb-4" />
            <p className="text-slate-600 font-semibold text-lg">No enquiries yet</p>
            <p className="text-slate-500">Business enquiries will appear here</p>
          </div>
        )}
      </motion.div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div 
        className="absolute top-0 -right-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/10 blur-3xl"
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute -bottom-1/4 -left-1/3 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-500/20 to-cyan-500/10 blur-3xl"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 mx-auto flex items-center justify-center mb-4 rounded-xl shadow-lg shadow-cyan-500/30">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-black text-3xl text-white tracking-tight">OPTIMUS ADMIN</h1>
          <p className="text-cyan-300 font-medium text-sm mt-2">Access to Administration Panel</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-blue-500/20 p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-white mb-2 tracking-widest uppercase">Email Address</label>
              <input
                type="email"
                autoFocus
                autoComplete="off"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 rounded-lg backdrop-blur-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-white mb-2 tracking-widest uppercase">Password</label>
              <input
                type="password"
                autoComplete="off"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 rounded-lg backdrop-blur-sm"
                required
              />
            </div>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm font-semibold">
                {error}
              </motion.p>
            )}
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-3 rounded-lg hover:shadow-xl hover:shadow-cyan-500/30 active:scale-95 transition-all duration-300 disabled:opacity-60 uppercase tracking-widest text-sm">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center text-white/60 text-xs font-medium mt-6">Optimus Manpower — Administration Only</p>
      </motion.div>
    </div>
  );
};

// ── Admin Layout & Router ─────────────────────────────────────────────────────
const AdminPanel = () => {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-600 font-medium">Loading...</div>;
  if (!user) return <AdminLoginGate />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 lg:ml-64 min-h-screen">
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-4 flex items-center gap-4 lg:hidden shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600 hover:text-slate-900">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-black text-sm text-slate-900">OPTIMUS ADMIN</span>
        </div>
        <div className="p-6 md:p-8">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="jobs" element={<JobsManager />} />
            <Route path="applications" element={<ApplicationsManager />} />
            <Route path="enquiries" element={<EnquiriesManager />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;


