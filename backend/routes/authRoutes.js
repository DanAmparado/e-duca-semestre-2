const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Páginas
router.get('/login', authController.loginPage);
router.get('/cadastro', authController.cadastroPage);

// Ações
router.post('/login', authController.login);
router.post('/cadastro', authController.cadastrar);
router.get('/logout', authController.logout);

module.exports = router;