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
import CountUp from '../components/CountUp';

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

const MOCK_ARTICLES = [
  {
    id: 'm1',
    category: 'Resume Tips',
    title: '7 Resume Mistakes That Get You Rejected in the First 10 Seconds',
    summary: 'Recruiters spend an average of 7 seconds on a resume. Here are the exact formatting, language, and structure mistakes that trigger instant rejection — and how to fix each one.',
    readTime: '6 min read',
    author: 'Priya Sharma',
    date: 'Mar 10, 2025',
    icon: FileText,
    color: 'bg-blue-50 text-blue-700',
  },
  {
    id: 'm2',
    category: 'Resume Tips',
    title: 'How to Write a Resume That Beats ATS Filters Every Time',
    summary: 'Over 75% of resumes never reach a human. Learn how Applicant Tracking Systems parse your resume, which keywords to include, and how to format sections so you always get through.',
    readTime: '8 min read',
    author: 'Anil Mehta',
    date: 'Feb 28, 2025',
    icon: FileText,
    color: 'bg-blue-50 text-blue-700',
  },
  {
    id: 'm3',
    category: 'Resume Tips',
    title: 'Writing Achievement Statements That Impress Any Hiring Manager',
    summary: 'Replace weak duty-based bullets with powerful impact statements. Use the Problem–Action–Result formula with real numbers to show what you actually delivered, not just what you did.',
    readTime: '5 min read',
    author: 'Priya Sharma',
    date: 'Feb 14, 2025',
    icon: FileText,
    color: 'bg-blue-50 text-blue-700',
  },
  {
    id: 'm4',
    category: 'Interview Tips',
    title: 'The STAR Method: A Complete Guide with 15 Real Example Answers',
    summary: 'Behavioral interview questions trip up great candidates every day. Master the Situation–Task–Action–Result framework with worked examples across the most common competency areas.',
    readTime: '10 min read',
    author: 'Rajesh Kumar',
    date: 'Mar 5, 2025',
    icon: Target,
    color: 'bg-green-50 text-green-700',
  },
  {
    id: 'm5',
    category: 'Interview Tips',
    title: 'How to Research a Company Before Your Interview (Most Candidates Skip This)',
    summary: 'Interviewers can instantly tell who has done their homework. A focused 45-minute pre-interview research process — covering business model, competitors, culture, and recent news — sets you apart.',
    readTime: '7 min read',
    author: 'Anil Mehta',
    date: 'Feb 20, 2025',
    icon: Target,
    color: 'bg-green-50 text-green-700',
  },
  {
    id: 'm6',
    category: 'Interview Tips',
    title: 'Salary Negotiation Scripts That Actually Work',
    summary: 'Negotiating salary is uncomfortable — but skipping it costs you lakhs over your career. Here are word-for-word scripts for every scenario: first offer, counter-offer, and final pushback.',
    readTime: '6 min read',
    author: 'Priya Sharma',
    date: 'Jan 30, 2025',
    icon: Star,
    color: 'bg-green-50 text-green-700',
  },
  {
    id: 'm7',
    category: 'Career Growth',
    title: 'When Is the Right Time to Switch Jobs? The 2.5-Year Rule Explained',
    summary: 'Switching too early labels you a job-hopper. Waiting too long leaves money and growth on the table. Learn the data-backed signals that tell you it is time to move — and how to do it without burning bridges.',
    readTime: '7 min read',
    author: 'Rajesh Kumar',
    date: 'Mar 1, 2025',
    icon: TrendingUp,
    color: 'bg-orange-50 text-orange-700',
  },
  {
    id: 'm8',
    category: 'Career Growth',
    title: 'Building a T-Shaped Skill Set to Accelerate Promotions',
    summary: 'The professionals who get promoted fastest combine deep expertise in one area with broad knowledge across related fields. Here is how to identify and build your T-shape intentionally in 12 months.',
    readTime: '9 min read',
    author: 'Anil Mehta',
    date: 'Feb 10, 2025',
    icon: TrendingUp,
    color: 'bg-orange-50 text-orange-700',
  },
  {
    id: 'm9',
    category: 'Industry Trends',
    title: 'Top 10 In-Demand Skills Across Every Industry in 2025',
    summary: 'AI literacy, data fluency, cross-functional communication — the skills employers are paying premiums for have shifted. Here is what is hot in IT, Healthcare, Finance, Engineering, and Logistics this year.',
    readTime: '8 min read',
    author: 'Priya Sharma',
    date: 'Mar 12, 2025',
    icon: Lightbulb,
    color: 'bg-yellow-50 text-yellow-700',
  },
  {
    id: 'm10',
    category: 'Industry Trends',
    title: 'The Rise of Contract and Project-Based Hiring: What Workers Need to Know',
    summary: 'Companies are increasingly hiring on a project basis to stay agile. Learn how contract roles work, what benefits to negotiate, how to protect your income between contracts, and when to go permanent.',
    readTime: '7 min read',
    author: 'Rajesh Kumar',
    date: 'Feb 22, 2025',
    icon: Briefcase,
    color: 'bg-yellow-50 text-yellow-700',
  },
  {
    id: 'm11',
    category: 'Gulf Jobs',
    title: 'Complete Guide to Gulf Job Offers: Documents, Visa, and What to Negotiate',
    summary: 'From educational certificate attestation to understanding your employment contract before signing — everything Indian professionals need to verify before relocating to UAE, KSA, Qatar, or Kuwait.',
    readTime: '12 min read',
    author: 'Anil Mehta',
    date: 'Mar 8, 2025',
    icon: Globe,
    color: 'bg-purple-50 text-purple-700',
  },
  {
    id: 'm12',
    category: 'Gulf Jobs',
    title: 'Gulf Salary Guide 2025: What Different Roles Actually Pay in UAE, Qatar & Saudi Arabia',
    summary: 'Real salary ranges for 30+ roles across Engineering, Healthcare, IT, Finance, and Hospitality in the Gulf. Includes accommodation allowances, flight benefits, and negotiation benchmarks by country.',
    readTime: '10 min read',
    author: 'Priya Sharma',
    date: 'Mar 3, 2025',
    icon: Award,
    color: 'bg-purple-50 text-purple-700',
  },
  {
    id: 'm13',
    category: 'Solutions',
    title: 'Permanent Recruitment vs. Contract Staffing: Which Hiring Model Is Right for Your Business?',
    summary: 'Understanding the difference between permanent and contract hiring helps you build the right team at the right cost. We break down when each model makes sense, what it costs, and what risks to watch out for.',
    readTime: '7 min read',
    author: 'Rajesh Kumar',
    date: 'Mar 15, 2025',
    icon: Briefcase,
    color: 'bg-teal-50 text-teal-700',
  },
  {
    id: 'm14',
    category: 'Solutions',
    title: 'Executive Search Demystified: How Top Companies Find C-Suite and Senior Leaders',
    summary: 'Senior leadership hiring is fundamentally different from regular recruitment. Discover the retained search process, how candidates are evaluated at the C-suite level, and what employers should expect from an executive search partner.',
    readTime: '9 min read',
    author: 'Anil Mehta',
    date: 'Mar 10, 2025',
    icon: Star,
    color: 'bg-teal-50 text-teal-700',
  },
  {
    id: 'm15',
    category: 'Solutions',
    title: 'How International Recruitment Works: A Step-by-Step Guide for Employers',
    summary: 'Hiring talent from India, South Asia, or Southeast Asia for your Gulf or European operations? This guide covers sourcing, screening, visa coordination, and onboarding — so you know exactly what to expect at each stage.',
    readTime: '8 min read',
    author: 'Priya Sharma',
    date: 'Feb 25, 2025',
    icon: Globe,
    color: 'bg-teal-50 text-teal-700',
  },
];

