USE educa;

-- EDUCAÇÃO BÁSICA (Basico, Fundamental, Medio)
INSERT INTO recursos (titulo, descricao, link_externo, etapa) VALUES
('Khan Academy', 'Plataforma gratuita de ensino online com exercícios, videoaulas e painel de aprendizado personalizado', 'https://pt.khanacademy.org/', 'Basico,Fundamental,Medio'),
('Nova Escola', 'Plataforma de recursos para professores e alunos da educação básica', 'https://novaescola.org.br/', 'Basico,Fundamental,Medio'),
('Portal do MEC', 'Portal oficial do Ministério da Educação com notícias, programas e recursos educacionais', 'https://www.gov.br/mec/', 'Basico,Fundamental,Medio'),
('Plataforma Integrada MEC', 'Plataforma com diversos recursos e serviços do MEC', 'https://plataformaintegrada.mec.gov.br/', 'Basico,Fundamental,Medio'),
('YouTube Edu', 'Canais educacionais certificados pelo YouTube em parceria com a Fundação Lemann', 'https://www.youtube.com/edu', 'Basico,Fundamental,Medio'),
('Escola Digital', 'Plataforma com recursos digitais para professores e estudantes', 'https://escoladigital.org.br/', 'Basico,Fundamental,Medio');

-- EDUCAÇÃO PROFISSIONAL (Tecnico)
INSERT INTO recursos (titulo, descricao, link_externo, etapa) VALUES
('SENAI', 'Serviço Nacional de Aprendizagem Industrial - Cursos técnicos e profissionalizantes', 'https://www.senai.br/', 'Tecnico'),
('SENAC', 'Serviço Nacional de Aprendizagem Comercial - Cursos técnicos e profissionalizantes', 'https://www.senac.br/', 'Tecnico'),
('Instituto Federal', 'Rede de institutos federais de educação, ciência e tecnologia - Cursos técnicos e superiores', 'https://www.ifet.edu.br/', 'Tecnico,Superior'),
('Pronatec', 'Programa Nacional de Acesso ao Ensino Técnico e Emprego', 'https://pronatec.mec.gov.br/', 'Tecnico'),
('Mundo SENAI', 'Plataforma de cursos online do SENAI', 'https://www.mundosenai.com.br/', 'Tecnico');

-- EDUCAÇÃO SUPERIOR (Superior)
INSERT INTO recursos (titulo, descricao, link_externo, etapa) VALUES
('ENEM', 'Exame Nacional do Ensino Médio - Acesso ao ensino superior', 'https://enem.inep.gov.br/', 'Superior'),
('SISU', 'Sistema de Seleção Unificada - Seleção para universidades públicas', 'https://sisu.mec.gov.br/', 'Superior'),
('PROUNI', 'Programa Universidade para Todos - Bolsas de estudo em universidades privadas', 'https://prouni.mec.gov.br/', 'Superior'),
('FIES', 'Fundo de Financiamento Estudantil - Financiamento de cursos superiores', 'https://fies.mec.gov.br/', 'Superior'),
('Universidades Públicas', 'Lista de universidades públicas brasileiras', 'https://www.gov.br/mec/pt-br/universidades-publicas', 'Superior'),
('e-MEC', 'Sistema de regulação do ensino superior', 'https://emec.mec.gov.br/', 'Superior'),
('Capes', 'Coordenação de Aperfeiçoamento de Pessoal de Nível Superior', 'https://www.gov.br/capes/', 'Superior');

-- RECURSOS GERAIS (Múltiplas etapas)
INSERT INTO recursos (titulo, descricao, link_externo, etapa) VALUES
('Biblioteca Digital Mundial', 'Acervo digital gratuito da UNESCO com materiais de todo o mundo', 'https://www.wdl.org/pt/', 'Basico,Fundamental,Medio,Superior'),
('Domínio Público', 'Biblioteca digital desenvolvida pelo MEC com obras em domínio público', 'http://www.dominiopublico.gov.br/', 'Basico,Fundamental,Medio,Superior'),
('Portal do Professor', 'Recursos educacionais para professores de todas as etapas', 'http://portaldoprofessor.mec.gov.br/', 'Basico,Fundamental,Medio');