import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronLeft, ChevronRight, Globe, MapPin } from 'lucide-react';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';
import AuthModal from '../components/AuthModal';

const CATEGORIES = ['IT & Technology', 'Healthcare', 'Finance', 'Engineering', 'Sales', 'Marketing', 'HR', 'Operations', 'Hospitality', 'Construction', 'Logistics', 'Education'];
const JOB_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship'];
const COUNTRIES = ['India', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'UK', 'Canada', 'Singapore', 'Australia', 'Malaysia'];
const EXPERIENCE_LEVELS = ['Fresher (0-1 yr)', '1-3 years', '3-5 years', '5-8 years', '8+ years'];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [authModal, setAuthModal] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const typeParam = searchParams.get('type');
  const isInternational = typeParam === 'international' ? 'true' : typeParam === 'domestic' ? 'false' : '';

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    job_type: searchParams.get('job_type') || '',
    country: searchParams.get('country') || searchParams.get('location') || '',
    is_international: isInternational,
    experience: searchParams.get('experience') || '',
    page: 1,
  });

  const [searchInput, setSearchInput] = useState(filters.q);

  // Sync URL params → filters when URL changes (e.g., clicking navbar links)
  useEffect(() => {
    const typeP = searchParams.get('type');
    const intl = typeP === 'international' ? 'true' : typeP === 'domestic' ? 'false' : '';
    setFilters(prev => ({
      ...prev,
      q: searchParams.get('q') || prev.q,
      is_international: intl || prev.is_international,
      page: 1,
    }));
    if (searchParams.get('q')) setSearchInput(searchParams.get('q') || '');
  }, [searchParams.get('type'), searchParams.get('q')]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsAPI.list({
      q: filters.q || undefined,
      category: filters.category || undefined,
      job_type: filters.job_type || undefined,
      country: filters.country || undefined,
      is_international: filters.is_international || undefined,
      experience: filters.experience || undefined,
      page: filters.page,
    }),
  });

  const jobs = data?.data?.results || [];
  const totalPages = Math.ceil((data?.data?.count || 0) / 10);
  const totalCount = data?.data?.count || 0;

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('q', searchInput);
  };

  const clearFilters = () => {
    setFilters({ q: '', category: '', job_type: '', country: '', is_international: '', experience: '', page: 1 });
    setSearchInput('');
    setSearchParams({});
  };

  const hasFilters = filters.q || filters.category || filters.job_type || filters.country || filters.is_international || filters.experience;

  const pageTitle = filters.is_international === 'true'
    ? 'International Jobs'
    : filters.is_international === 'false'
    ? 'Domestic Jobs'
    : 'All Job Listings';

  return (
    <main className="min-h-screen bg-white">
      {/* Premium Header with Background */}
      <div className="relative pt-40 pb-16 overflow-hidden bg-white">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80&auto=format&fit=crop")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-white" />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-black/5 border border-black/15 px-4 py-2 mb-6 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-black/60 animate-pulse" />
                <span className="text-xs font-display font-bold text-black/70 tracking-wide">DISCOVER YOUR CAREER PATH</span>
              </div>
              
              <h1 className="font-display font-black text-4xl md:text-5xl leading-tight text-black mb-6">
                <span>Find Your</span><br />
                <span className="relative inline-block">
                  Next Role
                  <motion.div 
                    className="absolute -bottom-2 left-0 h-1 bg-black"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </span>
              </h1>
              
              <p className="text-base text-gray-medium font-body max-w-md mb-8 leading-relaxed">
                Browse opportunities tailored to your expertise. Connect with industry leaders and advance your career.
              </p>

              <p className="text-sm text-gray-dark font-heading font-semibold flex items-center gap-2 mb-8">
                {isLoading ? (
                  <><span className="animate-pulse">Loading positions...</span></>
                ) : (
                  <>
                    <span className="text-xl font-black text-black">{totalCount}</span>
                    <span>active positions</span>
                  </>
                )}
              </p>

              {/* Quick filter pills for domestic/international */}
              <motion.div 
                className="flex gap-2 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <button
                  onClick={() => setFilters(f => ({ ...f, is_international: '', page: 1 }))}
                  className={`text-xs px-5 py-2.5 font-heading font-semibold border border-2 rounded transition-all duration-300 ${
                    !filters.is_international 
                      ? 'bg-black text-white border-black shadow-md' 
                      : 'border-gray-300 text-gray-medium hover:border-black hover:text-black bg-white'
                  }`}
                >
                  All Roles
                </button>
                <button
                  onClick={() => setFilters(f => ({ ...f, is_international: 'false', page: 1 }))}
                  className={`flex items-center gap-1.5 text-xs px-5 py-2.5 font-heading font-semibold border-2 rounded transition-all duration-300 ${
                    filters.is_international === 'false' 
                      ? 'bg-black text-white border-black shadow-md' 
                      : 'border-gray-300 text-gray-medium hover:border-black hover:text-black bg-white'
                  }`}
                >
                  <MapPin className="w-3 h-3" /> Domestic
                </button>
                <button
                  onClick={() => setFilters(f => ({ ...f, is_international: 'true', page: 1 }))}
                  className={`flex items-center gap-1.5 text-xs px-5 py-2.5 font-heading font-semibold border-2 rounded transition-all duration-300 ${
                    filters.is_international === 'true' 
                      ? 'bg-black text-white border-black shadow-md' 
                      : 'border-gray-300 text-gray-medium hover:border-black hover:text-black bg-white'
                  }`}
                >
                  <Globe className="w-3 h-3" /> International
                </button>
              </motion.div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div 
              className="hidden lg:flex justify-center"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&q=80&auto=format&fit=crop"
                alt="Career Search"
                className="w-96 h-96 rounded-2xl shadow-2xl object-cover border-4 border-white/80"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Search + Filters - Elegant Design */}
        <motion.div 
          className="mb-12 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Main Search Bar */}
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="relative flex items-stretch gap-2 md:gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, skills, or keywords..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 bg-white border-2 border-gray-light text-black placeholder-gray-medium text-sm font-body focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300 rounded-xl shadow-sm hover:border-gray-300"
                />
              </div>

              {/* Search Button */}
              <button 
                type="submit" 
                className="px-8 py-4 bg-black text-white font-heading font-bold text-sm rounded-xl hover:bg-black/90 active:bg-black/95 transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Advanced Filters Toggle */}
              <button 
                type="button" 
                onClick={() => setFiltersOpen(!filtersOpen)} 
                className={`flex items-center justify-center gap-2 px-6 py-4 font-heading font-semibold text-sm rounded-xl transition-all duration-300 whitespace-nowrap shadow-sm border-2 ${
                  filtersOpen 
                    ? 'border-black text-black bg-black/5' 
                    : 'border-gray-light text-gray-medium hover:border-black hover:text-black hover:shadow-md'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              {/* Clear Filters */}
              {hasFilters && (
                <button 
                  type="button" 
                  onClick={clearFilters} 
                  className="flex items-center justify-center gap-2 px-5 py-4 font-heading font-semibold text-sm border-2 border-gray-light text-gray-medium rounded-xl hover:border-black/40 hover:text-black hover:bg-black/2 transition-all duration-300 shadow-sm"
                  title="Clear all filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Expanded Filters - Premium Design */}
          {filtersOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }} 
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-white via-white/98 to-gray-50/30 rounded-2xl border-2 border-gray-light p-8 space-y-6 shadow-lg"
            >
              {/* Header */}
              <div className="flex items-center gap-3 pb-6 border-b-2 border-gray-light">
                <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                <h3 className="font-heading font-bold text-lg text-black">Refine Your Search</h3>
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-xs font-display font-bold text-black uppercase tracking-wider">Category</label>
                  <select 
                    value={filters.category} 
                    onChange={e => updateFilter('category', e.target.value)} 
                    className="w-full px-4 py-3 bg-white border-2 border-gray-light text-black text-sm font-body focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300 rounded-lg hover:border-gray-300"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Job Type */}
                <div className="space-y-2">
                  <label className="block text-xs font-display font-bold text-black uppercase tracking-wider">Job Type</label>
                  <select 
                    value={filters.job_type} 
                    onChange={e => updateFilter('job_type', e.target.value)} 
                    className="w-full px-4 py-3 bg-white border-2 border-gray-light text-black text-sm font-body focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300 rounded-lg hover:border-gray-300"
                  >
                    <option value="">All Job Types</option>
                    {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="block text-xs font-display font-bold text-black uppercase tracking-wider">Location</label>
                  <select 
                    value={filters.country} 
                    onChange={e => updateFilter('country', e.target.value)} 
                    className="w-full px-4 py-3 bg-white border-2 border-gray-light text-black text-sm font-body focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300 rounded-lg hover:border-gray-300"
                  >
                    <option value="">All Countries</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <label className="block text-xs font-display font-bold text-black uppercase tracking-wider">Experience</label>
                  <select 
                    value={filters.experience} 
                    onChange={e => updateFilter('experience', e.target.value)} 
                    className="w-full px-4 py-3 bg-white border-2 border-gray-light text-black text-sm font-body focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300 rounded-lg hover:border-gray-300"
                  >
                    <option value="">All Experience Levels</option>
                    {EXPERIENCE_LEVELS.map(x => <option key={x} value={x}>{x}</option>)}
                  </select>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-center gap-2 text-xs text-gray-medium pt-4 border-t border-gray-light">
                <div className="w-1 h-1 rounded-full bg-gray-medium" />
                <span>Filters update search results automatically</span>
              </div>
            </motion.div>
          )}

          {/* Active Filter Tags */}
          {hasFilters && (
            <motion.div 
              className="flex flex-wrap gap-2 items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-xs font-heading font-semibold text-gray-dark">Active:</span>
              {[
                { key: 'q', label: `"${filters.q}"` },
                { key: 'category', label: filters.category },
                { key: 'job_type', label: filters.job_type },
                { key: 'country', label: filters.country },
                { key: 'is_international', label: filters.is_international === 'true' ? 'International' : filters.is_international === 'false' ? 'Domestic' : '' },
                { key: 'experience', label: filters.experience },
              ].filter(f => f.label).map(({ key, label }) => (
                <motion.button 
                  key={key} 
                  onClick={() => updateFilter(key === 'is_international' ? 'is_international' : key, '')}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-black/8 border border-black/20 text-black font-heading font-semibold rounded-full hover:bg-black/15 hover:border-black/40 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {label} <X className="w-3 h-3 opacity-60" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        {isLoading || isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border-2 border-gray-light rounded-xl p-8 animate-pulse h-72">
                <div className="h-3 bg-gray-100 rounded mb-4 w-1/3" />
                <div className="h-6 bg-gray-100 rounded mb-3 w-3/4" />
                <div className="h-3 bg-gray-100 rounded mb-6 w-1/2" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {jobs.map((job: any, i: number) => (
                <motion.div 
                  key={job.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <JobCard job={job} onAuthRequired={() => setAuthModal(true)} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div 
                className="flex items-center justify-center gap-4 py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button 
                  disabled={filters.page <= 1} 
                  onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} 
                  className={`flex items-center justify-center gap-2 px-6 py-3 font-heading font-semibold text-sm border-2 rounded-lg transition-all duration-300 ${
                    filters.page <= 1
                      ? 'border-gray-light text-gray-light cursor-not-allowed opacity-40'
                      : 'border-black text-black hover:bg-black hover:text-white'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                
                <span className="text-gray-medium font-body text-sm px-4 py-2 bg-black/5 rounded-lg border border-gray-light">
                  Page <span className="font-semibold text-black">{filters.page}</span> of <span className="font-semibold text-black">{totalPages}</span>
                </span>
                
                <button 
                  disabled={filters.page >= totalPages} 
                  onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} 
                  className={`flex items-center justify-center gap-2 px-6 py-3 font-heading font-semibold text-sm border-2 rounded-lg transition-all duration-300 ${
                    filters.page >= totalPages
                      ? 'border-gray-light text-gray-light cursor-not-allowed opacity-40'
                      : 'border-black text-black hover:bg-black hover:text-white'
                  }`}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            className="text-center py-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gray-light">
              <Search className="w-12 h-12 text-gray-light" />
            </div>
            <p className="text-gray-medium font-body text-lg font-semibold mb-2">No jobs found</p>
            <p className="text-gray-light font-body text-sm mb-8">Try adjusting your filters or search query</p>
            <button 
              onClick={clearFilters} 
              className="inline-flex items-center gap-2 px-8 py-3 font-heading font-semibold text-sm border-2 border-gray-light text-gray-medium rounded-lg hover:border-black hover:text-black transition-all duration-300"
            >
              <X className="w-4 h-4" /> Clear All Filters
            </button>
          </motion.div>
        )}
      </div>

      {authModal && <AuthModal onClose={() => setAuthModal(false)} />}
    </main>
  );
};

export default Jobs;


