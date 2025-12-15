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
    setupFileUpload();
    
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
            const editorContent = document.getElementById('editor-content');
            if (editorContent) {
                editorContent.focus();
            }
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

function setupFileUpload() {
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

// Notification system
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
        const firstField = document.getElementById('modal-tipo-resposta');
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
        const tipoResposta = document.getElementById('modal-tipo-resposta');
        const paraCidadao = document.getElementById('modal-para-cidadao');
        const modeloResposta = document.getElementById('modelo-resposta');
        const responseText = document.getElementById('response-text');
        
        if (tipoResposta) tipoResposta.value = '';
        if (paraCidadao) paraCidadao.value = '';
        if (modeloResposta) modeloResposta.value = '';
        if (responseText) responseText.value = '';
    }
}

function saveResponse() {
    const tipoResposta = document.getElementById('modal-tipo-resposta').value;
    const paraCidadao = document.getElementById('modal-para-cidadao').value;
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
    
    // Atualizar status
    setTimeout(() => {
        currentState.stage = 3;
        updateStageDisplay();
        showNotification('Atendimento atualizado para "Aguardando retorno do cidadão"', 'info');
    }, 1000);
}

// Forward Mode Functions
let forwardModeActive = false;
let originalForwardValues = {};

function enableForwardMode() {
    if (forwardModeActive) return;
    
    forwardModeActive = true;
    
    // Salvar valores originais
    const gestorSpan = document.getElementById('gestor');
    const paraCidadaoSpan = document.getElementById('para-cidadao-span');
    
    if (gestorSpan && paraCidadaoSpan) {
        const gestorRow = gestorSpan.closest('.info-row');
        const paraCidadaoRow = paraCidadaoSpan.closest('.info-row');
        
        originalForwardValues = {
            'gestor': gestorSpan.textContent,
            'para-cidadao-span': paraCidadaoSpan.textContent
        };
        
        // Ativar modo de edição
        if (gestorRow) gestorRow.classList.add('forward-mode');
        if (paraCidadaoRow) paraCidadaoRow.classList.add('forward-mode');
    }
    
    // Mostrar botões de encaminhamento
    document.getElementById('forward-actions').style.display = 'flex';
    document.getElementById('bottom-actions').style.display = 'none';
    
    showNotification('Modo de encaminhamento ativado. Selecione o gestor e configurações.', 'info');
}

function disableForwardMode() {
    if (!forwardModeActive) return;
    
    forwardModeActive = false;
    
    // Remover modo de edição
    const gestorSpan = document.getElementById('gestor');
    const paraCidadaoSpan = document.getElementById('para-cidadao-span');
    
    if (gestorSpan && paraCidadaoSpan) {
        const gestorRow = gestorSpan.closest('.info-row');
        const paraCidadaoRow = paraCidadaoSpan.closest('.info-row');
        
        if (gestorRow) gestorRow.classList.remove('forward-mode');
        if (paraCidadaoRow) paraCidadaoRow.classList.remove('forward-mode');
    }
    
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
        currentState.stage = 2;
        updateStageDisplay();
        updatePageContent();
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
window.openResponseModal = openResponseModal;
window.closeResponseModal = closeResponseModal;
window.saveResponse = saveResponse;
window.saveForward = saveForward;
window.cancelForward = cancelForward;
window.showNotification = showNotification;
