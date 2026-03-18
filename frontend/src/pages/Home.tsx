import React from 'react';
import { useEffectiveMode } from '../context/ModeContext';
import CandidateHome from './CandidateHome';
import EmployerHome from './EmployerHome';

const Home = () => {
  const mode = useEffectiveMode();
  return mode === 'employer' ? <EmployerHome /> : <CandidateHome />;
};

export default Home;

