-- DASHBOARD - ESTATÍSTICAS GERAIS
SELECT 
    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM recursos WHERE ativo = 1) as recursos_ativos,
    (SELECT COUNT(*) FROM recursos WHERE ativo = 0) as recursos_pendentes,
    (SELECT COUNT(*) FROM noticias WHERE status = 'publicado') as noticias_publicadas,
    (SELECT COUNT(*) FROM noticias WHERE status = 'agendado') as noticias_agendadas;

-- RECURSOS PENDENTES DE MODERAÇÃO
SELECT id, titulo, etapa, data_criacao 
FROM recursos 
WHERE ativo = 0 OR aprovado = 0
ORDER BY data_criacao DESC;

-- NOTÍCIAS AGENDADAS (RN036)
SELECT id, titulo, data_agendamento 
FROM noticias 
WHERE status = 'agendado' AND data_agendamento > NOW()
ORDER BY data_agendamento ASC;

-- USUÁRIOS RECENTES (ÚLTIMOS 7 DIAS)
SELECT id, email, cidade, estado, data_cadastro
FROM usuarios 
WHERE data_cadastro >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY data_cadastro DESC;

-- RECURSOS MAIS ACESSADOS (SE EXISTIR TABELA ACESSOS)
-- SELECT r.id, r.titulo, COUNT(a.id) as total_acessos
-- FROM recursos r
-- LEFT JOIN acessos a ON r.id = a.recurso_id
-- GROUP BY r.id
-- ORDER BY total_acessos DESC
-- LIMIT 10;

-- conteudo revisado abaixo

-- 📊 DASHBOARD - ESTATÍSTICAS (Usando estrutura atualizada)
SELECT 
    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM usuarios WHERE is_admin = TRUE) as total_admins,
    (SELECT COUNT(*) FROM recursos WHERE ativo = 1) as recursos_ativos,
    (SELECT COUNT(*) FROM recursos WHERE ativo = 0) as recursos_inativos,
    (SELECT COUNT(*) FROM noticias WHERE status = 'publicado') as noticias_publicadas,
    (SELECT COUNT(*) FROM noticias WHERE status = 'agendado') as noticias_agendadas;

-- 📋 RECURSOS PENDENTES (Versão simplificada)
SELECT id, titulo, etapa, data_criacao 
FROM recursos 
WHERE ativo = 0
ORDER BY data_criacao DESC;

-- 👥 USUÁRIOS RECENTES
SELECT id, email, cidade, estado, data_cadastro
FROM usuarios 
WHERE data_cadastro >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY data_cadastro DESC
LIMIT 10;