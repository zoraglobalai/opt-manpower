import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';
import { Job } from '../types/job';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSavedJobs = async () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem('saved_jobs');
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        if (ids.length > 0) {
          // Fetch each job by ID
          const promises = ids.map(id => jobsAPI.detail(id).catch(() => null));
          const results = await Promise.all(promises);
          // Filter out nulls (e.g. if a job was deleted)
          const validJobs = results.filter(res => res && res.data).map(res => res!.data);
          setSavedJobs(validJobs);
        } else {
          setSavedJobs([]);
        }
      } else {
        setSavedJobs([]);
      }
    } catch (e) {
      console.error('Failed to fetch saved jobs', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
    
    // Listen for custom event if saved jobs change in another component
    const handleStorageChange = () => fetchSavedJobs();
    window.addEventListener('saved_jobs_changed', handleStorageChange);
    return () => window.removeEventListener('saved_jobs_changed', handleStorageChange);
  }, []);

  return (
    <main className="min-h-screen pt-24">
      <div className="bg-white border-b border-gray-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="section-tag mb-2">Your Shortlist</p>
          <h1 className="font-display font-black text-3xl text-black">Saved <span className="text-black">Jobs</span></h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-gray-light font-body">Loading your saved jobs...</div>
        ) : savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedJobs.map((item, i) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <JobCard job={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Briefcase className="w-12 h-12 text-gray-light mx-auto mb-4" />
            <p className="text-gray-light font-body mb-4">You haven't saved any jobs yet.</p>
            <Link to="/jobs" className="btn-primary">Explore Opportunities</Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default SavedJobs;


