import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Star, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  nome: string;
  descricao?: string;
  categoria: string;
  nivel: string;
  carga_horaria?: number;
  destaque: boolean;
  slug?: string;
}

export const DynamicCoursesSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from our public API first
      try {
        const response = await supabase.functions.invoke('api-public-courses', {
          body: { limit: 6 }
        });
        
        if (response.data?.courses) {
          setCourses(response.data.courses);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using direct query');
      }

      // Fallback to direct query
      const { data, error } = await supabase
        .from('cursos')
        .select(`
          id,
          nome,
          descricao,
          categoria,
          nivel,
          carga_horaria,
          destaque,
          slug
        `)
        .eq('ativo', true)
        .order('destaque', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setCourses(data || []);
      
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case 'iniciante':
        return 'bg-success/10 text-success border-success/20';
      case 'intermediario':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'avancado':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCategoryIcon = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'discipulado':
        return '🙏';
      case 'lideranca':
        return '👑';
      case 'evangelismo':
        return '📢';
      case 'ministerio':
        return '⛪';
      default:
        return '📚';
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-128 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Cursos e Ensino
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cresça na fé através de nossos cursos bíblicos e de desenvolvimento espiritual
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchCourses} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">
              Nenhum curso disponível no momento
            </p>
            <p className="text-muted-foreground mt-2">
              Em breve teremos novos cursos disponíveis!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {courses.map((course) => (
                <Card 
                  key={course.id} 
                  className="group border-none shadow-kerigma hover:shadow-kerigma-lg transition-all duration-300 hover:-translate-y-2 bg-card relative overflow-hidden"
                >
                  {/* Featured Badge */}
                  {course.destaque && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                        <Star className="w-3 h-3" />
                        Destaque
                      </div>
                    </div>
                  )}

                  {/* Category Icon Background */}
                  <div className="absolute top-4 left-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">
                    {getCategoryIcon(course.categoria)}
                  </div>

                  <CardHeader className="relative z-10 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getCategoryIcon(course.categoria)}</span>
                      <span className="text-sm font-medium text-primary uppercase tracking-wider">
                        {course.categoria}
                      </span>
                    </div>
                    
                    <CardTitle className="text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {course.nome}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Course Details */}
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getLevelColor(course.nivel)}`}>
                        {course.nivel}
                      </span>
                      
                      {course.carga_horaria && (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{course.carga_horaria}h</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {course.descricao && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {course.descricao}
                      </p>
                    )}

                    {/* Action Button */}
                    <Button 
                      size="sm" 
                      className="w-full mt-4 group-hover:bg-primary/90"
                      asChild
                    >
                      <Link to={course.slug ? `/cursos/${course.slug}` : `/ensino`}>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Saiba Mais
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View All Courses Button */}
            <div className="text-center">
              <Button size="lg" variant="outline" className="px-8" asChild>
                <Link to="/site/ensino">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Ver Todos os Cursos
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};