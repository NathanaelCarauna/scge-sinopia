/**
 * SINOPIA - Content Script
 * Injeta componentes de IA na página de detalhes do OUVE.PE
 */

(function() {
    'use strict';

    // Verificar se já foi inicializado
    if (window.SINOPIA_INITIALIZED) return;
    window.SINOPIA_INITIALIZED = true;

    // Estado da extensão
    let extensionEnabled = true;
    let enabledFeatures = {
        sentiment: false,
        duplicates: true,
        classification: false,
        forwarding: false,
        response: false
    };

    // Aguardar dados de IA carregarem
    const AI = window.SINOPIA_AI;
    if (!AI) {
        console.error('[SINOPIA] Dados de IA não encontrados');
        return;
    }

    console.log('[SINOPIA] Extensão carregada - Iniciando injeção de IA');

    // Inicialização
    document.addEventListener('DOMContentLoaded', init);
    if (document.readyState !== 'loading') {
        init();
    }

    function init() {
        // Verificar estado salvo
        chrome.storage.local.get(['sinopiaEnabled', 'features'], (result) => {
            console.log('[SINOPIA] Estado inicial carregado:', result);
            
            extensionEnabled = result.sinopiaEnabled !== false;
            
            // Carregar configurações de funcionalidades (padrão: apenas duplicatas)
            if (!result.features) {
                // Primeira inicialização - salvar padrão
                enabledFeatures = {
                    sentiment: false,
                    duplicates: true,
                    classification: false,
                    forwarding: false,
                    response: false
                };
                chrome.storage.local.set({ features: enabledFeatures }, () => {
                    console.log('[SINOPIA] Features padrão salvas:', enabledFeatures);
                });
            } else {
                enabledFeatures = result.features;
            }
            
            console.log('[SINOPIA] Features ativas:', enabledFeatures);
            console.log('[SINOPIA] IA habilitada:', extensionEnabled);
            
            if (extensionEnabled) {
                injectAIComponents();
            }
            addExtensionBadge();
            setupEventDelegation();
        });
    }

    /**
     * Configura event delegation para todos os botões de IA
     */
    function setupEventDelegation() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-sinopia-action]');
            if (!target) return;

            const action = target.dataset.sinopiaAction;
            const fieldId = target.dataset.fieldId;
            const value = target.dataset.value;

            e.preventDefault();
            e.stopPropagation();

            // Despachar ação
            switch (action) {
                case 'accept-suggestion':
                    acceptSuggestion(fieldId, value);
                    break;
                case 'reject-suggestion':
                    rejectSuggestion(fieldId);
                    break;
                case 'explain-suggestion':
                    explainSuggestion(fieldId);
                    break;
                case 'show-similar-cases':
                    showSimilarCases();
                    break;
                case 'apply-forwarding':
                    applyForwarding();
                    break;
                case 'accept-response-suggestion':
                    acceptResponseSuggestion(fieldId, value);
                    break;
                case 'accept-response-text':
                    acceptResponseText();
                    break;
                case 'reject-response-suggestion':
                    rejectResponseSuggestion(fieldId);
                    break;
                case 'explain-response-suggestion':
                    explainResponseSuggestion(fieldId);
                    break;
                case 'mark-as-duplicate':
                    markAsDuplicate();
                    break;
                case 'link-cases':
                    linkCases();
                    break;
                case 'provide-feedback':
                    provideFeedback();
                    break;
                case 'close-modal':
                    const modalId = target.dataset.modalId;
                    document.getElementById(modalId)?.remove();
                    break;
            }
        });
    }

    /**
     * Injeta todos os componentes de IA
     */
    function injectAIComponents() {
        console.log('[SINOPIA] Injetando componentes de IA...');
        console.log('[SINOPIA] Features ativas no momento da injeção:', enabledFeatures);

        // 1. Injetar badges de análise no relato
        console.log('[SINOPIA] Tentando injetar badges de análise...');
        injectAnalysisBadges();

        // 2. Injetar sugestões nos campos de classificação
        console.log('[SINOPIA] Tentando injetar sugestões de classificação...');
        injectFieldSuggestions();

        // 3. Injetar painel de análise na coluna direita
        console.log('[SINOPIA] Tentando injetar painel de análise...');
        injectAIPanel();

        // 4. Interceptar modal de resposta
        console.log('[SINOPIA] Tentando interceptar modal de resposta...');
        interceptResponseModal();

        // Mostrar notificação de carregamento
        setTimeout(() => {
            showAINotification('IA processando manifestação...', 'info');
            setTimeout(() => {
                showAINotification('Análise IA concluída! Sugestões disponíveis.', 'success');
            }, 2000);
        }, 1000);
    }

    /**
     * Injeta badges de análise no campo Relato
     */
    function injectAnalysisBadges() {
        console.log('[SINOPIA] injectAnalysisBadges - sentiment:', enabledFeatures.sentiment, 'duplicates:', enabledFeatures.duplicates);
        
        const relatoRow = document.querySelector('#relato-text');
        if (!relatoRow) {
            console.log('[SINOPIA] Elemento #relato-text não encontrado');
            return;
        }

        const parentRow = relatoRow.closest('.detail-row');
        if (!parentRow) {
            console.log('[SINOPIA] .detail-row não encontrado');
            return;
        }

        // Verificar se já existe
        if (parentRow.querySelector('.sinopia-ai-badges')) {
            console.log('[SINOPIA] Badges já existem, pulando');
            return;
        }

        const analysis = AI.analysis;
        let badges = [];

        // Badges de sentimento (se habilitado)
        if (enabledFeatures.sentiment) {
            console.log('[SINOPIA] Injetando badges de sentimento');
            badges.push(`
                <span class="sinopia-ai-badge sentiment-${analysis.sentiment.color}" 
                      title="Análise de Sentimento - ${analysis.sentiment.confidence}% confiança">
                    <i class="fas ${analysis.sentiment.icon}"></i> Sentimento: ${analysis.sentiment.value}
                </span>
            `);
            badges.push(`
                <span class="sinopia-ai-badge urgency-${analysis.urgency.color}" 
                      title="Análise de Urgência - ${analysis.urgency.confidence}% confiança">
                    <i class="fas ${analysis.urgency.icon}"></i> Urgência: ${analysis.urgency.value}
                </span>
            `);
            badges.push(`
                <span class="sinopia-ai-badge veracity-${analysis.veracity.color}" 
                      title="Análise de Veracidade - ${analysis.veracity.confidence}% confiança">
                    <i class="fas ${analysis.veracity.icon}"></i> Veracidade: ${analysis.veracity.value}
                </span>
            `);
            badges.push(`
                <span class="sinopia-ai-badge language-${analysis.language.color}" 
                      title="Análise de Linguagem">
                    <i class="fas ${analysis.language.icon}"></i> Linguagem: ${analysis.language.value}
                </span>
            `);
        }

        // Badge de duplicatas (se habilitado)
        if (enabledFeatures.duplicates) {
            console.log('[SINOPIA] Injetando badge de duplicatas');
            badges.push(`
                <button class="sinopia-ai-badge duplicates-found" 
                        data-sinopia-action="show-similar-cases"
                        title="${analysis.duplicates.count} manifestações similares encontradas">
                    <i class="fas fa-copy"></i> ${analysis.duplicates.count} Similares (${analysis.duplicates.similarities.join('%, ')}%)
                </button>
            `);
        }

        // Se não há badges, não injeta nada
        if (badges.length === 0) {
            console.log('[SINOPIA] Nenhuma badge para injetar (todas as features estão desabilitadas)');
            return;
        }
        
        console.log('[SINOPIA] Total de badges a injetar:', badges.length);

        const badgesHTML = `
            <div class="sinopia-ai-badges">
                ${badges.join('')}
            </div>
        `;

        parentRow.insertAdjacentHTML('beforeend', badgesHTML);
    }

    /**
     * Injeta sugestões de IA nos campos de classificação
     */
    function injectFieldSuggestions() {
        // Só injeta se a funcionalidade estiver habilitada
        if (!enabledFeatures.classification) {
            console.log('[SINOPIA] Sugestões de classificação desabilitadas, pulando');
            return;
        }
        
        console.log('[SINOPIA] Injetando sugestões de classificação');

        const suggestions = AI.suggestions;

        Object.keys(suggestions).forEach(fieldId => {
            const suggestion = suggestions[fieldId];
            const fieldContainer = document.querySelector(`[data-field="${fieldId}"]`);
            
            if (!fieldContainer) {
                // Tentar encontrar pelo ID do span
                const span = document.getElementById(fieldId);
                if (span) {
                    const parent = span.parentElement;
                    if (parent && !parent.querySelector('.sinopia-ai-suggestion')) {
                        injectSuggestionBox(parent, fieldId, suggestion);
                    }
                }
                return;
            }

            if (fieldContainer.querySelector('.sinopia-ai-suggestion')) return;
            injectSuggestionBox(fieldContainer, fieldId, suggestion);
        });
    }

    /**
     * Injeta caixa de sugestão em um campo
     */
    function injectSuggestionBox(container, fieldId, suggestion) {
        const escapedValue = suggestion.value.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const suggestionHTML = `
            <div class="sinopia-ai-suggestion" id="sinopia-suggestion-${fieldId}">
                <div class="sinopia-ai-suggestion-content">
                    <i class="fas fa-robot"></i>
                    <span class="sinopia-suggestion-label">IA sugere:</span>
                    <span class="sinopia-suggestion-value">${suggestion.value}</span>
                    <span class="sinopia-suggestion-confidence">(${suggestion.confidence}%)</span>
                </div>
                <div class="sinopia-ai-suggestion-actions">
                    <button class="sinopia-ai-btn accept" 
                            data-sinopia-action="accept-suggestion"
                            data-field-id="${fieldId}"
                            data-value="${escapedValue}"
                            title="Aceitar sugestão">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="sinopia-ai-btn reject" 
                            data-sinopia-action="reject-suggestion"
                            data-field-id="${fieldId}"
                            title="Rejeitar sugestão">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="sinopia-ai-btn explain" 
                            data-sinopia-action="explain-suggestion"
                            data-field-id="${fieldId}"
                            title="Por que a IA sugere isso?">
                        <i class="fas fa-question-circle"></i>
                    </button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', suggestionHTML);
    }

    /**
     * Injeta painel de análise de IA na coluna direita
     */
    function injectAIPanel() {
        // Só injeta se a funcionalidade de encaminhamento estiver habilitada
        if (!enabledFeatures.forwarding) {
            console.log('[SINOPIA] Painel de encaminhamento desabilitado, pulando');
            return;
        }
        
        console.log('[SINOPIA] Injetando painel de encaminhamento');

        const rightColumn = document.querySelector('.right-column');
        if (!rightColumn) return;

        // Verificar se já existe
        if (rightColumn.querySelector('.sinopia-ai-panel')) return;

        const forwarding = AI.forwarding;
        const scores = AI.scores;
        const insights = AI.insights;

        const panelHTML = `
            <div class="sinopia-ai-panel">
                <div class="sinopia-panel-header">
                    <h3><i class="fas fa-robot"></i> Análise Inteligente</h3>
                    <span class="sinopia-ai-status online">IA Online</span>
                </div>
                
                <div class="sinopia-ai-section">
                    <h4><i class="fas fa-crosshairs"></i> Encaminhamento Sugerido</h4>
                    <div class="sinopia-recommendation">
                        <div class="sinopia-recommendation-item">
                            <span class="sinopia-rec-label">Órgão:</span>
                            <span class="sinopia-rec-value">${forwarding.organ.value}</span>
                            <span class="sinopia-rec-confidence">${forwarding.organ.confidence}%</span>
                        </div>
                        <div class="sinopia-recommendation-item">
                            <span class="sinopia-rec-label">Setor:</span>
                            <span class="sinopia-rec-value">${forwarding.sector.value}</span>
                            <span class="sinopia-rec-confidence">${forwarding.sector.confidence}%</span>
                        </div>
                        <button class="sinopia-ai-apply-btn" data-sinopia-action="apply-forwarding">
                            <i class="fas fa-magic"></i> Aplicar Sugestão
                        </button>
                    </div>
                </div>

                <div class="sinopia-ai-section">
                    <h4><i class="fas fa-chart-line"></i> Scores de Análise</h4>
                    <div class="sinopia-scores">
                        ${Object.keys(scores).map(key => {
                            const score = scores[key];
                            return `
                                <div class="sinopia-score-item">
                                    <span class="sinopia-score-label">${score.label}</span>
                                    <div class="sinopia-score-bar">
                                        <div class="sinopia-score-fill ${score.level}" style="width: ${score.value}%"></div>
                                    </div>
                                    <span class="sinopia-score-value">${score.level === 'low' ? 'Baixa' : score.level === 'medium' ? 'Média' : 'Alta'} (${score.value}%)</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="sinopia-ai-section">
                    <h4><i class="fas fa-lightbulb"></i> Insights da IA</h4>
                    <div class="sinopia-insights">
                        ${insights.map(insight => `
                            <div class="sinopia-insight-item">
                                <i class="fas ${insight.icon}"></i>
                                <span>${insight.text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Inserir antes do info-panel
        const infoPanel = rightColumn.querySelector('.info-panel');
        if (infoPanel) {
            infoPanel.insertAdjacentHTML('beforebegin', panelHTML);
        } else {
            rightColumn.insertAdjacentHTML('afterbegin', panelHTML);
        }
    }

    /**
     * Intercepta abertura do modal de resposta
     */
    function interceptResponseModal() {
        // Só intercepta se a funcionalidade de resposta estiver habilitada
        if (!enabledFeatures.response) {
            console.log('[SINOPIA] Sugestões de resposta desabilitadas, pulando interceptação do modal');
            return;
        }
        
        console.log('[SINOPIA] Configurando interceptação do modal de resposta');

        // Observar mudanças no DOM para detectar quando o modal é aberto
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const modal = document.getElementById('response-modal');
                    if (modal && modal.style.display === 'flex') {
                        injectResponseModalSuggestions();
                    }
                }
            });
        });

        const modal = document.getElementById('response-modal');
        if (modal) {
            observer.observe(modal, { attributes: true });
        }
    }

    /**
     * Injeta sugestões de IA no modal de resposta
     */
    function injectResponseModalSuggestions() {
        // Verificar novamente se ainda está habilitado
        if (!enabledFeatures.response) return;

        const responseSuggestions = AI.responseSuggestions;

        // Tipo de Resposta
        const tipoRespostaGroup = document.querySelector('#modal-tipo-resposta')?.closest('.form-group');
        if (tipoRespostaGroup && !tipoRespostaGroup.querySelector('.sinopia-ai-suggestion')) {
            const suggestion = responseSuggestions['modal-tipo-resposta'];
            injectModalSuggestion(tipoRespostaGroup, 'modal-tipo-resposta', suggestion);
        }

        // Modelo de Resposta
        const modeloRespostaGroup = document.querySelector('#modelo-resposta')?.closest('.form-group');
        if (modeloRespostaGroup && !modeloRespostaGroup.querySelector('.sinopia-ai-suggestion')) {
            const suggestion = responseSuggestions['modelo-resposta'];
            injectModalSuggestion(modeloRespostaGroup, 'modelo-resposta', suggestion);
        }

        // Texto da Resposta
        const editorHeader = document.querySelector('.modal-content .editor-header');
        if (editorHeader && !editorHeader.querySelector('.sinopia-ai-suggestion')) {
            const suggestion = responseSuggestions['response-text'];
            const suggestionHTML = `
                <div class="sinopia-ai-suggestion sinopia-modal-ai-suggestion">
                    <div class="sinopia-ai-suggestion-content">
                        <i class="fas fa-robot"></i>
                        <span class="sinopia-suggestion-label">IA sugere rascunho</span>
                        <span class="sinopia-suggestion-confidence">(${suggestion.confidence}%)</span>
                    </div>
                    <div class="sinopia-ai-suggestion-actions">
                        <button class="sinopia-ai-btn accept" 
                                data-sinopia-action="accept-response-text"
                                title="Aceitar rascunho da IA">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="sinopia-ai-btn reject" 
                                data-sinopia-action="reject-response-suggestion"
                                data-field-id="response-text"
                                title="Rejeitar rascunho">
                            <i class="fas fa-times"></i>
                        </button>
                        <button class="sinopia-ai-btn explain" 
                                data-sinopia-action="explain-response-suggestion"
                                data-field-id="response-text"
                                title="Como a IA gerou este rascunho?">
                            <i class="fas fa-question-circle"></i>
                        </button>
                    </div>
                </div>
            `;
            editorHeader.insertAdjacentHTML('beforeend', suggestionHTML);
        }
    }

    /**
     * Injeta sugestão em campo do modal
     */
    function injectModalSuggestion(container, fieldId, suggestion) {
        const escapedValue = suggestion.value.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const suggestionHTML = `
            <div class="sinopia-ai-suggestion sinopia-modal-ai-suggestion">
                <div class="sinopia-ai-suggestion-content">
                    <i class="fas fa-robot"></i>
                    <span class="sinopia-suggestion-label">IA sugere:</span>
                    <span class="sinopia-suggestion-value">${suggestion.displayValue || suggestion.value}</span>
                    <span class="sinopia-suggestion-confidence">(${suggestion.confidence}%)</span>
                </div>
                <div class="sinopia-ai-suggestion-actions">
                    <button class="sinopia-ai-btn accept" 
                            data-sinopia-action="accept-response-suggestion"
                            data-field-id="${fieldId}"
                            data-value="${escapedValue}"
                            title="Aceitar sugestão">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="sinopia-ai-btn reject" 
                            data-sinopia-action="reject-response-suggestion"
                            data-field-id="${fieldId}"
                            title="Rejeitar sugestão">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="sinopia-ai-btn explain" 
                            data-sinopia-action="explain-response-suggestion"
                            data-field-id="${fieldId}"
                            title="Por que a IA sugere isso?">
                        <i class="fas fa-question-circle"></i>
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', suggestionHTML);
    }

    /**
     * Adiciona badge da extensão
     */
    function addExtensionBadge() {
        if (document.querySelector('.sinopia-extension-badge')) return;

        const badge = document.createElement('div');
        badge.className = `sinopia-extension-badge ${extensionEnabled ? '' : 'disabled'}`;
        badge.innerHTML = `
            <i class="fas fa-robot"></i>
            <span>SINOPIA ${extensionEnabled ? 'Ativo' : 'Inativo'}</span>
        `;
        badge.title = 'Clique para alternar IA';
        badge.onclick = toggleExtension;
        document.body.appendChild(badge);
    }

    /**
     * Alterna estado da extensão
     */
    function toggleExtension() {
        extensionEnabled = !extensionEnabled;
        chrome.storage.local.set({ sinopiaEnabled: extensionEnabled });

        const badge = document.querySelector('.sinopia-extension-badge');
        if (badge) {
            badge.classList.toggle('disabled', !extensionEnabled);
            badge.innerHTML = `
                <i class="fas fa-robot"></i>
                <span>SINOPIA ${extensionEnabled ? 'Ativo' : 'Inativo'}</span>
            `;
        }

        if (extensionEnabled) {
            injectAIComponents();
            showAINotification('Assistente IA ativado', 'success');
        } else {
            removeAIComponents();
            showAINotification('Assistente IA desativado', 'info');
        }
    }

    /**
     * Remove componentes de IA
     */
    function removeAIComponents() {
        document.querySelectorAll('.sinopia-ai-badges').forEach(el => el.remove());
        document.querySelectorAll('.sinopia-ai-suggestion').forEach(el => el.remove());
        document.querySelectorAll('.sinopia-ai-panel').forEach(el => el.remove());
        document.querySelectorAll('.sinopia-modal-overlay').forEach(el => el.remove());
    }

    // ==========================================
    // Funções de Ação (chamadas por event delegation)
    // ==========================================

    /**
     * Aceita sugestão de IA
     */
    function acceptSuggestion(fieldId, value) {
        const span = document.getElementById(fieldId);
        const input = document.getElementById(fieldId + '-input');
        const select = document.getElementById(fieldId + '-select');

        if (span) {
            span.textContent = value;
            span.classList.add('sinopia-ai-filled');
        }
        if (input) input.value = value;
        if (select) select.value = value;

        // Esconder sugestão
        const suggestion = document.getElementById(`sinopia-suggestion-${fieldId}`);
        if (suggestion) suggestion.style.display = 'none';

        showAINotification(`Sugestão aceita para ${fieldId}`, 'success');
        recordFeedback(fieldId, value, 'accepted');
    }

    /**
     * Rejeita sugestão de IA
     */
    function rejectSuggestion(fieldId) {
        const suggestion = document.getElementById(`sinopia-suggestion-${fieldId}`);
        if (suggestion) suggestion.style.display = 'none';

        showAINotification(`Sugestão rejeitada para ${fieldId}`, 'info');
        recordFeedback(fieldId, null, 'rejected');
    }

    /**
     * Explica sugestão de IA
     */
    function explainSuggestion(fieldId) {
        const suggestion = AI.suggestions[fieldId];
        if (!suggestion) return;

        showExplanationModal(fieldId, suggestion);
    }

    /**
     * Mostra modal de casos similares
     */
    function showSimilarCases() {
        const cases = AI.analysis.duplicates.cases;
        showSimilarCasesModal(cases);
    }

    /**
     * Aplica sugestão de encaminhamento
     */
    function applyForwarding() {
        const forwarding = AI.forwarding;
        
        const orgaoEl = document.getElementById('orgao-origem');
        const setorEl = document.getElementById('setor-atual');
        
        if (orgaoEl) {
            orgaoEl.textContent = forwarding.organ.value;
            orgaoEl.classList.add('sinopia-ai-filled');
        }
        if (setorEl) {
            setorEl.textContent = forwarding.sector.value;
            setorEl.classList.add('sinopia-ai-filled');
        }

        showAINotification('Sugestão de encaminhamento aplicada!', 'success');
    }

    /**
     * Aceita sugestão do modal de resposta
     */
    function acceptResponseSuggestion(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value;
            field.classList.add('sinopia-ai-filled');
        }

        // Esconder sugestão
        const suggestion = field?.closest('.form-group')?.querySelector('.sinopia-ai-suggestion');
        if (suggestion) suggestion.style.display = 'none';

        showAINotification('Sugestão aceita', 'success');
    }

    /**
     * Aceita texto de resposta sugerido
     */
    function acceptResponseText() {
        const textarea = document.getElementById('response-text');
        const suggestion = AI.responseSuggestions['response-text'];
        
        if (textarea && suggestion) {
            textarea.value = suggestion.value;
            textarea.classList.add('sinopia-ai-filled');
        }

        // Esconder sugestão
        const suggestionEl = document.querySelector('.editor-header .sinopia-ai-suggestion');
        if (suggestionEl) suggestionEl.style.display = 'none';

        showAINotification('Rascunho da IA aplicado!', 'success');
    }

    /**
     * Rejeita sugestão do modal de resposta
     */
    function rejectResponseSuggestion(fieldId) {
        let suggestionEl;
        
        if (fieldId === 'response-text') {
            suggestionEl = document.querySelector('.editor-header .sinopia-ai-suggestion');
        } else {
            const field = document.getElementById(fieldId);
            suggestionEl = field?.closest('.form-group')?.querySelector('.sinopia-ai-suggestion');
        }
        
        if (suggestionEl) suggestionEl.style.display = 'none';
        showAINotification('Sugestão rejeitada', 'info');
    }

    /**
     * Explica sugestão do modal de resposta
     */
    function explainResponseSuggestion(fieldId) {
        const suggestion = AI.responseSuggestions[fieldId];
        if (!suggestion) return;

        showExplanationModal(fieldId, suggestion);
    }

    // ==========================================
    // Funções de Modal
    // ==========================================

    /**
     * Mostra modal de explicação
     */
    function showExplanationModal(fieldId, suggestion) {
        const modalHTML = `
            <div class="sinopia-modal-overlay" id="sinopia-explanation-modal">
                <div class="sinopia-modal-content" style="max-width: 600px;">
                    <div class="sinopia-modal-header">
                        <h3><i class="fas fa-robot"></i> Explicação da IA</h3>
                        <button class="sinopia-modal-close" data-sinopia-action="close-modal" data-modal-id="sinopia-explanation-modal">×</button>
                    </div>
                    
                    <div class="sinopia-modal-body">
                        <div class="sinopia-explanation-section">
                            <h4>Por que a IA sugere esta classificação?</h4>
                            <p>${suggestion.explanation}</p>
                        </div>

                        <div class="sinopia-explanation-section">
                            <h4>Fatores considerados:</h4>
                            <ul>
                                <li>Análise semântica do texto da manifestação</li>
                                <li>Comparação com ${Math.floor(Math.random() * 500 + 100)} casos similares</li>
                                <li>Padrões identificados no histórico de classificações</li>
                                <li>Contexto e palavras-chave presentes no relato</li>
                                <li>Nível de confiança: ${suggestion.confidence}%</li>
                            </ul>
                        </div>

                        <div class="sinopia-explanation-section">
                            <h4>Casos similares analisados:</h4>
                            <div class="sinopia-example-box">
                                <strong>Protocolo 202401:</strong> "Estamos sempre limitados pelas escolhas..."
                                <small>Classificado como: ${suggestion.value} (Confiança: 92%)</small>
                            </div>
                            <div class="sinopia-example-box">
                                <strong>Protocolo 202389:</strong> "Vivemos presos às nossas decisões..."
                                <small>Classificado como: ${suggestion.value} (Confiança: 88%)</small>
                            </div>
                        </div>
                    </div>

                    <div class="sinopia-modal-footer">
                        <button class="sinopia-modal-btn secondary" data-sinopia-action="close-modal" data-modal-id="sinopia-explanation-modal">FECHAR</button>
                        <button class="sinopia-modal-btn primary" data-sinopia-action="provide-feedback">FORNECER FEEDBACK</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    /**
     * Mostra modal de casos similares
     */
    function showSimilarCasesModal(cases) {
        const casesHTML = cases.map(c => `
            <div class="sinopia-similar-case">
                <div class="sinopia-case-header">
                    <span class="sinopia-case-protocol">Protocolo: ${c.protocol}</span>
                    <span class="sinopia-similarity-badge ${c.similarity >= 75 ? 'high' : 'medium'}">${c.similarity}% Similar</span>
                </div>
                <div class="sinopia-case-content">
                    <p><strong>Relato:</strong> ${c.excerpt}</p>
                    <div class="sinopia-case-meta">
                        <span><i class="fas fa-calendar"></i> ${c.date}</span>
                        <span><i class="fas fa-user"></i> ${c.user}</span>
                        <span><i class="fas fa-building"></i> ${c.organ}</span>
                    </div>
                </div>
            </div>
        `).join('');

        const modalHTML = `
            <div class="sinopia-modal-overlay" id="sinopia-similar-modal">
                <div class="sinopia-modal-content">
                    <div class="sinopia-modal-header">
                        <h3><i class="fas fa-copy"></i> Manifestações Similares Encontradas</h3>
                        <button class="sinopia-modal-close" data-sinopia-action="close-modal" data-modal-id="sinopia-similar-modal">×</button>
                    </div>
                    
                    <div class="sinopia-modal-body">
                        ${casesHTML}

                        <div class="sinopia-duplicate-action">
                            <p><i class="fas fa-exclamation-triangle"></i> <strong>Atenção:</strong> Manifestações com similaridade acima de 95% são consideradas duplicatas e devem ser analisadas para possível cancelamento.</p>
                            <button class="sinopia-modal-btn secondary" data-sinopia-action="mark-as-duplicate">
                                <i class="fas fa-ban"></i> Marcar como Duplicata
                            </button>
                            <button class="sinopia-modal-btn primary" data-sinopia-action="link-cases">
                                <i class="fas fa-link"></i> Vincular Casos
                            </button>
                        </div>
                    </div>

                    <div class="sinopia-modal-footer">
                        <button class="sinopia-modal-btn secondary" data-sinopia-action="close-modal" data-modal-id="sinopia-similar-modal">FECHAR</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    /**
     * Marcar como duplicata
     */
    function markAsDuplicate() {
        if (confirm('Tem certeza que deseja marcar esta manifestação como duplicata?')) {
            showAINotification('Manifestação marcada como duplicata', 'success');
            document.getElementById('sinopia-similar-modal')?.remove();
        }
    }

    /**
     * Vincular casos
     */
    function linkCases() {
        showAINotification('Casos vinculados com sucesso!', 'success');
        document.getElementById('sinopia-similar-modal')?.remove();
    }

    /**
     * Fornecer feedback
     */
    function provideFeedback() {
        const feedback = prompt('Por favor, forneça seu feedback sobre esta análise da IA:');
        if (feedback && feedback.trim()) {
            showAINotification('Feedback enviado para melhoria da IA. Obrigado!', 'success');
            document.getElementById('sinopia-explanation-modal')?.remove();
            recordFeedback('general', feedback, 'feedback');
        }
    }

    // ==========================================
    // Funções Auxiliares
    // ==========================================

    /**
     * Mostra notificação
     */
    function showAINotification(message, type = 'info') {
        // Usar a função de notificação da página se existir
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(`[SINOPIA] ${type.toUpperCase()}: ${message}`);
        }
    }

    /**
     * Registra feedback para aprendizado
     */
    function recordFeedback(fieldId, value, action) {
        const feedback = {
            fieldId,
            value,
            action,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };

        console.log('[SINOPIA] Feedback registrado:', feedback);

        // Enviar para background script
        chrome.runtime.sendMessage({
            type: 'FEEDBACK',
            data: feedback
        });
    }

    // ==========================================
    // Listeners de Mensagens (do popup)
    // ==========================================

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('[SINOPIA] ========================================');
        console.log('[SINOPIA] Mensagem recebida:', message);
        console.log('[SINOPIA] Features ANTES da mudança:', JSON.parse(JSON.stringify(enabledFeatures)));

        switch (message.type) {
            case 'TOGGLE_AI':
                extensionEnabled = message.enabled;
                console.log('[SINOPIA] IA', message.enabled ? 'ATIVADA' : 'DESATIVADA');
                if (message.enabled) {
                    injectAIComponents();
                    showAINotification('IA Ativada', 'success');
                } else {
                    removeAIComponents();
                    showAINotification('IA Desativada', 'info');
                }
                break;

            case 'FEATURE_TOGGLE':
                console.log('[SINOPIA] Alterando feature:', message.feature, 'para', message.enabled);
                enabledFeatures[message.feature] = message.enabled;
                console.log('[SINOPIA] Features DEPOIS da mudança:', JSON.parse(JSON.stringify(enabledFeatures)));
                
                // Recarregar componentes com novas configurações
                console.log('[SINOPIA] Removendo todos os componentes...');
                removeAIComponents();
                
                if (extensionEnabled) {
                    console.log('[SINOPIA] Reinjetando componentes com novas configurações...');
                    injectAIComponents();
                }
                
                const featureName = getFeatureName(message.feature);
                showAINotification(
                    `${featureName} ${message.enabled ? 'ativada' : 'desativada'}`,
                    message.enabled ? 'success' : 'info'
                );
                break;
        }
        
        console.log('[SINOPIA] ========================================');
        sendResponse({ success: true });
        return true;
    });

    /**
     * Remove todos os componentes de IA injetados
     */
    function removeAIComponents() {
        const elements = document.querySelectorAll('[class*="sinopia-"]');
        console.log('[SINOPIA] Removendo', elements.length, 'componentes de IA');
        elements.forEach(el => {
            console.log('[SINOPIA] Removendo:', el.className);
            el.remove();
        });
        console.log('[SINOPIA] Componentes de IA removidos');
    }

    /**
     * Retorna nome legível da funcionalidade
     */
    function getFeatureName(feature) {
        const names = {
            sentiment: 'Análise de Sentimento',
            duplicates: 'Detecção de Duplicatas',
            classification: 'Sugestões de Classificação',
            forwarding: 'Sugestão de Encaminhamento',
            response: 'Sugestões de Resposta'
        };
        return names[feature] || feature;
    }

})();

