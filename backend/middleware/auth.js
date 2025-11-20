// Middleware de autenticação básica
const auth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login?erro=Faça login para acessar esta página');
    }
};

module.exports = auth;