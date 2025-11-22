// backend/middleware/adminAuth.js (VERSÃO ATUALIZADA)

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

    // ATUALIZADO: Verificar se é administrador (qualquer nível exceto 'usuario')
    const userNivel = req.session.user.nivel_acesso;
    if (userNivel === 'usuario') {
        console.log('❌ User is not admin (nivel_acesso = usuario)');
        return res.status(403).render('pages/erro', {
            erro: 'Acesso restrito a administradores',
            user: req.session.user
        });
    }

    console.log('✅ User is admin, allowing access');
    next();
};

// Middleware para verificar nível específico (JÁ EXISTE - MANTIDO)
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

// NOVO: Middlewares pré-configurados para cada nível
adminAuth.requireEditor = adminAuth.requireNivel(['editor', 'moderador', 'superadmin']);
adminAuth.requireModerador = adminAuth.requireNivel(['moderador', 'superadmin']);
adminAuth.requireSuperAdmin = adminAuth.requireNivel(['superadmin']);

module.exports = adminAuth;