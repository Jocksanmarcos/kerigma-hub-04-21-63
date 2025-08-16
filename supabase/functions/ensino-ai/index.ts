import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, question, trilhas, cursos, matriculas } = await req.json();

    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) throw new Error('Gemini API key not configured');

    const systemPrompt = `Você é um assistente educacional cristão (Kerigma Hub) que ajuda alunos a:
- descobrir cursos ideais (recomendações),
- tirar dúvidas sobre o catálogo (Q&A),
- gerar resumos do catálogo e próximos passos.
Responda em português do Brasil, com tom acolhedor e prático. Seja conciso e estruturado com listas quando útil.`;

    let userPrompt = '';

    switch (type) {
      case 'recommendations': {
        userPrompt = `Gere recomendações PERSONALIZADAS de até 5 cursos do catálogo abaixo.
Inclua: nome do curso, breve motivo, nível (se houver) e próximos passos.
Catálogo de cursos: ${JSON.stringify(cursos ?? [], null, 2)}
Minhas matrículas: ${JSON.stringify(matriculas ?? [], null, 2)}
Formato sugerido: lista com bullets.`;
        break;
      }
      case 'qna': {
        userPrompt = `Responda a PERGUNTA do aluno com base no catálogo.
Se existir curso(s) relevante(s), cite-os pelo nome e explique por quê.
Catálogo de cursos: ${JSON.stringify(cursos ?? [], null, 2)}
Trilhas: ${JSON.stringify(trilhas ?? [], null, 2)}
Pergunta: ${question ?? ''}`;
        break;
      }
      case 'summary': {
        userPrompt = `Crie um RESUMO do catálogo atual, destacando categorias, níveis e sugestões de percurso.
Seja objetivo (5-8 bullets) e finalize com próximos passos práticos.
Catálogo de cursos: ${JSON.stringify(cursos ?? [], null, 2)}
Trilhas: ${JSON.stringify(trilhas ?? [], null, 2)}`;
        break;
      }
      default:
        throw new Error('Unsupported type. Use: recommendations | qna | summary');
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + geminiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 1200 },
        }),
      }
    );

    const aiResponse = await response.json();
    if (!response.ok) {
      throw new Error(`Gemini API error: ${aiResponse.error?.message || 'unknown error'}`);
    }

    const content = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    return new Response(
      JSON.stringify({ success: true, content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ensino-ai:', error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
