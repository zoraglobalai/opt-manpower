import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock, ArrowRight, BookOpen, Target, TrendingUp, Star,
  CheckCircle, Briefcase, Globe, Award, Lightbulb, Users,
  FileText, ChevronDown, ChevronUp,
} from 'lucide-react';
import { contentAPI } from '../services/api';

// ── Static Content ─────────────────────────────────────────────────────────

const QUICK_TIPS = [
  { icon: FileText, category: 'Resume', color: 'bg-blue-50 text-blue-700', tip: 'Quantify achievements with numbers — "Reduced cost by 30%" beats "Cut costs significantly" every time.' },
  { icon: Target, category: 'Interview', color: 'bg-green-50 text-green-700', tip: 'Use the STAR method for behavioral questions: Situation, Task, Action, Result. Keep each answer under 2 minutes.' },
  { icon: Globe, category: 'International Jobs', color: 'bg-purple-50 text-purple-700', tip: 'Gulf employers look for 3+ years of continuous experience. Gaps must be explained clearly in your cover letter.' },
  { icon: TrendingUp, category: 'Career Growth', color: 'bg-orange-50 text-orange-700', tip: 'The best time to look for a new job is 2.5–3 years into your current role — before stagnation sets in.' },
  { icon: Users, category: 'Networking', color: 'bg-pink-50 text-pink-700', tip: 'Over 70% of jobs are filled through referrals. Update your LinkedIn every 3 months even when not job hunting.' },
  { icon: Award, category: 'Salary', color: 'bg-yellow-50 text-yellow-700', tip: `Never reveal your current salary first. Say: "I'm targeting a range of X–Y based on market benchmarks."` },
];

const TOPIC_GUIDES = [
  {
    icon: FileText,
    title: 'Resume Writing Masterclass',
    desc: 'Craft a resume that passes ATS filters and impresses human eyes — from formatting basics to advanced achievement statements.',
    topics: ['ATS-optimized formatting', 'Writing powerful bullet points', 'Tailoring for every application', 'LinkedIn profile alignment'],
    readTime: '12 min read',
  },
  {
    icon: Target,
    title: 'Interview Preparation Blueprint',
    desc: 'A complete framework for researching companies, preparing answers, and navigating every stage from HR screening to final round.',
    topics: ['Research framework & company analysis', 'Common question bank with STAR answers', 'Salary negotiation tactics', 'Post-interview follow-up templates'],
    readTime: '15 min read',
  },
  {
    icon: Globe,
    title: 'Gulf & International Placement Guide',
    desc: 'Everything Indian professionals need to know before accepting a Gulf offer — from documentation to cultural etiquette and cost of living.',
    topics: ['Documents & attestation process', 'Understanding the Kafala system', 'Gulf salary benchmarks by role', 'What to negotiate before joining'],
    readTime: '10 min read',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth Playbook',
    desc: 'Strategies used by professionals who have made 50%+ salary jumps and jumped to senior roles in under 3 years.',
    topics: ['T-shaped skill development', 'Building internal visibility', 'Strategic job-switching timing', 'Personal brand on LinkedIn'],
    readTime: '9 min read',
  },
];

const EXPERT_INSIGHTS = [
  {
    quote: 'The top mistake candidates make is sending the same resume to every job. Tailor every application — recruiters can tell immediately when you haven\'t.',
    expert: 'Priya Sharma',
    title: 'Head of Talent Acquisition, Optimus Manpower',
    initials: 'PS',
  },
  {
    quote: 'For Gulf placements, we always advise candidates to have their educational certificates attested 6–8 weeks before the expected joining date. Paperwork delays are the #1 reason onboarding gets pushed.',
    expert: 'Anil Mehta',
    title: 'International Recruitment Lead, Optimus Manpower',
    initials: 'AM',
  },
  {
    quote: 'Candidates who get hired fastest are the ones who are genuinely prepared — they\'ve researched the company, know why they want the role, and can articulate their value clearly.',
    expert: 'Rajesh Kumar',
    title: 'Founder & CEO, Optimus Manpower',
    initials: 'RK',
  },
];

const SALARY_BENCHMARKS = [
  { role: 'Software Engineer (3–5 yrs)', india: '₹8–16 LPA', gulf: 'AED 9,000–16,000/mo' },
  { role: 'ICU Registered Nurse', india: '₹4–7 LPA', gulf: 'AED 7,000–12,000/mo' },
  { role: 'Civil Site Engineer', india: '₹5–10 LPA', gulf: 'SAR 5,000–9,000/mo' },
  { role: 'HR Manager (6–10 yrs)', india: '₹10–18 LPA', gulf: 'AED 10,000–18,000/mo' },
  { role: 'Sales Executive (2–4 yrs)', india: '₹4–8 LPA', gulf: 'AED 5,000–8,000/mo' },
  { role: 'Chartered Accountant', india: '₹12–22 LPA', gulf: 'AED 12,000–20,000/mo' },
];

