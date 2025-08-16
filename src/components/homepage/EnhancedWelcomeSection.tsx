import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection } from './AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Heart, BookOpen, Calendar } from 'lucide-react';
import cardGrowth from '@/assets/card-growth.jpg';
import cardPurpose from '@/assets/card-purpose.jpg';
import cardRelationships from '@/assets/card-relationships.jpg';

interface EnhancedWelcomeSectionProps {
  isFirstTime?: boolean;
}

export const EnhancedWelcomeSection: React.FC<EnhancedWelcomeSectionProps> = ({
  isFirstTime = null
}) => {
  const getWelcomeCards = () => {
    if (isFirstTime === true) {
      return [
        {
          title: "Primeira Visita",
          description: "Preparamos um guia especial para você se sentir em casa desde o primeiro dia",
          icon: Heart,
          image: cardPurpose,
          cta: "Ver Guia de Primeira Visita",
          link: "/primeira-vez",
          priority: true
        },
        {
          title: "Nossa História",
          description: "Conheça nossa jornada e os valores que nos movem como comunidade",
          icon: BookOpen,
          image: cardGrowth,
          cta: "Conhecer História",
          link: "/sobre"
        },
        {
          title: "Encontrar uma Célula",
          description: "Descubra uma célula próxima a você para iniciar relacionamentos genuínos",
          icon: Users,
          image: cardRelationships,
          cta: "Ver Células",
          link: "/celulas"
        }
      ];
    } else if (isFirstTime === false) {
      return [
        {
          title: "Próximos Eventos",
          description: "Não perca os próximos encontros especiais da nossa comunidade",
          icon: Calendar,
          image: cardPurpose,
          cta: "Ver Eventos",
          link: "/eventos",
          priority: true
        },
        {
          title: "Crescimento Espiritual",
          description: "Continue crescendo com nossos cursos e materiais de discipulado",
          icon: BookOpen,
          image: cardGrowth,
          cta: "Ver Cursos",
          link: "/ensino"
        },
        {
          title: "Sua Célula",
          description: "Acompanhe as atividades e eventos da sua célula",
          icon: Users,
          image: cardRelationships,
          cta: "Minha Célula",
          link: "/celulas"
        }
      ];
    }

    // Default cards for unknown preference
    return [
      {
        title: "Relacionamentos",
        description: "Construa amizades verdadeiras em nossa comunidade de células",
        icon: Users,
        image: cardRelationships,
        cta: "Encontrar Célula",
        link: "/celulas"
      },
      {
        title: "Crescimento",
        description: "Desenvolva seu potencial através de cursos e mentorias",
        icon: BookOpen,
        image: cardGrowth,
        cta: "Ver Cursos",
        link: "/ensino"
      },
      {
        title: "Propósito",
        description: "Descubra seu chamado e faça a diferença no mundo",
        icon: Heart,
        image: cardPurpose,
        cta: "Conhecer Mais",
        link: "/sobre"
      }
    ];
  };

  const cards = getWelcomeCards();

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {isFirstTime === true 
              ? "Bem-vindo(a) à Nossa Família" 
              : isFirstTime === false 
                ? "Continue Sua Jornada" 
                : "Encontre o Seu Lugar"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isFirstTime === true
              ? "Queremos que você se sinta em casa desde o primeiro momento. Explore os recursos preparados especialmente para você."
              : isFirstTime === false
                ? "Que alegria ter você de volta! Veja as novidades e oportunidades para continuar crescendo conosco."
                : "Cada pessoa tem um lugar especial em nossa comunidade. Descubra onde você se encaixa melhor."}
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const CardIcon = card.icon;
            return (
              <AnimatedSection
                key={card.title}
                delay={index * 0.2}
                animation="fadeUp"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Card className={`group h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    card.priority ? 'ring-2 ring-primary/20' : ''
                  }`}>
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <CardIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {card.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {card.description}
                      </p>
                      <Button
                        variant={card.priority ? "default" : "outline"}
                        className="w-full group-hover:scale-105 transition-transform duration-200"
                        onClick={() => window.location.href = card.link}
                      >
                        {card.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};