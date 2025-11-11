const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

const authController = {
    loginPage: (req, res) => {
        res.render('pages/login', { erro: req.query.erro });
    },

    cadastroPage: (req, res) => {
        res.render('pages/cadastro', { erro: req.query.erro });
    },

    cadastrar: async (req, res) => {
        try {
            const { email, senha, confirmar_senha, cidade, estado, etapa_preferida } = req.body;
            
            // Validações básicas
            if (senha !== confirmar_senha) {
                return res.redirect('/cadastro?erro=Senhas não coincidem');
            }

            await Usuario.criar({ email, senha, cidade, estado, etapa_preferida });
            res.redirect('/login?sucesso=Conta criada com sucesso');
            
        } catch (error) {
            console.error(error);
            res.redirect('/cadastro?erro=Erro ao criar conta');
        }
    },

    login: async (req, res) => {
        try {
            const { email, senha } = req.body;
            const usuario = await Usuario.buscarPorEmail(email);
            
            if (!usuario) {
                return res.redirect('/login?erro=Email ou senha incorretos');
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.redirect('/login?erro=Email ou senha incorretos');
            }

            // Criar sessão
            req.session.user = {
                id: usuario.id,
                email: usuario.email,
                cidade: usuario.cidade,
                estado: usuario.estado,
                etapa_preferida: usuario.etapa_preferida
            };

            res.redirect('/');
            
        } catch (error) {
            console.error(error);
            res.redirect('/login?erro=Erro no servidor');
        }
    }
};

module.exports = authController;