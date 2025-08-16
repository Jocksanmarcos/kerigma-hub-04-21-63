import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const CertificatesCard: React.FC = () => {
  const count = 0; // Placeholder – integrar com certificados reais
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Certificados</CardTitle>
        <Award className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-sm text-muted-foreground">Certificados conquistados</p>
        <Button asChild variant="outline" className="mt-3">
          <Link to="/certificados">Ver certificados</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CertificatesCard;
