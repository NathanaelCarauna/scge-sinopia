// JavaScript para a página de detalhes do atendimento

// Estado atual do caso (pode ser alterado via URL params ou seleção)
let currentState = {
    stage: 3, // 1: Recebido, 2: Aguardando resposta, 3: Aguardando retorno, 4: Concluído
    protocol: '202475',
    modalidade: 'ACESSO À INFORMAÇÃO',
    tipo: 'PEDIDO DE INFORMAÇÃO DE DADOS PESSOAIS'
};

// Configurações para diferentes estágios
const stageConfigurations = {
    1: { // Recebido
        actions: ['VOLTAR', 'CLASSIFICAR'],
        showEditor: false,
        title: 'MANIFESTAÇÃO 20230',
        modalidade: 'MANIFESTAÇÃO',
        tipo: 'RECLAMAÇÃO'
    },
    2: { // Aguardando resposta
        actions: ['VOLTAR', 'CLASSIFICAR', 'ENCAMINHAR'],
        showEditor: false,
        title: 'ACESSO À INFORMAÇÃO 20239',
        modalidade: 'ACESSO À INFORMAÇÃO',
        tipo: 'PEDIDO DE INFORMAÇÃO DE DADOS PESSOAIS'
    },
    3: { // Aguardando retorno do cidadão
        actions: ['VOLTAR', 'CLASSIFICAR', 'ENCAMINHAR', 'RESPONDER', 'CANCELAR'],
        showEditor: false,
        title: 'PEDIDO DE INFORMAÇÃO DE DADOS PESSOAIS 202475',
        modalidade: 'ACESSO À INFORMAÇÃO',
        tipo: 'RECURSO DE 2ª INSTÂNCIA DE DADOS PÚBLICOS'
    },
    4: { // Concluído (com editor)
        actions: ['VOLTAR', 'CLASSIFICAR', 'REABRIR'],
        showEditor: true,
        title: 'PEDIDO DE INFORMAÇÃO DE DADOS PESSOAIS 202475',
        modalidade: 'ACESSO À INFORMAÇÃO',
        tipo: 'PEDIDO DE INFORMAÇÃO DE DADOS PESSOAIS'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeDetailsPage();
    setupTabs();
    setupEditor();
    setupStageNavigation();
    
    // Verificar se há parâmetros na URL
    const urlParams = new URLSearchParams(window.location.search);
    const protocol = urlParams.get('protocol');
    const stage = urlParams.get('stage');
    
    if (protocol) {
        currentState.protocol = protocol;
    }
    
    if (stage) {
        currentState.stage = parseInt(stage);
        updateStageDisplay();
    }
});

function initializeDetailsPage() {
    updateStageDisplay();
    updatePageContent();
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Special handling for communication tab (show editor)
            if (targetTab === 'comunicacao') {
                showTextEditor();
            } else {
                hideTextEditor();
            }
        });
    });
}

function setupEditor() {
    const editorButtons = document.querySelectorAll('.editor-btn');
    
    editorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const command = this.dataset.command;
            
            // Toggle active state
            this.classList.toggle('active');
            
            // Apply formatting
            document.execCommand(command, false, null);
            
            // Keep focus on editor
            document.getElementById('editor-content').focus();
        });
    });
    
    // Editor content focus handling
    const editorContent = document.getElementById('editor-content');
    if (editorContent) {
        editorContent.addEventListener('focus', function() {
            this.style.backgroundColor = '#fefefe';
        });
        
        editorContent.addEventListener('blur', function() {
            this.style.backgroundColor = '';
        });
    }
}

function setupStageNavigation() {
    const stageItems = document.querySelectorAll('.stage-item');
    
    stageItems.forEach(item => {
        item.addEventListener('click', function() {
            const stage = parseInt(this.dataset.stage);
            
            // Don't allow navigating to future stages
            if (stage <= currentState.stage + 1) {
                currentState.stage = stage;
                updateStageDisplay();
                updatePageContent();
            }
        });
    });
}

function updateStageDisplay() {
    const stageItems = document.querySelectorAll('.stage-item');
    
    stageItems.forEach((item, index) => {
        const stageNumber = index + 1;
        
        // Remove all classes
        item.classList.remove('active', 'completed');
        
        if (stageNumber < currentState.stage) {
            item.classList.add('completed');
        } else if (stageNumber === currentState.stage) {
            item.classList.add('active');
        }
    });
}

