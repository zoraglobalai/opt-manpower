import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { adminAPI } from '../services/api';

interface AdminJobFormProps {
  job?: any;
  onClose: () => void;
}

const AdminJobForm = ({ job, onClose }: AdminJobFormProps) => {
  const isEdit = !!job;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: job?.title || '',
    company_name: job?.company_name || '',
    description: job?.description || '',
    location: job?.location || '',
    country: job?.country || 'India',
    experience: job?.experience || '',
    salary: job?.salary || '',
    job_type: job?.job_type || 'Full Time',
    category: job?.category || '',
    visa_type: job?.visa_type || '',
    is_international: job?.is_international || false,
    requirements: job?.requirements || '',
    benefits: job?.benefits || '',
    status: job?.status || 'Published',
    deadline: job?.deadline || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await adminAPI.updateJob(job.id, form);
      } else {
        await adminAPI.createJob(form);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Failed to save job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center px-4 py-8 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-3xl bg-white border border-gray-light shadow-lg my-auto"
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-light">
          <h2 className="font-display font-bold text-lg text-black">{isEdit ? 'Edit Job' : 'Add New Job'}</h2>
          <button onClick={onClose} className="text-gray-medium hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'title', label: 'Job Title *', required: true },
              { name: 'company_name', label: 'Company Name *', required: true },
              { name: 'location', label: 'Location *', required: true },
              { name: 'country', label: 'Country *', required: true },
              { name: 'experience', label: 'Experience Required *', required: true },
              { name: 'salary', label: 'Salary Range' },
              { name: 'category', label: 'Category *', required: true },
              { name: 'visa_type', label: 'Visa Type (International)' },
              { name: 'deadline', label: 'Application Deadline', type: 'date' },
            ].map(({ name, label, required, type }) => (
              <div key={name}>
                <label className="text-gray-medium text-xs font-body block mb-1">{label}</label>
                <input
                  type={type || 'text'}
                  value={(form as any)[name]}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                  required={required}
                  className="input-field"
                />
              </div>
            ))}

            <div>
              <label className="text-gray-medium text-xs font-body block mb-1">Job Type *</label>
              <select value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })} className="input-field">
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Contract</option>
              </select>
            </div>
            <div>
              <label className="text-gray-medium text-xs font-body block mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                <option>Published</option>
                <option>Draft</option>
                <option>Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-gray-medium text-xs font-body block mb-1">Job Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              required rows={4} className="input-field resize-none" />
          </div>
          <div>
            <label className="text-gray-medium text-xs font-body block mb-1">Requirements</label>
            <textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              rows={3} className="input-field resize-none" />
          </div>
          <div>
            <label className="text-gray-medium text-xs font-body block mb-1">Benefits</label>
            <textarea value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })}
              rows={2} className="input-field resize-none" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_international" checked={form.is_international}
              onChange={(e) => setForm({ ...form, is_international: e.target.checked })}
              className="w-4 h-4 accent-black" />
            <label htmlFor="is_international" className="text-gray-medium text-sm font-body cursor-pointer">
              This is an International Job
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? 'Saving...' : isEdit ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminJobForm;

