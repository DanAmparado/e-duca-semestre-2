const express = require('express');
const router = express.Router();
const recursosController = require('../controllers/recursosController');

// Rota para listar todos os recursos
router.get('/', recursosController.listarTodos);

// Rota para buscar recursos
router.get('/buscar', recursosController.buscarRecursos);

// Rotas para educação por etapa
router.get('/educacao/basica', recursosController.listarPorEtapa);
router.get('/educacao/fundamental', recursosController.listarPorEtapa);
router.get('/educacao/medio', recursosController.listarPorEtapa);
router.get('/educacao/profissional', recursosController.listarPorEtapa);
router.get('/educacao/superior', recursosController.listarPorEtapa);

// Rota genérica para qualquer etapa (fallback)
router.get('/educacao/:etapa', recursosController.listarPorEtapa);

// Rota para detalhes de um recurso específico
router.get('/:id', recursosController.detalhesRecurso);

module.exports = router;