// import React, { useState, useRef } from 'react';
// import { Link, Navigate } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   User, Briefcase, Bookmark, FileText, Edit3, Upload, Download,
//   MapPin, Phone, Linkedin, Globe, CheckCircle, Clock, XCircle,
//   Star, ChevronRight, LogOut, Settings, AlertCircle,
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { candidateAPI } from '../services/api';

// // ── Helpers ──────────────────────────────────────────────────────────────────
// const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
//   Applied: { color: 'bg-blue-500/15 text-blue-400', icon: Clock },
//   'Under Review': { color: 'bg-yellow-500/15 text-yellow-400', icon: Clock },
//   Shortlisted: { color: 'bg-green-500/15 text-green-400', icon: Star },
//   'Interview Scheduled': { color: 'bg-purple-500/15 text-purple-400', icon: CheckCircle },
//   Rejected: { color: 'bg-red-500/15 text-red-400', icon: XCircle },
//   Hired: { color: 'bg-emerald-500/15 text-emerald-400', icon: CheckCircle },
// };

// type Tab = 'overview' | 'profile' | 'applications' | 'saved';

// // ── Profile Edit Form ─────────────────────────────────────────────────────────
// const ProfileForm = ({ profile, onSaved }: { profile: any; onSaved: () => void }) => {
//   const qc = useQueryClient();
//   const fileRef = useRef<HTMLInputElement>(null);
//   const cvRef = useRef<HTMLInputElement>(null);
//   const [form, setForm] = useState({
//     first_name: profile?.first_name || '',
//     last_name: profile?.last_name || '',
//     phone: profile?.phone || '',
//     headline: profile?.headline || '',
//     current_location: profile?.current_location || '',
//     preferred_location: profile?.preferred_location || '',
//     skills: profile?.skills || '',
//     experience: profile?.experience || '',
//     education: profile?.education || '',
//     linkedin_url: profile?.linkedin_url || '',
//     portfolio_url: profile?.portfolio_url || '',
//   });
//   const [photoFile, setPhotoFile] = useState<File | null>(null);
//   const [cvFile, setCvFile] = useState<File | null>(null);

//   const mutation = useMutation({
//     mutationFn: (fd: FormData) => candidateAPI.updateProfile(fd),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['candidate-dashboard'] });
//       onSaved();
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const fd = new FormData();
//     Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//     if (photoFile) fd.append('profile_photo', photoFile);
//     if (cvFile) fd.append('cv_file', cvFile);
//     mutation.mutate(fd);
//   };

//   const inp = 'input-field text-sm';

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Profile Photo */}
//       <div className="flex items-center gap-5">
//         <div className="relative">
//           {profile?.profile_photo ? (
//             <img src={profile.profile_photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-black/30" />
//           ) : (
//             <div className="w-20 h-20 rounded-full bg-black/20 flex items-center justify-center font-display font-bold text-black text-2xl">
//               {form.first_name?.[0] || 'U'}
//             </div>
//           )}
//           <button type="button" onClick={() => fileRef.current?.click()}
//             className="absolute -bottom-1 -right-1 w-7 h-7 bg-black flex items-center justify-center rounded-full hover:bg-accent-light transition-colors">
//             <Upload className="w-3 h-3 text-black" />
//           </button>
//           <input ref={fileRef} type="file" accept="image/*" className="hidden"
//             onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
//         </div>
//         <div>
//           <p className="text-black font-heading font-semibold text-sm">{form.first_name} {form.last_name}</p>
//           <p className="text-gray-medium text-xs font-body">{form.headline || 'Add a headline'}</p>
//           {photoFile && <p className="text-black text-xs mt-1">{photoFile.name}</p>}
//         </div>
//       </div>

//       {/* Basic Info */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-2 block">First Name</label>
//           <input className={inp} value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
//         </div>
//         <div>
//           <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-2 block">Last Name</label>
//           <input className={inp} value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
//         </div>
//         <div>
//           <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-2 block">Phone</label>
//           <input className={inp} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
//         </div>
//         <div>
//           <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-2 block">Professional Headline</label>
//           <input className={inp} placeholder="e.g. Senior Software Engineer" value={form.headline}
//             onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} />
//         </div>
//         <div>
//           <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-2 block">Current Location</label>
//           <input className={inp} value={form.current_location} onChange={e => setForm(f => ({ ...f, current_location: e.target.value }))} />
//         </div>
//         <div>
//           <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-2 block">Preferred Location</label>
//           <input className={inp} value={form.preferred_location} onChange={e => setForm(f => ({ ...f, preferred_location: e.target.value }))} />
//         </div>
//         <div>
//           <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-2 block">LinkedIn URL</label>
//           <input className={inp} type="url" value={form.linkedin_url} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} />
//         </div>
//         <div>
//           <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-2 block">Portfolio / Website</label>
//           <input className={inp} type="url" value={form.portfolio_url} onChange={e => setForm(f => ({ ...f, portfolio_url: e.target.value }))} />
//         </div>
//       </div>

