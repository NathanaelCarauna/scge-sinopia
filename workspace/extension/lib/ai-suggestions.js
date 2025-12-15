/**
 * SINOPIA - Dados e Configurações de IA
 * Este arquivo contém todas as sugestões e análises de IA
 * que serão injetadas pelo content script
 */

// Sugestões de IA para campos de classificação
const aiSuggestions = {
    modalidade: { 
        value: 'MANIFESTAÇÃO', 
        confidence: 90, 
        explanation: 'O texto apresenta características de uma manifestação baseada no tom reflexivo e propositivo. A IA identificou padrões linguísticos que indicam uma comunicação formal dirigida a um órgão público com intenção de compartilhar uma perspectiva pessoal sobre questões de interesse geral.' 
    },
    tipo: { 
        value: 'SUGESTÃO', 
        confidence: 85, 
        explanation: 'O conteúdo sugere uma reflexão sobre oportunidades perdidas, característico de sugestões. A análise semântica identificou termos como "limitados", "escolhas" e "oportunidades" que são indicativos de propostas de melhoria ou mudança de abordagem.' 
    },
    assunto: { 
        value: 'ATENDIMENTO', 
        confidence: 82, 
        explanation: 'Baseado na análise contextual da manifestação, a IA identificou que o foco principal está relacionado à qualidade do atendimento público. O conteúdo sugere preocupação com a eficiência e efetividade dos serviços prestados ao cidadão, com ênfase em aspectos procedimentais e de relacionamento.' 
    },
    subassunto: { 
        value: 'DESEMPENHO', 
        confidence: 88, 
        explanation: 'A análise detalhada do texto indica preocupação específica com o desempenho dos serviços públicos. Palavras-chave como "limitados", "escolhas" e referências a "oportunidades" sugerem avaliação crítica da performance atual e potencial para melhorias no atendimento.' 
    },
    'palavras-chave': { 
        value: 'atendimento, demora, serviço público, eficiência', 
        confidence: 90, 
        explanation: 'A IA extraiu automaticamente as palavras-chave mais relevantes através de análise de frequência, TF-IDF e análise semântica. Essas palavras capturam os conceitos centrais da manifestação: qualidade do atendimento público, questões temporais, natureza do serviço e eficiência operacional.' 
    }
};

// Análise de IA para o relato
const aiAnalysis = {
    sentiment: { 
        value: 'Neutro', 
        confidence: 75, 
        color: 'neutral',
        icon: 'fa-face-meh',
        description: 'O tom do texto é predominantemente neutro, sem expressões de forte emoção positiva ou negativa.'
    },
    urgency: { 
        value: 'Baixa', 
        confidence: 80, 
        color: 'low',
        icon: 'fa-gauge-low',
        description: 'Não foram identificados indicadores de urgência no texto. O conteúdo não requer tratamento prioritário.'
    },
    veracity: { 
        value: '85%', 
        confidence: 85, 
        color: 'high',
        icon: 'fa-shield-check',
        description: 'Alta consistência com padrões de relatos verídicos. Sem indicadores de informação inconsistente.'
    },
    language: { 
        value: 'Normal', 
        confidence: 95, 
        color: 'normal',
        icon: 'fa-comment',
        description: 'Linguagem dentro dos padrões normais. Não foram detectados termos ofensivos ou inadequados.'
    },
    duplicates: { 
        count: 2, 
        similarities: [78, 65],
        cases: [
            {
                protocol: '202443',
                date: '15/05/2025',
                user: 'João Santos',
                organ: 'SEC. DESENVOLVIMENTO SOCIAL',
                similarity: 78,
                excerpt: 'Vivemos limitados pelas nossas escolhas, pelo que poderíamos ter conquistado. Ah, se apenas tivéssemos escolhido os números certos na loteria...'
            },
            {
                protocol: '202398',
                date: '12/05/2025',
                user: 'Maria Oliveira',
                organ: 'SEC. EDUCAÇÃO',
                similarity: 65,
                excerpt: 'Sempre pensamos nas oportunidades perdidas, no que poderia ter sido diferente. Se ao menos tivéssemos tentado aquela oportunidade...'
            }
        ]
    }
};

// Sugestões de encaminhamento
const aiForwardingSuggestion = {
    organ: {
        value: 'SECRETARIA DE DESENVOLVIMENTO SOCIAL',
        confidence: 80
    },
    sector: {
        value: 'DIRETORIA DE ATENDIMENTO AO CIDADÃO',
        confidence: 75
    }
};

// Insights de IA
const aiInsights = [
    {
        icon: 'fa-info-circle',
        text: 'Manifestação similar à <strong>2 casos</strong> dos últimos 30 dias'
    },
    {
        icon: 'fa-clock',
        text: 'Tempo médio de resolução: <strong>7 dias</strong>'
    },
    {
        icon: 'fa-user-check',
        text: 'Taxa de satisfação histórica: <strong>89%</strong>'
    }
];

// Scores de análise
const aiScores = {
    priority: { label: 'Prioridade', value: 30, level: 'low' },
    complexity: { label: 'Complexidade', value: 60, level: 'medium' },
    reliability: { label: 'Confiabilidade', value: 85, level: 'high' }
};

// Sugestões de IA para o modal de resposta
const responseAISuggestions = {
    'modal-tipo-resposta': { 
        value: 'final', 
        displayValue: 'Final',
        confidence: 92, 
        explanation: 'Com base na análise da manifestação, a IA identificou que se trata de uma sugestão que pode ser respondida de forma conclusiva. O conteúdo não requer esclarecimentos adicionais ou respostas parciais, sendo adequado para uma resposta final que agradeça a contribuição e informe sobre o encaminhamento adequado.' 
    },
    'modelo-resposta': { 
        value: 'manifestacao-resposta-conclusiva-cidadao',
        displayValue: 'MANIFESTAÇÃO - RESPOSTA CONCLUSIVA AO CIDADÃO',
        confidence: 88, 
        explanation: 'Considerando que a manifestação é classificada como sugestão e não requer encaminhamento externo urgente, o modelo mais adequado é a resposta conclusiva ao cidadão. Este template permite agradecer pela contribuição, informar sobre o processamento da sugestão e fornecer orientações sobre acompanhamento futuro.' 
    },
    'response-text': { 
        value: `Prezado(a) Cidadão(ã),

Agradecemos pela sua manifestação e pelo interesse em contribuir para a melhoria dos serviços públicos.

Sua sugestão foi analisada e será considerada nos processos de avaliação e aprimoramento dos nossos atendimentos. Valorizamos muito as reflexões dos cidadãos, pois elas nos ajudam a identificar oportunidades de melhoria e a oferecer um serviço mais eficiente e de qualidade.

Informamos que sua manifestação foi devidamente registrada em nosso sistema e será utilizada como subsídio para futuras melhorias.

Atenciosamente,
Ouvidoria Geral do Estado`,
        confidence: 85,
        explanation: 'A IA gerou este rascunho baseado na análise da manifestação, classificação sugerida e modelo de resposta. O texto contempla: agradecimento pela participação cidadã, reconhecimento da contribuição, informação sobre o processamento da sugestão e encerramento institucional adequado. O tom é formal mas acolhedor, apropriado para respostas de ouvidoria.' 
    }
};

// Exportar para uso global no content script
window.SINOPIA_AI = {
    suggestions: aiSuggestions,
    analysis: aiAnalysis,
    forwarding: aiForwardingSuggestion,
    insights: aiInsights,
    scores: aiScores,
    responseSuggestions: responseAISuggestions
};

