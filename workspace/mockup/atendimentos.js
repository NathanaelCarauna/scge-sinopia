// JavaScript específico para a página de Atendimentos

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização da página
    initializeAtendimentos();
});

function initializeAtendimentos() {
    // Configurar funcionalidades específicas da página de atendimentos
    setupDatePickers();
    setupFormValidation();
    setupTableInteractions();
}

// Configurar campos de data
function setupDatePickers() {
    const dateInputs = document.querySelectorAll('.date-input-group input');
    
    dateInputs.forEach(input => {
        input.addEventListener('click', function() {
            // Simular abertura de date picker
            console.log('Date picker would open for:', this.placeholder);
        });
        
        input.addEventListener('focus', function() {
            this.type = 'date';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.type = 'text';
            }
        });
    });
}

// Validação de formulário
function setupFormValidation() {
    const form = document.querySelector('.filters-section');
    
    // Validação em tempo real para CPF/CNPJ
    const cpfCnpjInput = document.querySelector('input[placeholder="CPF/CNPJ"]');
    if (cpfCnpjInput) {
        cpfCnpjInput.addEventListener('input', function() {
            const value = this.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                // Formatação CPF: 000.000.000-00
                this.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else {
                // Formatação CNPJ: 00.000.000/0000-00
                this.value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
            }
        });
    }
}

// Interações da tabela
function setupTableInteractions() {
    const tableRows = document.querySelectorAll('.results-table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // Remover seleção anterior
            tableRows.forEach(r => r.classList.remove('selected'));
            
            // Adicionar seleção atual
            this.classList.add('selected');
            
            const protocolo = this.cells[0].textContent;
            console.log('Linha selecionada - Protocolo:', protocolo);
        });
        
        row.addEventListener('dblclick', function() {
            const protocolo = this.cells[0].textContent;
            // Navegar para página de detalhes
            window.location.href = `detalhes.html?protocol=${protocolo}&stage=3`;
        });
    });
}

// Função para limpar filtros
function clearFilters() {
    const form = document.querySelector('.filters-section');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.type === 'date') {
            input.type = 'text';
        }
        input.value = '';
        if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        }
    });
    
    console.log('Filtros limpos');
    
    // Feedback visual
    showNotification('Filtros limpos com sucesso', 'success');
}

// Função para aplicar filtros
function applyFilters() {
    const filtersSection = document.querySelector('.filters-section');
    const resultsSection = document.querySelector('.results-section');
    
    // Simular loading
    filtersSection.classList.add('loading');
    
    // Coletar dados do formulário
    const formData = collectFormData();
    
    // Simular requisição
    setTimeout(() => {
        filtersSection.classList.remove('loading');
        
        // Simular atualização da tabela
        updateTable(formData);
        
        console.log('Filtros aplicados:', formData);
        showNotification('Filtros aplicados com sucesso', 'success');
        
        // Scroll para resultados
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

// Função para imprimir resultados
function printResults() {
    // Simular preparação para impressão
    showNotification('Preparando para impressão...', 'info');
    
    setTimeout(() => {
        window.print();
    }, 500);
}

// Coletar dados do formulário
function collectFormData() {
    const form = document.querySelector('.filters-section');
    const formData = {};
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.value && input.placeholder) {
            formData[input.placeholder] = input.value;
        }
    });
    
    return formData;
}

// Atualizar tabela com base nos filtros
function updateTable(filters) {
    const tbody = document.querySelector('.results-table tbody');
    
    // Dados de exemplo para demonstração
    const sampleData = [
        {
            protocolo: '20230',
            dataCriacao: '20/10/23 10:39',
            dataRecebimento: '20/10/23 10:39',
            dataEncerramento: '06/11/23',
            dataEnceramentoGestor: '',
            dataProrrogacao: ''
        },
        {
            protocolo: '20239',
            dataCriacao: '20/10/23 11:06',
            dataRecebimento: '20/10/23 11:06',
            dataEncerramento: '21/11/23',
            dataEnceramentoGestor: '',
            dataProrrogacao: ''
        },
        {
            protocolo: '202314',
            dataCriacao: '23/10/23 15:10',
            dataRecebimento: '01/11/23 08:57',
            dataEncerramento: '07/11/23',
            dataEnceramentoGestor: '',
            dataProrrogacao: ''
        }
    ];
    
    // Simular filtro por protocolo
    let filteredData = sampleData;
    if (filters['Protocolo']) {
        filteredData = sampleData.filter(item => 
            item.protocolo.includes(filters['Protocolo'])
        );
    }
    
    // Atualizar tbody
    tbody.innerHTML = '';
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.protocolo}</td>
            <td>${item.dataCriacao}</td>
            <td>${item.dataRecebimento}</td>
            <td>${item.dataEncerramento}</td>
            <td>${item.dataEnceramentoGestor}</td>
            <td>${item.dataProrrogacao}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Reconfigurar interações da tabela
    setupTableInteractions();
    
    // Atualizar informações de paginação
    updatePagination(filteredData.length);
}

// Atualizar paginação
function updatePagination(totalItems) {
    const paginationInfo = document.querySelector('.pagination-info');
    const totalPages = Math.ceil(totalItems / 10); // 10 itens por página
    paginationInfo.textContent = `Página 1 de ${totalPages}`;
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remover após 3 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Navegação entre páginas
function navigateToAtendimentos() {
    window.location.href = 'atendimentos.html';
}

function navigateToHome() {
    window.location.href = 'index.html';
}

// Exportar funções para uso global
window.clearFilters = clearFilters;
window.applyFilters = applyFilters;
window.printResults = printResults;
window.navigateToAtendimentos = navigateToAtendimentos;
window.navigateToHome = navigateToHome; 