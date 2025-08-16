import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedScrollSection from "./AnimatedScrollSection";
import { HoverScale, GlassCard } from "./MicroInteractions";

interface Event {
  id: string;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim?: string;
  local: string;
  endereco?: string;
  tipo: string;
  cover_image_url?: string;
  capacidade?: number;
  inscricoes_abertas?: boolean;
}

export const DynamicEventsSection: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from our public API
      try {
        const response = await supabase.functions.invoke('api-public-events', {
          body: { limit: 3 }
        });
        
        if (response.data?.events) {
          setEvents(response.data.events);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using direct query');
      }

      // Fallback to direct query
      const { data, error } = await supabase
        .from('eventos')
        .select(`
          id,
          titulo,
          descricao,
          data_inicio,
          data_fim,
          local,
          endereco,
          tipo,
          cover_image_url,
          capacidade,
          inscricoes_abertas
        `)
        .eq('publico', true)
        .gte('data_inicio', new Date().toISOString())
        .order('data_inicio', { ascending: true })
        .limit(3);

      if (error) throw error;
      setEvents(data || []);
      
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-12 w-96 mx-auto mb-4 bg-slate-200 animate-pulse rounded" />
            <div className="h-6 w-128 mx-auto bg-slate-200 animate-pulse rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 w-full bg-slate-200 animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedScrollSection animation="fade-up" className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            Próximos Eventos
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            Encontros que Transformam
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Participe dos nossos eventos e experimente momentos de crescimento, 
            adoração e comunhão em família.
          </p>
        </AnimatedScrollSection>

        {error ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={fetchEvents} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-xl text-slate-600">
              Nenhum evento programado no momento
            </p>
            <p className="text-slate-500 mt-2">
              Acompanhe nossa agenda para não perder as próximas atividades!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {events.map((event, index) => (
                <AnimatedScrollSection 
                  key={event.id}
                  animation="fade-up"
                  delay={index * 150}
                >
                  <HoverScale>
                    <GlassCard className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                      {/* Event Image */}
                      <div className="relative h-48 overflow-hidden">
                        {event.cover_image_url ? (
                          <img
                            src={event.cover_image_url}
                            alt={event.titulo}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-primary/60" />
                          </div>
                        )}
                        
                        {/* Event Type Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                            {event.tipo}
                          </span>
                        </div>

                        {/* Registration Status */}
                        {event.inscricoes_abertas && (
                          <div className="absolute top-4 right-4">
                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                              Abertas
                            </span>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-6 space-y-4">
                        {/* Title */}
                        <h3 className="text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                          {event.titulo}
                        </h3>

                        {/* Date and Time */}
                        <div className="flex items-center text-sm text-slate-600">
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          <span>{formatDate(event.data_inicio)}</span>
                        </div>

                        <div className="flex items-center text-sm text-slate-600">
                          <Clock className="w-4 h-4 mr-2 text-primary" />
                          <span>{formatTime(event.data_inicio)}</span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center text-sm text-slate-600">
                          <MapPin className="w-4 h-4 mr-2 text-primary" />
                          <span className="line-clamp-1">{event.local}</span>
                        </div>

                        {/* Capacity */}
                        {event.capacidade && (
                          <div className="flex items-center text-sm text-slate-600">
                            <Users className="w-4 h-4 mr-2 text-primary" />
                            <span>{event.capacidade} vagas</span>
                          </div>
                        )}

                        {/* Description */}
                        {event.descricao && (
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {event.descricao}
                          </p>
                        )}

                        {/* Action Button */}
                        <Button 
                          size="sm" 
                          className="w-full mt-4 group-hover:bg-primary/90"
                          asChild
                        >
                          <Link to={`/eventos/${event.id}`}>
                            Ver Detalhes
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </GlassCard>
                  </HoverScale>
                </AnimatedScrollSection>
              ))}
            </div>

            {/* View All Events Button */}
            <div className="text-center">
              <AnimatedScrollSection animation="fade-up" delay={500}>
                <Button size="lg" variant="outline" className="px-8 hover:bg-primary hover:text-primary-foreground transition-colors" asChild>
                  <Link to="/agenda">
                    <Calendar className="mr-2 h-5 w-5" />
                    Ver Todos os Eventos
                  </Link>
                </Button>
              </AnimatedScrollSection>
            </div>
          </>
        )}
      </div>
    </section>
  );
};