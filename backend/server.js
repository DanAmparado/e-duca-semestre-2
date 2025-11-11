const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/database');

const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
    secret: 'educa-secret',
    resave: false,
    saveUninitialized: false
}));

// Rota básica
app.get('/', (req, res) => {
    res.render('pages/index', { user: req.session.user });
});

// Rota de teste do banco
app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            res.send('Erro no banco: ' + err.message);
        } else {
            res.send('Banco OK! Resultado: ' + results[0].solution);
        }
    });
});

// Rotas
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Rota de perfil
app.get('/perfil', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    res.render('pages/perfil', { user: req.session.user });
});

app.listen(3000, () => {
    console.log('Servidor rodando: http://localhost:3000');
});