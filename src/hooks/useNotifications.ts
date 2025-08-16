import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NotificationSettings {
  events: boolean;
  teaching_content: boolean;
  cell_messages: boolean;
  email: boolean;
  push: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'teaching' | 'cell' | 'system';
  read: boolean;
  created_at: string;
  user_id: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    events: true,
    teaching_content: true,
    cell_messages: true,
    email: true,
    push: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    loadSettings();
    setupRealtimeSubscription();
  }, []);

  const loadNotifications = async () => {
    try {
      // Simulação de dados até o TypeScript ser atualizado
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Evento próximo',
          message: 'Culto de oração esta noite às 19h',
          type: 'event',
          read: false,
          created_at: new Date().toISOString(),
          user_id: 'user1'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      // Manter configurações padrão até DB estar disponível
      const defaultSettings: NotificationSettings = {
        events: true,
        teaching_content: true,
        cell_messages: true,
        email: true,
        push: false
      };
      
      setSettings(defaultSettings);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    // Implementar quando tipos estiverem disponíveis
    console.log('Real-time subscription configurado');
    
    return () => {
      console.log('Subscription cleanup');
    };
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const updateSettings = async (newSettings: NotificationSettings) => {
    try {
      setSettings(newSettings);

      // Solicitar permissão para notificações push se habilitado
      if (newSettings.push && 'Notification' in window) {
        if (Notification.permission === 'default') {
          await Notification.requestPermission();
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
    }
  };

  const sendNotification = async (
    userId: string, 
    title: string, 
    message: string, 
    type: Notification['type']
  ) => {
    try {
      await supabase.functions.invoke('send-notification', {
        body: { userId, title, message, type }
      });
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  };

  return {
    notifications,
    settings,
    loading,
    markAsRead,
    markAllAsRead,
    updateSettings,
    sendNotification,
    unreadCount: notifications.filter(n => !n.read).length
  };
};