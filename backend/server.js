const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/database');
const flash = require('connect-flash');

const app = express();

// ⚙️ CONFIGURAÇÕES DO SERVIDOR
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔐 SESSÕES
app.use(session({
    secret: 'educa-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // ✅ Para desenvolvimento (false)
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

app.use(flash());

// Middleware para passar flash messages para todas as views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// 🏠 MIDDLEWARE PARA VARIÁVEIS GLOBAIS
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
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

// 🔄 CARREGAR TODAS AS ROTAS DOS ARQUIVOS (ORDEM CORRIGIDA)
console.log('🔄 Carregando rotas...');

// 🔐 ROTAS DE AUTENTICAÇÃO (primeiro - mais genéricas)
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// 🏠 ROTAS PRINCIPAIS 
const indexRoutes = require('./routes/indexRoutes');
app.use('/', indexRoutes);

// 📚 ROTAS DE RECURSOS
const recursosRoutes = require('./routes/recursosRoutes');
app.use('/recursos', recursosRoutes);

// 👤 ROTAS DE USUÁRIO 
const usuariosRoutes = require('./routes/usuariosRoutes');
app.use('/', usuariosRoutes);

// 📰 ROTAS DE NOTÍCIAS
const noticiasRoutes = require('./routes/noticiasRoutes');
app.use('/noticias', noticiasRoutes);

// 🛡️ ROTAS ADMINISTRATIVAS
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

// 🎯 ROTAS DE RECOMENDAÇÕES (específicas)
const recomendacoesRoutes = require('./routes/recomendacoesRoutes');
app.use('/recomendacoes', recomendacoesRoutes);

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
    console.log(`👤 Perfil: http://localhost:${PORT}/perfil`);
    console.log(`✅ Rotas carregadas: auth, index, recursos, usuarios, admin`);
});