//       {/* Textarea fields */}
//       {[
//         { key: 'skills', label: 'Skills (comma separated)' },
//         { key: 'experience', label: 'Work Experience' },
//         { key: 'education', label: 'Education' },
//       ].map(({ key, label }) => (
//         <div key={key}>
//           <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-2 block">{label}</label>
//           <textarea rows={3} className={`${inp} resize-none`}
//             value={(form as any)[key]}
//             onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
//         </div>
//       ))}

//       {/* CV Upload */}
//       <div>
//         <label className="text-gray-medium text-xs font-display uppercase tracking-wider mb-2 block">Upload CV (PDF/DOC/DOCX, max 5MB)</label>
//         <div className="flex items-center gap-3">
//           <button type="button" onClick={() => cvRef.current?.click()}
//             className="btn-outline text-xs py-2 px-4">
//             <Upload className="w-3.5 h-3.5" /> {cvFile ? cvFile.name : 'Choose File'}
//           </button>
//           {profile?.cv_file && (
//             <a href={profile.cv_file} download className="flex items-center gap-1.5 text-black hover:text-black-light text-xs font-body transition-colors">
//               <Download className="w-3.5 h-3.5" /> Current CV
//             </a>
//           )}
//         </div>
//         <input ref={cvRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
//           onChange={e => setCvFile(e.target.files?.[0] || null)} />
//       </div>

//       <div className="flex items-center gap-3">
//         <button type="submit" disabled={mutation.isPending} className="btn-primary text-sm">
//           {mutation.isPending ? 'Saving...' : 'Save Profile'}
//         </button>
//         {mutation.isSuccess && (
//           <span className="text-green-400 text-xs font-body flex items-center gap-1">
//             <CheckCircle className="w-3.5 h-3.5" /> Saved successfully
//           </span>
//         )}
//         {mutation.isError && (
//           <span className="text-red-400 text-xs font-body flex items-center gap-1">
//             <AlertCircle className="w-3.5 h-3.5" /> Failed to save
//           </span>
//         )}
//       </div>
//     </form>
//   );
// };

// // ── Main Dashboard ────────────────────────────────────────────────────────────
// const CandidateDashboard = () => {
//   const { user, logout, isLoading: authLoading } = useAuth();
//   const [tab, setTab] = useState<Tab>('overview');

//   const { data, isLoading } = useQuery({
//     queryKey: ['candidate-dashboard'],
//     queryFn: () => candidateAPI.dashboard().then(r => r.data),
//     enabled: !!user,
//   });

//   if (authLoading) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
//     </div>
//   );

//   if (!user) return <Navigate to="/" replace />;
//   if (user.role !== 'candidate') return <Navigate to={user.role === 'employer' ? '/recruiter/dashboard' : '/admin'} replace />;

//   const profile = data?.profile;
//   const applications: any[] = data?.applications || [];
//   const savedJobs: any[] = data?.saved_jobs || [];
//   const stats = data?.stats;

//   const TABS = [
//     { id: 'overview', label: 'Overview', icon: User },
//     { id: 'profile', label: 'My Profile', icon: Edit3 },
//     { id: 'applications', label: `Applications (${stats?.total_applications ?? 0})`, icon: FileText },
//     { id: 'saved', label: `Saved Jobs (${stats?.total_saved ?? 0})`, icon: Bookmark },
//   ] as const;

