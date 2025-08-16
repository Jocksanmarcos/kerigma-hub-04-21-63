import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from './AnimatedSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';

interface Sermon {
  id: number;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
}

export const FluidSermonsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sermons] = useState<Sermon[]>([
    {
      id: 1,
      title: "O Amor que Transforma",
      speaker: "Pastor João Silva",
      date: "2025-01-12",
      duration: "45 min",
      description: "Uma mensagem poderosa sobre como o amor de Deus transforma vidas e relacionamentos",
      thumbnail: "/lovable-uploads/11700eec-d837-4103-93e0-ec07fdcc9d64.png",
      videoUrl: "#"
    },
    {
      id: 2,
      title: "Fé para os Momentos Difíceis",
      speaker: "Pastora Maria Santos",
      date: "2025-01-05",
      duration: "38 min",
      description: "Como manter a fé e encontrar esperança nos desafios da vida",
      thumbnail: "/lovable-uploads/334c0fdb-b249-4044-ac5c-1bbd104ea82b.png",
      videoUrl: "#"
    },
    {
      id: 3,
      title: "Propósito e Chamado",
      speaker: "Pastor Carlos Lima",
      date: "2024-12-29",
      duration: "42 min",
      description: "Descobrindo seu propósito em Deus e vivendo seu chamado com paixão",
      thumbnail: "/lovable-uploads/57bb8965-c932-40db-a64b-c15a6d72d4b0.png",
      videoUrl: "#"
    }
  ]);

  const nextSermon = () => {
    setCurrentIndex((prev) => (prev + 1) % sermons.length);
  };

  const prevSermon = () => {
    setCurrentIndex((prev) => (prev - 1 + sermons.length) % sermons.length);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextSermon, 8000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Mensagens que Inspiram
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Assista às mensagens mais recentes e seja edificado pela Palavra de Deus
          </p>
        </AnimatedSection>

        <div className="relative max-w-6xl mx-auto">
          {/* Main Sermon Display */}
          <AnimatedSection delay={0.2}>
            <div className="relative bg-card rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="grid lg:grid-cols-2 gap-0"
                >
                  {/* Sermon Image */}
                  <div className="relative h-64 lg:h-96">
                    <img
                      src={sermons[currentIndex].thumbnail}
                      alt={sermons[currentIndex].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                    
                    {/* Play Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute inset-0 flex items-center justify-center"
                      onClick={() => window.location.href = sermons[currentIndex].videoUrl}
                    >
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-colors">
                        <Play className="w-12 h-12 text-white ml-1" fill="currentColor" />
                      </div>
                    </motion.button>
                  </div>

                  {/* Sermon Info */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(sermons[currentIndex].date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {sermons[currentIndex].duration}
                        </div>
                      </div>

                      <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                        {sermons[currentIndex].title}
                      </h3>

                      <p className="text-primary font-medium">
                        {sermons[currentIndex].speaker}
                      </p>

                      <p className="text-muted-foreground leading-relaxed">
                        {sermons[currentIndex].description}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                          size="lg"
                          className="gap-2"
                          onClick={() => window.location.href = sermons[currentIndex].videoUrl}
                        >
                          <Play className="w-4 h-4" />
                          Assistir Agora
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => window.location.href = "/sermoes"}
                        >
                          Ver Todas as Mensagens
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4 lg:left-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevSermon}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="absolute top-1/2 -translate-y-1/2 right-4 lg:right-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextSermon}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </AnimatedSection>

          {/* Sermon Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {sermons.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};