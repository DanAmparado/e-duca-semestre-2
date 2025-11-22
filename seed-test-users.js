// seed-test-users.js
const db = require('./backend/config/database');
const bcrypt = require('bcrypt');

async function seedTestUsers() {
    try {
        console.log('🧹 Limpando usuários de teste existentes...');
        
        // Limpar usuários de teste anteriores
        const deleteQuery = "DELETE FROM usuarios WHERE email LIKE '%@educa.com%'";
        await new Promise((resolve, reject) => {
            db.query(deleteQuery, (err, result) => {
                if (err) reject(err);
                else {
                    console.log(`✅ ${result.affectedRows} usuários de teste removidos`);
                    resolve();
                }
            });
        });

        console.log('🎯 Criando usuários de teste...');

        // Hash da senha comum (senha123)
        const hashedPassword = await bcrypt.hash('senha123', 10);

        // Usuários de teste
        const testUsers = [
            {
                email: 'super@educa.com',
                senha: hashedPassword,
                cidade: 'São Paulo',
                estado: 'SP',
                etapa_preferida: 'Ensino Superior',
                is_admin: 1,
                nivel_acesso: 'superadmin'
            },
            {
                email: 'moderador@educa.com',
                senha: hashedPassword,
                cidade: 'Rio de Janeiro',
                estado: 'RJ', 
                etapa_preferida: 'Ensino Médio',
                is_admin: 1,
                nivel_acesso: 'moderador'
            },
            {
                email: 'editor@educa.com',
                senha: hashedPassword,
                cidade: 'Belo Horizonte',
                estado: 'MG',
                etapa_preferida: 'Ensino Fundamental',
                is_admin: 1,
                nivel_acesso: 'editor'
            },
            {
                email: 'usuario@educa.com',
                senha: hashedPassword,
                cidade: 'Curitiba',
                estado: 'PR',
                etapa_preferida: 'Ensino Básico',
                is_admin: 0,
                nivel_acesso: 'usuario'
            }
        ];

        // Inserir cada usuário
        for (const user of testUsers) {
            const insertQuery = `
                INSERT INTO usuarios 
                (email, senha, cidade, estado, etapa_preferida, is_admin, nivel_acesso, data_cadastro) 
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            `;
            
            await new Promise((resolve, reject) => {
                db.query(insertQuery, [
                    user.email, user.senha, user.cidade, user.estado, 
                    user.etapa_preferida, user.is_admin, user.nivel_acesso
                ], (err, result) => {
                    if (err) reject(err);
                    else {
                        console.log(`✅ ${user.email} criado como ${user.nivel_acesso}`);
                        resolve();
                    }
                });
            });
        }

        console.log('\n🎉 POPULAÇÃO CONCLUÍDA!');
        console.log('📋 USUÁRIOS CRIADOS:');
        console.log('   👑 super@educa.com (superadmin) - senha: senha123');
        console.log('   ⚡ moderador@educa.com (moderador) - senha: senha123');
        console.log('   ✏️ editor@educa.com (editor) - senha: senha123');
        console.log('   👤 usuario@educa.com (usuario) - senha: senha123');

        // Verificar inserção
        const verifyQuery = `
            SELECT email, nivel_acesso, is_admin 
            FROM usuarios 
            WHERE email LIKE '%@educa.com%' 
            ORDER BY FIELD(nivel_acesso, 'superadmin', 'moderador', 'editor', 'usuario')
        `;
        
        db.query(verifyQuery, (err, results) => {
            if (err) {
                console.error('❌ Erro ao verificar inserção:', err);
            } else {
                console.log('\n🔍 VERIFICAÇÃO DO BANCO:');
                console.table(results);
            }
            
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Erro durante a população:', error);
        process.exit(1);
    }
}

// Executar o script
seedTestUsers();