function updatePageContent() {
    const config = stageConfigurations[currentState.stage];
    if (!config) return;
    
    // Update title
    const pageTitle = document.getElementById('page-title');
    const protocolBreadcrumb = document.getElementById('protocol-breadcrumb');
    
    if (pageTitle) {
        pageTitle.textContent = config.title;
    }
    
    if (protocolBreadcrumb) {
        protocolBreadcrumb.textContent = `PROTOCOLO DE ${config.title}`;
    }
    
    // Update case details
    updateCaseDetails(config);
    
    // Update action buttons
    updateActionButtons(config.actions);
    
    // Show/hide editor based on stage
    if (config.showEditor) {
        showTextEditor();
    } else {
        hideTextEditor();
    }
}

function updateCaseDetails(config) {
    // Update modalidade
    const modalidadeEl = document.getElementById('modalidade');
    if (modalidadeEl) {
        modalidadeEl.textContent = config.modalidade;
    }
    
    // Update tipo
    const tipoEl = document.getElementById('tipo');
    if (tipoEl) {
        tipoEl.textContent = config.tipo;
    }
    
    // Update other fields based on stage
    const stageSpecificUpdates = {
        1: () => {
            document.getElementById('etapa').textContent = 'Recebido';
            document.getElementById('situacao').textContent = 'Aguardando classificação';
        },
        2: () => {
            document.getElementById('etapa').textContent = 'Aguardando resposta';
            document.getElementById('situacao').textContent = 'Encaminhada para órgão';
        },
        3: () => {
            document.getElementById('etapa').textContent = 'Aguardando retorno do cidadão';
            document.getElementById('situacao').textContent = 'Respondida pela Ouvidoria de Rede';
        },
        4: () => {
            document.getElementById('etapa').textContent = 'Concluído';
            document.getElementById('situacao').textContent = 'Caso encerrado';
            document.getElementById('data-conclusao').textContent = '10/06/2025 14:30';
        }
    };
    
    if (stageSpecificUpdates[currentState.stage]) {
        stageSpecificUpdates[currentState.stage]();
    }
}

function updateActionButtons(actions) {
    const bottomActions = document.getElementById('bottom-actions');
    const allButtons = bottomActions.querySelectorAll('.action-btn');
    
    // Hide all buttons first
    allButtons.forEach(btn => {
        btn.style.display = 'none';
    });
    
    // Show only the buttons for this stage
    actions.forEach(action => {
        const button = findButtonByAction(action);
        if (button) {
            button.style.display = 'inline-block';
        }
    });
}

function findButtonByAction(action) {
    const buttonMap = {
        'VOLTAR': 'goBack()',
        'CLASSIFICAR': 'classifyCase()',
        'ENCAMINHAR': 'forwardCase()',
        'RESPONDER': 'respondCase()',
        'CANCELAR': 'cancelCase()',
        'REABRIR': 'reopenCase()'
    };
    
    const onclick = buttonMap[action];
    if (!onclick) return null;
    
    return document.querySelector(`[onclick="${onclick}"]`);
}

function showTextEditor() {
    const editor = document.getElementById('text-editor');
    if (editor) {
        editor.style.display = 'block';
    }
}

function hideTextEditor() {
    const editor = document.getElementById('text-editor');
    if (editor) {
        editor.style.display = 'none';
    }
}

// Action Functions
function showDetails() {
    // Switch to details view (already in ATENDIMENTO tab)
    const atendimentoTab = document.querySelector('[data-tab="atendimento"]');
    if (atendimentoTab) {
        atendimentoTab.click();
    }
    
    showNotification('Exibindo detalhes do atendimento', 'info');
}

function showHistory() {
    // Switch to communication tab for history
    const comunicacaoTab = document.querySelector('[data-tab="comunicacao"]');
    if (comunicacaoTab) {
        comunicacaoTab.click();
    }
    
    showNotification('Exibindo histórico do atendimento', 'info');
}

function printDetails() {
    showNotification('Preparando para impressão...', 'info');
    setTimeout(() => {
        window.print();
    }, 500);
}

function goBack() {
    window.location.href = 'atendimentos.html';
}

