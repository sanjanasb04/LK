import React, { useEffect } from 'react';

// Home Sections
import HeroSection from '../components/home/HeroSection';
import FeaturePills from '../components/home/FeaturePills';
import AccreditationLogos from '../components/home/AccreditationLogos';
import CoursesSection from '../components/home/CoursesSection';
import StatsBar from '../components/home/StatsBar';
import TrainingModes from '../components/home/TrainingModes';
import WhyLearnersKart from '../components/home/WhyLearnersKart';
import PartnersMarquee from '../components/home/PartnersMarquee';
import Testimonials from '../components/home/Testimonials';
import BenefitsSection from '../components/home/BenefitsSection';
import BlogSection from '../components/home/BlogSection';
import CertificationStrip from '../components/home/CertificationStrip';

const HomePage = () => {
  // Smooth scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col">
      {/* 1. Hero Banner Area */}
      <HeroSection />

      {/* 2. Feature Pills Grid */}
      <FeaturePills />

      {/* 3. Accreditation Logos Marquee */}
      <AccreditationLogos />

      {/* 4. Top/Featured Courses Grid */}
      <CoursesSection />

      {/* 5. Animated Intersection Stats Bar */}
      <StatsBar />

      {/* 6. Tailored Training Solutions Tabs */}
      <TrainingModes />

      {/* 7. Why LearnersKart Grid */}
      <WhyLearnersKart />

      {/* 8. Dual Direction Alumni Partners Marquee */}
      <PartnersMarquee />

      {/* 9. Auto-sliding Testimonials Carousel */}
      <Testimonials />

      {/* 10. Individual & Corporate Benefits Card Grid */}
      <BenefitsSection />

      {/* 11. Latest Blog Publications Grid */}
      <BlogSection />

      {/* 12. Accordion-tabbed mini Certification Horizontal Strip */}
      <CertificationStrip />
    </div>
  );
};

export default HomePage;