const STATS = [
  { value: 94, suffix: '%', label: 'Interview success rate for our prepared candidates' },
  { value: 40, suffix: '%', label: 'Average salary increase when switching with our support' },
  { value: 7, suffix: ' days', label: 'Average time to first interview for shortlisted profiles' },
  { value: 1200, suffix: '+', label: 'Career advice consultations delivered in 2024' },
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
  const apiArticles = data?.data?.results || data?.data || [];
  const [activeCategory, setActiveCategory] = useState('All');

  const CATEGORIES = ['All', 'Resume Tips', 'Interview Tips', 'Career Growth', 'Industry Trends', 'Gulf Jobs', 'Solutions'];

  // Merge API articles (if any) with mock articles
  const allArticles = [
    ...apiArticles.map((a: any) => ({
      id: a.id,
      category: a.category || 'Career Growth',
      title: a.title,
      summary: a.excerpt || a.summary || '',
      readTime: a.read_time || '5 min read',
      author: a.author || 'Optimus Team',
      date: new Date(a.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      icon: BookOpen,
      color: 'bg-gray-50 text-gray-700',
    })),
    ...MOCK_ARTICLES,
  ];

  const filteredArticles = activeCategory === 'All'
    ? allArticles
    : allArticles.filter((a) => a.category === activeCategory);

  return (
    <main className="min-h-screen pt-0 bg-gray-50/30">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-black text-white min-h-screen flex items-center py-14 md:py-20 relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full -mr-40 -mt-40" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-10 items-end">
            <div>
              <p className="hero-kicker text-gray-400 mb-4">Expert Knowledge Hub</p>
              <h1 className="hero-title hero-title-animate hero-title-glow text-5xl md:text-6xl text-white leading-tight mb-5">
                Career <span className="text-gray-300">Advice</span>
              </h1>
              <p className="text-gray-300 font-body text-base leading-relaxed mb-8">
                Industry-leading insights, expert resume tips, and interview strategies from our seasoned recruitment professionals - to help you land the right role, faster.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-body text-gray-300">
                <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1 backdrop-blur-sm">✍ 50+ Expert Articles</span>
                <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1 backdrop-blur-sm">💼 15+ Years Experience</span>
                <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1 backdrop-blur-sm">🌏 India & Gulf Focused</span>
                <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1 backdrop-blur-sm">✅ ATS‑Ready Tips</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link to="/jobs" className="btn-primary bg-white text-black hover:bg-gray-100">
                Explore Jobs <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="btn-outline border-white/40 text-white hover:bg-white/10">
                Get Expert Help
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, suffix, label }, i) => (
              <motion.div key={value} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <p className="font-display font-black text-4xl text-black">
                  <CountUp value={value} format="plain" suffix={suffix} />
                </p>
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

      {/* ── ARTICLES ─────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="section-tag mb-3">Latest from the Blog</p>
          <h2 className="section-title mb-3">Expert <span className="text-black">Articles</span></h2>
          <p className="text-gray-medium font-body text-sm max-w-xl mx-auto">
            Practical, no-fluff career insights from our recruitment experts.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-xs font-semibold rounded-full border transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article count */}
        <p className="text-center text-xs text-gray-medium font-body mb-8">
          {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}{activeCategory !== 'All' ? ` in "${activeCategory}"` : ''}
        </p>

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
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article, i) => {
              const Icon = article.icon;
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-6 flex flex-col gap-4 hover:border-black/20 hover:shadow-md transition-all duration-300 group"
                >
                  {/* Category + icon */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${article.color}`}>
                      <Icon className="w-3 h-3" />
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-medium font-body flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-semibold text-black text-sm leading-snug group-hover:underline underline-offset-2 line-clamp-3">
                    {article.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-gray-medium text-xs font-body leading-relaxed line-clamp-3 flex-1">
                    {article.summary}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-light font-body">{article.date}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-light font-body text-sm">
            <BookOpen className="w-10 h-10 mx-auto mb-4 opacity-30" />
            No articles in this category yet.
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
