import { supabase } from '@/integrations/supabase/client';

export type EnsinoAIType = 'recommendations' | 'qna' | 'summary';

export async function ensinoAI(params: {
  type: EnsinoAIType;
  question?: string;
  trilhas?: unknown;
  cursos?: unknown;
  matriculas?: unknown;
}): Promise<string> {
  const { data, error } = await supabase.functions.invoke('ensino-ai', {
    body: params,
  });

  if (error) throw error;
  return (data as any)?.content ?? '';
}
