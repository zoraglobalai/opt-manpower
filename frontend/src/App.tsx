import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ModeProvider, SiteMode, useMode } from './context/ModeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home = React.lazy(() => import('./pages/Home'));
const CandidateHome = React.lazy(() => import('./pages/CandidateHome'));
const EmployerHome = React.lazy(() => import('./pages/EmployerHome'));
const Jobs = React.lazy(() => import('./pages/Jobs'));
const JobDetails = React.lazy(() => import('./pages/JobDetails'));
const SavedJobs = React.lazy(() => import('./pages/SavedJobs'));
const CareerAdvice = React.lazy(() => import('./pages/CareerAdvice'));
const RecruiterHome = React.lazy(() => import('./pages/RecruiterHome'));
const ContactUs = React.lazy(() => import('./pages/ContactUs'));
const About = React.lazy(() => import('./pages/About'));
const Solutions = React.lazy(() => import('./pages/Solutions'));
const BusinessEnquiry = React.lazy(() => import('./pages/BusinessEnquiry'));
const AdminPanel = React.lazy(() => import('./admin/AdminPanel'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
  </div>
);

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

/** Sets site mode on mount then renders children — used for /candidate and /employer routes */
const ModeRoute = ({ role, children }: { role: SiteMode; children: React.ReactNode }) => {
  const { setMode } = useMode();
  useEffect(() => { setMode(role); }, [role]);
  return <>{children}</>;
};

/** Scrolls to top on route change */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ModeProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Admin — standalone */}
                  <Route path="/admin/*" element={<AdminPanel />} />

                  {/* Dashboards — Redirecting removed dashboards to home */}
                  <Route path="/dashboard" element={<Navigate to="/" replace />} />
                  <Route path="/recruiter/dashboard" element={<Navigate to="/" replace />} />

                  {/* Role-based home routes — set mode + render matching home */}
                  <Route path="/candidate" element={
                    <ModeRoute role="candidate">
                      <MainLayout><CandidateHome /></MainLayout>
                    </ModeRoute>
                  } />
                  <Route path="/employer" element={
                    <ModeRoute role="employer">
                      <MainLayout><EmployerHome /></MainLayout>
                    </ModeRoute>
                  } />

                  {/* Public — with Navbar/Footer */}
                  <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                  <Route path="/jobs" element={<MainLayout><Jobs /></MainLayout>} />
                  <Route path="/jobs/:id" element={<MainLayout><JobDetails /></MainLayout>} />
                  <Route path="/saved-jobs" element={<MainLayout><SavedJobs /></MainLayout>} />
                  <Route path="/career-advice" element={<MainLayout><CareerAdvice /></MainLayout>} />
                  <Route path="/recruiter" element={<MainLayout><RecruiterHome /></MainLayout>} />
                  <Route path="/solutions" element={<MainLayout><Solutions /></MainLayout>} />
                  <Route path="/business-enquiry" element={<MainLayout><BusinessEnquiry /></MainLayout>} />
                  <Route path="/employer-enquiry" element={<MainLayout><BusinessEnquiry /></MainLayout>} />
                  <Route path="/contact" element={<MainLayout><ContactUs /></MainLayout>} />
                  <Route path="/about" element={<MainLayout><About /></MainLayout>} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ModeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;


