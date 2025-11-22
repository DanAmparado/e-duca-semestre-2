// backend/routes/indexRoutes.js
const express = require('express');
const router = express.Router();
const recursosController = require('../controllers/recursosController');

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

// Rota Notícias (em construção)
router.get('/noticias', (req, res) => {
    res.render('pages/noticias', {
        user: req.session.user,
        title: 'Notícias - E-DUCA'
    });
});

// Rotas de recursos
router.get('/recursos', recursosController.listarTodos);
router.get('/recursos/educacao/:etapa', recursosController.listarPorEtapa);
router.get('/recursos/busca', recursosController.buscarRecursos);
router.get('/recursos/:id', recursosController.detalhesRecurso);

module.exports = router;