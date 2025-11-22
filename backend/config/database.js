const mysql = require('mysql2');

// Configuração do pool de conexões para melhor gerenciamento
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || 'Daniel35215525*',
    database: process.env.DB_NAME || 'educa',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Testar conexão ao iniciar
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Erro ao conectar com MySQL:', err.message);
    } else {
        console.log('✅ Conectado ao MySQL com pool de conexões!');
        connection.release();
    }
});

// Manipulador de eventos para erros de conexão
pool.on('error', (err) => {
    console.error('❌ Erro no pool MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('🔄 Conexão com MySQL foi fechada. Tentando reconectar...');
    }
});

module.exports = pool;