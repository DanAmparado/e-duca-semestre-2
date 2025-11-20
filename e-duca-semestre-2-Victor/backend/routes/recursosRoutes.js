const express = require('express');
const router = express.Router();
const recursosController = require('../controllers/recursosController');

// Rota para listar todos os recursos
router.get('/', recursosController.listarTodos);

// Rota para buscar recursos
router.get('/buscar', recursosController.buscarRecursos);

// Rotas específicas para cada etapa
router.get('/educacao/basica', (req, res) => {
    req.params.etapa = 'basica';
    recursosController.listarPorEtapa(req, res);
});

router.get('/educacao/fundamental', (req, res) => {
    req.params.etapa = 'fundamental';
    recursosController.listarPorEtapa(req, res);
});

router.get('/educacao/medio', (req, res) => {
    req.params.etapa = 'medio';
    recursosController.listarPorEtapa(req, res);
});

router.get('/educacao/profissional', (req, res) => {
    req.params.etapa = 'profissional';
    recursosController.listarPorEtapa(req, res);
});

router.get('/educacao/superior', (req, res) => {
    req.params.etapa = 'superior';
    recursosController.listarPorEtapa(req, res);
});

// Rota para detalhes de um recurso específico
router.get('/:id', recursosController.detalhesRecurso);

module.exports = router;