function classifyCase() {
    const isEditing = document.querySelector('.editable-field.editing');
    
    if (isEditing) {
        // Se já estiver editando, não faça nada
        showNotification('Modo de classificação já está ativo', 'warning');
        return;
    }
    
    // Ativar modo de edição
    enableClassificationMode();
    showNotification('Modo de classificação ativado. Você pode editar os campos agora.', 'info');
}

function respondCase() {
    openResponseModal();
}

function cancelCase() {
    if (confirm('Tem certeza que deseja cancelar este atendimento?')) {
        showNotification('Atendimento cancelado', 'success');
        setTimeout(() => {
            goBack();
        }, 1500);
    }
}

function reopenCase() {
    if (confirm('Tem certeza que deseja reabrir este atendimento?')) {
        currentState.stage = 2; // Volta para "Aguardando resposta"
        updateStageDisplay();
        updatePageContent();
        showNotification('Atendimento reaberto', 'success');
    }
}

// Notification system (reuse from atendimentos.js)
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Export functions for global access
window.showDetails = showDetails;
window.showHistory = showHistory;
window.printDetails = printDetails;
window.goBack = goBack;
window.classifyCase = classifyCase;
window.forwardCase = forwardCase;
window.respondCase = respondCase;
window.cancelCase = cancelCase;
window.reopenCase = reopenCase;
window.saveClassification = saveClassification;
window.cancelClassification = cancelClassification;

// Classification mode functions
let originalValues = {};

function enableClassificationMode() {
    // Store original values
    originalValues = {};
    
    // Get all editable fields
    const editableFields = [
        'modalidade', 'tipo', 'origem', 'assunto', 'subassunto', 'palavras-chave',
        'tipo-resposta', 'motivo-negativa', 'conformidade', 'ajustes-oge'
    ];
    
    editableFields.forEach(fieldId => {
        const span = document.getElementById(fieldId);
        const select = document.getElementById(fieldId + '-select');
        const input = document.getElementById(fieldId + '-input');
        
        if (span) {
            // Store original value
            originalValues[fieldId] = span.textContent;
            
            // Add editing class
            span.classList.add('editing');
            
            // Hide span and show input/select
            span.style.display = 'none';
            
            if (select) {
                select.style.display = 'block';
                select.value = span.textContent;
            } else if (input) {
                input.style.display = 'block';
                input.value = span.textContent;
            }
        }
    });
    
    // Add classification mode visual style
    const leftColumn = document.querySelector('.left-column');
    if (leftColumn) {
        leftColumn.classList.add('classification-mode');
    }
    
    // Show classification actions
    const actions = document.getElementById('classification-actions');
    if (actions) {
        actions.classList.add('show');
    }
}

function disableClassificationMode() {
    // Get all editable fields
    const editableFields = [
        'modalidade', 'tipo', 'origem', 'assunto', 'subassunto', 'palavras-chave',
        'tipo-resposta', 'motivo-negativa', 'conformidade', 'ajustes-oge'
    ];
    
    editableFields.forEach(fieldId => {
        const span = document.getElementById(fieldId);
        const select = document.getElementById(fieldId + '-select');
        const input = document.getElementById(fieldId + '-input');
        
        if (span) {
            // Remove editing class
            span.classList.remove('editing');
            
            // Show span and hide input/select
            span.style.display = 'inline';
            
            if (select) {
                select.style.display = 'none';
            } else if (input) {
                input.style.display = 'none';
            }
        }
    });
    
    // Remove classification mode visual style
    const leftColumn = document.querySelector('.left-column');
    if (leftColumn) {
        leftColumn.classList.remove('classification-mode');
    }
    
    // Hide classification actions
    const actions = document.getElementById('classification-actions');
    if (actions) {
        actions.classList.remove('show');
    }
}

function saveClassification() {
    // Get all editable fields and update spans with new values
    const editableFields = [
        'modalidade', 'tipo', 'origem', 'assunto', 'subassunto', 'palavras-chave',
        'tipo-resposta', 'motivo-negativa', 'conformidade', 'ajustes-oge'
    ];
    
    editableFields.forEach(fieldId => {
        const span = document.getElementById(fieldId);
        const select = document.getElementById(fieldId + '-select');
        const input = document.getElementById(fieldId + '-input');
        
        if (span) {
            let newValue = '';
            
            if (select && select.style.display !== 'none') {
                newValue = select.value;
            } else if (input && input.style.display !== 'none') {
                newValue = input.value;
            }
            
            if (newValue) {
                span.textContent = newValue;
            }
        }
    });
    
    // Clear original values
    originalValues = {};
    
    // Disable classification mode
    disableClassificationMode();
    
    showNotification('Classificação salva com sucesso!', 'success');
}

