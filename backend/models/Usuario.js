const db = require('../config/database');
const bcrypt = require('bcrypt');

class Usuario {
    static async criar(usuario) {
        const hashedPassword = await bcrypt.hash(usuario.senha, 10);
        
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO usuarios (email, senha, cidade, estado, etapa_preferida) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [
                usuario.email, 
                hashedPassword, 
                usuario.cidade, 
                usuario.estado, 
                usuario.etapa_preferida
            ], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async buscarPorEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM usuarios WHERE email = ?';
            
            db.query(sql, [email], (err, results) => {
                if (err) {
                    console.error('Erro ao buscar usuário por email:', err);
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            });
        });
    }

    static async validarSenha(senha, senhaHash) {
        return await bcrypt.compare(senha, senhaHash);
    }
}

module.exports = Usuario;