import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { Job } from '../types/job';

interface JobCardProps {
  job: Job;
  onAuthRequired?: () => void;
}

const JobCard = ({ job, onAuthRequired }: JobCardProps) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('saved_jobs');
      if (stored) {
        const parsed = JSON.parse(stored);
        setIsSaved(parsed.includes(job.id));
      }
    } catch (e) {}
  }, [job.id]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem('saved_jobs');
      let savedList: string[] = stored ? JSON.parse(stored) : [];
      if (isSaved) {
        savedList = savedList.filter(id => id !== job.id);
        setIsSaved(false);
      } else {
        savedList.push(job.id);
        setIsSaved(true);
      }
      localStorage.setItem('saved_jobs', JSON.stringify(savedList));
      // Dispatch a custom event to keep SavedJobs page in sync if needed
      window.dispatchEvent(new Event('saved_jobs_changed'));
    } catch (e) {}
  };

  const handleCardClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="card p-6 flex flex-col h-full group cursor-pointer relative"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`status-badge text-xs ${job.is_international ? 'bg-black/10 text-black' : 'bg-gray-100 text-gray-medium'}`}>
              {job.is_international ? '🌐 International' : '🇮🇳 Domestic'}
            </span>
            <span className="status-badge bg-gray-100 text-gray-medium">{job.job_type}</span>
          </div>
          <h3 className="font-heading font-semibold text-black text-base leading-tight group-hover:text-black transition-colors">
            {job.title}
          </h3>
          <p className="text-gray-medium text-sm font-body mt-1">{job.company_name}</p>
        </div>
        <button 
          onClick={handleSave} 
          className={`ml-3 transition-colors mt-1 relative z-10 p-2 -mr-2 -mt-2 ${isSaved ? 'text-black' : 'text-gray-light hover:text-black'}`}
        >
          {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      {/* Meta */}
      <div className="space-y-2 mb-4 flex-1">
        <div className="flex items-center gap-2 text-gray-medium text-xs font-body">
          <MapPin className="w-3.5 h-3.5" />
          <span>{job.location}, {job.country}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-medium text-xs font-body">
          <Briefcase className="w-3.5 h-3.5" />
          <span>{job.experience} • {job.category}</span>
        </div>
        {job.deadline && (
          <div className="flex items-center gap-2 text-gray-light text-xs font-body">
            <Clock className="w-3.5 h-3.5" />
            <span>Apply by {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {job.description && (
        <p className="text-gray-light text-xs font-body leading-relaxed mb-5 line-clamp-2">
          {job.description}
        </p>
      )}

      {/* Salary + CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-light mt-auto">
        {job.salary ? (
          <span className="text-black font-heading font-semibold text-sm">{job.salary}</span>
        ) : (
          <span className="text-gray-light text-xs font-body">Salary Negotiable</span>
        )}
        <span className="btn-primary py-2 px-5 text-xs relative z-10">
          View Job
        </span>
      </div>
    </motion.div>
  );
};

export default JobCard;


