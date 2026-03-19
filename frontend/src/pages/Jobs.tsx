import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronLeft, ChevronRight, Globe, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';
import AuthModal from '../components/AuthModal';
import job from '../asserts/job-bg.jpg';

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div 
          className="absolute top-0 -right-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/20 to-cyan-200/10 blur-3xl"
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-1/4 -left-1/3 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-200/20 to-purple-200/10 blur-3xl"
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Premium Header Section */}
      <div 
        className="relative pt-32 pb-20 px-4 before:absolute before:inset-0 before:bg-cover before:bg-center before:bg-no-repeat before:opacity-100 before:z-0 after:absolute after:inset-0 after:bg-gradient-to-br after:from-slate-900/40 after:via-slate-900/35 after:to-slate-900/40 after:z-10"
        style={{
          backgroundImage: `url(${job})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto relative z-20">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 px-6 py-2.5 rounded-full mb-6 backdrop-blur-sm shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 tracking-widest">PREMIUM OPPORTUNITIES</span>
            </motion.div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gradient leading-tight mb-6">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                Discover Your
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-transparent bg-clip-text relative">
                Perfect Career
                {/* <motion.div 
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-sm"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                /> */}
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Connect with world-class companies and unlock career opportunities tailored to your expertise. 
              <span className="block mt-2">Your next opportunity awaits.</span>
            </p>

            {/* Stats Row */}
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-12"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-center">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  {isLoading ? '...' : totalCount}
                </div>
                <div className="text-sm text-slate-600 font-medium mt-1">Active Positions</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
              <div className="text-center">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                  150+
                </div>
                <div className="text-sm text-slate-600 font-medium mt-1">Companies</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
              <div className="text-center">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  50+
                </div>
                <div className="text-sm text-slate-600 font-medium mt-1">Countries</div>
              </div>
            </motion.div>

            {/* Quick Filter Buttons - Centered & Aligned */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button
                onClick={() => setFilters(f => ({ ...f, is_international: '', page: 1 }))}
                className={`group relative px-7 py-3 font-semibold text-sm rounded-full transition-all duration-300 overflow-hidden ${
                  !filters.is_international 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40' 
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-lg'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  All Roles
                </span>
                {!filters.is_international && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                )}
              </button>
              
              <button
                onClick={() => setFilters(f => ({ ...f, is_international: 'false', page: 1 }))}
                className={`group relative px-7 py-3 font-semibold text-sm rounded-full transition-all duration-300 overflow-hidden flex items-center gap-2 ${
                  filters.is_international === 'false' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40' 
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-lg'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span className="relative z-10">Domestic</span>
                {filters.is_international === 'false' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                )}
              </button>
              
              <button
                onClick={() => setFilters(f => ({ ...f, is_international: 'true', page: 1 }))}
                className={`group relative px-7 py-3 font-semibold text-sm rounded-full transition-all duration-300 overflow-hidden flex items-center gap-2 ${
                  filters.is_international === 'true' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40' 
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-lg'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="relative z-10">International</span>
                {filters.is_international === 'true' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                )}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="relative max-w-7xl mx-auto px-4 pb-24">
        {/* Search & Filters Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Main Search Bar */}
          <form onSubmit={handleSearchSubmit} className="space-y-6">
            <div className="relative flex items-stretch gap-3 flex-col sm:flex-row">
              {/* Search Input */}
              <div className="flex-1 relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, skills..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-500 text-base font-light focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 rounded-2xl shadow-sm hover:border-slate-300 hover:shadow-md"
                />
              </div>

              {/* Button Group */}
              <div className="flex gap-3">
                {/* Search Button */}
                <button 
                  type="submit" 
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-base rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">Search</span>
                  </span>
                </button>

                {/* Filters Toggle */}
                <button 
                  type="button" 
                  onClick={() => setFiltersOpen(!filtersOpen)} 
                  className={`group relative px-6 py-4 font-semibold text-base rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${
                    filtersOpen 
                      ? 'bg-blue-50 border-2 border-blue-500 text-blue-600 shadow-lg shadow-blue-500/20' 
                      : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:shadow-lg'
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
                    className="group px-6 py-4 bg-red-50 border-2 border-red-200 text-red-600 font-semibold rounded-2xl hover:border-red-400 hover:bg-red-100 hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    title="Clear all filters"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Expanded Filters */}
          {filtersOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }} 
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-white via-blue-50/30 to-white rounded-3xl border-2 border-slate-200 p-8 space-y-8 shadow-xl mt-6"
            >
              {/* Header */}
              <div className="flex items-center gap-3 pb-6 border-b-2 border-slate-200">
                <motion.div 
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <h3 className="font-black text-xl text-slate-900 tracking-tight">Refine Your Search</h3>
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category */}
                <motion.div className="space-y-3" whileHover={{ y: -2 }}>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest">Category</label>
                  <select 
                    value={filters.category} 
                    onChange={e => updateFilter('category', e.target.value)} 
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 rounded-xl hover:border-slate-300 hover:shadow-md"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </motion.div>

                {/* Job Type */}
                <motion.div className="space-y-3" whileHover={{ y: -2 }}>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest">Job Type</label>
                  <select 
                    value={filters.job_type} 
                    onChange={e => updateFilter('job_type', e.target.value)} 
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 rounded-xl hover:border-slate-300 hover:shadow-md"
                  >
                    <option value="">All Job Types</option>
                    {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </motion.div>

                {/* Location */}
                <motion.div className="space-y-3" whileHover={{ y: -2 }}>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest">Location</label>
                  <select 
                    value={filters.country} 
                    onChange={e => updateFilter('country', e.target.value)} 
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 rounded-xl hover:border-slate-300 hover:shadow-md"
                  >
                    <option value="">All Countries</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </motion.div>

                {/* Experience */}
                <motion.div className="space-y-3" whileHover={{ y: -2 }}>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest">Experience</label>
                  <select 
                    value={filters.experience} 
                    onChange={e => updateFilter('experience', e.target.value)} 
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all duration-300 rounded-xl hover:border-slate-300 hover:shadow-md"
                  >
                    <option value="">All Experience Levels</option>
                    {EXPERIENCE_LEVELS.map(x => <option key={x} value={x}>{x}</option>)}
                  </select>
                </motion.div>
              </div>

              {/* Info Footer */}
              <div className="flex items-center gap-2 text-xs text-slate-600 pt-4 border-t border-slate-200">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Filters update instantly</span>
              </div>
            </motion.div>
          )}

          {/* Active Filter Tags */}
          {hasFilters && (
            <motion.div 
              className="flex flex-wrap gap-2 items-center mt-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Filters:</span>
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
                  className="flex items-center gap-2 text-xs px-3.5 py-1.5 bg-blue-50 border-2 border-blue-300 text-blue-700 font-semibold rounded-full hover:bg-blue-100 hover:border-blue-400 transition-all duration-300 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {label} 
                  <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Job Results Section */}
        <div className="space-y-8">
          {/* Results Header */}
          {jobs.length > 0 && !isLoading && (
            <motion.div 
              className="flex items-center justify-between pb-6 border-b-2 border-slate-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black text-sm">
                  {isLoading ? '...' : totalCount}
                </div>
                <span className="text-slate-700 font-semibold">Results Found</span>
              </div>
              <div className="text-sm text-slate-600 font-medium">
                Page <span className="text-blue-600 font-black">{filters.page}</span> of <span className="text-blue-600 font-black">{totalPages}</span>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading || isFetching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="bg-white border-2 border-slate-200 rounded-2xl p-8 animate-pulse h-80"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.5, 0.6, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="h-3 bg-slate-200 rounded mb-4 w-1/3" />
                  <div className="h-6 bg-slate-200 rounded mb-3 w-3/4" />
                  <div className="h-3 bg-slate-200 rounded mb-6 w-1/2" />
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-5/6" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <>
              {/* Job Cards Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {jobs.map((job: any, i: number) => (
                  <motion.div 
                    key={job.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.04, duration: 0.5 }}
                  >
                    <JobCard job={job} onAuthRequired={() => setAuthModal(true)} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div 
                  className="flex items-center justify-center gap-4 pt-16 pb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <button 
                    disabled={filters.page <= 1} 
                    onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} 
                    className={`group relative px-7 py-3.5 font-bold text-base rounded-full transition-all duration-300 flex items-center gap-2 overflow-hidden ${
                      filters.page <= 1
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-white border-2 border-slate-200 text-slate-900 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/20'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> 
                    <span>Previous</span>
                  </button>
                  
                  <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-slate-200">
                    <span className="text-slate-600 font-medium">Page</span>
                    <span className="h-8 w-12 flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black rounded-lg">
                      {filters.page}
                    </span>
                    <span className="text-slate-600 font-medium">of</span>
                    <span className="font-black text-slate-900 text-lg">{totalPages}</span>
                  </div>
                  
                  <button 
                    disabled={filters.page >= totalPages} 
                    onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} 
                    className={`group relative px-7 py-3.5 font-bold text-base rounded-full transition-all duration-300 flex items-center gap-2 overflow-hidden ${
                      filters.page >= totalPages
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-white border-2 border-slate-200 text-slate-900 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/20'
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            // Empty State
            <motion.div 
              className="text-center py-32"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-slate-200 shadow-lg">
                <Search className="w-16 h-16 text-slate-400" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">No Opportunities Found</h2>
              <p className="text-slate-600 font-medium text-lg mb-8 max-w-md mx-auto">
                Try adjusting your filters or search terms to discover more positions
              </p>
              <motion.button 
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-8 py-4 font-bold text-base border-2 border-slate-200 text-slate-700 rounded-full hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" /> Clear Filters & Try Again
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {authModal && <AuthModal onClose={() => setAuthModal(false)} />}
    </main>
  );
};

export default Jobs;


