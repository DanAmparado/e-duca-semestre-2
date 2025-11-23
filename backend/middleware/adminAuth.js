const adminAuth = (req, res, next) => {
    // Verificar se usuário está logado
    if (!req.session.user) {
        return res.redirect('/auth/login?erro=Acesso restrito a usuários logados');
    }

    // Verificar se é administrador (qualquer nível exceto 'usuario')
    const userNivel = req.session.user.nivel_acesso;
    if (userNivel === 'usuario') {
        return res.status(403).render('pages/erro', {
            erro: 'Acesso restrito a administradores',
            user: req.session.user
        });
    }

    next();
};

// Middleware para verificar nível específico
adminAuth.requireNivel = (niveisPermitidos) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        const userNivel = req.session.user.nivel_acesso;
        
        if (!niveisPermitidos.includes(userNivel)) {
            return res.status(403).render('pages/erro', {
                erro: `Nível de acesso insuficiente. Requer: ${niveisPermitidos.join(', ')}`,
                user: req.session.user
            });
        }

        next();
    };
};

// Middlewares pré-configurados para cada nível
adminAuth.requireEditor = adminAuth.requireNivel(['editor', 'moderador', 'superadmin']);
adminAuth.requireModerador = adminAuth.requireNivel(['moderador', 'superadmin']);
adminAuth.requireSuperAdmin = adminAuth.requireNivel(['superadmin']);

module.exports = adminAuth;