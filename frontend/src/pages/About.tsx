import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Star, Users, Globe, Award, ArrowRight, Target, Eye, Heart,
  Clock, CheckCircle, Briefcase, TrendingUp, MapPin, Phone,
  Mail, Shield, Zap, Search, BarChart2, FileText,
} from 'lucide-react';
import { contentAPI } from '../services/api';

// ── Static Data ──────────────────────────────────────────────────────────────

const TEAM = [
  { name: 'Rajesh Kumar', role: 'Founder & CEO', initials: 'RK', desc: '20+ years in recruitment across India and Gulf markets. Founded Optimus with a mission to redefine ethical, people-first hiring.' },
  { name: 'Priya Sharma', role: 'Head of Talent Acquisition', initials: 'PS', desc: 'Specialist in IT and professional services staffing. Manages a portfolio of 200+ corporate clients across India.' },
  { name: 'Anil Mehta', role: 'International Recruitment Lead', initials: 'AM', desc: 'Expert in Gulf, Europe and SEA placements. Personally overseen 3,000+ international placements since 2013.' },
  { name: 'Deepa Nair', role: 'Operations Director', initials: 'DN', desc: 'Drives delivery excellence across all verticals. Ensures every candidate and client receives a premium, consistent experience.' },
];

const MILESTONES = [
  { year: '2009', event: 'Founded in Mumbai with a focus on domestic placements and SME hiring.' },
  { year: '2012', event: 'Expanded to Gulf market — UAE, Qatar, Saudi Arabia. First 500 international placements.' },
  { year: '2015', event: 'Opened regional offices in Delhi NCR, Bangalore, and Chennai. 100+ clients onboarded.' },
  { year: '2018', event: 'Crossed 5,000 total placements milestone. Launched dedicated healthcare & engineering verticals.' },
  { year: '2021', event: 'Launched digital-first recruitment platform to serve candidates and employers online.' },
  { year: '2024', event: 'Achieved 10,000+ successful placements across 12+ countries and 500+ global clients.' },
];

const SERVICES = [
  {
    icon: Search,
    title: 'Permanent Staffing',
    desc: 'We source, screen, and place exceptional candidates for permanent full-time roles across all industries and seniority levels — from executives to specialists.',
    features: ['Dedicated account manager', 'Pre-screened shortlists', '90-day replacement guarantee'],
  },
  {
    icon: Clock,
    title: 'Contract & Temporary Staffing',
    desc: 'Rapidly deploy skilled professionals on short-term contracts. Ideal for project peaks, seasonal demand, or specialized technical requirements.',
    features: ['Fast turnaround (48–72 hrs)', 'Payroll management included', 'Scalable team augmentation'],
  },
  {
    icon: Globe,
    title: 'International Recruitment',
    desc: 'Specialist overseas placement to the Gulf (UAE, Qatar, KSA), Europe, and South East Asia with complete visa and documentation support.',
    features: ['Visa & documentation guidance', 'Pre-departure orientation', 'Post-placement support'],
  },
  {
    icon: Briefcase,
    title: 'Executive Search',
    desc: 'Confidential headhunting and executive placement for C-suite, VP, and director-level mandates. Talent that transforms your organization.',
    features: ['Confidential search process', 'Market mapping & benchmarking', 'Leadership assessment'],
  },
  {
    icon: BarChart2,
    title: 'Bulk Hiring & RPO',
    desc: 'Manage large-scale recruitment campaigns with speed and quality. We embed our recruiters into your process as a seamless extension of your HR team.',
    features: ['Volume hiring at scale', 'Dedicated onsite recruiter', 'ATS integration support'],
  },
  {
    icon: FileText,
    title: 'HR Consulting',
    desc: 'Strategic HR advisory services covering job architecture, compensation benchmarking, talent strategy, and workforce planning.',
    features: ['Compensation benchmarking', 'Workforce planning reports', 'HR policy development'],
  },
];

const INDUSTRIES = [
  { name: 'IT & Technology', icon: '💻', count: '2,800+ placements' },
  { name: 'Healthcare & Nursing', icon: '🏥', count: '1,900+ placements' },
  { name: 'Engineering & Construction', icon: '🏗️', count: '2,100+ placements' },
  { name: 'Finance & Banking', icon: '🏦', count: '850+ placements' },
  { name: 'Sales & Marketing', icon: '📊', count: '720+ placements' },
  { name: 'Hospitality & Tourism', icon: '🏨', count: '640+ placements' },
  { name: 'Logistics & Supply Chain', icon: '🚛', count: '580+ placements' },
  { name: 'Manufacturing & Operations', icon: '⚙️', count: '410+ placements' },
];

