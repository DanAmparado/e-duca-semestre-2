const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Middleware de verificação de Admin
const verificaAdmin = (req, res, next) => {
    if (req.session.user) { 
        next(); // Deixa passar se estiver logado
    } else {
        res.redirect('/auth/login');
    }
};

// ==================================================
// ROTAS DO PAINEL ADMINISTRATIVO
// (Prefixo /admin já definido no server.js)
// ==================================================

// 1. DASHBOARD (http://localhost:3000/admin)
// Chama a função 'index' do controller que renderiza os botões de escolha
router.get('/', verificaAdmin, adminController.index);

// 2. RECURSOS (http://localhost:3000/admin/recursos)
// Chama 'listarRecursos' para mostrar a tabela
router.get('/recursos', verificaAdmin, adminController.listarRecursos);

// 3. CRIAR RECURSO (http://localhost:3000/admin/recursos/criar)
// Chama 'criarRecurso' para mostrar o formulário
router.get('/recursos/criar', verificaAdmin, adminController.criarRecurso);

// 4. NOTÍCIAS (http://localhost:3000/admin/noticias)
// Chama 'listarNoticias'
router.get('/noticias', verificaAdmin, adminController.listarNoticias);

module.exports = router;