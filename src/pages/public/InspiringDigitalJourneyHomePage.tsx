import React, { useEffect } from "react";
import { motion } from "framer-motion";
import PublicSiteLayout from "@/components/layout/PublicSiteLayout";

// New inspiring components
import { NarrativeHeroSection } from "@/components/homepage/NarrativeHeroSection";
import { EnhancedWelcomeSection } from "@/components/homepage/EnhancedWelcomeSection";
import { FluidSermonsSection } from "@/components/homepage/FluidSermonsSection";
import { DynamicEventsSection } from "@/components/homepage/DynamicEventsSection";
import { DynamicCoursesSection } from "@/components/homepage/DynamicCoursesSection";
import { CommunitySection } from "@/components/homepage/CommunitySection";
import { PersonalizedWelcomeModal } from "@/components/homepage/PersonalizedWelcomeModal";

// Custom hooks
import { usePersonalizedWelcome } from "@/hooks/usePersonalizedWelcome";
import { useSmoothScrolling } from "@/hooks/useSmoothScrolling";

const InspiringDigitalJourneyHomePage: React.FC = () => {
  const {
    isFirstTime,
    showWelcomeModal,
    userPreference,
    handleWelcomeResponse,
    closeWelcomeModal,
  } = usePersonalizedWelcome();

  // Initialize smooth scrolling
  useSmoothScrolling();

  useEffect(() => {
    // Enhanced SEO Setup
    document.title = "Jornada Digital Inspiradora | Kerigma Hub - Igreja em Células";
    
    const metaDesc = document.querySelector('meta[name="description"]');
    const description = 'Viva uma experiência digital única e inspiradora. Descubra sua família em Cristo em nossa igreja em células, onde cada pessoa é valorizada e acolhida com amor.';
    
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin;

    // Enhanced Keywords
    let keywords = document.querySelector('meta[name="keywords"]');
    if (!keywords) {
      keywords = document.createElement('meta');
      keywords.setAttribute('name', 'keywords');
      document.head.appendChild(keywords);
    }
    keywords.setAttribute('content', 'igreja digital, células, comunidade cristã, experiência imersiva, fé, Cristo, relacionamentos, crescimento espiritual, acolhimento personalizado');

    // Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'Jornada Digital Inspiradora | Kerigma Hub');
    if (!document.querySelector('meta[property="og:title"]')) document.head.appendChild(ogTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    ogDesc.setAttribute('content', description);
    if (!document.querySelector('meta[property="og:description"]')) document.head.appendChild(ogDesc);
  }, []);

  return (
    <PublicSiteLayout>
        {/* Personalized Welcome Modal */}
        <PersonalizedWelcomeModal
          isOpen={showWelcomeModal}
          onResponse={handleWelcomeResponse}
          onClose={closeWelcomeModal}
        />

        {/* Page Transition Wrapper */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Narrative Hero Section - Immersive with Personalization */}
          <NarrativeHeroSection isFirstTime={isFirstTime} />

          {/* Enhanced Welcome Section - Personalized Content */}
          <EnhancedWelcomeSection isFirstTime={isFirstTime} />

          {/* Fluid Sermons Section - Carousel with Animations */}
          <FluidSermonsSection />

          {/* Dynamic Events Section - Enhanced with Animations */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <DynamicEventsSection />
          </motion.div>

          {/* Dynamic Courses Section - Enhanced with Animations */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <DynamicCoursesSection />
          </motion.div>

          {/* Community Connect Section - Enhanced with Animations */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <CommunitySection />
          </motion.div>
        </motion.div>
      </PublicSiteLayout>
  );
};

export default InspiringDigitalJourneyHomePage;