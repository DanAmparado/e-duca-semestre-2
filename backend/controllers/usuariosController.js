const db = require('../config/database');

const usuariosController = {
    // Perfil do usuário
    perfil: (req, res) => {
        res.render('pages/perfil', {
            user: req.session.user,
            title: 'Meu Perfil'
        });
    },

    // Atualizar perfil
    atualizarPerfil: (req, res) => {
        const { cidade, estado, etapa_preferida } = req.body;
        const userId = req.session.user.id;

        const sql = 'UPDATE usuarios SET cidade = ?, estado = ?, etapa_preferida = ? WHERE id = ?';
        
        db.query(sql, [cidade, estado, etapa_preferida, userId], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar perfil:', err);
                return res.render('pages/perfil', {
                    user: req.session.user,
                    erro: 'Erro ao atualizar perfil'
                });
            }

            // Atualizar sessão
            req.session.user.cidade = cidade;
            req.session.user.estado = estado;
            req.session.user.etapa_preferida = etapa_preferida;

            res.render('pages/perfil', {
                user: req.session.user,
                sucesso: 'Perfil atualizado com sucesso!'
            });
        });
    },

    // Página de recomendações
    recomendacoes: (req, res) => {
        const user = req.session.user;
        
        // Lógica de recomendação baseada no perfil do usuário
        let etapaFiltro = user.etapa_preferida || 'Superior';
        
        const sql = `
            SELECT * FROM recursos 
            WHERE ativo = 1 
            AND etapa LIKE ?
            ORDER BY data_criacao DESC
            LIMIT 10
        `;

        db.query(sql, [`%${etapaFiltro}%`], (err, recursos) => {
            if (err) {
                console.error('Erro ao buscar recomendações:', err);
                return res.status(500).render('pages/erro', {
                    erro: 'Erro ao carregar recomendações',
                    user: user
                });
            }

            // ✅ CORREÇÃO: Caminho correto da view
            res.render('pages/recomendacoes/para-voce', {
                user: user,
                recursos: recursos,
                temPreferencia: !!user.etapa_preferida,
                etapaPreferida: user.etapa_preferida,
                title: 'Para Você - E-DUCA'
            });
        });
    }
};

module.exports = usuariosController;