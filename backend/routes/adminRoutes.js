const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const auth = require('../middleware/auth');
const db = require('../config/database');

// APLICAR MIDDLEWARE DE AUTENTICAÇÃO BÁSICA EM TODAS AS ROTAS
router.use(auth);

// DASHBOARD E RELATÓRIOS - Todos os admins (editor+)
router.get('/', adminAuth.requireEditor, adminController.dashboard);
router.get('/dashboard', adminAuth.requireEditor, adminController.dashboard);
router.get('/relatorios', adminAuth.requireEditor, adminController.relatorios);

// GERENCIAMENTO DE USUÁRIOS - Apenas superadmin
router.get('/usuarios', adminAuth.requireSuperAdmin, adminController.listarUsuarios);
router.post('/usuarios/:id/alterar-nivel', adminAuth.requireSuperAdmin, adminController.alterarNivelAcesso);

// GERENCIAMENTO DE RECURSOS
router.get('/recursos', adminAuth.requireEditor, adminController.listarRecursos);
router.get('/recursos/criar', adminAuth.requireEditor, adminController.formularioCriarRecurso);
router.post('/recursos/criar', adminAuth.requireEditor, adminController.criarRecurso);
router.get('/recursos/editar/:id', adminAuth.requireEditor, adminController.formularioEditarRecurso);
router.post('/recursos/editar/:id', adminAuth.requireEditor, adminController.atualizarRecurso);
router.post('/recursos/:id/toggle', adminAuth.requireEditor, adminController.toggleRecursoStatus);

// EXCLUSÃO/RESTAURAÇÃO - Apenas moderador+
router.delete('/recursos/excluir/:id', adminAuth.requireModerador, adminController.excluirRecurso);
router.post('/recursos/restaurar/:id', adminAuth.requireModerador, adminController.restaurarRecurso);

// GERENCIAMENTO DE NOTÍCIAS (FUTURO) - Editor+
router.get('/noticias', adminAuth.requireEditor, (req, res) => {
    res.render('admin/noticias/listar', {
        user: req.session.user,
        noticias: [] // Placeholder para implementação futura
    });
});

// LOGS DO SISTEMA - Apenas Moderador e Superadmin
router.get('/sistema/logs', adminAuth.requireModerador, (req, res) => {
    const sql = 'SELECT * FROM sistema_logs ORDER BY data_log DESC LIMIT 100';
    
    db.query(sql, (err, logs) => {
        if (err) {
            console.error('Erro ao buscar logs:', err);
            return res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor',
                user: req.session.user
            });
        }

        res.render('admin/sistema/logs', {
            user: req.session.user,
            logs: logs
        });
    });
});

// API ENDPOINTS PARA DASHBOARD (AJAX) - Editor+
router.get('/api/dashboard/stats', adminAuth.requireEditor, (req, res) => {
    const statsQueries = [
        'SELECT COUNT(*) as total FROM usuarios',
        'SELECT COUNT(*) as total FROM recursos WHERE ativo = 1',
        'SELECT COUNT(*) as total FROM recursos WHERE ativo = 0',
        `SELECT COUNT(*) as total FROM noticias WHERE status = 'publicado'`
    ];

    // Executar todas as queries em paralelo
    Promise.all([
        new Promise((resolve) => {
            db.query(statsQueries[0], (err, results) => {
                if (err) {
                    console.error('Erro ao contar usuários:', err);
                    resolve(0);
                } else {
                    resolve(results[0].total);
                }
            });
        }),
        new Promise((resolve) => {
            db.query(statsQueries[1], (err, results) => {
                if (err) {
                    console.error('Erro ao contar recursos ativos:', err);
                    resolve(0);
                } else {
                    resolve(results[0].total);
                }
            });
        }),
        new Promise((resolve) => {
            db.query(statsQueries[2], (err, results) => {
                if (err) {
                    console.error('Erro ao contar recursos inativos:', err);
                    resolve(0);
                } else {
                    resolve(results[0].total);
                }
            });
        }),
        new Promise((resolve) => {
            db.query(statsQueries[3], (err, results) => {
                if (err) {
                    console.error('Erro ao contar notícias:', err);
                    resolve(0);
                } else {
                    resolve(results[0].total);
                }
            });
        })
    ])
    .then(([total_usuarios, recursos_ativos, recursos_inativos, noticias_publicadas]) => {
        res.json({
            total_usuarios,
            recursos_ativos,
            recursos_inativos,
            noticias_publicadas
        });
    })
    .catch(error => {
        console.error('Erro ao buscar stats:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            stats_fallback: {
                total_usuarios: 0,
                recursos_ativos: 0,
                recursos_inativos: 0,
                noticias_publicadas: 0
            }
        });
    });
});

router.get('/api/recursos/pendentes', adminAuth.requireEditor, (req, res) => {
    const sql = `
        SELECT id, titulo, etapa, data_criacao 
        FROM recursos 
        WHERE ativo = 0 
        ORDER BY data_criacao DESC
        LIMIT 10
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar recursos pendentes:', err);
            return res.status(500).json({ error: 'Erro interno' });
        }
        res.json(results);
    });
});

// API RELATÓRIOS (AJAX) - Editor+
router.get('/api/relatorios', adminAuth.requireEditor, adminController.apiRelatorios);

// ROTA DE GERENCIAMENTO DE PERMISSÕES - Apenas superadmin
router.get('/permissoes', adminAuth.requireSuperAdmin, adminController.listarPermissoes);
router.post('/permissoes/atualizar/:id', adminAuth.requireSuperAdmin, adminController.atualizarPermissoes);

module.exports = router;