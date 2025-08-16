import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, Heart, MapPin } from 'lucide-react';
import { useDeviceOptimization } from '@/hooks/useDeviceOptimization';
import heroImage from '@/assets/hero-immersive.jpg';

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  primaryCta: { label: string; link: string };
  secondaryCta: { label: string; link: string };
}

interface NarrativeHeroSectionProps {
  isFirstTime?: boolean;
}

export const NarrativeHeroSection: React.FC<NarrativeHeroSectionProps> = ({ 
  isFirstTime = null 
}) => {
  const { shouldReduceAnimations, shouldDisableParallax } = useDeviceOptimization();
  const [heroData, setHeroData] = useState<HeroData>({
    title: "Encontre o seu Lugar",
    subtitle: "Igreja em Células",
    description: "Uma comunidade onde cada pessoa é valorizada e encontra sua família em Cristo",
    primaryCta: { label: "Planeje Sua Visita", link: "/primeira-vez" },
    secondaryCta: { label: "Encontrar uma Célula", link: "/celulas" },
  });

  // Personalize content based on user preference
  useEffect(() => {
    if (isFirstTime === true) {
      setHeroData({
        title: "Seja Bem-vindo(a) à Nossa Família",
        subtitle: "Igreja em Células",
        description: "Estamos ansiosos para conhecê-lo(a). Aqui você encontrará um lugar de acolhimento, crescimento e relacionamentos genuínos",
        primaryCta: { label: "Planeje Sua Primeira Visita", link: "/primeira-vez" },
        secondaryCta: { label: "Conhecer Nossa História", link: "/sobre" },
      });
    } else if (isFirstTime === false) {
      setHeroData({
        title: "Que Bom Te Ver Novamente",
        subtitle: "Igreja em Células",
        description: "Continue crescendo conosco. Descubra as novidades e oportunidades para fortalecer sua jornada de fé",
        primaryCta: { label: "Ver Eventos", link: "/eventos" },
        secondaryCta: { label: "Minha Célula", link: "/celulas" },
      });
    }
  }, [isFirstTime]);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Optimized Animations */}
      <motion.div
        initial={shouldReduceAnimations ? {} : { scale: 1.1 }}
        animate={shouldReduceAnimations ? {} : { scale: 1 }}
        transition={shouldReduceAnimations ? {} : { duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={shouldReduceAnimations ? { opacity: 0 } : { opacity: 0, y: 30 }}
          animate={shouldReduceAnimations ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={shouldReduceAnimations ? { duration: 0.3 } : { duration: 1, delay: 0.5 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg md:text-xl font-medium tracking-wider uppercase opacity-90"
          >
            {heroData.subtitle}
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
          >
            {heroData.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 leading-relaxed"
          >
            {heroData.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = heroData.primaryCta.link}
            >
              <Heart className="w-5 h-5 mr-2" />
              {heroData.primaryCta.label}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-white/80 bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = heroData.secondaryCta.link}
            >
              <MapPin className="w-5 h-5 mr-2" />
              {heroData.secondaryCta.label}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 hover:text-white transition-colors"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.button>
    </section>
  );
};