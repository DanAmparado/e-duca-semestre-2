const db = require('../config/database');

const recursosController = {
    // Listar todos os recursos (para página geral)
    listarTodos: (req, res) => {
        const sql = 'SELECT * FROM recursos WHERE ativo = true ORDER BY titulo';
        
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Erro ao buscar recursos:', err);
                return res.status(500).render('pages/erro', { 
                    erro: 'Erro interno do servidor',
                    user: req.session.user 
                });
            }
            
            res.render('pages/recursos/lista', {
                user: req.session.user,
                recursos: results,
                titulo: 'Todos os Recursos Educacionais'
            });
        });
    },

    // Listar recursos por etapa
    listarPorEtapa: (req, res) => {
        const etapa = req.params.etapa;
        
        const etapasMap = {
            'basica': 'Basico',
            'fundamental': 'Fundamental', 
            'medio': 'Medio',
            'profissional': 'Tecnico',
            'superior': 'Superior'
        };

        const etapaBanco = etapasMap[etapa];
        
        if (!etapaBanco) {
            return res.status(404).render('pages/erro', {
                erro: 'Etapa educacional não encontrada',
                user: req.session.user
            });
        }
        
        const sql = 'SELECT * FROM recursos WHERE ativo = true AND etapa LIKE ? ORDER BY titulo';
        const parametros = [`%${etapaBanco}%`];
        
        db.query(sql, parametros, (err, results) => {
            if (err) {
                console.error('Erro ao buscar recursos por etapa:', err);
                return res.status(500).render('pages/erro', {
                    erro: 'Erro interno do servidor',
                    user: req.session.user
                });
            }

            const titulos = {
                'basica': 'Educação Básica',
                'fundamental': 'Ensino Fundamental', 
                'medio': 'Ensino Médio',
                'profissional': 'Educação Profissional',
                'superior': 'Educação Superior'
            };

            res.render('pages/recursos/lista', {
                user: req.session.user,
                recursos: results,
                etapa: etapa,
                titulo: titulos[etapa] || `Recursos Educacionais`
            });
        });
    },

    // Buscar recursos por termo
    buscarRecursos: (req, res) => {
        const termo = req.query.q;
        
        if (!termo || termo.trim() === '') {
            return res.redirect('/recursos');
        }

        const sql = `
            SELECT * FROM recursos 
            WHERE ativo = true 
            AND (titulo LIKE ? OR descricao LIKE ? OR etapa LIKE ?)
            ORDER BY titulo
        `;
        
        const parametros = [`%${termo}%`, `%${termo}%`, `%${termo}%`];
        
        db.query(sql, parametros, (err, results) => {
            if (err) {
                console.error('Erro na busca:', err);
                return res.status(500).render('pages/erro', {
                    erro: 'Erro interno do servidor',
                    user: req.session.user
                });
            }

            res.render('pages/recursos/busca', {
                user: req.session.user,
                recursos: results,
                termo: termo,
                total: results.length
            });
        });
    },

    // Detalhes de um recurso específico
    detalhesRecurso: (req, res) => {
        const id = req.params.id;
        
        const sql = 'SELECT * FROM recursos WHERE id = ? AND ativo = true';
        
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error('Erro ao buscar recurso:', err);
                return res.status(500).render('pages/erro', {
                    erro: 'Erro interno do servidor',
                    user: req.session.user
                });
            }

            if (results.length === 0) {
                return res.status(404).render('pages/erro', {
                    erro: 'Recurso não encontrado',
                    user: req.session.user
                });
            }

            res.render('pages/recursos/detalhes', {
                user: req.session.user,
                recurso: results[0]
            });
        });
    },

    // Página de administração de recursos
    adminListar: (req, res) => {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        const sql = 'SELECT * FROM recursos ORDER BY data_criacao DESC';
        
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Erro ao buscar recursos para admin:', err);
                return res.status(500).render('pages/erro', {
                    erro: 'Erro interno do servidor',
                    user: req.session.user
                });
            }

            res.render('pages/admin/recursos', {
                user: req.session.user,
                recursos: results
            });
        });
    }
};

module.exports = recursosController;