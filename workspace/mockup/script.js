// Funcionalidades básicas do mockup
document.addEventListener('DOMContentLoaded', function() {
    
    // Toggle de tema
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const icon = this.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                icon.className = 'fas fa-moon';
            } else {
                icon.className = 'fas fa-sun';
            }
        });
    }



    // Collapse/Expand sections
    const expandBtns = document.querySelectorAll('.expand-btn');
    expandBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.dashboard-section');
            const cardsGrid = section.querySelector('.cards-grid');
            const icon = this.querySelector('i');
            
            if (cardsGrid.style.display === 'none') {
                cardsGrid.style.display = 'grid';
                icon.className = 'fas fa-chevron-up';
            } else {
                cardsGrid.style.display = 'none';
                icon.className = 'fas fa-chevron-down';
            }
        });
    });

    // Hover effects e navegação para os cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.cursor = 'pointer';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Adicionar navegação ao clicar no card
        card.addEventListener('click', function() {
            window.location.href = 'atendimentos.html';
        });
    });

    // Simulação de atualização de dados
    function updateCardNumbers() {
        const cards = document.querySelectorAll('.card-number');
        cards.forEach(card => {
            const currentValue = parseInt(card.textContent);
            // Simula pequenas variações nos números
            const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, ou 1
            const newValue = Math.max(0, currentValue + variation);
            
            if (newValue !== currentValue) {
                card.style.transition = 'all 0.3s ease';
                card.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    card.textContent = newValue;
                    card.style.transform = 'scale(1)';
                }, 150);
            }
        });
    }

    // Atualiza os números a cada 30 segundos (simulação)
    setInterval(updateCardNumbers, 30000);

    // Menu mobile toggle (para responsividade)
    const menuToggle = document.querySelector('.header-btn:first-child');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
        });
    }

    // Animação de entrada para os cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    // Observa todos os cards para animação
    cards.forEach(card => {
        observer.observe(card);
    });
});

// Função para simular clique nos itens do menu
function navigateTo(page) {
    console.log(`Navegando para: ${page}`);
    // Aqui seria implementada a navegação real
    
    // Remove active de todos os itens
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Adiciona active ao item clicado (simulação)
    event.target.closest('.nav-item').classList.add('active');
} 