function cancelClassification() {
    // Restore original values
    Object.keys(originalValues).forEach(fieldId => {
        const span = document.getElementById(fieldId);
        if (span) {
            span.textContent = originalValues[fieldId];
        }
    });
    
    // Clear original values
    originalValues = {};
    
    // Disable classification mode
    disableClassificationMode();
    
    showNotification('Classificação cancelada. Valores originais restaurados.', 'info');
}

// Modal Functions
function openResponseModal() {
    const modal = document.getElementById('response-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Focus no primeiro campo
        const firstField = document.getElementById('tipo-resposta');
        if (firstField) {
            setTimeout(() => firstField.focus(), 100);
        }
        
        // Fechar modal clicando fora
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeResponseModal();
            }
        });
        
        // Fechar modal com ESC
        document.addEventListener('keydown', function handleEscape(e) {
            if (e.key === 'Escape') {
                closeResponseModal();
                document.removeEventListener('keydown', handleEscape);
            }
        });
    }
}

function closeResponseModal() {
    const modal = document.getElementById('response-modal');
    if (modal) {
        modal.style.display = 'none';
        
        // Limpar campos do formulário
        document.getElementById('tipo-resposta').value = '';
        document.getElementById('para-cidadao').value = '';
        document.getElementById('modelo-resposta').value = '';
        document.getElementById('response-text').value = '';
    }
}

function saveResponse() {
    const tipoResposta = document.getElementById('tipo-resposta').value;
    const paraCidadao = document.getElementById('para-cidadao').value;
    const modeloResposta = document.getElementById('modelo-resposta').value;
    const textoResposta = document.getElementById('response-text').value;
    
    // Validação básica
    if (!tipoResposta) {
        showNotification('Por favor, selecione o tipo de resposta', 'error');
        return;
    }
    
    if (!textoResposta.trim()) {
        showNotification('Por favor, digite o texto da resposta', 'error');
        return;
    }
    
    // Simular salvamento
    showNotification('Resposta salva com sucesso!', 'success');
    
    // Fechar modal
    closeResponseModal();
    
    // Atualizar status ou navegar para próximo estágio se necessário
    // Por exemplo, mudar para estágio "Aguardando retorno do cidadão"
    setTimeout(() => {
        updateStageDisplay(3); // Estágio "Aguardando retorno do cidadão"
        showNotification('Atendimento atualizado para "Aguardando retorno do cidadão"', 'info');
    }, 1000);
}

// File upload functionality
document.addEventListener('DOMContentLoaded', function() {
    const fileUploadArea = document.querySelector('.file-upload-area');
    const fileInput = fileUploadArea?.querySelector('input[type="file"]');
    
    if (fileUploadArea && fileInput) {
        fileUploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                const fileNames = files.map(f => f.name).join(', ');
                showNotification(`Arquivo(s) selecionado(s): ${fileNames}`, 'success');
            }
        });
        
        // Drag and drop
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#3b82f6';
            fileUploadArea.style.background = '#f8faff';
        });
        
        fileUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#d1d5db';
            fileUploadArea.style.background = '';
        });
        
        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#d1d5db';
            fileUploadArea.style.background = '';
            
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                const fileNames = files.map(f => f.name).join(', ');
                showNotification(`Arquivo(s) adicionado(s): ${fileNames}`, 'success');
            }
        });
    }
    
    // Editor toolbar functionality
    const editorBtns = document.querySelectorAll('.editor-btn');
    const responseText = document.getElementById('response-text');
    
    editorBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const command = this.querySelector('i').classList.contains('fa-bold') ? 'bold' :
                          this.querySelector('i').classList.contains('fa-italic') ? 'italic' :
                          this.querySelector('i').classList.contains('fa-underline') ? 'underline' : null;
            
            if (command && responseText) {
                // Toggle active state
                this.classList.toggle('active');
                
                // Simular formatação (em um editor real usaria execCommand ou similar)
                showNotification(`Formatação ${command} aplicada`, 'info');
            }
        });
    });
});

