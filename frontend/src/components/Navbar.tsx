import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronDown, Briefcase, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMode } from '../context/ModeContext';
import LogoImage from '../asserts/opt-man-logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, setMode } = useMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setJobsOpen(false); setAboutOpen(false); }, [location]);

  const isAdmin = user?.role === 'admin';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md shadow-[0_2px_20px_rgba(192,192,192,0.2)]' : 'bg-black'}`}>

        {/* ── Top Bar ── */}
        <div className="border-b border-gray-600">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
            {/* Left: context links */}
            <div className="flex items-center gap-6 text-xs font-body text-gray-300">
              {mode === 'candidate' ? (
                <>
                  <Link to="/jobs" className="silver-glow text-gray-300">Looking for a Job?</Link>
                  <Link to="/saved-jobs" className="silver-glow text-gray-300">Saved Jobs</Link>
                  <Link to="/career-advice" className="silver-glow text-gray-300">Career Advice</Link>
                </>
              ) : (
                <>
                  <Link to="/solutions" className="silver-glow text-gray-300">Solutions</Link>
                  <Link to="/business-enquiry" className="silver-glow text-gray-300">Hire Talent</Link>
                  <Link to="/contact" className="silver-glow text-gray-300">Contact Us</Link>
                </>
              )}
            </div>

            {/* Right: Mode Toggle Pill */}
            <div className="flex items-center gap-4">
              {!isAdmin && (
                <div className="flex items-center bg-black/30 border border-gray-600 p-0.5" role="group" aria-label="Switch site mode">
                  <button
                    onClick={() => setMode('candidate')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-semibold transition-all duration-200 ${mode === 'candidate' ? 'bg-white text-black' : 'text-gray-300 hover:text-white'}`}
                  >
                    <User className="w-3 h-3" /> Job Seekers
                  </button>
                  <button
                    onClick={() => setMode('employer')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-semibold transition-all duration-200 ${mode === 'employer' ? 'bg-white text-black' : 'text-gray-300 hover:text-white'}`}
                  >
                    <Briefcase className="w-3 h-3" /> Employers
                  </button>
                </div>
              )}
              {isAdmin && (
                <span className="text-xs font-body text-gray-300">Admin Mode</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Main Nav ── */}
        <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={LogoImage}
              alt="Optimus Manpower Logo"
              className="h-12 w-auto object-contain hover:opacity-80 transition-opacity duration-200"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {/* Guest — candidate mode */}
            {mode === 'candidate' && (
              <>
                <div className="relative" onMouseEnter={() => setJobsOpen(true)} onMouseLeave={() => setJobsOpen(false)}>
                  <button className="flex items-center gap-1 text-sm font-body text-white hover:text-gray-300 silver-glow transition-colors">
                    Search Jobs <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {jobsOpen && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-black border border-gray-600 shadow-lg">
                        <Link to="/jobs" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900 transition-colors">All Jobs</Link>
                        <Link to="/jobs?type=domestic" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900 transition-colors">Domestic Jobs</Link>
                        <Link to="/jobs?type=international" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900 transition-colors">International Jobs</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link to="/saved-jobs" className="text-sm font-body text-white hover:text-gray-300 silver-glow transition-colors">Saved Jobs</Link>
                <Link to="/career-advice" className="text-sm font-body text-white hover:text-gray-300 silver-glow transition-colors">Career Advice</Link>
                <Link to="/about" className="text-sm font-body text-white hover:text-gray-300 silver-glow transition-colors">About Us</Link>
              </>
            )}

            {/* Guest — employer mode */}
            {mode === 'employer' && (
              <>
                <Link to="/solutions" className="text-sm font-body text-white hover:text-gray-300 silver-glow transition-colors">Solutions</Link>
                <Link to="/business-enquiry" className="text-sm font-body text-white hover:text-gray-300 silver-glow transition-colors">Hire Talent</Link>
                <div className="relative" onMouseEnter={() => setAboutOpen(true)} onMouseLeave={() => setAboutOpen(false)}>
                  <button className="flex items-center gap-1 text-sm font-body text-white hover:text-gray-300 silver-glow transition-colors">
                    About Us <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {aboutOpen && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="absolute top-full left-0 mt-2 w-44 bg-black border border-gray-600 shadow-lg">
                        <Link to="/about" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900 transition-colors">About Us</Link>
                        <Link to="/solutions" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900 transition-colors">Our Solutions</Link>
                        <Link to="/career-advice" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900 transition-colors">Career Advice</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link to="/contact" className="text-sm font-body text-white hover:text-gray-300 silver-glow transition-colors">Contact Us</Link>
              </>
            )}
          </div>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-white hover:text-gray-300 silver-glow transition-colors">
              <Search className="w-5 h-5" />
            </button>
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <Link to="/admin" className="text-sm font-body text-white">Admin Panel</Link>
                <button onClick={logout} className="btn-outline text-xs py-2 px-5">Logout</button>
              </div>
            ) : (
              <Link to="/admin" className="flex items-center gap-1.5 text-xs font-body font-semibold text-gray-300 border border-gray-600 hover:border-gray-400 hover:text-white px-3 py-1.5 transition-all duration-200">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Login
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-black border-t border-gray-600 overflow-hidden">
              <div className="px-4 py-6 flex flex-col gap-4">
                {/* Mode toggle (mobile) */}
                {!isAdmin && (
                  <div className="flex gap-2 mb-2">
                    <button onClick={() => setMode('candidate')}
                      className={`flex-1 py-2 text-xs font-body font-semibold border transition-all ${mode === 'candidate' ? 'bg-white text-black border-white' : 'border-gray-600 text-gray-300'}`}>
                      <User className="w-3 h-3 inline mr-1" /> Job Seekers
                    </button>
                    <button onClick={() => setMode('employer')}
                      className={`flex-1 py-2 text-xs font-body font-semibold border transition-all ${mode === 'employer' ? 'bg-white text-black border-white' : 'border-gray-600 text-gray-300'}`}>
                      <Briefcase className="w-3 h-3 inline mr-1" /> Employers
                    </button>
                  </div>
                )}

                {/* Mobile nav links */}
                {mode === 'candidate' && (
                  <div className="flex flex-col gap-4">
                    <Link to="/jobs" className="nav-link text-lg" onClick={() => setMenuOpen(false)}>Search Jobs</Link>
                    <Link to="/jobs?type=domestic" className="text-gray-400 hover:text-gray-300 font-body text-sm pl-4 silver-glow" onClick={() => setMenuOpen(false)}>↳ Domestic Jobs</Link>
                    <Link to="/jobs?type=international" className="text-gray-400 hover:text-gray-300 font-body text-sm pl-4 silver-glow" onClick={() => setMenuOpen(false)}>↳ International Jobs</Link>
                    <Link to="/career-advice" className="nav-link text-lg" onClick={() => setMenuOpen(false)}>Career Advice</Link>
                    <Link to="/saved-jobs" className="nav-link text-lg" onClick={() => setMenuOpen(false)}>Saved Jobs</Link>
                  </div>
                )}
                {mode === 'employer' && (
                  <div className="flex flex-col gap-4">
                    <Link to="/solutions" className="nav-link text-lg" onClick={() => setMenuOpen(false)}>Solutions</Link>
                    <Link to="/business-enquiry" className="nav-link text-lg" onClick={() => setMenuOpen(false)}>Hire Talent</Link>
                    <Link to="/about" className="nav-link text-lg" onClick={() => setMenuOpen(false)}>About Us</Link>
                    <Link to="/career-advice" className="nav-link text-lg" onClick={() => setMenuOpen(false)}>Career Advice</Link>
                    <Link to="/contact" className="nav-link text-lg" onClick={() => setMenuOpen(false)}>Contact Us</Link>
                  </div>
                )}
                {isAdmin ? (
                  <>
                    <Link to="/admin" className="text-white font-body text-sm">Admin Panel</Link>
                    <button onClick={logout} className="btn-outline text-sm py-2 text-left w-full mt-2">Logout</button>
                  </>
                ) : (
                  <Link to="/admin" className="flex items-center gap-1.5 text-xs font-body font-semibold text-gray-300 border border-gray-600 px-3 py-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-[88px] left-0 right-0 z-40 bg-black border-b border-gray-600 px-4 py-4 shadow-lg">
            <div className="max-w-3xl mx-auto flex gap-3">
              <input
                autoFocus
                type="text"
                placeholder={mode === 'employer' ? 'Search solutions, industries...' : 'Search jobs, companies, locations...'}
                className="flex-1 px-4 py-3 bg-white text-black placeholder-gray-400 text-sm font-body rounded border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = (e.target as HTMLInputElement).value;
                    if (q.trim()) {
                      window.location.href = mode === 'employer' ? `/solutions?q=${q}` : `/jobs?q=${q}`;
                    }
                    setSearchOpen(false);
                  }
                }}
              />
              <button onClick={() => setSearchOpen(false)} className="btn-outline py-2 px-4"><X className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
