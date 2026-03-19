import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Users, Globe, Layers, Cpu, Award, TrendingUp, Clock, Star, Building2 } from 'lucide-react';
import { contentAPI } from '../services/api';
import AuthModal from '../components/AuthModal';

// Hero Background
import heroBg from '../asserts/Emp-Bg.webp';

// Solutions Images
import generalStaffingImg from '../asserts/General-Staffing.webp';
import professionalStaffingImg from '../asserts/Professional-Staffing.webp';
import permanentRecruitmentImg from '../asserts/Permanent-Recruitment.webp';
import executiveSearchImg from '../asserts/Executive-Search.webp';
import internationalRecruitmentImg from '../asserts/International-Recruitment.webp';
import contractStaffingImg from '../asserts/Contract-Staffing.webp';

const STATS = [
  { label: 'Talent in Pool', value: '10,000+', icon: Users },
  { label: 'Client Companies', value: '500+', icon: Building2 },
  { label: 'Avg. Days to Place', value: '14', icon: Clock },
  { label: 'Years Experience', value: '15+', icon: Star },
];

const SOLUTIONS_WITH_IMAGES: Record<string, string> = {
  'General Staffing': generalStaffingImg,
  'Professional Staffing': professionalStaffingImg,
  'Permanent Recruitment': permanentRecruitmentImg,
  'Executive Search': executiveSearchImg,
  'International Recruitment': internationalRecruitmentImg,
  'Contract Staffing': contractStaffingImg,
};

const SOLUTIONS = [
  { icon: Users, title: 'General Staffing', desc: 'Mass hiring solutions for blue-collar and entry-level positions across sectors.' },
  { icon: Award, title: 'Professional Staffing', desc: 'Mid to senior level professional placements with verified domain expertise.' },
  { icon: Layers, title: 'Permanent Recruitment', desc: 'End-to-end permanent placement services with guaranteed delivery timelines.' },
  { icon: Cpu, title: 'Executive Search', desc: 'Confidential C-suite and board-level executive talent acquisition.' },
  { icon: Globe, title: 'International Recruitment', desc: 'Cross-border talent solutions with full visa and relocation support.' },
  { icon: TrendingUp, title: 'Contract Staffing', desc: 'Flexible workforce solutions for project-based and seasonal needs.' },
];

const WHY_US = [
  '15+ years of recruitment expertise across 20+ industries',
  'Pre-screened, interview-ready candidates in 72 hours',
  'Pan-India network with Gulf, Europe & Southeast Asia reach',
  'Average placement delivered in under 14 working days',
  'End-to-end support from sourcing to onboarding',
  'Transparent pricing with no hidden fees',
];

