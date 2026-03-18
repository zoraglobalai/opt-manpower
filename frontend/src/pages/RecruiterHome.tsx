import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Users, Globe, Layers, Cpu, Award } from 'lucide-react';
import { contentAPI } from '../services/api';

const SOLUTIONS = [
  { icon: Users, title: 'General Staffing', desc: 'Mass hiring solutions for blue-collar and entry-level positions across sectors.' },
  { icon: Award, title: 'Professional Staffing', desc: 'Mid to senior level professional placements with domain expertise.' },
  { icon: Layers, title: 'Permanent Recruitment', desc: 'End-to-end permanent placement services with guaranteed delivery timelines.' },
  { icon: Cpu, title: 'Executive Search', desc: 'Confidential C-suite and board-level executive talent acquisition.' },
  { icon: Globe, title: 'International Recruitment', desc: 'Cross-border talent solutions with full visa and relocation support.' },
];

const RecruiterHome = () => {
  const [form, setForm] = useState({
    company_name: '', contact_person: '', email: '', phone: '',
    hiring_requirement: '', number_of_positions: '1', job_location: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await contentAPI.employerEnquiry({ ...form, number_of_positions: Number(form.number_of_positions) });
      setSubmitted(true);
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80&auto=format&fit=crop"
            alt="Business team"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/85 to-primary" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 pt-48">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="section-tag mb-6">
              Employer Solutions
            </motion.p>
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
              className="font-display font-black text-5xl md:text-6xl lg:text-7xl text-black leading-[1.05] max-w-3xl mb-6"
            >
              Delivering the right <br />
              <span className="text-black">workforce solutions</span><br />
              at the right time.
            </motion.h1>
            <motion.p
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="text-gray-medium text-lg font-body max-w-lg leading-relaxed mb-10"
            >
              From general staffing to executive search — Optimus Manpower is your trusted recruitment partner across India and globally.
            </motion.p>
            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="flex flex-wrap gap-4">
              <a href="#enquiry" className="btn-primary">Business Enquiry <ArrowRight className="w-4 h-4" /></a>
              <a href="#solutions" className="btn-outline">Our Solutions</a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="section-tag mb-3">What We Do</p>
            <h2 className="section-title">Our <span className="text-black">Solutions</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOLUTIONS.map((s, i) => (
              <motion.div key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-8 group"
              >
                <div className="w-11 h-11 bg-black/10 flex items-center justify-center mb-5 group-hover:bg-black/20 transition-colors">
                  <s.icon className="w-5 h-5 text-black" />
                </div>
                <h3 className="font-heading font-semibold text-black text-base mb-3">{s.title}</h3>
                <p className="text-gray-medium text-xs font-body leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry" className="py-24 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="section-tag mb-3">Get in Touch</p>
          <h2 className="section-title">Business <span className="text-black">Enquiry</span></h2>
        </div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card p-12 text-center">
            <CheckCircle className="w-16 h-16 text-black mx-auto mb-6" />
            <h3 className="font-display font-bold text-2xl text-black mb-3">Enquiry Submitted!</h3>
            <p className="text-gray-medium font-body">Our team will connect with you within 24 business hours.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-8 space-y-4">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'company_name', label: 'Company Name', required: true },
                { name: 'contact_person', label: 'Contact Person', required: true },
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'phone', label: 'Phone Number', required: true },
                { name: 'hiring_requirement', label: 'Hiring Requirement', required: true },
                { name: 'number_of_positions', label: 'Number of Positions', type: 'number', required: true },
                { name: 'job_location', label: 'Job Location', required: true },
              ].map(({ name, label, type, required }) => (
                <div key={name}>
                  <label className="text-gray-medium text-xs font-body block mb-1">{label}{required && ' *'}</label>
                  <input
                    type={type || 'text'}
                    value={(form as any)[name]}
                    onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                    required={required}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="text-gray-medium text-xs font-body block mb-1">Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4} className="input-field resize-none" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
              {loading ? 'Sending...' : 'Submit Enquiry'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default RecruiterHome;


