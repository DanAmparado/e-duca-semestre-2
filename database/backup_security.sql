
--  TABELA PARA BACKUP DE RECURSOS (RN037 - Rollback)
CREATE TABLE IF NOT EXISTS recursos_backup (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recurso_id INT,
    dados_anteriores JSON,
    admin_id INT,
    data_backup TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo ENUM('moderacao', 'exclusao', 'edicao', 'rollback'),
    FOREIGN KEY (admin_id) REFERENCES administradores(id)
);

-- TABELA DE LOGS DE SEGURANÇA
CREATE TABLE IF NOT EXISTS security_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    acao VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    data_log TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- QUERY PARA BACKUP ANTES DE MODIFICAÇÕES
-- (Executar antes de UPDATE/DELETE em recursos)
INSERT INTO recursos_backup (recurso_id, dados_anteriores, admin_id, motivo)
SELECT id, 
    JSON_OBJECT(
        'titulo', titulo,
        'descricao', descricao,
        'link_externo', link_externo,
        'etapa', etapa,
        'ativo', ativo
    ), 
    ?, 
    'moderacao'
FROM recursos WHERE id = ?;

-- QUERY PARA ROLLBACK
-- (Recuperar último backup de um recurso)
SELECT dados_anteriores 
FROM recursos_backup 
WHERE recurso_id = ? 
ORDER BY data_backup DESC 
LIMIT 1;

-- LOGS DE TENTATIVAS DE LOGIN
CREATE TABLE IF NOT EXISTS login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    ip_address VARCHAR(45),
    success BOOLEAN DEFAULT FALSE,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);