// Forward Mode Functions
let forwardModeActive = false;
let originalForwardValues = {};

function enableForwardMode() {
    if (forwardModeActive) return;
    
    forwardModeActive = true;
    
    // Salvar valores originais
    const gestorRow = document.querySelector('#gestor').closest('.info-row');
    const paraCidadaoRow = document.querySelector('#para-cidadao-span').closest('.info-row');
    
    originalForwardValues = {
        'gestor': document.getElementById('gestor').textContent,
        'para-cidadao-span': document.getElementById('para-cidadao-span').textContent
    };
    
    // Ativar modo de edição
    gestorRow.classList.add('forward-mode');
    paraCidadaoRow.classList.add('forward-mode');
    
    // Mostrar botões de encaminhamento
    document.getElementById('forward-actions').style.display = 'flex';
    document.getElementById('bottom-actions').style.display = 'none';
    
    showNotification('Modo de encaminhamento ativado. Selecione o gestor e configurações.', 'info');
}

function disableForwardMode() {
    if (!forwardModeActive) return;
    
    forwardModeActive = false;
    
    // Remover modo de edição
    const gestorRow = document.querySelector('#gestor').closest('.info-row');
    const paraCidadaoRow = document.querySelector('#para-cidadao-span').closest('.info-row');
    
    gestorRow.classList.remove('forward-mode');
    paraCidadaoRow.classList.remove('forward-mode');
    
    // Esconder botões de encaminhamento
    document.getElementById('forward-actions').style.display = 'none';
    document.getElementById('bottom-actions').style.display = 'flex';
}

function saveForward() {
    const gestorSelect = document.getElementById('gestor-select');
    const paraCidadaoSelect = document.getElementById('para-cidadao-select');
    
    // Validação
    if (!gestorSelect.value) {
        showNotification('Por favor, selecione um gestor para encaminhamento', 'error');
        return;
    }
    
    if (!paraCidadaoSelect.value) {
        showNotification('Por favor, selecione se é para cidadão', 'error');
        return;
    }
    
    // Atualizar valores exibidos
    const gestorOptions = {
        'gestor1': 'Gestor Administrativo',
        'gestor2': 'Gestor Técnico', 
        'gestor3': 'Gestor de Atendimento',
        'gestor4': 'Supervisor de Setor'
    };
    
    const paraCidadaoOptions = {
        'sim': 'Sim',
        'nao': 'Não'
    };
    
    document.getElementById('gestor').textContent = gestorOptions[gestorSelect.value] || gestorSelect.value;
    document.getElementById('para-cidadao-span').textContent = paraCidadaoOptions[paraCidadaoSelect.value] || paraCidadaoSelect.value;
    
    // Atualizar informações de encaminhamento
    document.getElementById('encaminhado-em').textContent = new Date().toLocaleString('pt-BR');
    document.getElementById('etapa').textContent = 'Encaminhado para gestão';
    
    // Limpar valores dos selects
    gestorSelect.value = '';
    paraCidadaoSelect.value = '';
    
    // Limpar valores originais
    originalForwardValues = {};
    
    // Desativar modo de encaminhamento
    disableForwardMode();
    
    showNotification('Encaminhamento salvo com sucesso!', 'success');
    
    // Simular mudança de estágio
    setTimeout(() => {
        updateStageDisplay(2); // Estágio "Aguardando resposta"
        showNotification('Atendimento encaminhado para o gestor selecionado', 'info');
    }, 1000);
}

function cancelForward() {
    // Restaurar valores originais se existirem
    Object.keys(originalForwardValues).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element && originalForwardValues[fieldId]) {
            element.textContent = originalForwardValues[fieldId];
        }
    });
    
    // Limpar valores dos selects
    document.getElementById('gestor-select').value = '';
    document.getElementById('para-cidadao-select').value = '';
    
    // Limpar valores originais
    originalForwardValues = {};
    
    // Desativar modo de encaminhamento
    disableForwardMode();
    
    showNotification('Encaminhamento cancelado. Valores originais restaurados.', 'info');
}

function forwardCase() {
    enableForwardMode();
}

// AI Integration Functions
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

const aiAnalysis = {
    sentiment: { value: 'Neutro', confidence: 75, color: 'neutral' },
    urgency: { value: 'Baixa', confidence: 80, color: 'low' },
    veracity: { value: 85, confidence: 85, color: 'high' },
    language: { value: 'Normal', confidence: 95, color: 'normal' },
    duplicates: { count: 2, similarities: [78, 65] }
};

