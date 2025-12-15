/**
 * SINOPIA - Background Service Worker
 * Gerencia estado e comunicação da extensão
 */

// Inicialização
chrome.runtime.onInstalled.addListener((details) => {
    console.log('[SINOPIA] Extensão instalada/atualizada:', details.reason);
    
    // Configurar estado inicial
    chrome.storage.local.set({
        sinopiaEnabled: true,
        stats: {
            accepted: 0,
            rejected: 0,
            explained: 0
        },
        feedbackHistory: []
    });
});

// Escutar mensagens dos content scripts e popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[SINOPIA] Mensagem recebida:', message);

    switch (message.type) {
        case 'FEEDBACK':
            handleFeedback(message.data);
            sendResponse({ success: true });
            break;

        case 'GET_STATE':
            chrome.storage.local.get(['sinopiaEnabled', 'stats'], (result) => {
                sendResponse(result);
            });
            return true; // Manter canal aberto para resposta assíncrona

        case 'TOGGLE_AI':
            chrome.storage.local.set({ sinopiaEnabled: message.enabled });
            sendResponse({ success: true });
            break;

        default:
            sendResponse({ success: false, error: 'Unknown message type' });
    }
});

/**
 * Processa feedback de sugestões de IA
 */
function handleFeedback(data) {
    chrome.storage.local.get(['stats', 'feedbackHistory'], (result) => {
        const stats = result.stats || { accepted: 0, rejected: 0, explained: 0 };
        const history = result.feedbackHistory || [];

        // Atualizar estatísticas
        switch (data.action) {
            case 'accepted':
                stats.accepted++;
                break;
            case 'rejected':
                stats.rejected++;
                break;
            case 'explained':
                stats.explained++;
                break;
            case 'feedback':
                // Feedback textual não incrementa contadores
                break;
        }

        // Adicionar ao histórico (manter últimos 100)
        history.push({
            ...data,
            timestamp: new Date().toISOString()
        });
        
        if (history.length > 100) {
            history.shift();
        }

        // Salvar
        chrome.storage.local.set({ stats, feedbackHistory: history });

        // Notificar popup se aberto
        chrome.runtime.sendMessage({
            type: 'STATS_UPDATED',
            stats
        }).catch(() => {
            // Popup pode não estar aberto
        });

        console.log('[SINOPIA] Estatísticas atualizadas:', stats);
    });
}

// Verificar se é uma página compatível ao navegar
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const isCompatible = tab.url.includes('detalhes.html') || 
                            tab.url.includes('detalhes') ||
                            tab.url.startsWith('file://');
        
        // Atualizar ícone baseado na compatibilidade
        if (isCompatible) {
            chrome.action.setBadgeText({ tabId, text: 'ON' });
            chrome.action.setBadgeBackgroundColor({ tabId, color: '#22c55e' });
        } else {
            chrome.action.setBadgeText({ tabId, text: '' });
        }
    }
});

// Log de inicialização
console.log('[SINOPIA] Service worker inicializado');

