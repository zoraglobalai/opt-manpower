import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Award, Layers, Cpu, Globe, TrendingUp, 
  CheckCircle, ArrowRight, Shield, Zap, Target, Search 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SOLUTIONS = [
  {
    icon: Users,
    title: 'General Staffing',
    desc: 'Scalable hiring solutions for blue-collar, entry-level, and bulk recruitment needs across manufacturing, logistics, and retail sectors.',
    features: ['High-volume sourcing', 'Rapid deployment', 'Full compliance management'],
    color: 'bg-blue-50 text-blue-700'
  },
  {
    icon: Award,
    title: 'Professional Staffing',
    desc: 'Precision placement for mid to senior-level professional roles requiring verified domain expertise and specific technical skill sets.',
    features: ['Targeted talent search', 'Skills gap analysis', 'Domain-expert screening'],
    color: 'bg-purple-50 text-purple-700'
  },
  {
    icon: Layers,
    title: 'Permanent Recruitment',
    desc: 'Strategic end-to-end recruitment for long-term growth. We find professionals who align with your culture and future goals.',
    features: ['Cultural fit assessment', '90-day replacement guarantee', 'Executive-led vetting'],
    color: 'bg-green-50 text-green-700'
  },
  {
    icon: Cpu,
    title: 'Executive Search',
    desc: 'Confidential and proactive talent acquisition for C-suite, board-level, and senior leadership positions that define your future.',
    features: ['Confidential headhunting', 'Global market mapping', 'Leadership benchmarking'],
    color: 'bg-yellow-50 text-yellow-700'
  },
  {
    icon: Globe,
    title: 'International Recruitment',
    desc: 'Licensed cross-border recruitment solutions specializing in Gulf, European, and SE Asian markets with complete visa support.',
    features: ['Visa processing support', 'Cultural orientation', 'Pre-departure assistance'],
    color: 'bg-cyan-50 text-cyan-700'
  },
  {
    icon: TrendingUp,
    title: 'Contract Staffing',
    desc: 'Agile workforce solutions to manage project-specific needs, seasonal peaks, or temporary specialized technical requirements.',
    features: ['Flexible engagement models', 'Payroll & HR support', 'Fast turnaround time'],
    color: 'bg-orange-50 text-orange-700'
  },
];

const PROCESS = [
  { step: '01', title: 'Consultation', desc: 'We dive deep into your company culture, technical requirements, and long-term business objectives.' },
  { step: '02', title: 'Sourcing & Vetting', desc: 'Our experts leverage global networks and proprietary tools to identify and rigorously screen top-tier talent.' },
  { step: '03', title: 'Curated Shortlist', desc: 'You receive a hand-picked shortlist of candidates who are not just qualified, but ready to deliver impact from day one.' },
  { step: '04', title: 'Selection & Support', desc: 'From coordinating interviews to final negotiations and onboarding support, we manage the entire lifecycle.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } 
  }),
};

const Solutions = () => {
  return (
    <main className="min-h-screen pt-24">
      {/* ── Hero Section ── */}
      <section className="bg-black text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-40 -mb-40 blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.p variants={fadeUp} className="text-xs font-display font-bold text-gray-400 tracking-widest uppercase mb-4">What We Deliver</motion.p>
            <motion.h1 variants={fadeUp} className="font-display font-black text-5xl md:text-7xl mb-6">
              Empowering Businesses with <br />
              <span className="text-gray-300">Elite Workforce Solutions</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-400 font-body text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Optimus Manpower provides a comprehensive suite of recruitment services designed to meet the evolving needs of modern organizations across the globe.
            </motion.p>
            <motion.div variants={fadeUp} className="flex justify-center gap-4">
              <Link to="/business-enquiry" className="btn-primary bg-white text-black hover:bg-gray-200 border-none">
                Start Hiring Now
              </Link>
              <a href="#all-solutions" className="btn-outline border-white/30 text-white hover:bg-white/10">
                Explore Services
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Key Differentiators ── */}
      <section className="py-16 border-b border-gray-light bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { icon: Shield, title: '90-Day Guarantee', desc: 'Secure your investment with our risk-free replacement policy for permanent placements.' },
            { icon: Zap, title: 'Rapid Turnaround', desc: 'Average time-to-first-interview is just 72 hours for standard roles.' },
            { icon: Search, title: 'Global Insights', desc: 'Deep industry knowledge spanning 20+ sectors across India and international markets.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
              <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-heading font-semibold text-black text-base mb-2">{title}</h3>
              <p className="text-gray-medium text-xs font-body leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── All Solutions ── */}
      <section id="all-solutions" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="section-tag mb-3">Our Expertise</p>
            <h2 className="section-title">Specialized <span className="text-black">Hiring Verticals</span></h2>
            <div className="accent-line mt-4 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTIONS.map((s, i) => (
              <motion.div 
                key={s.title} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                custom={i} 
                variants={fadeUp}
                className="bg-white border border-gray-light p-8 hover:border-black/20 transition-all hover:shadow-xl hover:shadow-black/5 group"
              >
                <div className={`w-12 h-12 ${s.color} flex items-center justify-center rounded-lg mb-6 group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-semibold text-black text-lg mb-4">{s.title}</h3>
                <p className="text-gray-medium text-sm font-body leading-relaxed mb-6">
                  {s.desc}
                </p>
                <ul className="space-y-2 mb-8 border-t border-gray-light pt-6">
                  {s.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs font-body text-gray-700">
                      <CheckCircle className="w-3.5 h-3.5 text-black/40" /> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Process ── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <p className="section-tag mb-4">Precision Workflow</p>
              <h2 className="section-title mb-8">How We Deliver <br /> Excellence</h2>
              <div className="space-y-10 relative">
                <div className="absolute left-6 top-2 bottom-2 w-px bg-gray-light" />
                {PROCESS.map((p, i) => (
                  <motion.div 
                    key={p.step} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true }} 
                    custom={i} 
                    variants={fadeUp}
                    className="flex gap-8 relative z-10"
                  >
                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-display font-black shrink-0">
                      {p.step}
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-black text-lg mb-2">{p.title}</h4>
                      <p className="text-gray-medium text-sm font-body leading-relaxed">{p.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="aspect-square bg-black/5 rounded-full p-12 relative">
                <div className="w-full h-full border-2 border-dashed border-black/20 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-display font-black text-6xl text-black">98%</p>
                    <p className="text-gray-medium font-body text-sm mt-2">Client Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 bg-black text-white text-center rounded-3xl mx-4 mb-12">
        <div className="max-w-3xl mx-auto px-4">
          <Target className="w-12 h-12 text-white/20 mx-auto mb-8" />
          <h2 className="font-display font-black text-4xl md:text-5xl mb-6">Build Your Future Workforce Today</h2>
          <p className="text-gray-400 font-body text-lg mb-10">
            Join 500+ global brands who trust Optimus Manpower to find and secure top-tier talent.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/business-enquiry" className="btn-primary bg-white text-black hover:bg-gray-200 border-none px-10">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-outline border-white/30 text-white hover:bg-white/10 px-10">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Solutions;