function acceptAISuggestion(fieldId, value) {
    // Aplicar sugestão
    const fieldElement = document.getElementById(fieldId);
    if (fieldElement) {
        fieldElement.textContent = value;
        
        // Para campo de palavras-chave, também atualizar o input correspondente
        if (fieldId === 'palavras-chave') {
            const inputElement = document.getElementById('palavras-chave-input');
            if (inputElement) {
                inputElement.value = value;
            }
        }
        
        // Feedback visual
        fieldElement.style.background = '#dcfce7';
        fieldElement.style.padding = '4px 8px';
        fieldElement.style.borderRadius = '4px';
        
        setTimeout(() => {
            fieldElement.style.background = '';
            fieldElement.style.padding = '';
            fieldElement.style.borderRadius = '';
        }, 2000);
        
        // Esconder sugestão
        const suggestion = document.getElementById(fieldId + '-suggestion');
        if (suggestion) {
            suggestion.style.display = 'none';
        }
        
        // Registrar feedback positivo para aprendizado
        recordAIFeedback(fieldId, value, 'accepted');
        
        showNotification(`Sugestão da IA aceita para ${fieldId}`, 'success');
    }
}

function rejectAISuggestion(fieldId) {
    // Esconder sugestão
    const suggestion = document.getElementById(fieldId + '-suggestion');
    if (suggestion) {
        suggestion.style.display = 'none';
    }
    
    // Registrar feedback negativo para aprendizado
    const suggestedValue = aiSuggestions[fieldId]?.value;
    recordAIFeedback(fieldId, suggestedValue, 'rejected');
    
    showNotification(`Sugestão da IA rejeitada para ${fieldId}`, 'info');
}

function explainAISuggestion(fieldId) {
    const suggestion = aiSuggestions[fieldId];
    if (!suggestion) return;
    
    // Preencher modal de explicação
    document.getElementById('ai-explanation-content').innerHTML = suggestion.explanation;
    
    const factorsList = document.getElementById('ai-factors-list');
    factorsList.innerHTML = `
        <li>Análise semântica do texto da manifestação</li>
        <li>Comparação com ${Math.floor(Math.random() * 500 + 100)} casos similares</li>
        <li>Padrões identificados no histórico de classificações</li>
        <li>Contexto e palavras-chave presentes no relato</li>
        <li>Nível de confiança: ${suggestion.confidence}%</li>
    `;
    
    const examplesList = document.getElementById('ai-similar-examples');
    examplesList.innerHTML = `
        <div style="background: #f9fafb; padding: 12px; border-radius: 6px; margin-bottom: 8px;">
            <strong>Protocolo 202401:</strong> "Estamos sempre limitados pelas escolhas..."
            <br><small style="color: #6b7280;">Classificado como: ${suggestion.value} (Confiança: 92%)</small>
        </div>
        <div style="background: #f9fafb; padding: 12px; border-radius: 6px;">
            <strong>Protocolo 202389:</strong> "Vivemos presos às nossas decisões..."
            <br><small style="color: #6b7280;">Classificado como: ${suggestion.value} (Confiança: 88%)</small>
        </div>
    `;
    
    // Mostrar modal
    document.getElementById('ai-explanation-modal').style.display = 'flex';
}

function recordAIFeedback(fieldId, value, action) {
    // Simular registro de feedback para aprendizado da IA
    const feedback = {
        fieldId: fieldId,
        suggestedValue: value,
        action: action,
        timestamp: new Date().toISOString(),
        manifestationId: getCurrentManifestationId()
    };
    
    console.log('AI Feedback recorded:', feedback);
    
    // Em um sistema real, isso seria enviado para o backend
    // para retreinar ou ajustar os modelos de IA
}

function getCurrentManifestationId() {
    // Extrair ID da manifestação atual (simplificado)
    return '202475';
}

function showSimilarCases() {
    document.getElementById('similar-cases-modal').style.display = 'flex';
}

function closeSimilarCasesModal() {
    document.getElementById('similar-cases-modal').style.display = 'none';
}

function closeExplanationModal() {
    document.getElementById('ai-explanation-modal').style.display = 'none';
}

