import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import api, { getAccessToken } from './utils/api';

// Layout & Common Components
import Layout from './components/layout/Layout';

// Public Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CartPage from './pages/CartPage';
import FAQsPage from './pages/FAQsPage';
import DiscountsPage from './pages/DiscountsPage';

// Policy Pages
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import MoneyBackPage from './pages/MoneyBackPage';
import NotFoundPage from './pages/NotFoundPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Protected Pages
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import MyCoursesPage from './pages/MyCoursesPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AdminTestimonialsPage from './pages/AdminTestimonialsPage';
import ScrollToTop from './components/common/ScrollToTop';
import FreeResourcesPage from './pages/free-resources/FreeResourcesPage';
import AdminPmpQuestionsPage from './pages/AdminPmpQuestionsPage';
import AdminUploadTestPage from './pages/free-resources/AdminUploadTestPage';
import AdminCurrenciesPage from './pages/AdminCurrenciesPage';
import AdminSchedulesPage from './pages/AdminSchedulesPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import AdminBlogsPage from './pages/AdminBlogsPage';

// Protected Route wrapper component
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightbg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const DynamicSlugHandler = () => {
  let { slug } = useParams();
  const [resolvedType, setResolvedType] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const resolveType = async () => {
      setLoading(true);
      if (!slug) {
        setResolvedType('not-found');
        setLoading(false);
        return;
      }

      let cleanSlug = decodeURIComponent(slug).trim().toLowerCase().replace(/\s+/g, '-');
      if (cleanSlug.includes('andbusiness')) {
        cleanSlug = cleanSlug.replace('andbusiness', 'and-business');
      }
      if (cleanSlug.includes('claritycommitment')) {
        cleanSlug = cleanSlug.replace('claritycommitment', 'clarity-commitment');
      }

      try {
        const courseRes = await api.get(`/courses/${cleanSlug}`);
        if (courseRes.data.success && courseRes.data.course) {
          setResolvedType('course');
          setLoading(false);
          return;
        }
      } catch (err) {
        // Backend down — try static fallback
      }

      // Static fallback: check local courses data
      try {
        const { initialCourses } = await import('./data/courses.js');
        const found = initialCourses.find(c => c.slug === cleanSlug || c._id === cleanSlug);
        if (found) {
          setResolvedType('course');
          setLoading(false);
          return;
        }
      } catch (err) {
        // ignore
      }

      try {
        const blogRes = await api.get(`/blogs/${cleanSlug}`);
        if (blogRes.data.success && blogRes.data.blog) {
          setResolvedType('blog');
          setLoading(false);
          return;
        }
      } catch (err) {
        // Blog not found or request failed
      }

      setResolvedType('not-found');
      setLoading(false);
    };

    resolveType();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (resolvedType === 'course') {
    return <CourseDetailPage />;
  }
  if (resolvedType === 'blog') {
    return <BlogDetailPage />;
  }
  return <NotFoundPage />;
};

const CoursesPageWrapper = () => {
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (loading || !user) return;
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const token = getAccessToken();
    const tokenQuery = token ? `?token=${token}` : '';
    window.location.href = `${protocol}//${hostname}:5174/lms/my-courses${tokenQuery}`;
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <CoursesPage />;
};

const FreeResourcesRedirect = () => {
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (loading || !user) return;
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const pathname = window.location.pathname.toLowerCase();
    
    let lmsPath = '/';
    if (pathname.includes('mock-test') || pathname.includes('mocktest')) {
      lmsPath = '/lms/mock-test';
    } else if (pathname.includes('practice-test') || pathname.includes('practicetest')) {
      lmsPath = '/lms/practice-test';
    } else if (pathname.includes('eligibility')) {
      lmsPath = '/lms/dashboard';
    } else if (pathname.includes('application-guidance') || pathname.includes('renewal-guidance') || pathname.includes('success-guide') || pathname.includes('resume-assistance')) {
      lmsPath = '/lms/dashboard';
    }
    
    const token = getAccessToken();
    const tokenQuery = token ? `?token=${token}` : '';
    window.location.href = `${protocol}//${hostname}:5174${lmsPath}${tokenQuery}`;
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <FreeResourcesPage />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public routes wrapped in Main Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPageWrapper />} />
              <Route path="/courses/:slug" element={<CourseDetailPage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/faqs" element={<FAQsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/term-conditions" element={<TermsPage />} />
              <Route path="/cancellation-refund" element={<RefundPolicyPage />} />
              <Route path="/money-back-policy" element={<MoneyBackPage />} />
              <Route path="/discounts/:type" element={<DiscountsPage />} />
              
              {/* Live Website Exact Match Discount Routes */}
              <Route path="/alumni-offers" element={<DiscountsPage />} />
              <Route path="/students-discount" element={<DiscountsPage />} />
              <Route path="/unemployed-discount" element={<DiscountsPage />} />
              <Route path="/veterans-military-discount" element={<DiscountsPage />} />

              <Route path="/free-resources" element={<FreeResourcesRedirect />} />
              <Route path="/free-resources/:tab" element={<FreeResourcesRedirect />} />
              <Route path="/free resources" element={<FreeResourcesRedirect />} />
              <Route path="/free resources/:tab" element={<FreeResourcesRedirect />} />
              <Route path="/free%20resources" element={<FreeResourcesRedirect />} />
              <Route path="/free%20resources/:tab" element={<FreeResourcesRedirect />} />

              {/* Dynamic slug route handler (matches courses and blogs directly under root) */}
              <Route path="/:slug" element={<DynamicSlugHandler />} />
            </Route>

            {/* Auth routes without main layout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ForgotPasswordPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/courses" element={<MyCoursesPage />} />
                <Route path="/dashboard/profile" element={<ProfilePage />} />
                <Route path="/dashboard/orders" element={<OrdersPage />} />
                <Route path="/dashboard/testimonials" element={<AdminTestimonialsPage />} />
                <Route path="/dashboard/pmp-questions" element={<AdminPmpQuestionsPage />} />
                <Route path="/dashboard/admin/upload-test" element={<AdminUploadTestPage />} />
                <Route path="/dashboard/admin/currencies" element={<AdminCurrenciesPage />} />
                <Route path="/dashboard/admin/schedules" element={<AdminSchedulesPage />} />
                <Route path="/dashboard/admin/courses" element={<AdminCoursesPage />} />
                <Route path="/dashboard/admin/blogs" element={<AdminBlogsPage />} />
              </Route>
            </Route>

            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