const FAQS = [
  {
    q: 'How long does it take to get placed through Optimus Manpower?',
    a: 'For domestic roles, the typical timeline from registration to offer is 2–4 weeks. For international roles (Gulf, Europe), plan for 4–8 weeks including documentation and visa processing.',
  },
  {
    q: 'Is there any fee for candidates?',
    a: 'Absolutely not. Our recruitment services are completely free for candidates. We are paid by the hiring employer. Never pay any consultancy that charges candidates a registration or placement fee.',
  },
  {
    q: 'What documents do I need for Gulf placements?',
    a: 'You\'ll need: valid passport (2+ years validity), educational certificates with MEA attestation, experience letters, police clearance certificate, and a medical fitness certificate. We guide you through every step.',
  },
  {
    q: 'How do I know if a Gulf job offer is legitimate?',
    a: 'Only accept offers from companies registered with their country\'s labor ministry. We verify all our employer partners. Legitimate offers are always in writing on company letterhead and never ask for upfront payments.',
  },
  {
    q: 'What is the best way to negotiate salary?',
    a: 'Research market rates on AmbitionBox, Glassdoor, and LinkedIn Salary. Let the employer name a number first. Then counter with data: "Based on my research and X years of experience, I was expecting Y–Z." Always negotiate respectfully and in writing.',
  },
];

const STATS = [
  { value: '94%', label: 'Interview success rate for our prepared candidates' },
  { value: '40%', label: 'Average salary increase when switching with our support' },
  { value: '7 days', label: 'Average time to first interview for shortlisted profiles' },
  { value: '1,200+', label: 'Career advice consultations delivered in 2024' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: 'easeOut' } }),
};

// ── FAQ Accordion ──────────────────────────────────────────────────────────
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-light last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left">
        <span className="font-heading font-semibold text-black text-sm pr-4">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-medium shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-medium shrink-0" />}
      </button>
      {open && (
        <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-gray-medium text-sm font-body leading-relaxed pb-5">
          {a}
        </motion.p>
      )}
    </div>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────
