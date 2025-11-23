const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/database');
const flash = require('connect-flash');

const app = express();

// Configurações do servidor
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessões
app.use(session({
    secret: 'educa-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(flash());

// Middleware para flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Middleware para variáveis globais
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Carregar rotas
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const indexRoutes = require('./routes/indexRoutes');
app.use('/', indexRoutes);

const recursosRoutes = require('./routes/recursosRoutes');
app.use('/recursos', recursosRoutes);

const usuariosRoutes = require('./routes/usuariosRoutes');
app.use('/', usuariosRoutes);

const noticiasRoutes = require('./routes/noticiasRoutes');
app.use('/noticias', noticiasRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

const recomendacoesRoutes = require('./routes/recomendacoesRoutes');
app.use('/recomendacoes', recomendacoesRoutes);

// Rota de erro 404
app.use((req, res) => {
    res.status(404).render('pages/erro', {
        erro: 'Página não encontrada',
        user: req.session.user
    });
});

// Manipulador de erros global
app.use((err, req, res, next) => {
    console.error('Erro do servidor:', err);
    res.status(500).render('pages/erro', {
        erro: 'Erro interno do servidor',
        user: req.session.user
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando: http://localhost:${PORT}`);
    console.log(`Painel Admin: http://localhost:${PORT}/admin`);
});