//   return (
//     <div className="min-h-screen bg-white pt-24">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//           <div className="flex items-center gap-4">
//             {profile?.profile_photo ? (
//               <img src={profile.profile_photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-black/30" />
//             ) : (
//               <div className="w-16 h-16 rounded-full bg-black/20 flex items-center justify-center font-display font-bold text-black text-xl">
//                 {user.first_name?.[0] || user.email[0].toUpperCase()}
//               </div>
//             )}
//             <div>
//               <div className="mb-2">
//                 <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
//                   <span className="font-display font-black text-lg text-black tracking-tight">OPTIMUS</span>
//                   <span className="font-display font-light text-lg text-black tracking-tight ml-1">MANPOWER</span>
//                 </Link>
//               </div>
//               <h1 className="font-display font-black text-2xl text-black">
//                 {user.first_name} {user.last_name}
//               </h1>
//               <p className="text-gray-medium text-sm font-body">{profile?.headline || user.email}</p>
//               {profile?.current_location && (
//                 <p className="text-gray-light text-xs font-body flex items-center gap-1 mt-0.5">
//                   <MapPin className="w-3 h-3" /> {profile.current_location}
//                 </p>
//               )}
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <Link to="/jobs" className="btn-outline text-xs py-2 px-5">
//               <Briefcase className="w-3.5 h-3.5" /> Browse Jobs
//             </Link>
//             <button onClick={logout} className="flex items-center gap-2 text-gray-medium hover:text-red-400 text-sm font-body transition-colors">
//               <LogOut className="w-4 h-4" /> Logout
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex items-center gap-1 mb-8 border-b border-gray-light overflow-x-auto pb-px">
//           {TABS.map(({ id, label, icon: Icon }) => (
//             <button key={id} onClick={() => setTab(id as Tab)}
//               className={`flex items-center gap-2 px-4 py-3 text-sm font-body whitespace-nowrap transition-all border-b-2 -mb-px ${
//                 tab === id
//                   ? 'border-black text-black'
//                   : 'border-transparent text-gray-medium hover:text-black'
//               }`}>
//               <Icon className="w-4 h-4" /> {label}
//             </button>
//           ))}
//         </div>

//         <AnimatePresence mode="wait">
//           <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

//             {/* ── Overview ── */}
//             {tab === 'overview' && (
//               <div className="space-y-6">
//                 {/* Stats */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {[
//                     { label: 'Applications', value: stats?.total_applications ?? 0, color: 'text-black' },
//                     { label: 'Saved Jobs', value: stats?.total_saved ?? 0, color: 'text-blue-400' },
//                     { label: 'Shortlisted', value: stats?.status_breakdown?.Shortlisted ?? 0, color: 'text-green-400' },
//                     { label: 'Hired', value: stats?.status_breakdown?.Hired ?? 0, color: 'text-emerald-400' },
//                   ].map(({ label, value, color }) => (
//                     <div key={label} className="card p-5">
//                       <p className="text-gray-light text-xs font-body mb-1">{label}</p>
//                       <p className={`font-display font-black text-3xl ${color}`}>{isLoading ? '—' : value}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Application Status Breakdown */}
//                 {stats?.status_breakdown && (
//                   <div className="card p-6">
//                     <h2 className="font-heading font-semibold text-black text-sm mb-5">Application Status</h2>
//                     <div className="flex flex-wrap gap-3">
//                       {Object.entries(stats.status_breakdown).map(([s, count]) => {
//                         const cfg = STATUS_CONFIG[s];
//                         if (!cfg) return null;
//                         return (
//                           <div key={s} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-semibold ${cfg.color}`}>
//                             <cfg.icon className="w-3.5 h-3.5" /> {s}: {count as number}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}

//                 {/* Recent Applications */}
//                 <div className="card p-6">
//                   <div className="flex items-center justify-between mb-5">
//                     <h2 className="font-heading font-semibold text-black text-sm">Recent Applications</h2>
//                     <button onClick={() => setTab('applications')} className="text-black text-xs font-body hover:text-black-light transition-colors flex items-center gap-1">
//                       View All <ChevronRight className="w-3.5 h-3.5" />
//                     </button>
//                   </div>
//                   {applications.slice(0, 5).length > 0 ? (
//                     <div className="space-y-3">
//                       {applications.slice(0, 5).map((app: any) => {
//                         const cfg = STATUS_CONFIG[app.status] || { color: 'bg-gray-50 text-gray-medium', icon: Clock };
//                         return (
//                           <div key={app.id} className="flex items-center justify-between py-3 border-b border-gray-light last:border-0">
//                             <div>
//                               <p className="text-gray-dark font-body text-sm">{app.job_title}</p>
//                               <p className="text-gray-medium text-xs font-body">{app.company_name} · {new Date(app.created_at).toLocaleDateString()}</p>
//                             </div>
//                             <span className={`status-badge text-xs ${cfg.color}`}>{app.status}</span>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <p className="text-gray-light font-body text-sm mb-3">No applications yet</p>
//                       <Link to="/jobs" className="btn-primary text-xs py-2 px-5">Browse Jobs</Link>
//                     </div>
//                   )}
//                 </div>