const CareerAdvice = () => {
  const { data, isLoading } = useQuery({ queryKey: ['career-advice'], queryFn: contentAPI.careerAdvice });
  const articles = data?.data?.results || data?.data || [];

  const CATEGORIES = ['All', 'Resume Tips', 'Interview Tips', 'Career Growth', 'Industry Trends', 'Gulf Jobs'];

  return (
    <main className="min-h-screen pt-24">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-black text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full -mr-40 -mt-40" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <p className="text-xs font-display font-bold text-gray-400 tracking-widest uppercase mb-4">Expert Knowledge Hub</p>
            <h1 className="font-display font-black text-5xl md:text-6xl text-white leading-tight mb-5">
              Career <span className="text-gray-300">Advice</span>
            </h1>
            <p className="text-gray-300 font-body text-base leading-relaxed mb-8">
              Industry-leading insights, expert resume tips, and interview strategies from our seasoned recruitment professionals — to help you land the right role, faster.
            </p>
            <div className="flex items-center gap-6 text-xs font-body text-gray-400">
              <span>✍ 50+ Expert Articles</span>
              <span>💼 15+ Years Experience</span>
              <span>🌏 India & Gulf Focused</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }, i) => (
              <motion.div key={value} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <p className="font-display font-black text-4xl text-black">{value}</p>
                <p className="text-gray-medium text-xs font-body mt-1 max-w-[140px] mx-auto leading-snug">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK TIPS ───────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="section-tag mb-3">Bite-Sized Wisdom</p>
          <h2 className="section-title mb-3">Quick Career <span className="text-black">Tips</span></h2>
          <p className="text-gray-medium font-body max-w-xl mx-auto text-sm">Actionable advice you can apply today.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {QUICK_TIPS.map(({ icon: Icon, category, color, tip }, i) => (
            <motion.div key={category} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
              className="card p-6 hover:border-black/20 transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-9 h-9 flex items-center justify-center rounded shrink-0 ${color.replace('text-', 'bg-').replace('-700', '-100')}`}>
                  <Icon className={`w-4.5 h-4.5 ${color.split(' ')[1]}`} />
                </div>
                <div>
                  <span className={`inline-block text-xs font-display font-bold mb-2 px-2 py-0.5 rounded ${color}`}>{category}</span>
                  <p className="text-gray-dark text-sm font-body leading-relaxed">{tip}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TOPIC GUIDES ─────────────────────────────────────────────── */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs font-display font-bold text-gray-400 tracking-widest uppercase mb-3">In-Depth Learning</p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">Complete Topic <span className="text-gray-300">Guides</span></h2>
            <p className="text-gray-400 font-body text-sm max-w-xl mx-auto">From zero to job-offer ready — comprehensive resources for every career stage.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TOPIC_GUIDES.map(({ icon: Icon, title, desc, topics, readTime }, i) => (
              <motion.div key={title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="bg-white/5 border border-white/10 hover:border-white/25 p-8 transition-all duration-300">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-11 h-11 bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-body mb-1">{readTime}</p>
                    <h3 className="font-heading font-semibold text-white text-base leading-snug">{title}</h3>
                  </div>
                </div>
                <p className="text-gray-400 text-sm font-body leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-2">
                  {topics.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-xs font-body text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-white/40 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTICLES FROM DATABASE ───────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="section-tag mb-3">Latest from the Blog</p>
          <h2 className="section-title mb-3">Expert <span className="text-black">Articles</span></h2>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {CATEGORIES.map((cat) => (
            <button key={cat}
              className={`status-badge px-4 py-2 text-xs transition-colors ${cat === 'All' ? 'bg-black text-white' : 'bg-gray-50 text-gray-medium hover:bg-black/10 hover:text-black'}`}>
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse h-56">
                <div className="h-3 bg-gray-50 rounded mb-3 w-1/4" />
                <div className="h-5 bg-gray-50 rounded mb-2" />
                <div className="h-3 bg-gray-50 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article: any, i: number) => (
              <motion.div key={article.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link to={`/career-advice/${article.id}`} className="card p-0 block overflow-hidden group h-full">
                  {article.image && (
                    <div className="h-44 overflow-hidden">
                      <img src={article.image} alt={article.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-3.5 h-3.5 text-gray-medium" />
                      <span className="text-gray-light text-xs font-body">
                        {new Date(article.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-black text-sm leading-snug mb-4 group-hover:text-black transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-black text-xs font-body font-medium">
                      Read Article <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-light font-body text-sm">
            <BookOpen className="w-10 h-10 mx-auto mb-4 opacity-30" />
            No articles published yet. Check back soon!
          </div>
        )}
      </section>

      {/* ── EXPERT INSIGHTS ──────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="section-tag mb-3">From Our Recruiters</p>
            <h2 className="section-title mb-3">Expert <span className="text-black">Perspectives</span></h2>
            <p className="text-gray-medium font-body text-sm max-w-xl mx-auto">Real advice from the people who review thousands of profiles and conduct hundreds of interviews every year.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXPERT_INSIGHTS.map(({ quote, expert, title, initials }, i) => (
              <motion.div key={expert} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="card p-7">
                <Lightbulb className="w-6 h-6 text-black/20 mb-4" />
                <p className="text-gray-dark text-sm font-body italic leading-relaxed mb-6">"{quote}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center font-display font-bold text-black text-xs shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-black text-xs">{expert}</p>
                    <p className="text-gray-light text-xs font-body">{title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SALARY BENCHMARKS ────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="section-tag mb-3">Know Your Worth</p>
          <h2 className="section-title mb-3">Salary <span className="text-black">Benchmarks</span></h2>
          <p className="text-gray-medium font-body text-sm max-w-xl mx-auto">Indicative salary ranges for in-demand roles across India and the Gulf region (2024–2025).</p>
        </div>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-display font-semibold uppercase tracking-wide">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-display font-semibold uppercase tracking-wide">India (Annual)</th>
                  <th className="px-6 py-4 text-left text-xs font-display font-semibold uppercase tracking-wide">Gulf (Monthly)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-light">
                {SALARY_BENCHMARKS.map(({ role, india, gulf }, i) => (
                  <motion.tr key={role} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-heading font-medium text-black text-sm">{role}</td>
                    <td className="px-6 py-4 text-gray-dark font-body text-sm">{india}</td>
                    <td className="px-6 py-4 text-gray-dark font-body text-sm">{gulf}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-light">
            <p className="text-gray-light text-xs font-body">* Ranges are indicative and vary based on location, company size, education, and specific experience. Source: Optimus Manpower placement data 2024–2025.</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-gray-light">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-tag mb-3">Got Questions?</p>
            <h2 className="section-title mb-3">Frequently Asked <span className="text-black">Questions</span></h2>
          </div>
          <div className="card p-2">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="px-5">
                <FaqItem q={q} a={a} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-6" />
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-5">
            Ready to Take the Next Step?
          </h2>
          <p className="text-gray-400 font-body text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Browse hundreds of verified job openings across India and the Gulf — or speak to our consultants for personalised career guidance.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/jobs" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-heading font-semibold text-sm hover:bg-gray-100 transition-all group">
              Browse All Jobs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 border border-white/40 text-white font-heading font-semibold text-sm hover:bg-white/10 transition-all">
              Talk to a Consultant
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default CareerAdvice;
