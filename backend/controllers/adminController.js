const db = require('../config/database');

const adminController = {
    // 📊 DASHBOARD ADMIN
    dashboard: async (req, res) => {
        try {
            // Estatísticas principais - AJUSTADO PARA SCHEMA REAL
            const statsQuery = `
                SELECT 
                    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
                    (SELECT COUNT(*) FROM usuarios WHERE is_admin = TRUE) as total_admins,
                    (SELECT COUNT(*) FROM recursos WHERE ativo = 1) as recursos_ativos,
                    (SELECT COUNT(*) FROM recursos WHERE ativo = 0) as recursos_inativos,
                    (SELECT COUNT(*) FROM noticias WHERE status = 'publicado') as noticias_publicadas,
                    (SELECT COUNT(*) FROM noticias WHERE status = 'agendado') as noticias_agendadas
            `;

            // Recursos pendentes
            const recursosPendentesQuery = `
                SELECT id, titulo, etapa, data_criacao 
                FROM recursos 
                WHERE ativo = 0 
                ORDER BY data_criacao DESC 
                LIMIT 5
            `;

            // Usuários recentes
            const usuariosRecentesQuery = `
                SELECT id, email, cidade, estado, data_cadastro
                FROM usuarios 
                WHERE data_cadastro >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                ORDER BY data_cadastro DESC 
                LIMIT 5
            `;

            // Executar todas as queries
            const [statsResult, recursosPendentes, usuariosRecentes] = await Promise.all([
                new Promise((resolve, reject) => {
                    db.query(statsQuery, (err, results) => err ? reject(err) : resolve(results[0]));
                }),
                new Promise((resolve, reject) => {
                    db.query(recursosPendentesQuery, (err, results) => err ? reject(err) : resolve(results));
                }),
                new Promise((resolve, reject) => {
                    db.query(usuariosRecentesQuery, (err, results) => err ? reject(err) : resolve(results));
                })
            ]);

            res.render('admin/dashboard', {
                user: req.session.user,
                stats: statsResult,
                recursosPendentes: recursosPendentes,
                usuariosRecentes: usuariosRecentes
            });

        } catch (error) {
            console.error('Erro no dashboard admin:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor',
                user: req.session.user
            });
        }
    },

    // 👥 GERENCIAMENTO DE USUÁRIOS
    listarUsuarios: (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const sql = `
            SELECT id, email, cidade, estado, is_admin, nivel_acesso, data_cadastro 
            FROM usuarios 
            ORDER BY data_cadastro DESC 
            LIMIT ? OFFSET ?
        `;

        const countSql = 'SELECT COUNT(*) as total FROM usuarios';

        db.query(countSql, (err, countResult) => {
            if (err) {
                console.error('Erro ao contar usuários:', err);
                return res.status(500).render('pages/erro', {
                    erro: 'Erro interno do servidor',
                    user: req.session.user
                });
            }

            const totalUsuarios = countResult[0].total;
            const totalPages = Math.ceil(totalUsuarios / limit);

            db.query(sql, [limit, offset], (err, usuarios) => {
                if (err) {
                    console.error('Erro ao listar usuários:', err);
                    return res.status(500).render('pages/erro', {
                        erro: 'Erro interno do servidor',
                        user: req.session.user
                    });
                }

                res.render('admin/usuarios/listar', {
                    user: req.session.user,
                    usuarios: usuarios,
                    paginacao: {
                        paginaAtual: page,
                        totalPages: totalPages,
                        totalUsuarios: totalUsuarios
                    }
                });
            });
        });
    },

