import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, Briefcase, User, ShieldCheck, BookOpen, Star, Users, Home } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import LogoImage from '../asserts/opt-man-logo.webp';

const Navbar = () => {
  const { mode, setMode } = useMode();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY > 20) setMenuOpen(false);
    };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setAboutOpen(false); }, [location]);

  const handleMobileNavClick = () => {
    setMenuOpen(false);
    setAboutOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  const navLinkClass = (path: string) =>
    `relative text-sm font-body text-white hover:text-gray-300 silver-glow transition-colors
     after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-white
     after:origin-left after:transition-transform after:duration-200
     ${isActive(path) ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}`;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md shadow-[0_2px_20px_rgba(192,192,192,0.2)]' : 'bg-black'}`}>

        {/* ── Main Nav ── */}
        <nav className="max-w-7xl mx-auto px-4 py-2 md:py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={LogoImage}
              alt="Optimus Manpower Logo"
              className="h-8 md:h-10 w-auto object-contain hover:opacity-80 transition-opacity duration-200"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {/* Guest — candidate mode */}
            {mode === 'candidate' && (
              <>
                <Link to="/" className={navLinkClass('/')}>Home</Link>
                <Link to="/jobs" className={navLinkClass('/jobs')} onClick={() => window.scrollTo(0, 0)}>Search Jobs</Link>
                <Link to="/saved-jobs" className={navLinkClass('/saved-jobs')}>Saved Jobs</Link>
                <Link to="/career-advice" className={navLinkClass('/career-advice')}>Career Advice</Link>
                <Link to="/about" className={navLinkClass('/about')}>About Us</Link>
              </>
            )}

            {/* Guest — employer mode */}
            {mode === 'employer' && (
              <>
                <Link to="/" className={navLinkClass('/')}>Home</Link>
                <Link to="/solutions" className={navLinkClass('/solutions')}>Solutions</Link>
                <Link to="/business-enquiry" className={navLinkClass('/business-enquiry')}>Hire Talent</Link>
                <div className="relative" onMouseEnter={() => setAboutOpen(true)} onMouseLeave={() => setAboutOpen(false)}>
                  <button className="flex items-center gap-1 text-sm font-body text-white hover:text-gray-300 silver-glow transition-colors">
                    About Us <ChevronDown className="w-3 h-3" />
                  </button>
                  {/* Tailwind conditional render for About dropdown */}
                  <div
                    className={`absolute top-full left-0 pt-2 transition-all duration-200 ${
                      aboutOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible pointer-events-none'
                    }`}
                  >
                    <div className="w-44 bg-black border border-gray-600 shadow-lg flex flex-col">
                      <Link to="/about" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900 transition-colors">About Us</Link>
                      <Link to="/solutions" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900 transition-colors">Our Solutions</Link>
                      <Link to="/career-advice" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900 transition-colors">Career Advice</Link>
                    </div>
                  </div>
                </div>
                <Link to="/contact" className={navLinkClass('/contact')}>Contact Us</Link>
              </>
            )}
          </div>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={mode === 'employer' ? 'Search solutions...' : 'Search jobs...'}
                className="w-56 lg:w-64 pl-9 pr-3 py-2 bg-white text-black placeholder-gray-400 text-sm font-body rounded border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = (e.target as HTMLInputElement).value;
                    if (q.trim()) {
                      window.location.href = mode === 'employer' ? `/solutions?q=${q}` : `/jobs?q=${q}`;
                    } else {
                      window.location.href = mode === 'employer' ? '/solutions' : '/jobs';
                    }
                  }
                }}
              />
            </div>
            <div className="flex items-center bg-black/30 border border-gray-600 p-0.5" role="group" aria-label="Switch site mode">
              <button
                onClick={() => { setMode('candidate'); navigate('/'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-semibold transition-all duration-200 ${mode === 'candidate' ? 'bg-white text-black' : 'text-gray-300 hover:text-white'}`}
              >
                <User className="w-3 h-3" /> Job Seekers
              </button>
              <button
                onClick={() => { setMode('employer'); navigate('/'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-semibold transition-all duration-200 ${mode === 'employer' ? 'bg-white text-black' : 'text-gray-300 hover:text-white'}`}
              >
                <Briefcase className="w-3 h-3" /> Employers
              </button>
            </div>
          </div>

          {/* Mobile: compact mode toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
              <div className="flex items-center bg-white/10 border border-gray-600 rounded overflow-hidden">
                <button
                  onClick={() => { setMode('candidate'); navigate('/'); handleMobileNavClick(); }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold transition-all ${mode === 'candidate' ? 'bg-white text-black' : 'text-gray-300'
                    }`}
                >
                  <User className="w-3 h-3" /> Candidate
                </button>
                <button
                  onClick={() => { setMode('employer'); navigate('/'); handleMobileNavClick(); }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold transition-all ${mode === 'employer' ? 'bg-white text-black' : 'text-gray-300'
                    }`}
                >
                  <Briefcase className="w-3 h-3" /> Employer
                </button>
              </div>
            <button
              className="text-white p-1"
              onClick={() => { setMenuOpen(!menuOpen); }}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Backdrop — closes menu on outside tap */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-40 md:hidden bg-transparent"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* ── Mobile Menu ── */}
        <div
          id="mobile-nav"
          className={`md:hidden relative z-50 bg-black overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-[800px] opacity-100 border-t border-gray-700' : 'max-h-0 opacity-0 border-transparent'
          }`}
        >
          <div className="px-4 py-4 flex flex-col gap-2">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={mode === 'employer' ? 'Search solutions...' : 'Search jobs...'}
                className="w-full pl-9 pr-3 py-2 bg-white text-black placeholder-gray-400 text-sm font-body rounded border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = (e.target as HTMLInputElement).value;
                    if (q.trim()) {
                      window.location.href = mode === 'employer' ? `/solutions?q=${q}` : `/jobs?q=${q}`;
                    } else {
                      window.location.href = mode === 'employer' ? '/solutions' : '/jobs';
                    }
                    handleMobileNavClick();
                  }
                }}
              />
            </div>
            {/* Nav links */}
            {mode === 'candidate' && (
              <>
                <Link to="/" className="flex items-center gap-2 py-2 px-3 text-sm text-gray-200 hover:text-white hover:bg-white/5 rounded transition-colors" onClick={handleMobileNavClick}>
                  <Home className="w-3.5 h-3.5" /> Home
                </Link>
                <Link to="/jobs" className="flex items-center gap-2 py-2 px-3 text-sm text-gray-200 hover:text-white hover:bg-white/5 rounded transition-colors" onClick={handleMobileNavClick}>
                  <Search className="w-3.5 h-3.5" /> Search Jobs
                </Link>
                <Link to="/career-advice" className="flex items-center gap-2 py-2 px-3 text-sm text-gray-200 hover:text-white hover:bg-white/5 rounded transition-colors" onClick={handleMobileNavClick}>
                  <BookOpen className="w-3.5 h-3.5" /> Career Advice
                </Link>
                <Link to="/saved-jobs" className="flex items-center gap-2 py-2 px-3 text-sm text-gray-200 hover:text-white hover:bg-white/5 rounded transition-colors" onClick={handleMobileNavClick}>
                  <Star className="w-3.5 h-3.5" /> Saved Jobs
                </Link>
                <Link to="/about" className="flex items-center gap-2 py-2 px-3 text-sm text-gray-200 hover:text-white hover:bg-white/5 rounded transition-colors" onClick={handleMobileNavClick}>
                  <Users className="w-3.5 h-3.5" /> About Us
                </Link>
              </>
            )}
            {mode === 'employer' && (
              <>
                <Link to="/" className="flex items-center gap-2 py-2 px-3 text-sm text-gray-200 hover:text-white hover:bg-white/5 rounded transition-colors" onClick={handleMobileNavClick}>
                  <Home className="w-3.5 h-3.5" /> Home
                </Link>
                <Link to="/solutions" className="flex items-center gap-2 py-2 px-3 text-sm text-gray-200 hover:text-white hover:bg-white/5 rounded transition-colors" onClick={handleMobileNavClick}>
                  <Briefcase className="w-3.5 h-3.5" /> Solutions
                </Link>
                <Link to="/business-enquiry" className="flex items-center gap-2 py-2 px-3 text-sm text-gray-200 hover:text-white hover:bg-white/5 rounded transition-colors" onClick={handleMobileNavClick}>
                  <User className="w-3.5 h-3.5" /> Hire Talent
                </Link>
                <Link to="/about" className="flex items-center gap-2 py-2 px-3 text-sm text-gray-200 hover:text-white hover:bg-white/5 rounded transition-colors" onClick={handleMobileNavClick}>
                  <Users className="w-3.5 h-3.5" /> About Us
                </Link>
                <Link to="/contact" className="flex items-center gap-2 py-2 px-3 text-sm text-gray-200 hover:text-white hover:bg-white/5 rounded transition-colors" onClick={handleMobileNavClick}>
                  <ShieldCheck className="w-3.5 h-3.5" /> Contact Us
                </Link>
              </>
            )}


          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
