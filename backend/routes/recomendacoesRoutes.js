const express = require('express');
const router = express.Router();
const recomendacoesController = require('../controllers/recomendacoesController');

router.get('/', recomendacoesController.listarRecomendados);

module.exports = router;