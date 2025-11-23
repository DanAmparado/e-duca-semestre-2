// Função para inicializar componentes Bootstrap
function inicializarComponentesBootstrap() {
    // Inicializar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializar popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Inicializar modais
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        new bootstrap.Modal(modal);
    });

    console.log('Componentes Bootstrap inicializados');
}

// Event listener seguro
document.addEventListener('DOMContentLoaded', function() {
    // Inicialização segura dos componentes Bootstrap
    if (typeof bootstrap !== 'undefined') {
        inicializarComponentesBootstrap();
    } else {
        console.warn('Bootstrap não carregado');
        // Tentar carregar Bootstrap dinamicamente
        setTimeout(() => {
            if (typeof bootstrap !== 'undefined') {
                inicializarComponentesBootstrap();
            }
        }, 1000);
    }
});

// Tornar a função global para evitar ReferenceError
window.inicializarComponentesBootstrap = inicializarComponentesBootstrap;