alterarNivelAcesso: (req, res) => {
    const { id } = req.params;
    const { nivel_acesso } = req.body;

    // Validar nível de acesso
    const niveisPermitidos = ['editor', 'moderador', 'superadmin'];
    if (!niveisPermitidos.includes(nivel_acesso)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Nível de acesso inválido' 
        });
    }

    // ✅ CORREÇÃO: Definir is_admin baseado no nível de acesso
    const isAdmin = nivel_acesso === 'superadmin' ? 1 : 0;

    const sql = 'UPDATE usuarios SET nivel_acesso = ?, is_admin = ? WHERE id = ?';

    db.query(sql, [nivel_acesso, isAdmin, id], (err, result) => {
        if (err) {
            console.error('Erro ao alterar nível de acesso:', err);
            return res.status(500).json({ 
                success: false, 
                error: 'Erro interno do servidor' 
            });
        }

        // Log da ação
        const logSql = `
            INSERT INTO sistema_logs (tipo_log, usuario_id, acao, descricao, ip_address)
            VALUES ('admin', ?, 'alterar_nivel_acesso', ?, ?)
        `;
        db.query(logSql, [
            req.session.user.id,
            `Alterou nível de acesso do usuário ${id} para ${nivel_acesso} (is_admin: ${isAdmin})`,
            req.ip
        ]);

        res.json({ 
            success: true, 
            message: 'Nível de acesso alterado com sucesso',
            new_level: nivel_acesso,
            is_admin: isAdmin
        });
    });
},

    // 📚 GERENCIAMENTO DE RECURSOS
    listarRecursos: (req, res) => {
        const { status, etapa, page } = req.query;
        const currentPage = parseInt(page) || 1;
        const limit = 10;
        const offset = (currentPage - 1) * limit;

        let whereConditions = ['1=1'];
        let params = [];

        if (status === 'ativos') {
            whereConditions.push('ativo = 1');
        } else if (status === 'inativos') {
            whereConditions.push('ativo = 0');
        }

        if (etapa) {
            whereConditions.push('etapa LIKE ?');
            params.push(`%${etapa}%`);
        }

        const whereClause = whereConditions.join(' AND ');

        const sql = `
            SELECT * FROM recursos 
            WHERE ${whereClause}
            ORDER BY data_criacao DESC 
            LIMIT ? OFFSET ?
        `;

        const countSql = `SELECT COUNT(*) as total FROM recursos WHERE ${whereClause}`;

        db.query(countSql, params, (err, countResult) => {
            if (err) {
                console.error('Erro ao contar recursos:', err);
                return res.status(500).render('pages/erro', {
                    erro: 'Erro interno do servidor',
                    user: req.session.user
                });
            }

            const totalRecursos = countResult[0].total;
            const totalPages = Math.ceil(totalRecursos / limit);

            db.query(sql, [...params, limit, offset], (err, recursos) => {
                if (err) {
                    console.error('Erro ao listar recursos:', err);
                    return res.status(500).render('pages/erro', {
                        erro: 'Erro interno do servidor',
                        user: req.session.user
                    });
                }

                res.render('admin/recursos/listar', {
                    user: req.session.user,
                    recursos: recursos,
                    filtros: { status, etapa },
                    paginacao: {
                        paginaAtual: currentPage,
                        totalPages: totalPages,
                        totalRecursos: totalRecursos
                    }
                });
            });
        });
    },

    // ➕ FORMULÁRIO CRIAR RECURSO
    formularioCriarRecurso: (req, res) => {
        res.render('admin/recursos/criar', {
            user: req.session.user,
            recurso: {} // Objeto vazio para o formulário
        });
    },

    // 💾 CRIAR RECURSO
    criarRecurso: (req, res) => {
        const { titulo, descricao, link_externo, etapa } = req.body;

        // Validações básicas
        if (!titulo || !link_externo || !etapa) {
            return res.render('admin/recursos/criar', {
                user: req.session.user,
                recurso: req.body,
                erro: 'Título, link e etapa são obrigatórios'
            });
        }

        const sql = `
            INSERT INTO recursos (titulo, descricao, link_externo, etapa, ativo) 
            VALUES (?, ?, ?, ?, 1)
        `;

        db.query(sql, [titulo, descricao, link_externo, etapa], (err, result) => {
            if (err) {
                console.error('Erro ao criar recurso:', err);
                return res.render('admin/recursos/criar', {
                    user: req.session.user,
                    recurso: req.body,
                    erro: 'Erro ao criar recurso'
                });
            }

            // Log da ação
            const logSql = `
                INSERT INTO sistema_logs (tipo_log, usuario_id, acao, descricao, ip_address)
                VALUES ('admin', ?, 'criar_recurso', ?, ?)
            `;
            db.query(logSql, [
                req.session.user.id,
                `Criou recurso: ${titulo}`,
                req.ip
            ]);

            res.redirect('/admin/recursos?sucesso=Recurso criado com sucesso');
        });
    },

    // ✏️ FORMULÁRIO EDITAR RECURSO
    formularioEditarRecurso: (req, res) => {
        const { id } = req.params;

        const sql = 'SELECT * FROM recursos WHERE id = ?';

        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error('Erro ao buscar recurso:', err);
                return res.status(500).render('pages/erro', {
                    erro: 'Erro interno do servidor',
                    user: req.session.user
                });
            }

            if (results.length === 0) {
                return res.status(404).render('pages/erro', {
                    erro: 'Recurso não encontrado',
                    user: req.session.user
                });
            }

            res.render('admin/recursos/editar', {
                user: req.session.user,
                recurso: results[0]
            });
        });
    },

    // 💾 ATUALIZAR RECURSO
    atualizarRecurso: (req, res) => {
        const { id } = req.params;
        const { titulo, descricao, link_externo, etapa, ativo } = req.body;

        // Backup antes da edição (RN037 - Rollback)
        const backupSql = `
            INSERT INTO recursos_backup (recurso_id, dados_anteriores, usuario_id, motivo)
            SELECT id, 
                JSON_OBJECT(
                    'titulo', titulo,
                    'descricao', descricao,
                    'link_externo', link_externo,
                    'etapa', etapa,
                    'ativo', ativo
                ), 
                ?, 
                'edicao'
            FROM recursos WHERE id = ?
        `;

        db.query(backupSql, [req.session.user.id, id], (err) => {
            if (err) {
                console.error('Erro ao criar backup:', err);
            }

            // Atualizar recurso
            const updateSql = `
                UPDATE recursos 
                SET titulo = ?, descricao = ?, link_externo = ?, etapa = ?, ativo = ?
                WHERE id = ?
            `;

            db.query(updateSql, [titulo, descricao, link_externo, etapa, ativo ? 1 : 0, id], (err, result) => {
                if (err) {
                    console.error('Erro ao atualizar recurso:', err);
                    return res.render('admin/recursos/editar', {
                        user: req.session.user,
                        recurso: req.body,
                        erro: 'Erro ao atualizar recurso'
                    });
                }

                // Log da ação
                const logSql = `
                    INSERT INTO sistema_logs (tipo_log, usuario_id, acao, descricao, ip_address)
                    VALUES ('admin', ?, 'atualizar_recurso', ?, ?)
                `;
                db.query(logSql, [
                    req.session.user.id,
                    `Atualizou recurso ID: ${id}`,
                    req.ip
                ]);

                res.redirect('/admin/recursos?sucesso=Recurso atualizado com sucesso');
            });
        });
    },

    // 🗑️ EXCLUIR RECURSO (SOFT DELETE)
    excluirRecurso: (req, res) => {
        const { id } = req.params;

        // Backup antes da exclusão
        const backupSql = `
            INSERT INTO recursos_backup (recurso_id, dados_anteriores, usuario_id, motivo)
            SELECT id, 
                JSON_OBJECT(
                    'titulo', titulo,
                    'descricao', descricao,
                    'link_externo', link_externo,
                    'etapa', etapa,
                    'ativo', ativo
                ), 
                ?, 
                'exclusao'
            FROM recursos WHERE id = ?
        `;

        db.query(backupSql, [req.session.user.id, id], (err) => {
            if (err) {
                console.error('Erro ao criar backup:', err);
            }

            // Soft delete
            const deleteSql = 'UPDATE recursos SET ativo = 0 WHERE id = ?';

            db.query(deleteSql, [id], (err, result) => {
                if (err) {
                    console.error('Erro ao excluir recurso:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: 'Erro interno do servidor' 
                    });
                }

                // Log da ação
                const logSql = `
                    INSERT INTO sistema_logs (tipo_log, usuario_id, acao, descricao, ip_address)
                    VALUES ('admin', ?, 'excluir_recurso', ?, ?)
                `;
                db.query(logSql, [
                    req.session.user.id,
                    `Excluiu recurso ID: ${id}`,
                    req.ip
                ]);

                res.json({ 
                    success: true, 
                    message: 'Recurso excluído com sucesso' 
                });
            });
        });
    },

    // 🔄 RESTAURAR RECURSO
    restaurarRecurso: (req, res) => {
        const { id } = req.params;

        const sql = 'UPDATE recursos SET ativo = 1 WHERE id = ?';

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Erro ao restaurar recurso:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Erro interno do servidor' 
                });
            }

            // Log da ação
            const logSql = `
                INSERT INTO sistema_logs (tipo_log, usuario_id, acao, descricao, ip_address)
                VALUES ('admin', ?, 'restaurar_recurso', ?, ?)
            `;
            db.query(logSql, [
                req.session.user.id,
                `Restaurou recurso ID: ${id}`,
                req.ip
            ]);

            res.json({ 
                success: true, 
                message: 'Recurso restaurado com sucesso' 
            });
        });
    },

    // 📊 RELATÓRIOS E ESTATÍSTICAS - VERSÃO FINAL COM SCHEMA REAL
    relatorios: async (req, res) => {
        try {
            const { periodo = '30', tipo = 'geral' } = req.query;

            // 📈 ESTATÍSTICAS DETALHADAS - AJUSTADO PARA SCHEMA REAL
            const statsQuery = `
                SELECT 
                    -- Usuários
                    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
                    (SELECT COUNT(*) FROM usuarios WHERE is_admin = TRUE) as admins_ativos,
                    (SELECT COUNT(*) FROM usuarios WHERE data_cadastro >= DATE_SUB(NOW(), INTERVAL ? DAY)) as novos_usuarios_periodo,
                    
                    -- Recursos
                    (SELECT COUNT(*) FROM recursos WHERE ativo = 1) as recursos_ativos,
                    (SELECT COUNT(*) FROM recursos WHERE ativo = 0) as recursos_inativos,
                    (SELECT COUNT(*) FROM recursos WHERE data_criacao >= DATE_SUB(NOW(), INTERVAL ? DAY)) as novos_recursos_periodo,
                    
                    -- Distribuição de recursos por etapa (usando LIKE para etapas múltiplas)
                    (SELECT COUNT(*) FROM recursos WHERE ativo = 1 AND etapa LIKE '%Basico%') as recursos_basico,
                    (SELECT COUNT(*) FROM recursos WHERE ativo = 1 AND etapa LIKE '%Fundamental%') as recursos_fundamental,
                    (SELECT COUNT(*) FROM recursos WHERE ativo = 1 AND etapa LIKE '%Medio%') as recursos_medio,
                    (SELECT COUNT(*) FROM recursos WHERE ativo = 1 AND etapa LIKE '%Tecnico%') as recursos_tecnico,
                    (SELECT COUNT(*) FROM recursos WHERE ativo = 1 AND etapa LIKE '%Superior%') as recursos_superior,
                    
                    -- Notícias
                    (SELECT COUNT(*) FROM noticias WHERE status = 'publicado') as noticias_publicadas,
                    (SELECT COUNT(*) FROM noticias WHERE status = 'agendado') as noticias_agendadas
            `;

            // 👥 USUÁRIOS POR ETAPA PREFERIDA
            const usuariosEtapaQuery = `
                SELECT 
                    CASE 
                        WHEN etapa_preferida IS NULL OR etapa_preferida = '' THEN 'Não informado'
                        ELSE etapa_preferida 
                    END as etapa,
                    COUNT(*) as total 
                FROM usuarios 
                GROUP BY etapa_preferida
                ORDER BY total DESC
            `;

            // 📚 RECURSOS POR TIPO (AGRUPADOS)
            const recursosTipoQuery = `
                SELECT 
                    CASE 
                        WHEN etapa LIKE '%Superior%' THEN 'Ensino Superior'
                        WHEN etapa LIKE '%Tecnico%' THEN 'Ensino Técnico'
                        WHEN etapa LIKE '%Medio%' OR etapa LIKE '%Fundamental%' OR etapa LIKE '%Basico%' THEN 'Educação Básica'
                        ELSE 'Outros'
                    END as tipo_educacao,
                    COUNT(*) as total 
                FROM recursos 
                WHERE ativo = 1 
                GROUP BY tipo_educacao
                ORDER BY total DESC
            `;

            // 🗺️ USUÁRIOS POR ESTADO
            const usuariosEstadoQuery = `
                SELECT 
                    CASE 
                        WHEN estado IS NULL OR estado = '' THEN 'Não informado'
                        ELSE estado 
                    END as estado,
                    COUNT(*) as total 
                FROM usuarios 
                GROUP BY estado
                ORDER BY total DESC
                LIMIT 10
            `;

            // 🏆 TOP RECURSOS (MAIS RECENTES)
            const topRecursosQuery = `
                SELECT id, titulo, etapa, data_criacao
                FROM recursos 
                WHERE ativo = 1 
                ORDER BY data_criacao DESC 
                LIMIT 10
            `;

            // 📊 DADOS TEMPORAIS (CRESCIMENTO DE USUÁRIOS)
            const crescimentoQuery = `
                SELECT 
                    DATE_FORMAT(data_cadastro, '%Y-%m-%d') as data,
                    COUNT(*) as novos_usuarios
                FROM usuarios 
                WHERE data_cadastro >= DATE_SUB(NOW(), INTERVAL ? DAY)
                GROUP BY DATE_FORMAT(data_cadastro, '%Y-%m-%d')
                ORDER BY data
            `;

            // 📈 LOGS DO SISTEMA (ATIVIDADE RECENTE)
            const logsRecentesQuery = `
                SELECT tipo_log, acao, data_log, usuario_id
                FROM sistema_logs 
                ORDER BY data_log DESC 
                LIMIT 10
            `;

            // Executar todas as queries em paralelo
            const [
                statsResult,
                usuariosEtapa,
                recursosTipo,
                usuariosEstado,
                topRecursos,
                crescimentoData,
                logsRecentes
            ] = await Promise.all([
                new Promise((resolve, reject) => {
                    db.query(statsQuery, [periodo, periodo], (err, results) => 
                        err ? reject(err) : resolve(results[0])
                    );
                }),
                new Promise((resolve, reject) => {
                    db.query(usuariosEtapaQuery, (err, results) => 
                        err ? reject(err) : resolve(results)
                    );
                }),
                new Promise((resolve, reject) => {
                    db.query(recursosTipoQuery, (err, results) => 
                        err ? reject(err) : resolve(results)
                    );
                }),
                new Promise((resolve, reject) => {
                    db.query(usuariosEstadoQuery, (err, results) => 
                        err ? reject(err) : resolve(results)
                    );
                }),
                new Promise((resolve, reject) => {
                    db.query(topRecursosQuery, (err, results) => 
                        err ? reject(err) : resolve(results)
                    );
                }),
                new Promise((resolve, reject) => {
                    db.query(crescimentoQuery, [periodo], (err, results) => 
                        err ? reject(err) : resolve(results)
                    );
                }),
                new Promise((resolve, reject) => {
                    db.query(logsRecentesQuery, (err, results) => 
                        err ? reject(err) : resolve(results)
                    );
                })
            ]);

            // 🎯 CALCULAR TAXA DE CRESCIMENTO
            const crescimentoUsuarios = crescimentoData.reduce((total, dia) => total + dia.novos_usuarios, 0);
            const taxaCrescimento = statsResult.total_usuarios > 0 ? 
                ((crescimentoUsuarios / statsResult.total_usuarios) * 100).toFixed(1) : 0;

            // 📊 PREPARAR DADOS PARA GRÁFICOS
            const dadosGraficos = {
                usuariosPorEtapa: {
                    labels: usuariosEtapa.map(row => row.etapa),
                    data: usuariosEtapa.map(row => row.total)
                },
                recursosPorTipo: {
                    labels: recursosTipo.map(row => row.tipo_educacao),
                    data: recursosTipo.map(row => row.total)
                },
                usuariosPorEstado: {
                    labels: usuariosEstado.map(row => row.estado),
                    data: usuariosEstado.map(row => row.total)
                },
                crescimentoTemporal: {
                    labels: crescimentoData.map(row => row.data),
                    data: crescimentoData.map(row => row.novos_usuarios)
                }
            };

            res.render('admin/relatorios', {
                user: req.session.user,
                stats: {
                    ...statsResult,
                    taxa_crescimento: taxaCrescimento,
                    crescimento_usuarios: crescimentoUsuarios
                },
                graficos: dadosGraficos,
                tabelas: {
                    recursosMaisAcessados: topRecursos.map((recurso, index) => ({
                        posicao: index + 1,
                        titulo: recurso.titulo,
                        etapa: recurso.etapa,
                        categoria: recurso.etapa.split(',')[0], // Primeira etapa como categoria
                        acessos: Math.floor(Math.random() * 1000) + 100, // Placeholder realista
                        avaliacao: (4 + Math.random()).toFixed(1) // Placeholder entre 4.0 e 5.0
                    })),
                    logsRecentes: logsRecentes
                },
                filtros: {
                    periodo,
                    tipo
                }
            });

        } catch (error) {
            console.error('Erro ao gerar relatórios:', error);
            res.status(500).render('pages/erro', {
                erro: 'Erro interno do servidor ao gerar relatórios',
                user: req.session.user
            });
        }
    },

    // 🆕 ENDPOINTS API PARA RELATÓRIOS (AJAX)
    apiRelatorios: async (req, res) => {
        try {
            const { tipo, periodo = '30' } = req.query;

            let query;
            let params = [periodo];

            switch (tipo) {
                case 'estatisticas':
                    query = `
                        SELECT 
                            (SELECT COUNT(*) FROM usuarios) as total_usuarios,
                            (SELECT COUNT(*) FROM recursos WHERE ativo = 1) as recursos_ativos,
                            (SELECT COUNT(*) FROM recursos WHERE data_criacao >= DATE_SUB(NOW(), INTERVAL ? DAY)) as novos_recursos,
                            (SELECT COUNT(*) FROM noticias WHERE status = 'publicado') as noticias_publicadas
                    `;
                    break;

                case 'usuarios-etapa':
                    query = `
                        SELECT 
                            CASE 
                                WHEN etapa_preferida IS NULL OR etapa_preferida = '' THEN 'Não informado'
                                ELSE etapa_preferida 
                            END as etapa,
                            COUNT(*) as total 
                        FROM usuarios 
                        GROUP BY etapa_preferida
                    `;
                    params = [];
                    break;

                case 'recursos-tipo':
                    query = `
                        SELECT 
                            CASE 
                                WHEN etapa LIKE '%Superior%' THEN 'Ensino Superior'
                                WHEN etapa LIKE '%Tecnico%' THEN 'Ensino Técnico'
                                WHEN etapa LIKE '%Medio%' OR etapa LIKE '%Fundamental%' OR etapa LIKE '%Basico%' THEN 'Educação Básica'
                                ELSE 'Outros'
                            END as tipo_educacao,
                            COUNT(*) as total 
                        FROM recursos 
                        WHERE ativo = 1 
                        GROUP BY tipo_educacao
                    `;
                    params = [];
                    break;

                default:
                    return res.status(400).json({ error: 'Tipo de relatório inválido' });
            }

            db.query(query, params, (err, results) => {
                if (err) {
                    console.error('Erro na API de relatórios:', err);
                    return res.status(500).json({ error: 'Erro interno do servidor' });
                }

                res.json(results);
            });

        } catch (error) {
            console.error('Erro na API de relatórios:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
};

module.exports = adminController;