function applyForwardingSuggestion() {
    // Aplicar sugestões de encaminhamento da IA
    showNotification('Aplicando sugestão de encaminhamento da IA...', 'info');
    
    setTimeout(() => {
        // Simular aplicação das sugestões
        document.getElementById('orgao-origem').textContent = 'SECRETARIA DE DESENVOLVIMENTO SOCIAL';
        document.getElementById('setor-atual').textContent = 'DIRETORIA DE ATENDIMENTO AO CIDADÃO';
        document.getElementById('etapa').textContent = 'Encaminhado automaticamente';
        
        showNotification('Sugestão de encaminhamento aplicada com sucesso!', 'success');
    }, 1000);
}

function markAsDuplicate() {
    if (confirm('Tem certeza que deseja marcar esta manifestação como duplicata?')) {
        showNotification('Manifestação marcada como duplicata', 'success');
        closeSimilarCasesModal();
        
        // Simular ações de duplicata
        setTimeout(() => {
            showNotification('Processo de cancelamento por duplicata iniciado', 'info');
        }, 1000);
    }
}

function linkCases() {
    showNotification('Vinculando casos relacionados...', 'info');
    closeSimilarCasesModal();
    
    setTimeout(() => {
        showNotification('Casos vinculados com sucesso!', 'success');
    }, 1000);
}

function provideFeedback() {
    const feedback = prompt('Por favor, forneça seu feedback sobre esta análise da IA:');
    if (feedback && feedback.trim()) {
        showNotification('Feedback enviado para melhoria da IA. Obrigado!', 'success');
        closeExplanationModal();
        
        // Registrar feedback
        recordAIFeedback('general', 'feedback', feedback);
    }
}

// Auto-inicialização da análise IA
document.addEventListener('DOMContentLoaded', function() {
    // Simular carregamento da análise IA
    setTimeout(() => {
        initializeAIAnalysis();
    }, 1000);
});