const PROCESS = [
  { step: '01', title: 'Submit Your Requirement', desc: 'Share your hiring needs with our consultant — job role, experience level, location, and timeline. Takes less than 10 minutes.' },
  { step: '02', title: 'Talent Search & Screening', desc: 'Our recruitment team leverages our 50,000+ candidate database, job boards, and networks to source and screen the best prospects.' },
  { step: '03', title: 'Curated Shortlist', desc: 'Receive a shortlist of 3–5 pre-vetted candidates with detailed profiles, within 5–7 business days for standard roles.' },
  { step: '04', title: 'Interviews & Selection', desc: 'We coordinate all interview rounds, provide candidate preparation, and collect structured feedback to drive fast decisions.' },
  { step: '05', title: 'Offer & Onboarding', desc: 'We facilitate salary negotiation, offer management, and post-offer support — ensuring high acceptance rates and smooth joining.' },
];

const DIFFERENTIATORS = [
  { icon: Shield, title: 'Zero-Risk Replacement', desc: 'If a placed candidate leaves within 90 days, we replace them at no additional cost. Your investment is always protected.' },
  { icon: Zap, title: 'Speed to Hire', desc: 'Our average time-to-shortlist is 5 business days for mid-level roles. We operate with urgency without compromising quality.' },
  { icon: CheckCircle, title: 'Rigorous Vetting', desc: 'Every candidate undergoes background verification, reference checks, and skills assessment before reaching your desk.' },
  { icon: Users, title: 'Dedicated Consultant', desc: 'One consistent point of contact who understands your culture, goals, and evolving requirements — not a ticket system.' },
  { icon: Globe, title: 'Verified International Network', desc: 'Partnerships with licensed overseas employers, with full documentation and visa support managed end-to-end.' },
  { icon: TrendingUp, title: 'Data-Led Matching', desc: 'We track placement success metrics to continuously refine our matching approach, leading to higher retention rates.' },
];

const STATS = [
  { value: '10,000+', label: 'Successful Placements', icon: Users },
  { value: '500+', label: 'Verified Employer Partners', icon: Briefcase },
  { value: '12+', label: 'Countries Served', icon: Globe },
  { value: '15+', label: 'Years of Industry Experience', icon: Award },
  { value: '92%', label: 'Candidate Retention Rate', icon: CheckCircle },
  { value: '48 hrs', label: 'Average Response Time', icon: Zap },
];

const LOCATIONS = [
  { city: 'Mumbai', type: 'Headquarters', address: 'Andheri East, Mumbai – 400069' },
  { city: 'Delhi NCR', type: 'Regional Office', address: 'Connaught Place, New Delhi – 110001' },
  { city: 'Bangalore', type: 'Regional Office', address: 'Koramangala, Bengaluru – 560034' },
  { city: 'Chennai', type: 'Regional Office', address: 'Anna Nagar, Chennai – 600040' },
];

// ── Component ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } }),
};

