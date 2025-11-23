const Usuario = require('../models/Usuario');

const authController = {
    loginPage: (req, res) => {
        res.render('pages/login', { 
            user: req.session.user,
            erro: req.query.erro 
        });
    },

    cadastroPage: (req, res) => {
        res.render('pages/cadastro', { 
            user: req.session.user,
            erro: req.query.erro,
            sucesso: req.query.sucesso
        });
    },

    cadastrar: async (req, res) => {
        try {
            const { email, senha, confirmar_senha, cidade, estado, etapa_preferida } = req.body;
            
            // Validações básicas
            if (senha !== confirmar_senha) {
                return res.redirect('/auth/cadastro?erro=Senhas não coincidem');
            }

            await Usuario.criar({ email, senha, cidade, estado, etapa_preferida });
            res.redirect('/auth/login?sucesso=Conta criada com sucesso');
            
        } catch (error) {
            console.error('Erro no cadastro:', error);
            let mensagemErro = 'Erro ao criar conta';
            
            if (error.code === 'ER_DUP_ENTRY') {
                mensagemErro = 'Este email já está cadastrado';
            }
            
            res.redirect('/auth/cadastro?erro=' + mensagemErro);
        }
    },

    login: async (req, res) => {
        try {
            const { email, senha } = req.body;
            const usuario = await Usuario.buscarPorEmail(email);

            if (!usuario) {
                return res.redirect('/auth/login?erro=Email ou senha incorretos');
            }

            const senhaValida = await Usuario.validarSenha(senha, usuario.senha);
            if (!senhaValida) {
                return res.redirect('/auth/login?erro=Email ou senha incorretos');
            }

            // Criar sessão
            req.session.user = {
                id: usuario.id,
                email: usuario.email,
                cidade: usuario.cidade,
                estado: usuario.estado,
                etapa_preferida: usuario.etapa_preferida,
                is_admin: usuario.is_admin || false,
                nivel_acesso: usuario.nivel_acesso || 'editor'
            };

            res.redirect('/');
            
        } catch (error) {
            console.error('Erro no login:', error);
            res.redirect('/auth/login?erro=Erro no servidor');
        }
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Erro ao fazer logout:', err);
            }
            res.redirect('/');
        });
    }
};

module.exports = authController;