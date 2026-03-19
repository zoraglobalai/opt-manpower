import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Users, Globe, TrendingUp, Search, MapPin, Briefcase, Award } from 'lucide-react';
import { contentAPI, jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';
// Sector Images (LOCAL)
import itImg from '../asserts/IT&Technology.webp';
import healthcareImg from '../asserts/Healthcare.webp';
import engineeringImg from '../asserts/Engineering.webp';
import financeImg from '../asserts/Finance&Banking.webp';
import salesImg from '../asserts/Sales&Marketing.webp';
import hospitalityImg from '../asserts/Hospitality.webp';
import constructionImg from '../asserts/Construction.webp';
import logisticsImg from '../asserts/Logistics.webp';

// Why Choose Us Images
import precisionImg from '../asserts/Precision-Role-Matching.webp';
import consultancyImg from '../asserts/Expert-Consultancy.webp';
import strategyImg from '../asserts/Long-Term-Career-Strategy.webp';
import partnersImg from '../asserts/VettedGlobalPartners.webp';

const STATS = [
  { label: 'Placements Made', value: '10,000+', icon: Users },
  { label: 'Global Clients', value: '500+', icon: Globe },
  { label: 'Live Jobs', value: '1,200+', icon: TrendingUp },
  { label: 'Years Experience', value: '15+', icon: Star },
];

const SECTORS = [
  'IT & Technology', 'Healthcare', 'Engineering', 'Finance & Banking',
  'Sales & Marketing', 'Hospitality', 'Construction', 'Logistics',
];

const SECTOR_IMAGES: Record<string, string> = {
  'IT & Technology': itImg,
  'Healthcare': healthcareImg,
  'Engineering': engineeringImg,
  'Finance & Banking': financeImg,
  'Sales & Marketing': salesImg,
  'Hospitality': hospitalityImg,
  'Construction': constructionImg,
  'Logistics': logisticsImg,
};

const CandidateHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const { data: jobsData } = useQuery({
    queryKey: ['featured-jobs'],
    queryFn: () => jobsAPI.list({ page_size: 6 }),
  });
  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: contentAPI.testimonials,
  });

  const jobs = jobsData?.data?.results || [];
  const reviews = testimonials?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* ── Premium Hero ── */}
      <section className="relative min-h-[90vh] flex items-center pt-32">
        {/* Gradient Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-black/5 rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/3 rounded-full -ml-40 -mb-40" />
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
          {/* Main Content */}
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }} className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mb-8">
                <div className="inline-flex items-center gap-2 bg-black/10 border border-black/20 px-4 py-2 mb-6 rounded">
                  <TrendingUp className="w-4 h-4 text-black" />
                  <span className="text-xs font-display font-bold text-black tracking-wide">PREMIER RECRUITMENT SERVICES</span>
                </div>
                <h1 className="font-display font-black text-6xl lg:text-7xl leading-[1.1] text-black mb-6">
                  Accelerate Your <br />
                  <span className="relative">
                    Career Growth
                    <div className="absolute -bottom-3 left-0 w-40 h-1 bg-black/20" />
                  </span>
                </h1>
                <p className="text-lg text-gray-medium font-body leading-relaxed max-w-lg">
                  Partner with industry-leading recruitment experts to discover transformative career opportunities. We connect exceptional talent with premier organizations across India and the Middle East.
                </p>
              </motion.div>

              {/* Stats Mini */}
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="flex gap-8 mt-10">
                <div>
                  <p className="font-display font-black text-3xl text-black">10K+</p>
                  <p className="text-xs text-gray-medium font-body mt-1">Placements</p>
                </div>
                <div className="w-px bg-gray-light" />
                <div>
                  <p className="font-display font-black text-3xl text-black">500+</p>
                  <p className="text-xs text-gray-medium font-body mt-1">Clients</p>
                </div>
                <div className="w-px bg-gray-light" />
                <div>
                  <p className="font-display font-black text-3xl text-black">1.2K+</p>
                  <p className="text-xs text-gray-medium font-body mt-1">Active Roles</p>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Premium Search Card */}
            <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3 } } }}>
              <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-10 border border-black/5">
                <h3 className="font-heading font-semibold text-black text-lg mb-8">Find Your Perfect Role</h3>
                <form onSubmit={handleSearch} className="space-y-5">
                  {/* Job Search */}
                  <div>
                    <label className="block text-xs font-display font-bold text-gray-dark mb-3 tracking-wide uppercase">What role are you looking for?</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
                      <input
                        type="text"
                        placeholder="Job title, skill, or keyword..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-light text-black placeholder-gray-medium text-sm font-body focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Location Search */}
                  <div>
                    <label className="block text-xs font-display font-bold text-gray-dark mb-3 tracking-wide uppercase">Where do you want to work?</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
                      <input
                        type="text"
                        placeholder="City or region..."
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-light text-black placeholder-gray-medium text-sm font-body focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="w-full btn-primary py-4 justify-center mt-8">
                    Explore Opportunities <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Tags */}
                <div className="mt-8 pt-8 border-t border-gray-light">
                  <p className="text-xs font-display font-bold text-gray-medium mb-4 tracking-wide uppercase">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['IT Jobs', 'Gulf Roles', 'Leadership', 'Contract Work'].map(tag => (
                      <Link key={tag} to={`/jobs?q=${encodeURIComponent(tag)}`} className="text-xs font-body text-gray-medium hover:text-black border border-gray-light hover:border-black/30 hover:bg-black/2 px-3 py-1.5 transition-all duration-200">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* !!! Why Choose Us Section !!! */}
      <section className="py-24 bg-gradient-to-br from-white via-white to-gray-50 border-t border-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.4fr] gap-12 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:sticky lg:top-28">
              <p className="section-tag mb-4">OUR ADVANTAGES</p>
              <h2 className="section-title mb-6">
                Why Top Talent <span className="text-black">Chooses Us</span>
              </h2>
              <p className="text-gray-medium font-body max-w-xl leading-relaxed">
                We provide a consultative approach to recruitment, focusing on long-term career growth rather than quick placements. Our expert team ensures highly tailored role-matching, complete transparency, and steadfast advocacy for your career ambitions.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-6 max-w-xl">
                {[
                  { icon: Users, title: 'Dedicated Recruiter', value: '1:1 career guidance' },
                  { icon: Globe, title: 'Global Reach', value: '12+ active markets' },
                  { icon: TrendingUp, title: 'Strategic Growth', value: 'Skills-centric alignment' },
                  { icon: Award, title: 'Proven Outcomes', value: '10,000+ success stories' },
                ].map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <div className="flex items-start gap-3 bg-white border border-black/5 rounded-lg p-4">
                      <div className="w-10 h-10 bg-black/8 rounded-md flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-black text-sm">{item.title}</p>
                        <p className="text-gray-medium text-xs font-body">{item.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                {
                  title: 'Precision Role Matching',
                  desc: 'We map your distinct skills and preferences against highly relevant, verified vacancies to secure the ideal cultural and professional fit.',
                  icon: Search,
                  image: precisionImg,
                },
                {
                  title: 'Expert Consultancy',
                  desc: 'Our seasoned recruiters act as your dedicated advocates, comprehensively preparing you for interviews and negotiating optimal compensations.',
                  icon: Users,
                  image: consultancyImg,
                },
                {
                  title: 'Long-Term Career Strategy',
                  desc: 'We prioritize roles that foster sustainable value, providing you with continuous insights for upskilling and career transitions.',
                  icon: TrendingUp,
                  image: strategyImg,
                },
                {
                  title: 'Vetted Global Partners',
                  desc: 'We strictly collaborate with reputable employers renowned for their credibility, inclusive cultures, and accelerated growth potential.',
                  icon: Award,
                  image: partnersImg,
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="group h-full bg-white border border-black/5 hover:border-black/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
                      <div className="absolute left-5 bottom-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-black" />
                        </div>
                        <p className="font-heading font-semibold text-white text-sm drop-shadow">{item.title}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-medium text-sm font-body leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      {/* ── Featured Jobs ── */}
      <section className="py-20 bg-gradient-to-br from-black/2 to-black/1 border-t border-b border-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-14 gap-4">
            <div>
              <p className="section-tag mb-3">LIVE VACANCIES</p>
              <h2 className="section-title">
                Featured <span className="text-black">Opportunities</span>
              </h2>
              <div className="accent-line mt-4" />
            </div>
            <Link to="/jobs" className="btn-outline text-sm">View All <ArrowRight className="w-4 h-4" /></Link>
          </motion.div>

          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job: any, i: number) => (
                <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <JobCard job={job} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-light font-body">No jobs available at the moment. Check back soon!</div>
          )}
        </div>
      </section>

      {/* ── Browse by Sector ── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="section-tag mb-3">EXPLORE ROLES</p>
          <h2 className="section-title">
            Browse by <span className="text-black">Industry</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {SECTORS.map((sector, i) => (
            <motion.div key={sector} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={`/jobs?q=${encodeURIComponent(sector)}`}
                className="group relative block bg-white border border-black/5 overflow-hidden rounded-xl h-48 transition-all duration-300 hover:border-black/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
                {/* Image Background */}
                <img
                  src={SECTOR_IMAGES[sector]}
                  alt={sector}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/80 transition-all duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                  <p className="font-heading font-semibold text-white text-center text-sm leading-tight drop-shadow-lg">{sector}</p>
                </div>

                {/* Hover Indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      {reviews.length > 0 && (
        <section className="py-20 bg-white border-t border-gray-light">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <p className="section-tag mb-3">SUCCESS STORIES</p>
              <h2 className="section-title">
                What Our <span className="text-black">Candidates Achieved</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {reviews.slice(0, 3).map((t: any, i: number) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="group bg-white border border-black/5 hover:border-black/20 rounded-xl p-8 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] h-full flex flex-col">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-black text-black" />)}
                    </div>
                    <p className="text-gray-medium text-sm font-body italic leading-relaxed mb-6 flex-1">
                      "{t.review}"
                    </p>
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-light">
                      {t.photo ? (
                        <img src={t.photo} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center font-display font-bold text-black text-sm">
                          {t.name?.[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-heading font-semibold text-black text-sm">{t.name}</p>
                        <p className="text-gray-medium text-xs font-body">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Premium CTA ── */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-display font-bold text-gray-300 mb-6 tracking-wide uppercase">Take the Next Step</p>
            <h2 className="font-display font-black text-5xl lg:text-6xl leading-tight text-white mb-8">
              Ready to Transform Your <span className="relative">Career<div className="absolute -bottom-2 left-0 w-32 h-1 bg-white/30" /></span>?
            </h2>
            <p className="text-lg text-gray-300 font-body leading-relaxed mb-10 max-w-xl mx-auto">
              Partner with Optimus Manpower to access exclusive recruitment opportunities. Your next monumental career achievement begins here.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/jobs" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-heading font-semibold text-sm rounded transition-all hover:bg-gray-100 group">
                Explore Opportunities <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-heading font-semibold text-sm rounded hover:bg-white/10 transition-all">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default CandidateHome;
