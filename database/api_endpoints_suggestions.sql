-- ENDPOINT: GET /api/admin/dashboard/stats
-- Query: 
SELECT 
    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM recursos WHERE ativo = 1) as recursos_ativos,
    (SELECT COUNT(*) FROM recursos WHERE ativo = 0) as recursos_pendentes,
    (SELECT COUNT(*) FROM noticias WHERE status = 'publicado') as noticias_publicadas;

-- ENDPOINT: GET /api/admin/recursos/pendentes
-- Query:
SELECT id, titulo, etapa, data_criacao 
FROM recursos 
WHERE ativo = 0 OR aprovado = 0
ORDER BY data_criacao DESC;

-- ENDPOINT: PUT /api/admin/recursos/:id/aprovar
-- Query:
UPDATE recursos 
SET ativo = 1, aprovado = 1, data_moderacao = NOW() 
WHERE id = ?;

-- ENDPOINT: PUT /api/admin/recursos/:id/recusar
-- Query:
UPDATE recursos 
SET ativo = 0, aprovado = 0, data_moderacao = NOW() 
WHERE id = ?;

-- ENDPOINT: GET /api/admin/usuarios/recentes
-- Query:
SELECT id, email, cidade, estado, data_cadastro
FROM usuarios 
ORDER BY data_cadastro DESC 
LIMIT 20;

-- ENDPOINT: GET /api/admin/noticias/agendadas
-- Query:
SELECT id, titulo, data_agendamento 
FROM noticias 
WHERE status = 'agendado' AND data_agendamento > NOW()
ORDER BY data_agendamento ASC;