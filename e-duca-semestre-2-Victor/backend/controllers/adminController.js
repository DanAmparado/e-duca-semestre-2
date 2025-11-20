const db = require('../config/database');

const adminController = {
    
    // =========================================
    // 1. DASHBOARD (Página Inicial do Admin)
    // =========================================
    // Renderiza views/admin/index.ejs
    index: (req, res) => {
        res.render('admin/index', { 
            user: req.session.user 
        });
    },

    // =========================================
    // 2. GERENCIAR RECURSOS
    // =========================================
    // Renderiza views/admin/recursos.ejs
    listarRecursos: (req, res) => {
        const sql = 'SELECT * FROM recursos ORDER BY id DESC';
        
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Erro ao buscar recursos:', err);
                return res.render('admin/recursos', { 
                    recursos: [], 
                    error: 'Erro ao buscar dados',
                    user: req.session.user 
                });
            }
            
            res.render('admin/recursos', { 
                recursos: results,
                user: req.session.user
            });
        });
    },

    // Formulário de Criação (Você precisará criar o arquivo views/admin/form_recurso.ejs)
    criarRecurso: (req, res) => {
        res.render('admin/form_recurso', { 
            user: req.session.user 
        });
    },

    // =========================================
    // 3. GERENCIAR NOTÍCIAS
    // =========================================
    // Renderiza views/admin/noticias.ejs
    listarNoticias: (req, res) => {
        // Lógica temporária até criar a tabela de notícias
        // Se já tiver tabela, faça o SELECT aqui igual ao de recursos
        res.render('admin/noticias', { 
            user: req.session.user,
            noticias: [] // Array vazio por enquanto
        });
    }
};

module.exports = adminController;