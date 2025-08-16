import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const CommunitySection: React.FC = () => {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            A igreja não é um evento, é uma família.
          </h2>
          <p className="text-xl opacity-95 max-w-3xl mx-auto text-white">
            Descubra maneiras de se conectar, crescer e servir em nossa comunidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card Células */}
          <Card className="border-none shadow-2xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-white/20 rounded-full w-16 h-16 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Células</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/90 mb-6 leading-relaxed">
                Grupos pequenos onde relacionamentos profundos são formados e vidas são transformadas através do amor de Cristo.
              </p>
              <Button size="lg" variant="secondary" className="w-full" asChild>
                <Link to="/celulas">Encontrar uma Célula</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card Cursos */}
          <Card className="border-none shadow-2xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-white/20 rounded-full w-16 h-16 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Cursos</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/90 mb-6 leading-relaxed">
                Cresça na fé através de nossos cursos bíblicos e de desenvolvimento espiritual, ministrados por professores qualificados.
              </p>
              <Button size="lg" variant="secondary" className="w-full" asChild>
                <Link to="/ensino">Ver Cursos</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card Ministérios */}
          <Card className="border-none shadow-2xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-white/20 rounded-full w-16 h-16 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Ministérios</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/90 mb-6 leading-relaxed">
                Descubra seus dons e talentos servindo ao Reino de Deus através dos diversos ministérios da nossa igreja.
              </p>
              <Button size="lg" variant="secondary" className="w-full" asChild>
                <Link to="/ministerios">Conhecer Ministérios</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};