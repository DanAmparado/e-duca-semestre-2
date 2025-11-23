const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const auth = require('../middleware/auth');

// Todas as rotas aqui exigem autenticação
router.use(auth);

router.get('/perfil', usuariosController.perfil);
router.get('/perfil/editar', usuariosController.formularioEditarPerfil); // 🆕 NOVA ROTA
router.post('/perfil', usuariosController.atualizarPerfil);
router.get('/recomendacoes', usuariosController.recomendacoes);

module.exports = router;