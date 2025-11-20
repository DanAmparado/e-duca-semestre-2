const db = require('../config/database');

const recomendacoesController = {
    listarRecomendados: (req, res) => {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        const user = req.session.user;
        
        // Lógica de recomendação baseada nas RN013-RN016, RN025, RN032-RN034
        let sql;
        let parametros = [];

        if (user.etapa_preferida) {
            // RN013: Priorizar recursos com critérios do perfil
            // RN025: Atualizações no perfil afetam recomendações imediatamente
            sql = `
                SELECT * FROM recursos 
                WHERE ativo = true 
                AND etapa LIKE ?
                ORDER BY 
                    CASE WHEN etapa = ? THEN 1 ELSE 2 END,
                    titulo
            `;
            parametros = [`%${user.etapa_preferida}%`, user.etapa_preferida];
        } else {
            // RN014, RN032: Perfis incompletos → recomendações por popularidade
            sql = 'SELECT * FROM recursos WHERE ativo = true ORDER BY data_criacao DESC LIMIT 10';
        }

        db.query(sql, parametros, (err, results) => {
            if (err) {
                console.error('Erro ao buscar recomendações:', err);
                return res.status(500).render('pages/erro', {
                    erro: 'Erro interno do servidor',
                    user: req.session.user
                });
            }

            res.render('pages/recomendacoes/para-voce', {
                user: req.session.user,
                recursos: results,
                temPreferencia: !!user.etapa_preferida,
                etapaPreferida: user.etapa_preferida
            });
        });
    }
};

module.exports = recomendacoesController;