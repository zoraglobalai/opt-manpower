import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Linkedin, Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-600 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-white flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-black" />
              </div>
              <div>
                <span className="font-display font-black text-lg text-white tracking-tight">OPTIMUS</span>
                <span className="font-display font-light text-lg text-gray-300 tracking-tight ml-1">MANPOWER</span>
              </div>
            </Link>
            <p className="text-sm font-body text-gray-300 leading-relaxed max-w-xs mb-6">
              Connecting talented professionals with leading organizations across India and internationally.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300 text-xs font-body">
                <MapPin className="w-3.5 h-3.5 text-white" /> Chennai, Tamil Nadu, India
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-xs font-body">
                <Phone className="w-3.5 h-3.5 text-white" /> +91 44 0000 0000
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-xs font-body">
                <Mail className="w-3.5 h-3.5 text-white" /> connect@optimusmanpower.com
              </div>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-5 tracking-wide">About</h4>
            <ul className="space-y-3">
              {['About Us', 'Our Values', 'Case Studies', 'Testimonials'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-300 text-xs font-body silver-glow hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-5 tracking-wide">Job Categories</h4>
            <ul className="space-y-3">
              {['IT & Technology', 'Healthcare', 'Finance', 'Engineering', 'International'].map((item) => (
                <li key={item}>
                  <Link to={`/jobs?category=${item}`} className="text-gray-300 text-xs font-body silver-glow hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers & Advice */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-5 tracking-wide">Employers</h4>
            <ul className="space-y-3 mb-6">
              {['Business Enquiry', 'Solutions', 'Post a Job', 'Our Clients'].map((item) => (
                <li key={item}>
                  <Link to="/employer-enquiry" className="text-gray-300 text-xs font-body silver-glow hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
            <h4 className="text-white font-heading font-semibold text-sm mb-3 tracking-wide">Career Advice</h4>
            <ul className="space-y-2">
              {['Resume Tips', 'Interview Tips', 'Career Growth'].map((item) => (
                <li key={item}>
                  <Link to="/career-advice" className="text-gray-300 text-xs font-body silver-glow hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs font-body">
            © {new Date().getFullYear()} Optimus Manpower. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { icon: Linkedin, href: 'https://linkedin.com' },
              { icon: Facebook, href: 'https://facebook.com' },
              { icon: Instagram, href: 'https://instagram.com' },
              { icon: Twitter, href: 'https://twitter.com' },
            ].map(({ icon: Icon, href }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-gray-600 flex items-center justify-center text-gray-300 hover:border-white hover:text-white silver-glow transition-all duration-200">
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


