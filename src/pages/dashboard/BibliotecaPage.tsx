import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, QrCode, Users, BookMarked, AlertTriangle } from 'lucide-react';
import { BibliotecaLivros } from '@/components/biblioteca/BibliotecaLivros';
import { BibliotecaEmprestimos } from '@/components/biblioteca/BibliotecaEmprestimos';
import { BibliotecaReservas } from '@/components/biblioteca/BibliotecaReservas';
import { CadastroLivroDialog } from '@/components/biblioteca/CadastroLivroDialog';
import { EmprestimoDialog } from '@/components/biblioteca/EmprestimoDialog';
import { QRCodeScanner } from '@/components/biblioteca/QRCodeScanner';

const BibliotecaPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCadastroLivro, setShowCadastroLivro] = useState(false);
  const [showEmprestimo, setShowEmprestimo] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const statCards = [
    {
      title: 'Total de Livros',
      value: '1,247',
      description: 'Livros cadastrados',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      title: 'Empréstimos Ativos',
      value: '89',
      description: 'Livros emprestados',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Livros Disponíveis',
      value: '1,158',
      description: 'Prontos para empréstimo',
      icon: BookMarked,
      color: 'text-purple-600'
    },
    {
      title: 'Empréstimos Atrasados',
      value: '12',
      description: 'Precisam de atenção',
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Biblioteca da Sabedoria</h1>
            <p className="text-muted-foreground">
              Sistema completo de gestão da biblioteca da igreja
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowScanner(true)}
              variant="outline"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Scanner QR
            </Button>
            <Button 
              onClick={() => setShowEmprestimo(true)}
              variant="outline"
            >
              <Users className="h-4 w-4 mr-2" />
              Novo Empréstimo
            </Button>
            <Button onClick={() => setShowCadastroLivro(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Livro
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="livros">Acervo</TabsTrigger>
            <TabsTrigger value="emprestimos">Empréstimos</TabsTrigger>
            <TabsTrigger value="reservas">Reservas</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((card, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Empréstimos Recentes</CardTitle>
                  <CardDescription>
                    Últimos livros emprestados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-14 bg-muted rounded-sm flex items-center justify-center">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">O Poder da Oração</p>
                          <p className="text-sm text-muted-foreground">
                            João Silva • Emprestado hoje
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Livros Mais Populares</CardTitle>
                  <CardDescription>
                    Os mais emprestados este mês
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { titulo: 'Em Busca de Deus', emprestimos: '15' },
                      { titulo: 'A Cabana', emprestimos: '12' },
                      { titulo: 'Jesus Freaks', emprestimos: '10' }
                    ].map((livro, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                            {i + 1}
                          </div>
                          <span className="font-medium">{livro.titulo}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {livro.emprestimos} empréstimos
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="livros">
            <BibliotecaLivros />
          </TabsContent>

          <TabsContent value="emprestimos">
            <BibliotecaEmprestimos />
          </TabsContent>

          <TabsContent value="reservas">
            <BibliotecaReservas />
          </TabsContent>
        </Tabs>

        <CadastroLivroDialog 
          open={showCadastroLivro} 
          onOpenChange={setShowCadastroLivro}
        />
        
        <EmprestimoDialog 
          open={showEmprestimo} 
          onOpenChange={setShowEmprestimo}
        />

        <QRCodeScanner
          open={showScanner}
          onOpenChange={setShowScanner}
          onCodeScanned={(code) => {
            console.log('QR Code scanned:', code);
            setShowScanner(false);
          }}
        />
      </div>
    </AppLayout>
  );
};

export default BibliotecaPage;