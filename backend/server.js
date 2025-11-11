const express = require('express');
const session = require('express-session');
const path = require('path');

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

app.listen(3000, () => {
    console.log('Servidor rodando: http://localhost:3000');
});