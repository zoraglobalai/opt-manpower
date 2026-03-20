import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Briefcase, DollarSign, Clock, ArrowLeft, Share2, Bookmark, BookmarkCheck,
  CheckCircle, X, AlertCircle, Upload, Globe,
} from 'lucide-react';
import { jobsAPI, applicationsAPI } from '../services/api';

const EXP_YEARS = ['< 1 year', '1 year', '2 years', '3 years', '4 years', '5 years', '6-8 years', '8-10 years', '10+ years'];

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [applyModal, setApplyModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Local storage for saved jobs
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('saved_jobs');
      if (stored) setSavedJobIds(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to parse saved jobs", e);
    }
  }, []);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    is_experienced: false,
    years_of_experience: '',
    previous_company: '',
    role: '',
  });
  const [experienceSelected, setExperienceSelected] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['job', id], queryFn: () => jobsAPI.detail(id!) });
  
  const isSaved = savedJobIds.includes(id!);

  const toggleSaveJob = () => {
    let newSaved = [...savedJobIds];
    if (isSaved) {
      newSaved = newSaved.filter(savedId => savedId !== id);
    } else {
      newSaved.push(id!);
    }
    setSavedJobIds(newSaved);
    localStorage.setItem('saved_jobs', JSON.stringify(newSaved));
  };

  const job = data?.data;

  const handleApplyClick = () => {
    setApplyModal(true);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: job?.title, text: `Check out this job at ${job?.company_name}`, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { setError('Only PDF, DOC, DOCX files allowed.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('File must be less than 5 MB.'); return; }
    setCvFile(file); setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate mandatory fields
    if (!form.name.trim()) { setError('Full Name is required.'); return; }
    if (!form.email.trim()) { setError('Email is required.'); return; }
    if (!form.phone.trim()) { setError('Phone Number is required.'); return; }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { setError('Phone Number must be valid (10 digits, starting with 6-9).'); return; }
    if (!form.qualification.trim()) { setError('Highest Qualification is required.'); return; }
    if (!experienceSelected) { setError('Please select whether you are a Fresher or Experienced.'); return; }
    if (form.is_experienced && !form.years_of_experience) { setError('Total Experience is required for experienced candidates.'); return; }
    if (form.is_experienced && !form.previous_company.trim()) { setError('Current/Previous Company is required for experienced candidates.'); return; }
    if (form.is_experienced && !form.role.trim()) { setError('Current Role/Position is required for experienced candidates.'); return; }
    if (!cvFile) { setError('Please upload your CV / Resume.'); return; }
    
    setSubmitting(true); setError('');
    try {
      const fd = new FormData();
      fd.append('job', id!);
      fd.append('resume', cvFile);
      
      // Append form fields - map 'name' to 'full_name'
      Object.entries(form).forEach(([k, v]) => {
        const key = k === 'name' ? 'full_name' : k;
        if (typeof v === 'boolean') {
           fd.append(key, v ? 'True' : 'False');
        } else {
           fd.append(key, v);
        }
      });
      
      await applicationsAPI.apply(fd);
      setSubmitted(true);
      setForm({
        name: '', email: '', phone: '', qualification: '', is_experienced: false,
        years_of_experience: '', previous_company: '', role: ''
      });
      setCvFile(null);
      setExperienceSelected(false);
    } catch (err: any) {
      const detail = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0];
      if (detail?.toLowerCase().includes('already exists')) {
        setSubmitted(true); // treat already-applied as submitted too
      } else {
        setError(detail || Object.values(err.response?.data || {}).flat().join(' ') || 'Failed to submit. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return (
    <main className="min-h-screen pt-28 max-w-4xl mx-auto px-4">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-50 rounded w-2/3" />
        <div className="h-4 bg-gray-50 rounded w-1/3" />
        <div className="h-40 bg-gray-50 rounded" />
      </div>
    </main>
  );

  if (!job) return <main className="min-h-screen pt-28 max-w-4xl mx-auto px-4 text-gray-medium font-body">Job not found.</main>;

  return (
    <main className="min-h-screen pt-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-light py-10">
        <div className="max-w-5xl mx-auto px-4">
          <Link to="/jobs" className="inline-flex items-center gap-2 text-gray-medium hover:text-black text-sm font-body mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`status-badge text-xs ${job.is_international ? 'bg-black/15 text-black' : 'bg-gray-50 text-gray-medium'}`}>
                  {job.is_international ? <><Globe className="w-3 h-3 inline mr-1" />International</> : '🇮🇳 Domestic'}
                </span>
                <span className="status-badge bg-gray-50 text-gray-medium">{job.job_type}</span>
                <span className="status-badge bg-gray-50 text-gray-medium">{job.category}</span>
              </div>
              <h1 className="font-display font-black text-3xl md:text-4xl text-black mb-2">{job.title}</h1>
              <p className="text-black font-heading font-semibold text-lg">{job.company_name}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {/* Share Button */}
              <button onClick={handleShare} className="p-2.5 text-sm text-gray-medium hover:text-black transition-colors relative" title="Share">
                <Share2 className="w-4 h-4" />
                {copied && (
                  <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-white border border-gray-light px-2 py-1 whitespace-nowrap text-black">
                    Link copied!
                  </motion.span>
                )}
              </button>
              {/* Save Button */}
              <button onClick={toggleSaveJob} className={`p-2.5 text-sm transition-colors ${isSaved ? 'text-black' : 'text-gray-medium hover:text-black'}`} title={isSaved ? 'Saved' : 'Save Job'}>
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
              <button onClick={handleApplyClick} className="btn-primary">Apply Now</button>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-6 text-sm font-body text-gray-medium">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}, {job.country}</span>
            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.experience}</span>
            {job.salary && <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {job.salary}</span>}
            {job.deadline && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Apply by {new Date(job.deadline).toLocaleDateString()}</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="font-heading font-semibold text-black text-lg mb-4">Job Description</h2>
            <p className="text-gray-medium font-body text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
          </section>
          {job.requirements && (
            <section>
              <h2 className="font-heading font-semibold text-black text-lg mb-4">Requirements</h2>
              <p className="text-gray-medium font-body text-sm leading-relaxed whitespace-pre-line">{job.requirements}</p>
            </section>
          )}
          {job.benefits && (
            <section>
              <h2 className="font-heading font-semibold text-black text-lg mb-4">Benefits</h2>
              <p className="text-gray-medium font-body text-sm leading-relaxed whitespace-pre-line">{job.benefits}</p>
            </section>
          )}
        </div>

        <aside>
          <div className="card p-6 sticky top-28">
            <h3 className="font-heading font-semibold text-black text-sm mb-5">Job Overview</h3>
            <div className="space-y-4">
              {[
                { label: 'Location', value: `${job.location}, ${job.country}` },
                { label: 'Experience', value: job.experience },
                { label: 'Job Type', value: job.job_type },
                { label: 'Category', value: job.category },
                ...(job.salary ? [{ label: 'Salary', value: job.salary }] : []),
                ...(job.visa_type ? [{ label: 'Visa Type', value: job.visa_type }] : []),
                { label: 'Job Type', value: job.is_international ? 'International' : 'Domestic' },
              ].map(({ label, value }) => (
                <div key={label + value}>
                  <p className="text-gray-light text-xs font-body">{label}</p>
                  <p className="text-black text-sm font-heading font-medium mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <button onClick={handleApplyClick} className="btn-primary w-full justify-center mt-8 text-sm">
              Apply for this Position
            </button>
          </div>
        </aside>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {applyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center px-4 py-8 overflow-y-auto"
            onClick={() => !submitted && setApplyModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-white border border-gray-light shadow-2xl my-auto">
              {submitted ? (
                <div className="p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-black mx-auto mb-6" />
                  <h3 className="font-display font-bold text-2xl text-black mb-3">Application Submitted!</h3>
                  <p className="text-gray-medium font-body text-sm mb-8">
                    Thank you for applying to <strong className="text-black">{job.title}</strong> at <strong className="text-black">{job.company_name}</strong>. We'll review your profile and get back to you soon.
                  </p>
                  <button onClick={() => { setApplyModal(false); setSubmitted(false); }} className="btn-primary">Close</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between px-8 py-6 border-b border-gray-light">
                    <div>
                      <p className="section-tag mb-1">Apply Now</p>
                      <h3 className="font-display font-bold text-xl text-black">{job.title}</h3>
                      <p className="text-black text-sm font-body">{job.company_name}</p>
                    </div>
                    <button onClick={() => setApplyModal(false)} className="text-gray-light hover:text-black"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
                    {error && (
                      <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
                      </div>
                    )}

                    {/* Personal Details */}
                    <div>
                      <h4 className="text-gray-medium text-xs font-display uppercase tracking-wide mb-3">Personal Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-gray-medium text-xs font-body block mb-1">Full Name *</label>
                          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="input-field w-full" />
                        </div>
                        <div>
                          <label className="text-gray-medium text-xs font-body block mb-1">Email *</label>
                          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="input-field w-full" />
                        </div>
                        <div>
                          <label className="text-gray-medium text-xs font-body block mb-1">Phone Number *</label>
                          <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required className="input-field w-full" />
                        </div>
                        <div>
                          <label className="text-gray-medium text-xs font-body block mb-1">Highest Qualification *</label>
                          <input type="text" value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} required placeholder="e.g. Master's in CS" className="input-field w-full" />
                        </div>
                      </div>
                    </div>

                    {/* Skills & Experience */}
                    <div>
                      <h4 className="text-gray-medium text-xs font-display uppercase tracking-wide mb-3">Experience</h4>

                      <div className="mb-3 flex gap-4">
                        <label className="flex items-center gap-2 text-sm font-body text-gray-medium cursor-pointer">
                          <input 
                            type="radio" 
                            checked={!form.is_experienced && experienceSelected} 
                            onChange={() => { setForm({ ...form, is_experienced: false }); setExperienceSelected(true); }} 
                          />
                          Fresher
                        </label>
                        <label className="flex items-center gap-2 text-sm font-body text-gray-medium cursor-pointer">
                          <input 
                            type="radio" 
                            checked={form.is_experienced && experienceSelected} 
                            onChange={() => { setForm({ ...form, is_experienced: true }); setExperienceSelected(true); }} 
                          />
                          Experienced
                        </label>
                      </div>
                      {!experienceSelected && <p className="text-red-400 text-xs font-body mb-2">Please select your experience level *</p>}

                      <AnimatePresence>
                        {form.is_experienced && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 pt-2">
                              <div>
                                <label className="text-gray-medium text-xs font-body block mb-1">Total Experience *</label>
                                <select value={form.years_of_experience} onChange={e => setForm({ ...form, years_of_experience: e.target.value })} required={form.is_experienced} className="input-field w-full">
                                  <option value="">Select Experience</option>
                                  {EXP_YEARS.map(x => <option key={x} value={x}>{x}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="text-gray-medium text-xs font-body block mb-1">Current/Previous Company *</label>
                                <input value={form.previous_company} onChange={e => setForm({ ...form, previous_company: e.target.value })} required={form.is_experienced} className="input-field w-full" />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="text-gray-medium text-xs font-body block mb-1">Current Role/Position *</label>
                                <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required={form.is_experienced} placeholder="e.g. Senior Software Engineer" className="input-field w-full" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* CV Upload */}
                    <div>
                      <label className="text-gray-medium text-xs font-body block mb-2">Upload CV / Resume * (PDF, DOC, DOCX — max 5 MB)</label>
                      <label className={`flex flex-col items-center gap-2 p-6 border border-dashed cursor-pointer transition-colors ${cvFile ? 'border-black/40 bg-black/5' : 'border-gray-light hover:border-black/40'}`}>
                        <Upload className="w-6 h-6 text-gray-light" />
                        <span className="text-gray-medium text-sm font-body">{cvFile ? cvFile.name : 'Click to choose file'}</span>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setApplyModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                      <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
                        {submitting ? 'Submitting...' : 'Submit Form'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default JobDetails;


