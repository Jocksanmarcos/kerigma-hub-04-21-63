import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Church {
  id: string;
  name: string;
  type: 'sede' | 'missao';
  address?: string;
  cnpj?: string;
  parent_church_id?: string;
  pastor_responsavel?: string;
  data_fundacao?: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  ativa: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserChurchRole {
  id: string;
  user_id: string;
  church_id: string;
  role: 'super_admin' | 'pastor' | 'tesoureiro' | 'lider_celula' | 'secretario' | 'membro';
  active: boolean;
  church?: Church;
}

export const useChurches = () => {
  return useQuery({
    queryKey: ["churches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("churches")
        .select("*")
        .eq("ativa", true)
        .order("name");

      if (error) throw error;
      return data as Church[];
    },
  });
};

export const useUserChurchRoles = () => {
  return useQuery({
    queryKey: ["user-church-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_church_roles")
        .select(`
          *,
          church:churches(*)
        `)
        .eq("active", true);

      if (error) throw error;
      return data as UserChurchRole[];
    },
  });
};

export const useUserChurch = () => {
  return useQuery({
    queryKey: ["user-church"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_user_church_id");
      if (error) throw error;
      
      if (!data) return null;
      
      const { data: church, error: churchError } = await supabase
        .from("churches")
        .select("*")
        .eq("id", data)
        .single();
        
      if (churchError) throw churchError;
      return church as Church;
    },
  });
};

export const useIsSuperAdmin = () => {
  return useQuery({
    queryKey: ["is-super-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("is_super_admin");
      if (error) throw error;
      return Boolean(data);
    },
  });
};

export const useCreateChurch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (churchData: Omit<Church, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("churches")
        .insert([churchData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["churches"] });
      toast({
        title: "Igreja criada",
        description: "Nova igreja foi criada com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar igreja",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateChurch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Church> }) => {
      const { data, error } = await supabase
        .from("churches")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["churches"] });
      toast({
        title: "Igreja atualizada",
        description: "Igreja foi atualizada com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar igreja",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAssignUserToChurch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      userId,
      churchId,
      role,
    }: {
      userId: string;
      churchId: string;
      role: UserChurchRole['role'];
    }) => {
      const { data, error } = await supabase
        .from("user_church_roles")
        .insert([{
          user_id: userId,
          church_id: churchId,
          role,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-church-roles"] });
      toast({
        title: "Usuário atribuído",
        description: "Usuário foi atribuído à igreja com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atribuir usuário",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};