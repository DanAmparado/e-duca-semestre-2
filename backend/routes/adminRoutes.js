const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const db = require('../config/database');

// 🔐 APLICAR MIDDLEWARE DE ADMIN EM TODAS AS ROTAS
router.use(adminAuth);

// 📊 DASHBOARD E RELATÓRIOS
router.get('/', adminController.dashboard);
router.get('/dashboard', adminController.dashboard);
router.get('/relatorios', adminController.relatorios);

// 👥 GERENCIAMENTO DE USUÁRIOS
router.get('/usuarios', adminController.listarUsuarios);
router.post('/usuarios/:id/alterar-nivel', adminController.alterarNivelAcesso);

// 📚 GERENCIAMENTO DE RECURSOS
router.get('/recursos', adminController.listarRecursos);
router.get('/recursos/criar', adminController.formularioCriarRecurso);
router.post('/recursos/criar', adminController.criarRecurso);
router.get('/recursos/editar/:id', adminController.formularioEditarRecurso);
router.post('/recursos/editar/:id', adminController.atualizarRecurso);
router.delete('/recursos/excluir/:id', adminController.excluirRecurso);
router.post('/recursos/restaurar/:id', adminController.restaurarRecurso);

// 📰 GERENCIAMENTO DE NOTÍCIAS (FUTURO)
router.get('/noticias', (req, res) => {
    res.render('admin/noticias/listar', {
        user: req.session.user,
        noticias: [] // Placeholder para implementação futura
    });
});

// 🔧 FERRAMENTAS DO SISTEMA
router.get('/sistema/logs', (req, res) => {
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

// 📊 API ENDPOINTS PARA DASHBOARD (AJAX)
router.get('/api/dashboard/stats', (req, res) => {
    const statsQueries = [
        'SELECT COUNT(*) as total FROM usuarios',
        'SELECT COUNT(*) as total FROM recursos WHERE ativo = 1',
        'SELECT COUNT(*) as total FROM recursos WHERE ativo = 0',
        `SELECT COUNT(*) as total FROM noticias WHERE status = 'publicado'`
    ];

    // Executar todas as queries em paralelo
    Promise.all([
        new Promise((resolve, reject) => {
            db.query(statsQueries[0], (err, results) => {
                if (err) reject(err);
                else resolve(results[0].total);
            });
        }),
        new Promise((resolve, reject) => {
            db.query(statsQueries[1], (err, results) => {
                if (err) reject(err);
                else resolve(results[0].total);
            });
        }),
        new Promise((resolve, reject) => {
            db.query(statsQueries[2], (err, results) => {
                if (err) reject(err);
                else resolve(results[0].total);
            });
        }),
        new Promise((resolve, reject) => {
            db.query(statsQueries[3], (err, results) => {
                if (err) reject(err);
                else resolve(results[0].total);
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
        res.status(500).json({ error: 'Erro interno do servidor' });
    });
});

router.get('/api/recursos/pendentes', (req, res) => {
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

// 🆕 ROTA DE TESTE PARA DEBUG (OPCIONAL)
router.get('/teste-tudo', (req, res) => {
    res.json({
        message: '✅ Admin routes working perfectly!',
        user: req.session.user,
        is_admin: req.session.user?.is_admin,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;