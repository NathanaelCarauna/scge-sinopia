/**
 * SINOPIA - Popup Script
 */

document.addEventListener('DOMContentLoaded', init);

function init() {
    loadState();
    setupEventListeners();
    checkCurrentTab();
}

/**
 * Carrega estado salvo
 */
function loadState() {
    chrome.storage.local.get(['sinopiaEnabled', 'stats'], (result) => {
        // Toggle
        const toggle = document.getElementById('toggle-ai');
        toggle.checked = result.sinopiaEnabled !== false;
        
        // Stats
        const stats = result.stats || { accepted: 0, rejected: 0, explained: 0 };
        document.getElementById('accepted-count').textContent = stats.accepted;
        document.getElementById('rejected-count').textContent = stats.rejected;
        document.getElementById('explained-count').textContent = stats.explained;

        updateStatus(toggle.checked);
    });
}

/**
 * Configura event listeners
 */
function setupEventListeners() {
    // Toggle
    document.getElementById('toggle-ai').addEventListener('change', (e) => {
        const enabled = e.target.checked;
        chrome.storage.local.set({ sinopiaEnabled: enabled });
        updateStatus(enabled);
        
        // Notificar aba atual
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { 
                    type: 'TOGGLE_AI', 
                    enabled 
                }).catch(() => {
                    // Tab may not have content script
                });
            }
        });
    });

    // Refresh
    document.getElementById('refresh-btn').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.reload(tabs[0].id);
                window.close();
            }
        });
    });

    // Reset stats
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja resetar as estatísticas?')) {
            const stats = { accepted: 0, rejected: 0, explained: 0 };
            chrome.storage.local.set({ stats });
            document.getElementById('accepted-count').textContent = '0';
            document.getElementById('rejected-count').textContent = '0';
            document.getElementById('explained-count').textContent = '0';
        }
    });
}

/**
 * Atualiza indicador de status
 */
function updateStatus(enabled) {
    const indicator = document.getElementById('status-indicator');
    const text = document.getElementById('status-text');
    
    if (enabled) {
        indicator.classList.add('active');
        indicator.classList.remove('inactive');
        text.textContent = 'IA Ativa - Pronta para assistir';
    } else {
        indicator.classList.add('inactive');
        indicator.classList.remove('active');
        text.textContent = 'IA Desativada';
    }
}

/**
 * Verifica se a aba atual é compatível
 */
function checkCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            const url = tabs[0].url || '';
            const isCompatible = url.includes('detalhes.html') || 
                                url.includes('detalhes') ||
                                url.startsWith('file://');
            
            if (!isCompatible) {
                document.getElementById('status-text').textContent = 'Página não compatível';
                document.getElementById('status-indicator').classList.remove('active');
            }
        }
    });
}

// Escutar mensagens do background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'STATS_UPDATED') {
        document.getElementById('accepted-count').textContent = message.stats.accepted;
        document.getElementById('rejected-count').textContent = message.stats.rejected;
        document.getElementById('explained-count').textContent = message.stats.explained;
    }
});

