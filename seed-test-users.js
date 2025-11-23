// seed-test-users.js
const db = require('./backend/config/database');
const bcrypt = require('bcrypt');

async function seedTestUsers() {
    try {
        console.log('Limpando usuários de teste existentes...');
        
        console.log('Limpando registros relacionados...');
        
        // 1. Limpar registros em recursos_backup que referenciam os usuários
        const deleteBackupQuery = `
            DELETE FROM recursos_backup 
            WHERE usuario_id IN (SELECT id FROM usuarios WHERE email LIKE '%@educa.com%')
        `;
        
        // 2. Limpar registros em sistema_logs que referenciam os usuários
        const deleteLogsQuery = `
            DELETE FROM sistema_logs 
            WHERE usuario_id IN (SELECT id FROM usuarios WHERE email LIKE '%@educa.com%')
        `;

        // 3. Limpar registros em noticias que referenciam os usuários (se existirem)
        const deleteNoticiasQuery = `
            DELETE FROM noticias 
            WHERE autor_id IN (SELECT id FROM usuarios WHERE email LIKE '%@educa.com%')
        `;

        // Executar as limpezas em sequência
        await new Promise((resolve, reject) => {
            db.query(deleteBackupQuery, (err, result) => {
                if (err) {
                    console.log('Nenhum registro em recursos_backup para limpar');
                    resolve();
                } else {
                    console.log(`${result.affectedRows} registros em recursos_backup removidos`);
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            db.query(deleteLogsQuery, (err, result) => {
                if (err) {
                    console.log('Nenhum registro em sistema_logs para limpar');
                    resolve();
                } else {
                    console.log(`${result.affectedRows} registros em sistema_logs removidos`);
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            db.query(deleteNoticiasQuery, (err, result) => {
                if (err) {
                    console.log('Nenhum registro em noticias para limpar');
                    resolve();
                } else {
                    console.log(`${result.affectedRows} registros em noticias removidos`);
                    resolve();
                }
            });
        });

        const deleteQuery = "DELETE FROM usuarios WHERE email LIKE '%@educa.com%'";
        await new Promise((resolve, reject) => {
            db.query(deleteQuery, (err, result) => {
                if (err) reject(err);
                else {
                    console.log(`${result.affectedRows} usuários de teste removidos`);
                    resolve();
                }
            });
        });

        console.log('🎯 Criando usuários de teste...');

        // Hash da senha comum (senha123)
        const hashedPassword = await bcrypt.hash('senha123', 10);

        const testUsers = [
            {
                email: 'super@educa.com',
                senha: hashedPassword,
                cidade: 'São Paulo',
                estado: 'SP',
                etapa_preferida: 'Superior',
                is_admin: 1,
                nivel_acesso: 'superadmin'
            },
            {
                email: 'moderador@educa.com',
                senha: hashedPassword,
                cidade: 'Rio de Janeiro',
                estado: 'RJ', 
                etapa_preferida: 'Medio',
                is_admin: 1,
                nivel_acesso: 'moderador'
            },
            {
                email: 'editor@educa.com',
                senha: hashedPassword,
                cidade: 'Belo Horizonte',
                estado: 'MG',
                etapa_preferida: 'Fundamental',
                is_admin: 1,
                nivel_acesso: 'editor'
            },
            {
                email: 'usuario@educa.com',
                senha: hashedPassword,
                cidade: 'Curitiba',
                estado: 'PR',
                etapa_preferida: 'Basico',
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
                        console.log(`${user.email} criado como ${user.nivel_acesso} (etapa: ${user.etapa_preferida})`);
                        resolve();
                    }
                });
            });
        }

        console.log('\nPOPULAÇÃO CONCLUÍDA!');
        console.log('USUÁRIOS CRIADOS:');
        console.log('   super@educa.com (superadmin) - etapa: Superior');
        console.log('   moderador@educa.com (moderador) - etapa: Medio');
        console.log('   editor@educa.com (editor) - etapa: Fundamental');
        console.log('   usuario@educa.com (usuario) - etapa: Basico');
        console.log('   Senha para todos: senha123');

        // Verificação final
        const verifyQuery = `
            SELECT email, nivel_acesso, etapa_preferida 
            FROM usuarios 
            WHERE email LIKE '%@educa.com%' 
            ORDER BY FIELD(nivel_acesso, 'superadmin', 'moderador', 'editor', 'usuario')
        `;
        
        db.query(verifyQuery, (err, results) => {
            if (err) {
                console.error('Erro ao verificar inserção:', err);
            } else {
                console.log('\nVERIFICAÇÃO DO BANCO:');
                console.table(results);
            }
            
            process.exit(0);
        });

    } catch (error) {
        console.error('Erro durante a população:', error);
        process.exit(1);
    }
}

seedTestUsers();