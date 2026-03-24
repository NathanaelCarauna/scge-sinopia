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
    chrome.storage.local.get(['sinopiaEnabled', 'stats', 'features'], (result) => {
        console.log('[POPUP] Estado carregado:', result);
        
        // Toggle geral
        const toggle = document.getElementById('toggle-ai');
        toggle.checked = result.sinopiaEnabled !== false;
        
        // Features (por padrão, apenas duplicatas ativada)
        let features = result.features;
        
        // Se não existe configuração salva, criar padrão
        if (!features) {
            features = {
                sentiment: false,
                duplicates: true,
                classification: false,
                forwarding: false,
                response: false
            };
            // Salvar configuração padrão
            chrome.storage.local.set({ features }, () => {
                console.log('[POPUP] Configuração padrão salva:', features);
            });
        }
        
        console.log('[POPUP] Features ativas:', features);
        
        document.getElementById('feature-sentiment').checked = features.sentiment === true;
        document.getElementById('feature-duplicates').checked = features.duplicates === true;
        document.getElementById('feature-classification').checked = features.classification === true;
        document.getElementById('feature-forwarding').checked = features.forwarding === true;
        document.getElementById('feature-response').checked = features.response === true;
        
        // Desabilitar features se IA estiver desativada
        updateFeaturesState(toggle.checked);
        
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
    // Toggle geral
    document.getElementById('toggle-ai').addEventListener('change', (e) => {
        const enabled = e.target.checked;
        chrome.storage.local.set({ sinopiaEnabled: enabled });
        updateStatus(enabled);
        updateFeaturesState(enabled);
        
        // Notificar aba atual
        notifyContentScript({ type: 'TOGGLE_AI', enabled });
    });

    // Feature toggles
    const featureIds = ['sentiment', 'duplicates', 'classification', 'forwarding', 'response'];
    featureIds.forEach(featureId => {
        document.getElementById(`feature-${featureId}`).addEventListener('change', (e) => {
            saveFeatureState(featureId, e.target.checked);
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
 * Salva estado de uma funcionalidade
 */
function saveFeatureState(featureId, enabled) {
    console.log(`[POPUP] Salvando feature ${featureId}:`, enabled);
    
    chrome.storage.local.get(['features'], (result) => {
        const features = result.features || {
            sentiment: false,
            duplicates: true,
            classification: false,
            forwarding: false,
            response: false
        };
        
        features[featureId] = enabled;
        
        chrome.storage.local.set({ features }, () => {
            console.log('[POPUP] Features salvas:', features);
        });
        
        // Notificar content script
        notifyContentScript({ 
            type: 'FEATURE_TOGGLE', 
            feature: featureId, 
            enabled 
        });
    });
}

/**
 * Atualiza estado dos toggles de funcionalidades
 */
function updateFeaturesState(enabled) {
    const featuresSection = document.getElementById('features-section');
    const featureToggles = document.querySelectorAll('.feature-item input[type="checkbox"]');
    
    featureToggles.forEach(toggle => {
        toggle.disabled = !enabled;
        toggle.parentElement.parentElement.style.opacity = enabled ? '1' : '0.5';
    });
}

/**
 * Notifica content script na aba atual
 */
function notifyContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, message).catch(() => {
                // Tab may not have content script
            });
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

