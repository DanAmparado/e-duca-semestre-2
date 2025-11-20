// backend/server.js

const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/database');

const app = express();

// ⚙️ CONFIGURAÇÕES DO SERVIDOR
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // 🆕 IMPORTANTE: Para receber JSON nas requisições

// 🔐 SESSÕES
app.use(session({
    secret: 'educa-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// 🏠 MIDDLEWARE PARA VARIÁVEIS GLOBAIS
app.use((req, res, next) => {
    // Disponibilizar user em todas as views
    res.locals.user = req.session.user;
    next();
});

// 🏠 ROTAS PÚBLICAS
app.get('/', (req, res) => {
    res.render('pages/index', { user: req.session.user });
});

// 🧪 ROTA DE TESTE DO BANCO
app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            res.send('Erro no banco: ' + err.message);
        } else {
            res.send('Banco OK! Resultado: ' + results[0].solution);
        }
    });
});

// 👤 ROTA DE PERFIL
app.get('/perfil', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    res.render('pages/perfil', { user: req.session.user });
});

// 🔐 ROTAS DE AUTENTICAÇÃO
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// 📚 ROTAS DE RECURSOS EDUCACIONAIS
const recursosRoutes = require('./routes/recursosRoutes');
app.use('/recursos', recursosRoutes);

// 🎯 ROTAS DE RECOMENDAÇÕES
const recomendacoesRoutes = require('./routes/recomendacoesRoutes');
app.use('/recomendacoes', recomendacoesRoutes);

// 🛡️ ROTAS ADMINISTRATIVAS
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

// 🎓 ROTAS DE EDUCAÇÃO (REDIRECTS AMIGÁVEIS)
app.get('/educacao/basica', (req, res) => {
    res.redirect('/recursos/educacao/basica');
});

app.get('/educacao/fundamental', (req, res) => {
    res.redirect('/recursos/educacao/fundamental');
});

app.get('/educacao/medio', (req, res) => {
    res.redirect('/recursos/educacao/medio');
});

app.get('/educacao/profissional', (req, res) => {
    res.redirect('/recursos/educacao/profissional');
});

app.get('/educacao/superior', (req, res) => {
    res.redirect('/recursos/educacao/superior');
});

// 📰 ROTA DE NOTÍCIAS (PLACEHOLDER)
app.get('/noticias', (req, res) => {
    res.render('pages/noticias', { 
        user: req.session.user,
        noticias: [] // Para implementação futura
    });
});

// ℹ️ ROTA SOBRE
app.get('/sobre', (req, res) => {
    res.render('pages/sobre', { user: req.session.user });
});

// ❌ ROTA DE ERRO 404
app.use((req, res) => {
    res.status(404).render('pages/erro', {
        erro: 'Página não encontrada',
        user: req.session.user
    });
});

// 🚨 MANIPULADOR DE ERROS GLOBAL
app.use((err, req, res, next) => {
    console.error('Erro do servidor:', err);
    res.status(500).render('pages/erro', {
        erro: 'Erro interno do servidor',
        user: req.session.user
    });
});

// 🚀 INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando: http://localhost:${PORT}`);
    console.log(`📊 Painel Admin: http://localhost:${PORT}/admin`);
    console.log(`🎯 Recomendações: http://localhost:${PORT}/recomendacoes`);
});