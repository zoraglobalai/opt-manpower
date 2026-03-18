import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Building2, Phone, Eye, EyeOff, AlertCircle, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onSuccess?: () => void;
}

type RoleType = 'candidate' | 'employer';

const AuthModal = ({ onClose, defaultMode = 'login', onSuccess }: AuthModalProps) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [role, setRole] = useState<RoleType>('candidate');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '', password: '', first_name: '', last_name: '',
    phone: '', company_name: '', skills: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode); setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register({
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
          role,
          phone: form.phone,
          ...(role === 'employer' ? { company_name: form.company_name } : { skills: form.skills }),
        });
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      const data = err.response?.data;
      const msgs = data
        ? Object.values(data).flat().join(' ')
        : 'Something went wrong. Please try again.';
      setError(msgs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 overflow-y-auto py-8">
        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-md bg-white border border-gray-light shadow-lg my-auto">

          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-light">
            <div>
              <p className="section-tag mb-1">Optimus Manpower</p>
              <h2 className="font-display font-bold text-xl text-black">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
            </div>
            <button onClick={onClose} className="text-gray-medium hover:text-black transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
              </div>
            )}

            {/* Role Selector (register only) */}
            {mode === 'register' && (
              <div>
                <p className="text-gray-medium text-xs font-body mb-2">I am a...</p>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setRole('candidate')}
                    className={`flex items-center justify-center gap-2 py-3 text-sm font-body border transition-all ${role === 'candidate' ? 'bg-black/10 border-black text-black' : 'border-gray-light text-gray-medium hover:border-gray-medium'}`}>
                    <User className="w-4 h-4" /> Job Seeker
                  </button>
                  <button type="button" onClick={() => setRole('employer')}
                    className={`flex items-center justify-center gap-2 py-3 text-sm font-body border transition-all ${role === 'employer' ? 'bg-black/10 border-black text-black' : 'border-gray-light text-gray-medium hover:border-gray-medium'}`}>
                    <Briefcase className="w-4 h-4" /> Employer / Recruiter
                  </button>
                </div>
              </div>
            )}

            {/* Name fields (register only) */}
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
                  <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required className="input-field pl-10" />
                </div>
                <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required className="input-field" />
              </div>
            )}

            {/* Company Name (employer register only) */}
            {mode === 'register' && role === 'employer' && (
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
                <input name="company_name" placeholder="Company Name *" value={form.company_name} onChange={handleChange} required className="input-field pl-10" />
              </div>
            )}

            {/* Skills (candidate register only) */}
            {mode === 'register' && role === 'candidate' && (
              <input name="skills" placeholder="Your skills (e.g. React, Python, Sales)" value={form.skills} onChange={handleChange} className="input-field" />
            )}

            {/* Phone (register only) */}
            {mode === 'register' && (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
                <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="input-field pl-10" />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
              <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required className="input-field pl-10" />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
              <input name="password" type={showPass ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={handleChange} required className="input-field pl-10 pr-10" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-black">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : `Create ${role === 'employer' ? 'Employer' : 'Job Seeker'} Account`}
            </button>
          </form>

          <div className="px-8 pb-6 text-center">
            <p className="text-sm font-body text-gray-medium">
              {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
              <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')} className="text-black hover:text-black transition-colors font-semibold">
                {mode === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;


