// Configuração e inicialização dos gráficos de relatórios
class RelatoriosManager {
    constructor(dadosGraficos, stats) {
        this.dadosGraficos = dadosGraficos;
        this.stats = stats;
        this.charts = {};
        
        this.init();
    }

    init() {
        // Configurar data de geração
        document.getElementById('dataGeracao').textContent = new Date().toLocaleString('pt-BR');
        
        // Inicializar gráficos
        this.inicializarGraficos();
        
        // Configurar event listeners
        this.configurarEventListeners();
    }

    configurarEventListeners() {
        // Event listeners para botões de exportação
        document.querySelectorAll('[onclick^="exportTo"]').forEach(btn => {
            const action = btn.getAttribute('onclick');
            btn.removeAttribute('onclick');
            btn.addEventListener('click', this[action.replace('()', '')].bind(this));
        });

        // Event listener para impressão
        const btnImprimir = document.querySelector('[onclick="imprimirRelatorio()"]');
        if (btnImprimir) {
            btnImprimir.removeAttribute('onclick');
            btnImprimir.addEventListener('click', this.imprimirRelatorio.bind(this));
        }

        // Event listener para atualizar
        const btnAtualizar = document.querySelector('[onclick="refreshData()"]');
        if (btnAtualizar) {
            btnAtualizar.removeAttribute('onclick');
            btnAtualizar.addEventListener('click', this.refreshData.bind(this));
        }
    }

    inicializarGraficos() {
        this.inicializarGraficoUsuariosEtapa();
        this.inicializarGraficoRecursosTipo();
        this.inicializarGraficoUsuariosEstado();
        this.inicializarGraficoCrescimento();
    }

    inicializarGraficoUsuariosEtapa() {
        const ctx = document.getElementById('usuariosEtapaChart');
        if (!ctx) return;

        this.charts.usuariosEtapa = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.dadosGraficos.usuariosPorEtapa.labels,
                datasets: [{
                    data: this.dadosGraficos.usuariosPorEtapa.data,
                    backgroundColor: [
                        'rgba(78, 115, 223, 0.8)',
                        'rgba(28, 200, 138, 0.8)',
                        'rgba(246, 194, 62, 0.8)',
                        'rgba(231, 74, 59, 0.8)',
                        'rgba(142, 68, 173, 0.8)',
                        'rgba(121, 85, 72, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    inicializarGraficoRecursosTipo() {
        const ctx = document.getElementById('recursosTipoChart');
        if (!ctx) return;

        this.charts.recursosTipo = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: this.dadosGraficos.recursosPorTipo.labels,
                datasets: [{
                    data: this.dadosGraficos.recursosPorTipo.data,
                    backgroundColor: [
                        'rgba(78, 115, 223, 0.8)',
                        'rgba(28, 200, 138, 0.8)',
                        'rgba(246, 194, 62, 0.8)',
                        'rgba(231, 74, 59, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    inicializarGraficoUsuariosEstado() {
        const ctx = document.getElementById('usuariosEstadoChart');
        if (!ctx) return;

        this.charts.usuariosEstado = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.dadosGraficos.usuariosPorEstado.labels,
                datasets: [{
                    label: 'Usuários',
                    data: this.dadosGraficos.usuariosPorEstado.data,
                    backgroundColor: 'rgba(78, 115, 223, 0.8)',
                    borderColor: 'rgba(78, 115, 223, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }

    inicializarGraficoCrescimento() {
        const ctx = document.getElementById('crescimentoChart');
        if (!ctx) return;

        if (this.dadosGraficos.crescimentoTemporal.labels.length > 0) {
            this.charts.crescimento = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.dadosGraficos.crescimentoTemporal.labels.map(data => 
                        new Date(data).toLocaleDateString('pt-BR')
                    ),
                    datasets: [{
                        label: 'Novos Usuários',
                        data: this.dadosGraficos.crescimentoTemporal.data,
                        backgroundColor: 'rgba(28, 200, 138, 0.1)',
                        borderColor: 'rgba(28, 200, 138, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0
                            }
                        }
                    }
                }
            });
        } else {
            ctx.parentElement.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="bi bi-graph-up display-4 d-block mb-2"></i>
                    <p>Não há dados de crescimento para o período selecionado</p>
                </div>
            `;
        }
    }

    exportToPDF() {
        console.log('Exportando para PDF...');
        // Implementar geração de PDF com jsPDF
    }

    exportToCSV() {
        console.log('Exportando para CSV...');
        // Implementar geração de CSV
    }

    exportToExcel() {
        console.log('Exportando para Excel...');
        // Implementar geração de Excel
    }

    imprimirRelatorio() {
        window.print();
    }

    refreshData() {
        window.location.reload();
    }

    // Destruir gráficos quando necessário
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Obter dados dos elementos hidden
    const dadosGraficosElement = document.getElementById('dadosGraficos');
    const statsElement = document.getElementById('stats');
    
    if (dadosGraficosElement && statsElement) {
        const dadosGraficos = JSON.parse(dadosGraficosElement.textContent);
        const stats = JSON.parse(statsElement.textContent);
        
        // Inicializar gerenciador de relatórios
        window.relatoriosManager = new RelatoriosManager(dadosGraficos, stats);
    }
});