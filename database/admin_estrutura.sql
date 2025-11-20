-- CAMPOS DE MODERAÇÃO PARA RECURSOS (RN035)
ALTER TABLE recursos 
ADD COLUMN ativo BOOLEAN DEFAULT TRUE,
ADD COLUMN aprovado BOOLEAN DEFAULT FALSE,
ADD COLUMN data_moderacao DATETIME;

-- CAMPOS PARA SISTEMA DE NOTÍCIAS (RN036)
ALTER TABLE noticias 
ADD COLUMN status ENUM('rascunho', 'agendado', 'publicado', 'arquivado') DEFAULT 'rascunho',
ADD COLUMN data_agendamento DATETIME,
ADD COLUMN autor_id INT,
ADD COLUMN etapa_educacional VARCHAR(100),
ADD FOREIGN KEY (autor_id) REFERENCES usuarios(id);

-- TABELA DE ADMINISTRADORES
CREATE TABLE IF NOT EXISTS administradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nivel_acesso ENUM('superadmin', 'moderador', 'editor') DEFAULT 'editor',
    ativo BOOLEAN DEFAULT TRUE,
    ultimo_login DATETIME,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LOGS DE ATIVIDADE ADMIN
CREATE TABLE IF NOT EXISTS admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    acao VARCHAR(100) NOT NULL,
    descricao TEXT,
    ip_address VARCHAR(45),
    data_log TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES administradores(id)
);