// backend/routes/indexRoutes.js (VERSÃO CORRIGIDA)
const express = require('express');
const router = express.Router();

// Rotas Públicas
router.get('/', (req, res) => {
    res.render('pages/index', {
        user: req.session.user,
        title: 'E-DUCA - Plataforma Educacional'
    });
});

router.get('/sobre', (req, res) => {
    res.render('pages/sobre', {
        user: req.session.user,
        title: 'Sobre - E-DUCA'
    });
});

module.exports = router;