// Gerenciamento de formulários de recursos no painel administrativo
class RecursosFormManager {
    constructor() {
        this.init();
    }

    init() {
        this.configurarEventListeners();
        this.configurarValidacaoFormulario();
        this.configurarPreview();
    }

    configurarEventListeners() {
        // Configurar event listeners para os botões de exclusão/restauração (apenas na edição)
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const onclick = button.getAttribute('onclick');
            if (!onclick) return;

            if (onclick.startsWith('excluirRecurso')) {
                e.preventDefault();
                const id = this.extractIdFromOnClick(onclick);
                this.excluirRecurso(id);
            } else if (onclick.startsWith('restaurarRecurso')) {
                e.preventDefault();
                const id = this.extractIdFromOnClick(onclick);
                this.restaurarRecurso(id);
            }
        });

        // Remover atributos onclick após configurar os event listeners
        setTimeout(() => {
            document.querySelectorAll('[onclick^="excluirRecurso"], [onclick^="restaurarRecurso"]').forEach(btn => {
                btn.removeAttribute('onclick');
            });
        }, 100);
    }

    configurarValidacaoFormulario() {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                if (!this.validarFormulario()) {
                    e.preventDefault();
                }
            });
        }
    }

    configurarPreview() {
        // Só configurar preview se o elemento existir (apenas na página de criação)
        const previewTitulo = document.getElementById('preview-titulo');
        if (!previewTitulo) return;

        this.updatePreview(); // Atualizar preview inicial

        // Adicionar event listeners para os campos
        const campos = ['titulo', 'descricao', 'etapa', 'link_externo'];
        campos.forEach(campo => {
            const element = document.getElementById(campo);
            if (element) {
                element.addEventListener('input', this.updatePreview.bind(this));
                element.addEventListener('change', this.updatePreview.bind(this));
            }
        });
    }

    updatePreview() {
        const previewTitulo = document.getElementById('preview-titulo');
        const previewDescricao = document.getElementById('preview-descricao');
        const previewEtapa = document.getElementById('preview-etapa');
        const previewLink = document.getElementById('preview-link');

        if (previewTitulo) {
            previewTitulo.textContent = 
                document.getElementById('titulo').value || 'Título do recurso';
        }

        if (previewDescricao) {
            previewDescricao.textContent = 
                document.getElementById('descricao').value || 'Descrição do recurso educacional...';
        }

        if (previewEtapa) {
            const etapaSelect = document.getElementById('etapa');
            const etapaText = etapaSelect.options[etapaSelect.selectedIndex]?.text || 'Etapa educacional';
            previewEtapa.textContent = etapaText;
        }

        if (previewLink) {
            const link = document.getElementById('link_externo').value;
            if (link) {
                previewLink.href = link;
                previewLink.style.display = 'inline-block';
            } else {
                previewLink.style.display = 'none';
            }
        }
    }

    validarFormulario() {
        const titulo = document.getElementById('titulo').value.trim();
        const descricao = document.getElementById('descricao').value.trim();
        const linkExterno = document.getElementById('link_externo').value.trim();

        if (!titulo) {
            this.showAlert('Por favor, preencha o título do recurso.', 'warning');
            return false;
        }

        if (!descricao) {
            this.showAlert('Por favor, preencha a descrição do recurso.', 'warning');
            return false;
        }

        if (!linkExterno) {
            this.showAlert('Por favor, preencha o link externo do recurso.', 'warning');
            return false;
        }

        // Validação básica de URL
        try {
            new URL(linkExterno);
        } catch {
            this.showAlert('Por favor, insira uma URL válida para o link externo.', 'warning');
            return false;
        }

        return true;
    }

    extractIdFromOnClick(onclick) {
        const match = onclick.match(/\((.*?)\)/);
        return match ? parseInt(match[1]) : null;
    }

    excluirRecurso(id) {
        if (confirm('Tem certeza que deseja desativar este recurso?\n\nEle não aparecerá mais no site público.')) {
            this.executarAcao(`/admin/recursos/excluir/${id}`, 'DELETE', 'Recurso desativado com sucesso!');
        }
    }

    restaurarRecurso(id) {
        if (confirm('Deseja reativar este recurso?')) {
            this.executarAcao(`/admin/recursos/restaurar/${id}`, 'POST', 'Recurso reativado com sucesso!');
        }
    }

    executarAcao(url, method, successMessage) {
        fetch(url, { 
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                this.showAlert(successMessage, 'success');
                setTimeout(() => location.reload(), 1500);
            } else {
                this.showAlert('Erro: ' + (data.error || 'Erro desconhecido'), 'danger');
            }
        })
        .catch(error => {
            this.showAlert('Erro ao processar solicitação. Tente novamente.', 'danger');
        });
    }

    showAlert(message, type) {
        // Remover alertas existentes
        document.querySelectorAll('.alert.alert-dismissible').forEach(alert => {
            if (alert.parentNode) {
                alert.remove();
            }
        });

        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const cardBody = document.querySelector('.card-body');
        const form = cardBody.querySelector('form');
        cardBody.insertBefore(alert, form);

        // Auto-remove após 5 segundos
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.recursosFormManager = new RecursosFormManager();
});