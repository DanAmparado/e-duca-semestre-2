// backend/middleware/adminAuth.js

const adminAuth = (req, res, next) => {
    // 🚨 DEBUG: Verificar a sessão
    console.log('=== DEBUG ADMIN AUTH ===');
    console.log('Session user:', req.session.user);
    console.log('is_admin:', req.session.user?.is_admin);
    console.log('nivel_acesso:', req.session.user?.nivel_acesso);
    console.log('========================');

    // Verificar se usuário está logado
    if (!req.session.user) {
        console.log('❌ No user session');
        return res.redirect('/auth/login?erro=Acesso restrito a usuários logados');
    }

    // Verificar se é administrador
    if (!req.session.user.is_admin) {
        console.log('❌ User is not admin');
        return res.status(403).render('pages/erro', {
            erro: 'Acesso restrito a administradores',
            user: req.session.user
        });
    }

    // Verificar nível de acesso para rotas específicas (opcional)
    const userNivel = req.session.user.nivel_acesso;
    const path = req.path;

    // Rotas exclusivas para superadmin
    if (path.includes('/superadmin/') && userNivel !== 'superadmin') {
        return res.status(403).render('pages/erro', {
            erro: 'Acesso restrito a superadministradores',
            user: req.session.user
        });
    }

    // Rotas para moderador ou superior
    if (path.includes('/moderacao/') && 
        !['superadmin', 'moderador'].includes(userNivel)) {
        return res.status(403).render('pages/erro', {
            erro: 'Acesso restrito a moderadores',
            user: req.session.user
        });
    }

    console.log('✅ User is admin, allowing access');
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

module.exports = adminAuth;