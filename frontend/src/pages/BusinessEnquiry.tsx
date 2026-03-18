import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Building2, Mail, Phone, Clock, ShieldCheck, Zap, Star } from 'lucide-react';
import { contentAPI } from '../services/api';

const BusinessEnquiry = () => {
  const [form, setForm] = useState({
    company_name: '', contact_person: '', email: '', phone: '',
    hiring_requirement: '', number_of_positions: '1', job_location: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await contentAPI.employerEnquiry({ ...form, number_of_positions: Number(form.number_of_positions) });
      setSubmitted(true);
    } catch { setError('Failed to submit. Please try again or call us directly.'); }
    finally { setLoading(false); }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 0) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } 
    }),
  };

  return (
    <main className="min-h-screen pt-24 bg-gray-50/50">
      {/* ── Header ── */}
      <section className="bg-white border-b border-gray-light py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.p variants={fadeUp} className="section-tag mb-4">Partner With Us</motion.p>
            <motion.h1 variants={fadeUp} className="section-title mb-6 text-black">
              Business <span className="text-black/60">Enquiry</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-medium font-body text-lg max-w-2xl mx-auto leading-relaxed">
              Scale your team with the right talent. Fill out the form below and our recruitment consultants will contact you within 24 business hours.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* ── Sidebar Info ── */}
          <div className="lg:col-span-4 space-y-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h3 className="font-heading font-semibold text-black text-xl mb-6">Why Partner With Us?</h3>
              <div className="space-y-6">
                {[
                  { icon: Zap, title: 'Speed to Hire', desc: 'Average 72-hour turnaround for first interview shortlists.' },
                  { icon: ShieldCheck, title: 'Risk-Free Hiring', desc: 'Secure 90-day replacement guarantee for every placement.' },
                  { icon: Star, title: 'Elite Talent Pool', desc: 'Access to 10,000+ pre-vetted professionals across 20+ sectors.' },
                  { icon: Building2, title: 'Global Reach', desc: 'Strong presence across India and Middle East (UAE, KSA, Qatar).' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 bg-black/5 rounded flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-black text-sm mb-1">{title}</h4>
                      <p className="text-gray-medium text-xs font-body leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-black text-white p-8 rounded-2xl">
              <h3 className="font-heading font-semibold text-lg mb-6">Need Immediate Assistance?</h3>
              <div className="space-y-5">
                <a href="tel:+912222334455" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-body">Call Our Sales Team</p>
                    <p className="font-heading font-semibold text-sm">+91 22 2233 4455</p>
                  </div>
                </a>
                <a href="mailto:info@optimusmanpower.com" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-body">Email Your Requirement</p>
                    <p className="font-heading font-semibold text-sm">info@optimusmanpower.com</p>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-body">Response Time</p>
                    <p className="font-heading font-semibold text-sm">Under 24 Business Hours</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Form Section ── */}
          <div className="lg:col-span-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              {submitted ? (
                <div className="bg-white border border-gray-light p-16 text-center shadow-xl shadow-black/5">
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="font-display font-black text-3xl text-black mb-4">Requirement Received!</h3>
                  <p className="text-gray-medium font-body text-lg mb-8 max-w-md mx-auto">
                    Thank you for reaching out. Our specialist recruitment consultant will contact you shortly to discuss your needs.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline">
                    Submit Another Requirement
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-gray-light p-10 shadow-xl shadow-black/5">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-body rounded">
                        {error}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-black font-heading font-semibold text-xs uppercase tracking-wider block">Company Name *</label>
                        <input name="company_name" value={form.company_name} onChange={handleChange} required className="input-field w-full h-12 bg-gray-50 border-gray-200" placeholder="e.g. Acme Corp" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-black font-heading font-semibold text-xs uppercase tracking-wider block">Contact Person *</label>
                        <input name="contact_person" value={form.contact_person} onChange={handleChange} required className="input-field w-full h-12 bg-gray-50 border-gray-200" placeholder="John Doe" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-black font-heading font-semibold text-xs uppercase tracking-wider block">Business Email *</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} required className="input-field w-full h-12 bg-gray-50 border-gray-200" placeholder="john@company.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-black font-heading font-semibold text-xs uppercase tracking-wider block">Phone Number *</label>
                        <input name="phone" value={form.phone} onChange={handleChange} required className="input-field w-full h-12 bg-gray-50 border-gray-200" placeholder="+91 98765 43210" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-black font-heading font-semibold text-xs uppercase tracking-wider block">Job Title / Requirement *</label>
                        <input name="hiring_requirement" value={form.hiring_requirement} onChange={handleChange} required className="input-field w-full h-12 bg-gray-50 border-gray-200" placeholder="e.g. Senior Java Developer" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-black font-heading font-semibold text-xs uppercase tracking-wider block">Work Location *</label>
                        <input name="job_location" value={form.job_location} onChange={handleChange} required className="input-field w-full h-12 bg-gray-50 border-gray-200" placeholder="e.g. Mumbai, UAE, Remote" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-black font-heading font-semibold text-xs uppercase tracking-wider block">Number of Openings</label>
                      <input type="number" name="number_of_positions" value={form.number_of_positions} onChange={handleChange} min="1" className="input-field w-32 h-12 bg-gray-50 border-gray-200" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-black font-heading font-semibold text-xs uppercase tracking-wider block">Requirement Details</label>
                      <textarea name="message" value={form.message} onChange={handleChange} rows={5} className="input-field w-full bg-gray-50 border-gray-200 resize-none" placeholder="Briefly describe the candidate profile, experience level, and any specific technical skills needed..." />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full h-14 justify-center text-base">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Submit Requirement <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                    
                    <p className="text-center text-gray-medium text-xs font-body italic">
                      * By submitting, you agree to our privacy policy and terms of service.
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default BusinessEnquiry;
