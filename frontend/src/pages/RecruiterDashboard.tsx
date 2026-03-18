import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Users, FileText, PlusCircle, Edit3, Trash2, Eye,
  Download, ChevronDown, LogOut, MapPin, X, CheckCircle, AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recruiterAPI } from '../services/api';

type Tab = 'overview' | 'jobs' | 'applicants' | 'forwarded';

const STATUS_COLOR: Record<string, string> = {
  Applied: 'bg-blue-500/15 text-blue-400',
  'Under Review': 'bg-yellow-500/15 text-yellow-400',
  Shortlisted: 'bg-green-500/15 text-green-400',
  'Interview Scheduled': 'bg-purple-500/15 text-purple-400',
  Rejected: 'bg-red-500/15 text-red-400',
  Hired: 'bg-emerald-500/15 text-emerald-400',
};

// ── Job Form Modal ────────────────────────────────────────────────────────────
const JobFormModal = ({ job, onClose }: { job?: any; onClose: () => void }) => {
  const qc = useQueryClient();
  const isEdit = !!job;
  const [form, setForm] = useState({
    title: job?.title || '',
    company_name: job?.company_name || '',
    description: job?.description || '',
    location: job?.location || '',
    country: job?.country || '',
    experience: job?.experience || '',
    experience_min: job?.experience_min ?? 0,
    experience_max: job?.experience_max ?? 5,
    salary: job?.salary || '',
    salary_min: job?.salary_min || '',
    salary_max: job?.salary_max || '',
    job_type: job?.job_type || 'Full Time',
    category: job?.category || '',
    industry: job?.industry || 'Other',
    visa_type: job?.visa_type || '',
    is_international: job?.is_international || false,
    requirements: job?.requirements || '',
    benefits: job?.benefits || '',
    status: job?.status || 'Published',
  });

  const mutation = useMutation({
    mutationFn: (data: object) =>
      isEdit ? recruiterAPI.updateJob(job.id, data) : recruiterAPI.createJob(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recruiter-dashboard'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const inp = 'input-field text-sm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-gray-light w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-light sticky top-0 bg-white z-10">
          <h2 className="font-display font-bold text-black text-sm">{isEdit ? 'Edit Job' : 'Post New Job'}</h2>
          <button onClick={onClose} className="text-gray-medium hover:text-black"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'title', label: 'Job Title', required: true },
              { key: 'company_name', label: 'Company Name', required: true },
              { key: 'location', label: 'Location', required: true },
              { key: 'country', label: 'Country', required: true },
              { key: 'experience', label: 'Experience (display)', required: true },
              { key: 'salary', label: 'Salary (display)', required: false },
              { key: 'category', label: 'Category', required: true },
              { key: 'visa_type', label: 'Visa Type (international)', required: false },
            ].map(({ key, label, required }) => (
              <div key={key}>
                <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-1.5 block">{label}</label>
                <input className={inp} required={required} value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}

            <div>
              <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-1.5 block">Job Type</label>
              <select className={inp} value={form.job_type} onChange={e => setForm(f => ({ ...f, job_type: e.target.value }))}>
                {['Full Time', 'Part Time', 'Contract'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-1.5 block">Industry</label>
              <select className={inp} value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}>
                {['IT', 'Healthcare', 'Finance', 'Engineering', 'Sales', 'HR', 'Education', 'Construction', 'Hospitality', 'Logistics', 'Manufacturing', 'Legal', 'Other']
                  .map(i => <option key={i}>{i}</option>)}
              </select>
            </div>

            <div>
              <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-1.5 block">Min Experience (years)</label>
              <input type="number" min={0} className={inp} value={form.experience_min}
                onChange={e => setForm(f => ({ ...f, experience_min: +e.target.value }))} />
            </div>

            <div>
              <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-1.5 block">Max Experience (years)</label>
              <input type="number" min={0} className={inp} value={form.experience_max}
                onChange={e => setForm(f => ({ ...f, experience_max: +e.target.value }))} />
            </div>

            <div>
              <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-1.5 block">Min Salary (monthly)</label>
              <input type="number" className={inp} value={form.salary_min}
                onChange={e => setForm(f => ({ ...f, salary_min: e.target.value }))} />
            </div>

            <div>
              <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-1.5 block">Max Salary (monthly)</label>
              <input type="number" className={inp} value={form.salary_max}
                onChange={e => setForm(f => ({ ...f, salary_max: e.target.value }))} />
            </div>

            <div>
              <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-1.5 block">Status</label>
              <select className={inp} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {['Published', 'Draft', 'Closed'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_international" checked={form.is_international}
              onChange={e => setForm(f => ({ ...f, is_international: e.target.checked }))}
              className="w-4 h-4 accent-black" />
            <label htmlFor="is_international" className="text-gray-medium text-sm font-body">International Job</label>
          </div>

          {[
            { key: 'description', label: 'Job Description', rows: 5, required: true },
            { key: 'requirements', label: 'Requirements', rows: 3 },
            { key: 'benefits', label: 'Benefits', rows: 3 },
          ].map(({ key, label, rows, required }) => (
            <div key={key}>
              <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-1.5 block">{label}</label>
              <textarea rows={rows} className={`${inp} resize-none`} required={required}
                value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={mutation.isPending} className="btn-primary text-sm">
              {mutation.isPending ? 'Saving...' : isEdit ? 'Update Job' : 'Post Job'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline text-sm">Cancel</button>
            {mutation.isError && (
              <span className="text-red-400 text-xs font-body flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Failed to save
              </span>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ── Applicants Drawer ─────────────────────────────────────────────────────────
const ApplicantsDrawer = ({ job, onClose }: { job: any; onClose: () => void }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['recruiter-applicants', job.id],
    queryFn: () => recruiterAPI.getJobApplicants(job.id).then((r: any) => r.data),
  });
  const applicants: any[] = Array.isArray(data) ? data : (data?.results || []);

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/60" />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="w-full max-w-lg bg-white border-l border-gray-light h-full overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-light sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-display font-bold text-black text-sm">Applicants</h2>
            <p className="text-gray-medium text-xs font-body">{job.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-medium hover:text-black"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : applicants.length > 0 ? applicants.map((app: any) => (
            <div key={app.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-black font-heading font-semibold text-sm">{app.full_name}</p>
                  <p className="text-gray-medium text-xs font-body">{app.email} · {app.phone}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs font-body text-gray-light">
                    <span>{app.experience} exp</span>
                    {app.current_company && <span>@ {app.current_company}</span>}
                    {app.expected_salary && <span>Expects: {app.expected_salary}</span>}
                    {app.notice_period && <span>Notice: {app.notice_period}</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`status-badge text-xs ${STATUS_COLOR[app.status] || 'bg-gray-50 text-gray-medium'}`}>{app.status}</span>
                  {app.cv_file && (
                    <a href={app.cv_file} download className="flex items-center gap-1 text-black hover:text-black-light text-xs font-body transition-colors">
                      <Download className="w-3 h-3" /> CV
                    </a>
                  )}
                </div>
              </div>
              {app.additional_notes && (
                <p className="text-gray-light text-xs font-body mt-2 leading-relaxed">{app.additional_notes}</p>
              )}
              <p className="text-gray-light text-xs font-body mt-2">{new Date(app.created_at).toLocaleDateString()}</p>
            </div>
          )) : (
            <div className="text-center py-12">
              <Users className="w-10 h-10 text-gray-light mx-auto mb-3" />
              <p className="text-gray-light font-body text-sm">No applicants yet</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const RecruiterDashboard = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [jobForm, setJobForm] = useState<{ open: boolean; job?: any }>({ open: false });
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['recruiter-dashboard'],
    queryFn: () => recruiterAPI.getDashboard().then((r: any) => r.data),
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => recruiterAPI.deleteJob(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recruiter-dashboard'] }),
  });

  const { data: fwdData, refetch: refetchFwd } = useQuery({
    queryKey: ['recruiter-candidates'],
    queryFn: () => recruiterAPI.getCandidates().then(r => r.data),
    enabled: !!user && tab === 'forwarded',
  });

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/" replace />;
  if (user.role === 'candidate') return <Navigate to="/dashboard" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;

  const stats = data?.stats;
  const jobs: any[] = data?.jobs || [];
  const recentApplicants: any[] = data?.recent_applicants || [];

  const TABS = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'jobs', label: `My Jobs (${stats?.total_jobs ?? 0})`, icon: FileText },
    { id: 'applicants', label: 'Recent Applicants', icon: Users },
    { id: 'forwarded', label: 'Forwarded Candidates', icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
              <h1 className="font-display font-black text-2xl text-black flex items-center gap-2">
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-black" />
                </div>
                <span>OPTIMUS</span>
                <span className="text-black font-light">MANPOWER</span>
              </h1>
            </Link>
            <p className="text-gray-medium text-sm font-body mt-1 ml-10">Recruiter Portal · {user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setJobForm({ open: true })} className="btn-primary text-sm">
              <PlusCircle className="w-4 h-4" /> Post New Job
            </button>
            <button onClick={logout} className="flex items-center gap-2 text-gray-medium hover:text-red-400 text-sm font-body transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 border-b border-gray-light">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id as Tab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-body whitespace-nowrap transition-all border-b-2 -mb-px ${
                tab === id ? 'border-black text-black' : 'border-transparent text-gray-medium hover:text-black'
              }`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

            {/* ── Overview ── */}
            {tab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Jobs Posted', value: stats?.total_jobs ?? 0, color: 'text-black' },
                    { label: 'Published Jobs', value: stats?.published_jobs ?? 0, color: 'text-green-400' },
                    { label: 'Total Applications', value: stats?.total_applications ?? 0, color: 'text-blue-400' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="card p-5">
                      <p className="text-gray-light text-xs font-body mb-1">{label}</p>
                      <p className={`font-display font-black text-3xl ${color}`}>{isLoading ? '—' : value}</p>
                    </div>
                  ))}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => setJobForm({ open: true })}
                    className="card p-6 text-left hover:border-black/40 transition-all group">
                    <PlusCircle className="w-6 h-6 text-black mb-3" />
                    <p className="font-heading font-semibold text-black text-sm group-hover:text-black transition-colors">Post a Job</p>
                    <p className="text-gray-light text-xs font-body mt-1">Create a new job listing and start receiving applications</p>
                  </button>
                  <button onClick={() => setTab('applicants')}
                    className="card p-6 text-left hover:border-black/40 transition-all group">
                    <Users className="w-6 h-6 text-black mb-3" />
                    <p className="font-heading font-semibold text-black text-sm group-hover:text-black transition-colors">View Applicants</p>
                    <p className="text-gray-light text-xs font-body mt-1">Review and manage candidates who applied to your jobs</p>
                  </button>
                </div>

                {/* Recent applicants preview */}
                {recentApplicants.length > 0 && (
                  <div className="card p-6">
                    <h2 className="font-heading font-semibold text-black text-sm mb-5">Recent Applicants</h2>
                    <div className="space-y-3">
                      {recentApplicants.slice(0, 5).map((app: any) => (
                        <div key={app.id} className="flex items-center justify-between py-2 border-b border-gray-light last:border-0">
                          <div>
                            <p className="text-gray-dark text-sm font-body">{app.full_name}</p>
                            <p className="text-gray-medium text-xs font-body">{app.job_title} · {new Date(app.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className={`status-badge text-xs ${STATUS_COLOR[app.status] || 'bg-gray-50 text-gray-medium'}`}>{app.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── My Jobs ── */}
            {tab === 'jobs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-semibold text-black text-sm">Posted Jobs</h2>
                  <button onClick={() => setJobForm({ open: true })} className="btn-primary text-xs py-2 px-5">
                    <PlusCircle className="w-3.5 h-3.5" /> Post Job
                  </button>
                </div>
                {jobs.length > 0 ? (
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[640px]">
                        <thead className="bg-gray-50">
                          <tr>
                            {['Title', 'Location', 'Type', 'Status', 'Applications', 'Actions'].map(h => (
                              <th key={h} className="px-4 py-3 text-left text-xs font-display text-gray-light uppercase tracking-wide">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {jobs.map((job: any) => (
                            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <p className="text-gray-dark font-body text-xs">{job.title}</p>
                                <p className="text-gray-light font-body text-xs">{job.company_name}</p>
                              </td>
                              <td className="px-4 py-3 text-gray-medium font-body text-xs">{job.location}</td>
                              <td className="px-4 py-3">
                                <span className="status-badge bg-gray-50 text-gray-medium text-xs">{job.job_type}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`status-badge text-xs ${job.status === 'Published' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                                  {job.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-medium font-body text-xs">{job.application_count ?? 0}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <button onClick={() => setSelectedJob(job)}
                                    className="p-1.5 text-gray-light hover:text-black transition-colors" title="View Applicants">
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => setJobForm({ open: true, job })}
                                    className="p-1.5 text-gray-light hover:text-black transition-colors" title="Edit">
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => { if (confirm('Delete this job?')) deleteMutation.mutate(job.id); }}
                                    className="p-1.5 text-gray-light hover:text-red-400 transition-colors" title="Delete">
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
                ) : (
                  <div className="card p-12 text-center">
                    <Briefcase className="w-10 h-10 text-gray-light mx-auto mb-3" />
                    <p className="text-gray-light font-body text-sm mb-4">No jobs posted yet</p>
                    <button onClick={() => setJobForm({ open: true })} className="btn-primary text-sm">Post Your First Job</button>
                  </div>
                )}
              </div>
            )}

            {/* ── All Applicants ── */}
            {tab === 'applicants' && (
              <div className="space-y-4">
                <h2 className="font-heading font-semibold text-black text-sm">All Applicants</h2>
                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.filter(j => (j.application_count ?? 0) > 0).map((job: any) => (
                      <div key={job.id} className="card p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-black font-heading font-semibold text-sm">{job.title}</p>
                            <p className="text-gray-medium text-xs font-body">{job.application_count ?? 0} applicants · {job.location}</p>
                          </div>
                          <button onClick={() => setSelectedJob(job)} className="btn-outline text-xs py-2 px-4">
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </div>
                      </div>
                    ))}
                    {jobs.every(j => !(j.application_count ?? 0)) && (
                      <div className="card p-12 text-center">
                        <Users className="w-10 h-10 text-gray-light mx-auto mb-3" />
                        <p className="text-gray-light font-body text-sm">No applicants yet across your job listings</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <p className="text-gray-light font-body text-sm">Post jobs first to see applicants</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Forwarded Candidates ── */}
            {tab === 'forwarded' && (
              <div className="space-y-4">
                <h2 className="font-heading font-semibold text-black text-sm">Forwarded Candidates (From Admin)</h2>
                {fwdData?.results?.length > 0 || fwdData?.length > 0 ? (
                  <div className="grid gap-4">
                    {(fwdData.results || fwdData).map((assignment: any) => {
                      const app = assignment.application;
                      return (
                        <div key={assignment.id} className="card p-5">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-heading font-semibold text-black text-lg">{app.full_name}</h3>
                                <span className={`status-badge text-xs ${STATUS_COLOR[assignment.status] || 'bg-gray-50 text-gray-medium'}`}>
                                  {assignment.status}
                                </span>
                              </div>
                              <p className="text-gray-medium text-sm font-body">{app.email} · {app.phone}</p>
                              <div className="flex flex-wrap gap-2 mt-2 text-xs font-body text-gray-light">
                                <span>{app.experience} exp</span>
                                {app.expected_salary && <span>Expects: {app.expected_salary}</span>}
                                {app.notice_period && <span>Notice: {app.notice_period}</span>}
                              </div>
                            </div>
                            <div className="min-w-[250px] space-y-3 flex flex-col items-end">
                                {assignment.notes && (
                                  <div className="bg-gray-50 p-3 rounded border border-gray-light w-full">
                                    <p className="text-gray-medium text-xs font-display uppercase tracking-wide mb-1">Admin Notes</p>
                                    <p className="text-gray-dark text-sm font-body">{assignment.notes}</p>
                                  </div>
                                )}
                                <div className="flex gap-2 w-full justify-between items-center">
                                  {app.cv_file && (
                                    <a href={app.cv_file} download className="flex flex-1 justify-center items-center gap-1 bg-gray-50 hover:bg-gray-50 text-black text-xs font-body py-2 rounded transition-colors">
                                      <Download className="w-3.5 h-3.5" /> Resume
                                    </a>
                                  )}
                                  <select 
                                    className="input-field text-xs py-2 flex-1 m-0"
                                    value={assignment.status} 
                                    onChange={async (e) => {
                                      await recruiterAPI.updateCandidateStatus(assignment.id, e.target.value);
                                      refetchFwd();
                                    }}
                                  >
                                    {['Pending Review', 'Shortlisted', 'Interviewing', 'Selected', 'Rejected', 'On Hold'].map(s => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <Users className="w-10 h-10 text-gray-light mx-auto mb-3" />
                    <p className="text-gray-light font-body text-sm">No candidates forwarded to you yet</p>
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {jobForm.open && <JobFormModal job={jobForm.job} onClose={() => setJobForm({ open: false })} />}
        {selectedJob && <ApplicantsDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default RecruiterDashboard;


