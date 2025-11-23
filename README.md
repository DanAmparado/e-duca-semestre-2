E-DUCA - Sistema de Democratização do Acesso à Educação

Sobre o Projeto
O E-DUCA é uma plataforma web inovadora desenvolvida para democratizar o acesso à educação no Brasil. A plataforma oferece recursos educacionais organizados por etapas de ensino, sistema de recomendações personalizadas baseadas no perfil do usuário e um painel administrativo completo para gerenciamento de conteúdo.

Data de Entrega: 24 de Novembro de 2025

Equipe de Desenvolvimento
- Daniel Lemos Amparado Jr
- César Henrique Ramos da Silva
- Victor Medeiros Fidalgo

Tecnologias Utilizadas

Backend
- Node.js + Express.js - Servidor e API
- EJS - Template engine para views
- MySQL - Banco de dados relacional
- BCrypt - Criptografia de senhas
- Express-session - Gerenciamento de sessões

Frontend
- Bootstrap 5 - Framework CSS
- Chart.js - Gráficos e visualizações
- JavaScript - Interatividade
- Bootstrap Icons - Ícones

Banco de Dados
- MySQL 8.0 - Sistema de gerenciamento de banco de dados
- Chaves estrangeiras - Integridade referencial
- Backup automático - Histórico de alterações

Como Executar o Projeto Localmente

Pré-requisitos
Antes de começar, certifique-se de ter instalado em sua máquina:
- Node.js (versão 14 ou superior)
- MySQL (versão 8.0 ou superior)
- Git

Passo a Passo para Configuração

1. Clone o Repositório
git clone https://github.com/DanAmparado/e-duca-semestre-2
cd e-duca-semestre-2

2. Instale as Dependências
npm install

3. Configure o Banco de Dados

Crie o banco de dados:
CREATE DATABASE educa;

Importe a estrutura (se houver um arquivo SQL):
mysql -u root -p educa < database/educa_dump.sql

4. Configure a Conexão com o Banco
Edite o arquivo backend/config/database.js com suas credenciais:

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',           // Seu usuário MySQL
    password: 'sua_senha',  // Sua senha MySQL
    database: 'educa',
    connectionLimit: 10
});

5. Popule o Banco com Dados de Teste
node seed-test-users.js

Usuários criados automaticamente:
- super@educa.com (superadmin) - senha: senha123
- moderador@educa.com (moderador) - senha: senha123
- editor@educa.com (editor) - senha: senha123
- usuario@educa.com (usuário) - senha: senha123

6. Execute a Aplicação
Produção:
npm start

Desenvolvimento (com auto-reload):
npm run dev

7. Acesse a Aplicação
Abra seu navegador e visite: http://localhost:3000

Funcionalidades da Plataforma

Para Usuários Comuns
- Cadastro e Login - Sistema seguro de autenticação
- Perfil Personalizável - Editar cidade, estado e etapa de interesse
- Recomendações Inteligentes - Recursos sugeridos baseados no perfil
- Busca Avançada - Encontrar recursos por etapa educacional
- Navegação Intuitiva - Interface amigável e responsiva

Para Administradores
- Painel Administrativo - Dashboard com estatísticas em tempo real
- Gerenciamento de Usuários - Controle de permissões e níveis de acesso
- CRUD de Recursos - Criar, editar, ativar/desativar recursos
- Sistema de Logs - Histórico completo de atividades
- Relatórios Detalhados - Gráficos e métricas do sistema

Estrutura do Projeto

e-duca/
├── backend/
│   ├── config/           # Configurações do sistema
│   │   └── database.js   # Conexão com MySQL
│   ├── controllers/      # Lógica de negócio
│   ├── middleware/       # Autenticação e validações
│   ├── models/          # Modelos de dados
│   ├── routes/          # Definição de rotas
│   └── server.js        # Ponto de entrada
├── frontend/
│   ├── public/          # Arquivos estáticos
│   │   ├── css/         # Estilos customizados
│   │   ├── js/          # Scripts do frontend
│   │   └── images/      # Imagens e logos
│   └── views/           # Templates EJS
│       ├── pages/       # Páginas principais
│       ├── admin/       # Painel administrativo
│       └── partials/    # Componentes reutilizáveis
├── seed-test-users.js   # Populador do banco
└── package.json         # Dependências e scripts

Sistema de Permissões

Níveis de Acesso
1. Usuário - Acesso básico às funcionalidades
2. Editor - Pode criar e editar recursos
3. Moderador - Gerencia recursos e usuários
4. Super Admin - Acesso total ao sistema

Recursos Educacionais

Etapas de Ensino Suportadas
- Ensino Básico - Educação infantil e fundamental I
- Ensino Fundamental - Fundamental II
- Ensino Médio - Preparação para vestibulares
- Ensino Técnico - Formação profissional
- Ensino Superior - Graduação e pós-graduação

Solução de Problemas Comuns

Erro de Conexão com MySQL
Verifique se o MySQL está rodando:
sudo service mysql start

Confirme as credenciais no database.js

Porta 3000 Ocupada
Encerre processos na porta:
npx kill-port 3000

Ou execute em outra porta:
PORT=3001 npm start

Dependências com Problemas
Limpe e reinstale:
rm -rf node_modules package-lock.json
npm install

Erro de Chave Estrangeira
Execute o seed com verificação de FKs:
node seed-test-users.js

Estrutura do Banco de Dados

Tabelas Principais
- usuarios - Dados dos usuários e permissões
- recursos - Recursos educacionais com metadados
- sistema_logs - Auditoria de atividades
- recursos_backup - Versionamento de recursos
- noticias - Sistema de notícias (futuro)

Desenvolvimento

Scripts Disponíveis
npm start          # Produção
npm run dev        # Desenvolvimento com nodemon

Padrões de Código
- Controllers - Lógica de negócio separada por módulos
- Middleware - Autenticação e validações centralizadas
- Views - Templates EJS com partials reutilizáveis
- CSS - Bootstrap 5 com customizações

Destaques do Projeto

- Interface responsiva - Funciona em desktop e mobile
- Sistema de recomendações inteligente - Personalizado por perfil
- Painel administrativo completo - Gestão total do sistema
- Segurança robusta - Criptografia de senhas e proteção contra SQL injection
- Backup automático - Histórico de alterações para rollback
- Logs de auditoria - Rastreabilidade completa de ações

Suporte

Em caso de dificuldades na instalação ou execução:

1. Verifique os pré-requisitos - Node.js, MySQL e Git instalados
2. Confirme as credenciais do banco no database.js
3. Execute o script de população do banco (seed-test-users.js)
4. Verifique os logs no terminal para mensagens de erro específicas

Desenvolvido com dedicação para transformar a educação brasileira

Projeto acadêmico - Sistema de Democratização do Acesso à Educação
