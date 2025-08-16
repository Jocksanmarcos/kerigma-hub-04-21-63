import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  Type, 
  Palette, 
  MousePointer, 
  Keyboard, 
  Volume2, 
  Users, 
  RotateCcw,
  Lightbulb,
  Heart,
  Accessibility
} from 'lucide-react';
import { useAccessibilitySettings } from '@/hooks/useAccessibilitySettings';
import { useToast } from '@/hooks/use-toast';

export const AccessibilitySettings: React.FC = () => {
  const { settings, updateSettings, resetSettings, detectUserPreferences } = useAccessibilitySettings();
  const { toast } = useToast();

  const handleAutoDetect = () => {
    detectUserPreferences();
    toast({
      title: "Configurações detectadas",
      description: "Aplicamos as melhores configurações baseadas no seu dispositivo."
    });
  };

  const handleReset = () => {
    resetSettings();
    toast({
      title: "Configurações restauradas",
      description: "Todas as configurações foram redefinidas para o padrão."
    });
  };

  const themes = [
    {
      id: 'default',
      name: 'Padrão',
      description: 'Design equilibrado para todos',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      id: 'accessibility',
      name: 'Acessibilidade',
      description: 'Alto contraste, fontes grandes',
      icon: Accessibility,
      color: 'text-yellow-500'
    },
    {
      id: 'young',
      name: 'Jovem',
      description: 'Cores vibrantes e moderno',
      icon: Heart,
      color: 'text-pink-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configurações de Acessibilidade</h2>
          <p className="text-muted-foreground">
            Personalize a experiência de acordo com suas necessidades
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAutoDetect} className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Auto-detectar
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Restaurar
          </Button>
        </div>
      </div>

      {/* Current Theme Indicator */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {themes.find(t => t.id === settings.theme)?.icon && 
                React.createElement(themes.find(t => t.id === settings.theme)!.icon, {
                  className: `h-5 w-5 ${themes.find(t => t.id === settings.theme)!.color}`
                })
              }
              <span className="font-medium">
                Tema atual: {themes.find(t => t.id === settings.theme)?.name}
              </span>
            </div>
            <Badge variant="secondary">
              {themes.find(t => t.id === settings.theme)?.description}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Tema da Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Tema da Interface
            </CardTitle>
            <CardDescription>
              Escolha o estilo visual que melhor atende suas necessidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {themes.map((theme) => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.id}
                    onClick={() => updateSettings({ theme: theme.id as any })}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      settings.theme === theme.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${theme.color}`} />
                      <div>
                        <div className="font-medium">{theme.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {theme.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tipografia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Tamanho do Texto
            </CardTitle>
            <CardDescription>
              Ajuste o tamanho da fonte para melhor legibilidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="font-size">Tamanho da fonte</Label>
              <Select 
                value={settings.fontSize} 
                onValueChange={(value) => updateSettings({ fontSize: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (16px)</SelectItem>
                  <SelectItem value="large">Grande (18px)</SelectItem>
                  <SelectItem value="extra-large">Extra Grande (22px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="contrast">Contraste</Label>
              <Select 
                value={settings.contrast} 
                onValueChange={(value) => updateSettings({ contrast: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Alto Contraste</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Interação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Interação
            </CardTitle>
            <CardDescription>
              Configure como você interage com a interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Animações reduzidas</Label>
                <p className="text-sm text-muted-foreground">
                  Reduz movimentos na tela
                </p>
              </div>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Foco aprimorado</Label>
                <p className="text-sm text-muted-foreground">
                  Destaque visual mais forte
                </p>
              </div>
              <Switch
                checked={settings.enhancedFocus}
                onCheckedChange={(checked) => updateSettings({ enhancedFocus: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Interface simplificada</Label>
                <p className="text-sm text-muted-foreground">
                  Remove elementos decorativos
                </p>
              </div>
              <Switch
                checked={settings.simplifiedUI}
                onCheckedChange={(checked) => updateSettings({ simplifiedUI: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Navegação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Navegação
            </CardTitle>
            <CardDescription>
              Opções para navegação por teclado e leitores de tela
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Navegação por teclado</Label>
                <p className="text-sm text-muted-foreground">
                  Melhora o suporte ao Tab
                </p>
              </div>
              <Switch
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => updateSettings({ keyboardNavigation: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo leitor de tela</Label>
                <p className="text-sm text-muted-foreground">
                  Otimiza para NVDA, JAWS, etc.
                </p>
              </div>
              <Switch
                checked={settings.screenReaderMode}
                onCheckedChange={(checked) => updateSettings({ screenReaderMode: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Suporte a daltonismo</Label>
                <p className="text-sm text-muted-foreground">
                  Ajusta cores para daltonismo
                </p>
              </div>
              <Switch
                checked={settings.colorBlindSupport}
                onCheckedChange={(checked) => updateSettings({ colorBlindSupport: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Recursos de Áudio
          </CardTitle>
          <CardDescription>
            Configurações para feedback sonoro e leitura de tela
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Texto para fala</Label>
              <p className="text-sm text-muted-foreground">
                Permite que o sistema leia textos em voz alta
              </p>
            </div>
            <Switch
              checked={settings.textToSpeech}
              onCheckedChange={(checked) => updateSettings({ textToSpeech: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};