//                 {/* Profile completeness prompt */}
//                 {profile && !profile.phone && (
//                   <div className="card p-5 border-black/20 bg-black/5">
//                     <div className="flex items-center gap-3">
//                       <Settings className="w-5 h-5 text-black shrink-0" />
//                       <div className="flex-1">
//                         <p className="text-black font-body text-sm">Complete your profile to stand out</p>
//                         <p className="text-gray-medium text-xs mt-0.5">Add your phone, skills, and experience to get better job matches.</p>
//                       </div>
//                       <button onClick={() => setTab('profile')} className="btn-primary text-xs py-2 px-4 shrink-0">Edit Profile</button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── Profile ── */}
//             {tab === 'profile' && (
//               <div className="card p-6 md:p-8 max-w-3xl">
//                 <h2 className="font-heading font-semibold text-black text-sm mb-6">Edit Profile</h2>
//                 {profile ? (
//                   <ProfileForm profile={profile} onSaved={() => {}} />
//                 ) : (
//                   <div className="flex items-center justify-center py-8">
//                     <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── Applications ── */}
//             {tab === 'applications' && (
//               <div className="space-y-4">
//                 <h2 className="font-heading font-semibold text-black text-sm">My Applications</h2>
//                 {applications.length > 0 ? (
//                   applications.map((app: any) => {
//                     const cfg = STATUS_CONFIG[app.status] || { color: 'bg-gray-50 text-gray-medium', icon: Clock };
//                     return (
//                       <div key={app.id} className="card p-5">
//                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
//                           <div className="flex-1">
//                             <div className="flex items-start gap-3">
//                               <div className="w-10 h-10 bg-black/10 flex items-center justify-center shrink-0">
//                                 <Briefcase className="w-4 h-4 text-black" />
//                               </div>
//                               <div>
//                                 <p className="text-black font-heading font-semibold text-sm">{app.job_title}</p>
//                                 <p className="text-gray-medium text-xs font-body">{app.company_name}</p>
//                                 {app.job_location && (
//                                   <p className="text-gray-light text-xs font-body flex items-center gap-1 mt-0.5">
//                                     <MapPin className="w-3 h-3" /> {app.job_location}
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-3">
//                             <span className={`status-badge text-xs ${cfg.color}`}>
//                               <cfg.icon className="w-3 h-3" /> {app.status}
//                             </span>
//                             <p className="text-gray-light text-xs font-body">{new Date(app.created_at).toLocaleDateString()}</p>
//                           </div>
//                         </div>
//                         {/* Progress tracker */}
//                         <div className="mt-4 flex items-center gap-1 overflow-x-auto">
//                           {['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Hired'].map((s, i) => {
//                             const steps = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Hired'];
//                             const currentIdx = steps.indexOf(app.status);
//                             const stepIdx = steps.indexOf(s);
//                             const done = currentIdx >= stepIdx && app.status !== 'Rejected';
//                             return (
//                               <React.Fragment key={s}>
//                                 <div className={`flex items-center gap-1 text-xs font-body whitespace-nowrap ${done ? 'text-black' : 'text-gray-light'}`}>
//                                   <div className={`w-2 h-2 rounded-full ${done ? 'bg-black' : 'bg-gray-50'}`} />
//                                   {s}
//                                 </div>
//                                 {i < 4 && <div className={`flex-1 h-px min-w-[16px] ${done && currentIdx > stepIdx ? 'bg-black/40' : 'bg-gray-50'}`} />}
//                               </React.Fragment>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <div className="card p-12 text-center">
//                     <FileText className="w-10 h-10 text-gray-light mx-auto mb-3" />
//                     <p className="text-gray-light font-body text-sm mb-4">You haven't applied to any jobs yet</p>
//                     <Link to="/jobs" className="btn-primary text-sm">Browse Jobs</Link>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── Saved Jobs ── */}
//             {tab === 'saved' && (
//               <div className="space-y-4">
//                 <h2 className="font-heading font-semibold text-black text-sm">Saved Jobs</h2>
//                 {savedJobs.length > 0 ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {savedJobs.map((item: any) => (
//                       <Link key={item.id} to={`/jobs/${item.job.id}`} className="card p-5 block group hover:border-black/40 transition-all">
//                         <p className="text-black font-heading font-semibold text-sm group-hover:text-black transition-colors">{item.job.title}</p>
//                         <p className="text-gray-medium text-xs font-body mt-0.5">{item.job.company_name}</p>
//                         <div className="flex items-center gap-3 mt-3 text-gray-light text-xs font-body">
//                           <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.job.location}</span>
//                           <span className="status-badge bg-gray-50 text-gray-medium text-xs">{item.job.job_type}</span>
//                         </div>
//                         <p className="text-gray-light text-xs font-body mt-2">Saved {new Date(item.created_at).toLocaleDateString()}</p>
//                       </Link>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="card p-12 text-center">
//                     <Bookmark className="w-10 h-10 text-gray-light mx-auto mb-3" />
//                     <p className="text-gray-light font-body text-sm mb-4">No saved jobs yet</p>
//                     <Link to="/jobs" className="btn-primary text-sm">Browse Jobs</Link>
//                   </div>
//                 )}
//               </div>
//             )}

//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default CandidateDashboard;