function initializeAIAnalysis() {
    // Simular processamento da IA
    showNotification('IA processando manifestação...', 'info');
    
    setTimeout(() => {
        showNotification('Análise IA concluída! Sugestões disponíveis.', 'success');
        
        // Animar badges de análise
        const badges = document.querySelectorAll('.ai-badge');
        badges.forEach((badge, index) => {
            setTimeout(() => {
                badge.style.opacity = '0';
                badge.style.transform = 'translateY(10px)';
                badge.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    badge.style.opacity = '1';
                    badge.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
        
        // Animar sugestões
        const suggestions = document.querySelectorAll('.ai-suggestion');
        suggestions.forEach((suggestion, index) => {
            setTimeout(() => {
                suggestion.style.opacity = '0';
                suggestion.style.transform = 'translateX(20px)';
                suggestion.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    suggestion.style.opacity = '1';
                    suggestion.style.transform = 'translateX(0)';
                }, 50);
            }, (index + badges.length) * 100);
        });
    }, 2000);
}

// Melhorar funções existentes para integrar com IA
const originalClassifyCase = window.classifyCase;
window.classifyCase = function() {
    // Oferecer aplicar todas as sugestões da IA
    const applyAll = confirm('Deseja aplicar todas as sugestões da IA antes de editar manualmente?');
    
    if (applyAll) {
        Object.keys(aiSuggestions).forEach(fieldId => {
            if (document.getElementById(fieldId)) {
                acceptAISuggestion(fieldId, aiSuggestions[fieldId].value);
            }
        });
        
        setTimeout(() => {
            if (originalClassifyCase) originalClassifyCase();
        }, 1000);
    } else {
        if (originalClassifyCase) originalClassifyCase();
    }
};

// Response Modal AI Integration
const responseAISuggestions = {
    'tipo-resposta': { 
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

function acceptResponseAISuggestion(fieldId, value) {
    const suggestion = responseAISuggestions[fieldId];
    if (!suggestion) return;
    
    // Aplicar sugestão ao campo
    const fieldElement = document.getElementById(fieldId);
    if (fieldElement) {
        fieldElement.value = value;
        
        // Feedback visual
        fieldElement.style.background = '#dcfce7';
        fieldElement.style.transition = 'background 0.3s ease';
        
        setTimeout(() => {
            fieldElement.style.background = '';
        }, 2000);
        
        // Esconder sugestão
        const suggestionElement = document.getElementById(fieldId + '-suggestion');
        if (suggestionElement) {
            suggestionElement.style.display = 'none';
        }
        
        // Registrar feedback positivo
        recordAIFeedback('response-' + fieldId, value, 'accepted');
        
        showNotification(`Sugestão da IA aceita para ${fieldId.replace('-', ' ')}`, 'success');
    }
}

function acceptResponseTextSuggestion() {
    const suggestion = responseAISuggestions['response-text'];
    if (!suggestion) return;
    
    // Aplicar rascunho ao textarea
    const textArea = document.getElementById('response-text');
    if (textArea) {
        textArea.value = suggestion.value;
        
        // Feedback visual
        textArea.style.background = '#dcfce7';
        textArea.style.transition = 'background 0.3s ease';
        
        setTimeout(() => {
            textArea.style.background = '';
        }, 2000);
        
        // Esconder sugestão
        const suggestionElement = document.getElementById('response-text-suggestion');
        if (suggestionElement) {
            suggestionElement.style.display = 'none';
        }
        
        // Registrar feedback positivo
        recordAIFeedback('response-text', 'draft_generated', 'accepted');
        
        showNotification('Rascunho da IA aplicado com sucesso!', 'success');
    }
}

function rejectResponseAISuggestion(fieldId) {
    // Esconder sugestão
    const suggestionElement = document.getElementById(fieldId + '-suggestion');
    if (suggestionElement) {
        suggestionElement.style.display = 'none';
    }
    
    // Registrar feedback negativo
    const suggestion = responseAISuggestions[fieldId];
    const suggestedValue = suggestion ? suggestion.value : 'unknown';
    recordAIFeedback('response-' + fieldId, suggestedValue, 'rejected');
    
    showNotification(`Sugestão da IA rejeitada para ${fieldId.replace('-', ' ')}`, 'info');
}

function explainResponseAISuggestion(fieldId) {
    const suggestion = responseAISuggestions[fieldId];
    if (!suggestion) return;
    
    // Preencher modal de explicação específico para resposta
    document.getElementById('ai-explanation-content').innerHTML = suggestion.explanation;
    
    const factorsList = document.getElementById('ai-factors-list');
    factorsList.innerHTML = `
        <li>Análise do tipo de manifestação classificada</li>
        <li>Compatibilidade com templates de resposta disponíveis</li>
        <li>Histórico de respostas para manifestações similares</li>
        <li>Padrões de comunicação institucional da ouvidoria</li>
        <li>Tempo médio de processamento: ${fieldId === 'response-text' ? '2-3 dias' : '1-2 dias'}</li>
        <li>Nível de confiança: ${suggestion.confidence}%</li>
    `;
    
    const examplesList = document.getElementById('ai-similar-examples');
    examplesList.innerHTML = `
        <div style="background: #f9fafb; padding: 12px; border-radius: 6px; margin-bottom: 8px;">
            <strong>Caso Similar 1:</strong> Manifestação de sugestão sobre atendimento
            <br><small style="color: #6b7280;">Resposta: ${suggestion.displayValue || suggestion.value} (Satisfação: 94%)</small>
        </div>
        <div style="background: #f9fafb; padding: 12px; border-radius: 6px;">
            <strong>Caso Similar 2:</strong> Proposta de melhoria em serviços
            <br><small style="color: #6b7280;">Resposta: ${suggestion.displayValue || suggestion.value} (Satisfação: 91%)</small>
        </div>
    `;
    
    // Mostrar modal
    document.getElementById('ai-explanation-modal').style.display = 'flex';
}

// Inicializar sugestões de IA do modal quando abrir
function initializeResponseAI() {
    // Mostrar todas as sugestões quando o modal abrir
    const suggestions = ['tipo-resposta-suggestion', 'modelo-resposta-suggestion', 'response-text-suggestion'];
    suggestions.forEach(suggestionId => {
        const element = document.getElementById(suggestionId);
        if (element) {
            element.style.display = 'block';
        }
    });
}

// Override da função openResponseModal para incluir IA
const originalOpenResponseModal = window.openResponseModal;
window.openResponseModal = function() {
    if (originalOpenResponseModal) {
        originalOpenResponseModal();
    }
    
    // Inicializar IA após abrir modal
    setTimeout(() => {
        initializeResponseAI();
    }, 100);
}; 