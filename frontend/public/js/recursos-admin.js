// Versão SIMPLIFICADA - só o essencial
document.addEventListener('DOMContentLoaded', function() {
    // Botão Ativar/Desativar
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-toggle-status')) {
            const button = e.target;
            const id = button.getAttribute('data-id');
            const currentStatus = button.getAttribute('data-status') === 'true';
            
            if (confirm(`Tem certeza que deseja ${currentStatus ? 'desativar' : 'ativar'} este recurso?`)) {
                toggleRecursoStatus(id, currentStatus);
            }
        }
        
        // Botão Excluir
        if (e.target.classList.contains('btn-excluir')) {
            const id = e.target.getAttribute('data-id');
            if (confirm('Tem certeza que deseja excluir este recurso?')) {
                excluirRecurso(id);
            }
        }
    });
});

function toggleRecursoStatus(id, currentStatus) {
    fetch(`/admin/recursos/${id}/toggle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            location.reload(); // Recarrega a página
        } else {
            alert('Erro: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao processar solicitação');
    });
}

function excluirRecurso(id) {
    fetch(`/admin/recursos/excluir/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Recurso excluído com sucesso!');
            location.reload();
        } else {
            alert('Erro: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao excluir recurso');
    });
}