const About = () => {
  const { data: testimonials } = useQuery({ queryKey: ['testimonials'], queryFn: contentAPI.testimonials });
  const reviews = (testimonials?.data?.results || testimonials?.data || []).slice(0, 3);

  return (
    <main className="min-h-screen pt-24">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-black text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full -ml-40 -mb-40" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.p variants={fadeUp} className="text-xs font-display font-bold text-gray-400 tracking-widest uppercase mb-4">Our Story</motion.p>
            <motion.h1 variants={fadeUp} className="font-display font-black text-5xl md:text-7xl text-white leading-tight max-w-4xl mb-6">
              Premier Global <span className="text-gray-300">Recruitment & Staffing</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-300 font-body text-lg leading-relaxed max-w-2xl mb-10">
              Optimus Manpower stands at the forefront of global talent acquisition and strategic staffing. With over 15 years of excellence, we empower organizations across India and the Middle East by delivering exceptional workforce solutions — one successful placement at a time.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link to="/jobs" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black font-heading font-semibold text-sm hover:bg-gray-100 transition-all">
                Explore Opportunities <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/40 text-white font-heading font-semibold text-sm hover:bg-white/10 transition-all">
                Partner With Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-light py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <motion.div key={label} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="text-center">
                <Icon className="w-5 h-5 text-black/40 mx-auto mb-2" />
                <p className="font-display font-black text-3xl text-black">{value}</p>
                <p className="text-gray-medium text-xs font-body mt-1 leading-snug">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION / VISION / VALUES ────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Target, title: 'Our Mission', text: 'To deliver exceptional recruitment solutions that create meaningful employment and drive business growth across India and globally — with integrity at the core of everything we do.' },
            { icon: Eye, title: 'Our Vision', text: 'To be South Asia\'s most trusted recruitment partner — known for integrity, speed, and sustained outcomes. A company that genuinely cares about every candidate and every client.' },
            { icon: Heart, title: 'Our Values', text: 'People-first. Radical transparency in every interaction. Commitment to long-term relationships over short-term transactions. Excellence in delivery. Respect for diversity and inclusion.' },
          ].map(({ icon: Icon, title, text }, i) => (
            <motion.div key={title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="card p-8">
              <div className="w-11 h-11 bg-black/10 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-black" />
              </div>
              <h3 className="font-heading font-semibold text-black text-lg mb-3">{title}</h3>
              <p className="text-gray-medium text-sm font-body leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── OUR SERVICES ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs font-display font-bold text-gray-400 tracking-widest uppercase mb-3">What We Offer</p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">Our Recruitment <span className="text-gray-300">Services</span></h2>
            <p className="text-gray-400 font-body max-w-xl mx-auto">
              End-to-end hiring solutions tailored for businesses of every size — from emerging startups to Fortune 500 enterprises.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ icon: Icon, title, desc, features }, i) => (
              <motion.div key={title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="bg-white/5 border border-white/10 hover:border-white/20 p-7 transition-all duration-300 hover:bg-white/8">
                <div className="w-11 h-11 bg-white/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-white text-base mb-3">{title}</h3>
                <p className="text-gray-400 text-sm font-body leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs font-body text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-white/50 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES WE SERVE ──────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="section-tag mb-3">Sector Expertise</p>
          <h2 className="section-title mb-4">Industries We <span className="text-black">Specialize In</span></h2>
          <p className="text-gray-medium font-body max-w-xl mx-auto">
            Deep domain knowledge across eight major industries ensures we understand the specific skills, culture, and compliance requirements of each sector.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {INDUSTRIES.map(({ name, icon, count }, i) => (
            <motion.div key={name} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
              className="card p-6 text-center hover:border-black/20 transition-all group">
              <span className="text-3xl mb-3 block">{icon}</span>
              <p className="font-heading font-semibold text-black text-sm mb-1">{name}</p>
              <p className="text-gray-medium text-xs font-body">{count}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── OUR PROCESS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-gray-light">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="section-tag mb-3">How It Works</p>
            <h2 className="section-title mb-4">Our Hiring <span className="text-black">Process</span></h2>
            <p className="text-gray-medium font-body max-w-xl mx-auto">
              A straightforward, transparent process designed to deliver the right hire with speed and confidence.
            </p>
          </div>
          <div className="space-y-0">
            {PROCESS.map(({ step, title, desc }, i) => (
              <motion.div key={step} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="flex gap-6 pb-10 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-display font-black">{step}</span>
                  </div>
                  {i < PROCESS.length - 1 && <div className="w-px flex-1 bg-gray-light mt-2" />}
                </div>
                <div className="pt-2 pb-10">
                  <h3 className="font-heading font-semibold text-black text-base mb-2">{title}</h3>
                  <p className="text-gray-medium text-sm font-body leading-relaxed max-w-2xl">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="section-tag mb-3">Our Edge</p>
          <h2 className="section-title mb-4">Why Businesses <span className="text-black">Choose Optimus</span></h2>
          <p className="text-gray-medium font-body max-w-xl mx-auto">
            Beyond filling vacancies — we build talent partnerships that stand the test of time.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DIFFERENTIATORS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
              className="card p-7 hover:border-black/20 transition-all">
              <div className="w-10 h-10 bg-black/8 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-black" />
              </div>
              <h3 className="font-heading font-semibold text-black text-sm mb-3">{title}</h3>
              <p className="text-gray-medium text-sm font-body leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MILESTONES ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-gray-light">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="section-tag mb-3">Our Journey</p>
            <h2 className="section-title">15 Years of <span className="text-black">Growth</span></h2>
          </div>
          <div className="space-y-0">
            {MILESTONES.map(({ year, event }, i) => (
              <motion.div key={year} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-black/10 border border-black/20 flex items-center justify-center shrink-0">
                    <span className="text-black text-xs font-display font-black">{year.slice(2)}</span>
                  </div>
                  {i < MILESTONES.length - 1 && <div className="w-px flex-1 bg-gray-light mt-2" />}
                </div>
                <div className="pt-2 pb-8">
                  <p className="text-black text-xs font-body mb-1 font-semibold">{year}</p>
                  <p className="text-gray-dark text-sm font-body leading-relaxed">{event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP TEAM ──────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="section-tag mb-3">The People</p>
          <h2 className="section-title mb-4">Meet Our <span className="text-black">Leadership</span></h2>
          <p className="text-gray-medium font-body max-w-xl mx-auto">
            Seasoned professionals united by a shared commitment to transforming how talent meets opportunity.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map((t, i) => (
            <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="card p-7 text-center">
              <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-display font-black text-black text-xl">{t.initials}</span>
              </div>
              <h3 className="font-heading font-semibold text-black text-sm mb-1">{t.name}</h3>
              <p className="text-black text-xs font-body mb-3">{t.role}</p>
              <p className="text-gray-medium text-xs font-body leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="py-20 bg-white border-t border-gray-light">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="section-tag mb-3">What They Say</p>
              <h2 className="section-title">Candidate <span className="text-black">Success Stories</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {reviews.map((t: any, i: number) => (
                <motion.div key={t.id} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="card p-7">
                  <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-black text-black" />)}</div>
                  <p className="text-gray-medium text-sm font-body italic leading-relaxed mb-5">"{t.review}"</p>
                  <div className="flex items-center gap-3">
                    {t.photo ? (
                      <img src={t.photo} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center font-display font-bold text-black text-xs">{t.name?.[0]}</div>
                    )}
                    <div>
                      <p className="font-heading font-semibold text-black text-xs">{t.name}</p>
                      <p className="text-gray-light text-xs font-body">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── OUR OFFICES ──────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="section-tag mb-3">Our Presence</p>
          <h2 className="section-title mb-4">Office <span className="text-black">Locations</span></h2>
          <p className="text-gray-medium font-body max-w-xl mx-auto">
            With offices across India's major metros, we're never far from the talent or clients we serve.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {LOCATIONS.map(({ city, type, address }, i) => (
            <motion.div key={city} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
              className="card p-7">
              <MapPin className="w-5 h-5 text-black mb-4" />
              <p className="font-heading font-semibold text-black text-base mb-1">{city}</p>
              <p className="text-xs font-body text-black mb-3 inline-block bg-black/8 px-2 py-0.5">{type}</p>
              <p className="text-gray-medium text-xs font-body leading-relaxed">{address}</p>
            </motion.div>
          ))}
        </div>
        {/* Contact strip */}
        <div className="mt-10 card p-7 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-heading font-semibold text-black text-base mb-1">Get in Touch</p>
            <p className="text-gray-medium text-sm font-body">Our team is available Monday–Saturday, 9 AM – 7 PM IST.</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <a href="tel:+912222334455" className="flex items-center gap-2 text-sm font-body text-black hover:text-gray-medium transition-colors">
              <Phone className="w-4 h-4" /> +91 22 2233 4455
            </a>
            <a href="mailto:info@optimusmanpower.com" className="flex items-center gap-2 text-sm font-body text-black hover:text-gray-medium transition-colors">
              <Mail className="w-4 h-4" /> info@optimusmanpower.com
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Award className="w-12 h-12 text-white/30 mx-auto mb-6" />
            <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
              Ready to Work With Us?
            </h2>
            <p className="text-gray-400 font-body text-base leading-relaxed mb-10 max-w-xl mx-auto">
              Whether you're a candidate searching for your next career milestone or a business looking to build an exceptional team — Optimus Manpower is your dedicated partner.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/jobs" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-heading font-semibold text-sm hover:bg-gray-100 transition-all group">
                Find Jobs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 border border-white/40 text-white font-heading font-semibold text-sm hover:bg-white/10 transition-all">
                Hire Talent
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
};

export default About;
