const db = require('../config/database');

const recomendacoesController = {
    listarRecomendados: (req, res) => {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        const user = req.session.user;
        
        console.log('🔍 DEBUG - Buscando recomendações para:', user.email);
        console.log('🔍 DEBUG - Etapa preferida:', user.etapa_preferida);
        
        let sql;
        let parametros = [];

        if (user.etapa_preferida) {
            //Encontrar recursos que contenham a etapa do usuário
            sql = `
                SELECT * FROM recursos 
                WHERE ativo = 1 
                AND (
                    etapa = ? 
                    OR etapa LIKE ? 
                    OR etapa LIKE ? 
                    OR etapa LIKE ?
                )
                ORDER BY data_criacao DESC
                LIMIT 20
            `;
            parametros = [
                user.etapa_preferida,
                `${user.etapa_preferida},%`,
                `%,${user.etapa_preferida},%`,
                `%,${user.etapa_preferida}`
            ];
        } else {
            // Usuário sem preferência
            sql = 'SELECT * FROM recursos WHERE ativo = 1 ORDER BY data_criacao DESC LIMIT 15';
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