const EmployerHome = () => {
  const [authModal, setAuthModal] = useState(false);
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

  return (
    <main className="min-h-screen bg-white">
      {/* ── Premium Hero ── */}
      <section className="relative min-h-[95vh] flex items-center pt-32 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Business team" className="w-full h-full object-cover opacity-12" />
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white/98 to-gray-50/30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-black/3 rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/2 rounded-full -ml-40 -mb-40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }} className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mb-8">
                <div className="inline-flex items-center gap-2 bg-black/8 border border-black/20 px-4 py-2 mb-6 rounded">
                  <Building2 className="w-4 h-4 text-black" />
                  <span className="text-xs font-display font-bold text-black tracking-wide">EMPLOYER SOLUTIONS</span>
                </div>
                <h1 className="font-display font-black text-6xl lg:text-7xl leading-[1.1] text-black mb-6">
                  Build Your <br />
                  <span className="relative">
                    Elite Team
                    <div className="absolute -bottom-3 left-0 w-48 h-1 bg-black/20" />
                  </span>
                </h1>
                <p className="text-lg text-gray-medium font-body leading-relaxed max-w-lg">
                  Access pre-vetted, interview-ready talent across 20+ industries. From general staffing to executive search — we deliver results in record time.
                </p>
              </motion.div>

              {/* Mini Stats */}
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="flex gap-8 mt-10 mb-10">
                <div>
                  <p className="font-display font-black text-3xl text-black">10K+</p>
                  <p className="text-xs text-gray-medium font-body mt-1">Candidates</p>
                </div>
                <div className="w-px bg-gray-light" />
                <div>
                  <p className="font-display font-black text-3xl text-black">14</p>
                  <p className="text-xs text-gray-medium font-body mt-1">Days Average</p>
                </div>
                <div className="w-px bg-gray-light" />
                <div>
                  <p className="font-display font-black text-3xl text-black">500+</p>
                  <p className="text-xs text-gray-medium font-body mt-1">Companies</p>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-wrap gap-4">
                <a href="#enquiry" className="px-8 py-4 bg-black text-white font-display font-semibold rounded-xl hover:bg-black/90 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl">
                  Start Hiring <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#solutions" className="px-8 py-4 bg-white border-2 border-black/20 text-black font-display font-semibold rounded-xl hover:border-black hover:bg-black/2 transition-all duration-300">
                  Explore Solutions
                </a>
              </motion.div>
            </div>

            {/* Right Column - Premium Visual Card */}
            <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3 } } }}>
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.1)] p-10 border border-black/5 space-y-8">
                  <div>
                    <p className="text-xs font-display font-bold text-gray-dark mb-4 tracking-wide uppercase">Why Choose Optimus</p>
                    <ul className="space-y-3">
                      {['24-hour delivery on first candidate', 'Pre-screened & interview-ready talent', 'Zero upfront charges, transparent pricing', 'Pan-India & global talent network'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-black shrink-0" />
                          <span className="text-sm font-body text-gray-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-6 border-t border-gray-light">
                    <p className="text-xs font-display font-bold text-gray-dark mb-3 tracking-wide uppercase">Global Reach</p>
                    <div className="grid grid-cols-3 gap-3">
                      {['India', 'Gulf', 'Europe'].map((region, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-light">
                          <p className="text-xs font-body text-gray-medium">{region}</p>
                          <p className="text-sm font-display font-bold text-black mt-1">+{[1200, 400, 300][i]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Hiring Solutions ── */}
      <section id="solutions" className="py-24 max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="section-tag mb-3">OUR SOLUTIONS</p>
          <h2 className="section-title">
            Staffing Solutions for <span className="text-black">Every Need</span>
          </h2>
          <p className="text-gray-medium font-body max-w-2xl mx-auto mt-4">
            From mass hiring to executive search, we have the expertise and network to fulfill your talent requirements efficiently.
          </p>
          <div className="accent-line mt-6 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((solution, i) => (
            <motion.div key={solution.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <div className="group relative block bg-white border border-black/5 overflow-hidden rounded-xl h-72 transition-all duration-300 hover:border-black/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
                {/* Image Background */}
                <img 
                  src={SOLUTIONS_WITH_IMAGES[solution.title]} 
                  alt={solution.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/90 transition-all duration-300" />
                
                {/* Icon */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <solution.icon className="w-6 h-6 text-black" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="font-heading font-semibold text-white text-lg mb-2 drop-shadow-lg">{solution.title}</h3>
                  <p className="text-white/90 text-sm font-body drop-shadow-md leading-relaxed line-clamp-2">{solution.desc}</p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-8 h-8 text-white drop-shadow-lg transform group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-24 bg-white border-t border-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="section-tag mb-3">THE OPTIMUS ADVANTAGE</p>
            <h2 className="section-title">
              Why We're Your <span className="text-black">Hiring Partner</span>
            </h2>
            <p className="text-gray-medium font-body max-w-2xl mx-auto mt-4">
              We combine advanced technology, industry expertise, and a vast talent pool to deliver results that exceed expectations.
            </p>
            <div className="accent-line mt-6 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Benefits List */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="space-y-5">
                {WHY_US.map((point, i) => (
                  <motion.div key={point} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} 
                    className="group flex gap-4 p-5 rounded-xl bg-white border border-black/5 hover:border-black/10 hover:shadow-md hover:bg-black/1 transition-all duration-300">
                    <div className="shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-black group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <p className="text-gray-medium text-sm font-body leading-relaxed">{point}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.a href="#enquiry" className="inline-flex mt-8 px-8 py-4 bg-black text-white font-display font-semibold rounded-xl hover:bg-black/90 transition-all duration-300 items-center gap-2 shadow-lg hover:shadow-xl">
                Start Hiring Today <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>

            {/* Stats Grid */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-5">
              {[
                { icon: Users, title: '10,000+', sub: 'Candidates in pool', color: 'from-blue-50 to-blue-50/50' },
                { icon: Building2, title: '500+', sub: 'Client companies', color: 'from-emerald-50 to-emerald-50/50' },
                { icon: Globe, title: '12+', sub: 'Countries covered', color: 'from-purple-50 to-purple-50/50' },
                { icon: Award, title: '98%', sub: 'Client retention', color: 'from-amber-50 to-amber-50/50' },
              ].map(({ icon: Icon, title, sub, color }) => (
                <motion.div key={sub} whileHover={{ y: -8 }} transition={{ duration: 0.3 }} 
                  className="group bg-white border border-black/5 hover:border-black/10 rounded-xl p-7 text-center transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-gradient-to-br from-black/8 to-black/12 flex items-center justify-center group-hover:from-black/12 group-hover:to-black/16 transition-all duration-300">
                    <Icon className="w-7 h-7 text-black" />
                  </div>
                  <p className="font-display font-black text-3xl text-black mb-1">{title}</p>
                  <p className="text-gray-medium text-xs font-body">{sub}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Business Enquiry Form ── */}
      <section id="enquiry" className="py-24 max-w-5xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="section-tag mb-3">GET IN TOUCH</p>
          <h2 className="section-title">
            Tell Us Your <span className="text-black">Hiring Needs</span>
          </h2>
          <p className="text-gray-medium font-body max-w-2xl mx-auto mt-4">
            Complete this form and our expert recruitment team will contact you within 24 hours with tailored solutions.
          </p>
          <div className="accent-line mt-6 mx-auto" />
        </motion.div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-black/5 rounded-2xl p-16 text-center shadow-lg">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <CheckCircle className="w-20 h-20 text-black mx-auto mb-8" />
            </motion.div>
            <h3 className="font-display font-bold text-3xl text-black mb-3">Thank You!</h3>
            <p className="text-gray-medium font-body text-lg mb-2">Your enquiry has been submitted successfully.</p>
            <p className="text-gray-medium font-body">Our recruitment specialists will contact you shortly at the email or phone number provided.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-black/5 rounded-2xl p-12 shadow-lg space-y-6">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50/50 border border-red-200 text-red-700 text-sm font-body rounded-lg flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                {error}
              </motion.div>
            )}

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'company_name', label: 'Company Name', placeholder: 'Your company', required: true },
                { name: 'contact_person', label: 'Contact Person', placeholder: 'Full name', required: true },
                { name: 'email', label: 'Business Email', type: 'email', placeholder: 'your.email@company.com', required: true },
                { name: 'phone', label: 'Phone Number', placeholder: '+91 XXXXX XXXXX', required: true },
                { name: 'hiring_requirement', label: 'Hiring Requirement', placeholder: 'e.g., Software Engineers', required: true },
                { name: 'number_of_positions', label: 'Number of Positions', type: 'number', placeholder: '1', required: true },
              ].map(({ name, label, type, placeholder, required }) => (
                <motion.div key={name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <label className="text-gray-dark text-sm font-display font-semibold block mb-2">{label}{required && ' *'}</label>
                  <input 
                    type={type || 'text'} 
                    name={name} 
                    value={(form as any)[name]} 
                    onChange={handleChange} 
                    placeholder={placeholder}
                    required={required} 
                    className="w-full px-5 py-3.5 bg-white border border-gray-light text-black placeholder-gray-medium text-sm font-body focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300 rounded-lg"
                  />
                </motion.div>
              ))}
            </div>

            {/* Full Width */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <label className="text-gray-dark text-sm font-display font-semibold block mb-2">Job Location</label>
              <input 
                type="text" 
                name="job_location" 
                value={form.job_location} 
                onChange={handleChange} 
                placeholder="e.g., Bangalore, India / Remote"
                required 
                className="w-full px-5 py-3.5 bg-white border border-gray-light text-black placeholder-gray-medium text-sm font-body focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300 rounded-lg"
              />
            </motion.div>

            {/* Message */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <label className="text-gray-dark text-sm font-display font-semibold block mb-2">Additional Details</label>
              <textarea 
                name="message" 
                value={form.message} 
                onChange={handleChange} 
                placeholder="Tell us more about your hiring needs, timeline, budget, or any special requirements..."
                rows={5} 
                className="w-full px-5 py-3.5 bg-white border border-gray-light text-black placeholder-gray-medium text-sm font-body focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300 rounded-lg resize-none"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full px-8 py-4 bg-black text-white font-display font-semibold rounded-xl hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Submit Enquiry <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            <p className="text-gray-medium text-xs text-center font-body">
              We respect your privacy. Your information will only be used to contact you about your hiring needs.
            </p>
          </form>
        )}
      </section>

      {authModal && <AuthModal onClose={() => setAuthModal(false)} />}
    </main>
  );
};

export default EmployerHome;


