const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/database');

const app = express();

// ==================================================
// 1. CONFIGURAÇÃO DA SESSÃO (PRIORIDADE MÁXIMA)
// ==================================================
// Precisa vir antes de tudo para que req.session exista
app.use(session({
    secret: 'educa-secret',
    resave: false,
    saveUninitialized: false
}));

// ==================================================
// 2. MIDDLEWARE GLOBAL DE USUÁRIO
// ==================================================
// Agora é seguro acessar req.session aqui
app.use((req, res, next) => {
    // Disponibiliza a variável 'user' para TODOS os arquivos EJS
    // Assim você não precisa passar { user: req.session.user } em cada render
    res.locals.user = req.session.user || null;
    next();
});

// ==================================================
// 3. CONFIGURAÇÕES BÁSICAS
// ==================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Configuração de arquivos estáticos (CSS, Imagens)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Para ler dados de formulários (POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==================================================
// 4. ROTAS DO SISTEMA
// ==================================================

// Importação das rotas
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const recursosRoutes = require('./routes/recursosRoutes');
const recomendacoesRoutes = require('./routes/recomendacoesRoutes');

// Definição de uso das rotas
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/recursos', recursosRoutes);
app.use('/recomendacoes', recomendacoesRoutes);

// Rota Home
app.get('/', (req, res) => {
    // Não precisa mais passar { user: ... }, o middleware já resolveu
    res.render('pages/index');
});

// Rota de Perfil
app.get('/perfil', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    res.render('pages/perfil');
});

// Rotas de Atalho (Redirects)
app.get('/educacao/basica', (req, res) => res.redirect('/recursos/educacao/basica'));
app.get('/educacao/profissional', (req, res) => res.redirect('/recursos/educacao/profissional'));
app.get('/educacao/superior', (req, res) => res.redirect('/recursos/educacao/superior'));

// Rota de Teste do Banco de Dados
app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            res.send('Erro no banco: ' + err.message);
        } else {
            res.send('Banco OK! Resultado: ' + results[0].solution);
        }
    });
});

// Inicialização do Servidor
app.listen(3000, () => {
    console.log('Servidor rodando: http://localhost:3000');
    console.log('Painel Admin: http://localhost:3000/admin');
});

