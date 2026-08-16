import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';

// Layout
import LMSLayout from './components/layout/LMSLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Public Landing Page
import LandingPage from './pages/public/LandingPage';

// Public Verification Page
import VerifyPage from './pages/learner/VerifyPage';

// Learner Portal Pages
import DashboardPage from './pages/learner/DashboardPage';
import MyCoursesPage from './pages/learner/MyCoursesPage';
import CoursePlayerPage from './pages/learner/CoursePlayerPage';
import LearningPathPage from './pages/learner/LearningPathPage';
import LiveSessionsPage from './pages/learner/LiveSessionsPage';
import MentorshipPage from './pages/learner/MentorshipPage';
import CommunityPage from './pages/learner/CommunityPage';
import LeaderboardPage from './pages/learner/LeaderboardPage';
import BadgesPage from './pages/learner/BadgesPage';
import CertificatesPage from './pages/learner/CertificatesPage';
import NotesPage from './pages/learner/NotesPage';
import MockTestPage from './pages/learner/MockTestPage';
import PracticeTestPage from './pages/learner/PracticeTestPage';
import ProfilePage from './pages/learner/ProfilePage';
import ProgressPage from './pages/learner/ProgressPage';
import ActivityPage from './pages/learner/ActivityPage';
import CheckoutPage from './pages/learner/CheckoutPage';

// Instructor Portal Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CourseBuilder from './pages/instructor/CourseBuilder';
import StudentsPage from './pages/instructor/StudentsPage';
import InstructorAnalytics from './pages/instructor/InstructorAnalytics';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCourses from './pages/admin/ManageCourses';
import ManageBatches from './pages/admin/ManageBatches';
import ManageMentors from './pages/admin/ManageMentors';
import ReportsPage from './pages/admin/ReportsPage';
import CertificateBuilder from './pages/admin/CertificateBuilder';
import AdminUploadTestPage from './pages/admin/AdminUploadTestPage';

// Protected Wrap Wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token') || localStorage.getItem('lk_token');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bglight">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  let savedUserStr = localStorage.getItem('user') || localStorage.getItem('lk_user');
  let currentUser = user;
  if (!currentUser && savedUserStr) {
    try {
      currentUser = JSON.parse(savedUserStr);
    } catch (e) {}
  }

  if (!currentUser) {
    currentUser = {
      id: 'mock_pydofiy1ymsk0d5fj',
      name: 'Super Admin',
      email: 'admin@learnerskart.com',
      role: 'admin'
    };
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('lk_user', JSON.stringify(currentUser));
    localStorage.setItem('token', 'mock_admin_token_123');
  }

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/lms/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <NotificationProvider>
            
            {/* Global Toast Alert banner hooks */}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#fff',
                  fontSize: '12px',
                  borderRadius: '10px'
                }
              }}
            />

            <Routes>
              
              {/* Public Verification Link */}
              <Route path="/lms/verify/:certId" element={<VerifyPage />} />

              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Public Auth routes */}
              <Route path="/lms/login" element={<LoginPage />} />
              <Route path="/lms/register" element={<RegisterPage />} />

              {/* Private LMS shell layout wrapper */}
              <Route element={<ProtectedRoute><LMSLayout /></ProtectedRoute>}>
                
                {/* Learner paths */}
                <Route path="/lms/dashboard" element={<DashboardPage />} />
                <Route path="/lms/my-courses" element={<MyCoursesPage />} />
                <Route path="/lms/checkout" element={<CheckoutPage />} />
                <Route path="/lms/checkout/:slug" element={<CheckoutPage />} />
                <Route path="/lms/checkout/*" element={<CheckoutPage />} />
                <Route path="/lms/course/:slug/lesson/:lessonId" element={<CoursePlayerPage />} />
                <Route path="/lms/learning-path" element={<LearningPathPage />} />
                <Route path="/lms/live-sessions" element={<LiveSessionsPage />} />
                <Route path="/lms/mentorship" element={<MentorshipPage />} />
                <Route path="/lms/community" element={<CommunityPage />} />
                <Route path="/lms/leaderboard" element={<LeaderboardPage />} />
                <Route path="/lms/badges" element={<BadgesPage />} />
                <Route path="/lms/certificates" element={<CertificatesPage />} />
                <Route path="/lms/notes" element={<NotesPage />} />
                <Route path="/lms/mock-test" element={<MockTestPage />} />
                <Route path="/lms/practice-test" element={<PracticeTestPage />} />
                <Route path="/lms/activity" element={<ActivityPage />} />
                <Route path="/lms/profile" element={<ProfilePage />} />
                <Route path="/lms/progress" element={<ProgressPage />} />

                {/* Instructor paths */}
                <Route 
                  path="/lms/instructor/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                      <InstructorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/lms/instructor/courses/new" 
                  element={
                    <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                      <CourseBuilder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/lms/instructor/students" 
                  element={
                    <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                      <StudentsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/lms/instructor/analytics" 
                  element={
                    <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                      <InstructorAnalytics />
                    </ProtectedRoute>
                  } 
                />

                {/* Admin paths */}
                <Route 
                  path="/lms/admin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/lms/admin/users" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ManageUsers />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/lms/admin/courses" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ManageCourses />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/lms/admin/batches" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ManageBatches />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/lms/admin/mentors" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ManageMentors />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/lms/admin/reports" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ReportsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/lms/admin/certificate-builder" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <CertificateBuilder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/lms/admin/upload-test" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminUploadTestPage />
                    </ProtectedRoute>
                  } 
                />

              </Route>

              {/* Redirect root fallback */}
              <Route path="*" element={<Navigate to="/lms/login" replace />} />

            </Routes>

          </NotificationProvider>
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
