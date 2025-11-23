CREATE DATABASE  IF NOT EXISTS `educa` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `educa`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: educa
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `noticias`
--

DROP TABLE IF EXISTS `noticias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `noticias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `conteudo` text,
  `data_publicacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('rascunho','agendado','publicado','arquivado') DEFAULT 'rascunho',
  `data_agendamento` datetime DEFAULT NULL,
  `autor_id` int DEFAULT NULL,
  `etapa_educacional` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `autor_id` (`autor_id`),
  KEY `idx_noticias_status` (`status`),
  CONSTRAINT `noticias_ibfk_1` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noticias`
--

LOCK TABLES `noticias` WRITE;
/*!40000 ALTER TABLE `noticias` DISABLE KEYS */;
/*!40000 ALTER TABLE `noticias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recursos`
--

DROP TABLE IF EXISTS `recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` text,
  `link_externo` varchar(500) DEFAULT NULL,
  `etapa` varchar(100) DEFAULT NULL,
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ativo` tinyint(1) DEFAULT '1',
  `data_moderacao` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_recursos_ativo` (`ativo`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recursos`
--

LOCK TABLES `recursos` WRITE;
/*!40000 ALTER TABLE `recursos` DISABLE KEYS */;
INSERT INTO `recursos` VALUES (1,'Khan Academy','Plataforma gratuita de ensino online com exercícios, videoaulas e painel de aprendizado personalizado','https://pt.khanacademy.org/','Basico,Fundamental,Medio','2025-11-12 19:40:58',1,NULL),(2,'Nova Escola','Plataforma de recursos para professores e alunos da educação básica','https://novaescola.org.br/','Basico,Fundamental,Medio','2025-11-12 19:40:58',1,NULL),(3,'Portal do MEC','Portal oficial do Ministério da Educação com notícias, programas e recursos educacionais','https://www.gov.br/mec/','Basico,Fundamental,Medio','2025-11-12 19:40:58',1,NULL),(4,'Plataforma Integrada MEC','Plataforma com diversos recursos e serviços do MEC','https://plataformaintegrada.mec.gov.br/','Basico,Fundamental,Medio','2025-11-12 19:40:58',1,NULL),(5,'YouTube Edu','Canais educacionais certificados pelo YouTube em parceria com a Fundação Lemann','https://www.youtube.com/edu','Basico,Fundamental,Medio','2025-11-12 19:40:58',1,NULL),(6,'Escola Digital','Plataforma com recursos digitais para professores e estudantes','https://escoladigital.org.br/','Basico,Fundamental,Medio','2025-11-12 19:40:58',1,NULL),(7,'SENAI','Serviço Nacional de Aprendizagem Industrial - Cursos técnicos e profissionalizantes','https://www.senai.br/','Tecnico','2025-11-12 19:40:58',1,NULL),(8,'SENAC','Serviço Nacional de Aprendizagem Comercial - Cursos técnicos e profissionalizantes','https://www.senac.br/','Tecnico','2025-11-12 19:40:58',1,NULL),(9,'Instituto Federal','Rede de institutos federais de educação, ciência e tecnologia - Cursos técnicos e superiores','https://www.ifet.edu.br/','Tecnico,Superior','2025-11-12 19:40:58',1,NULL),(10,'Pronatec','Programa Nacional de Acesso ao Ensino Técnico e Emprego','https://pronatec.mec.gov.br/','Tecnico','2025-11-12 19:40:58',1,NULL),(11,'Mundo SENAI','Plataforma de cursos online do SENAI','https://www.mundosenai.com.br/','Tecnico','2025-11-12 19:40:58',1,NULL),(12,'ENEM','Exame Nacional do Ensino Médio - Acesso ao ensino superior','https://enem.inep.gov.br/','Superior','2025-11-12 19:40:58',1,NULL),(13,'SISU','Sistema de Seleção Unificada - Seleção para universidades públicas','https://sisu.mec.gov.br/','Superior','2025-11-12 19:40:58',1,NULL),(14,'PROUNI','Programa Universidade para Todos - Bolsas de estudo em universidades privadas','https://prouni.mec.gov.br/','Superior','2025-11-12 19:40:58',1,NULL),(15,'FIES','Fundo de Financiamento Estudantil - Financiamento de cursos superiores','https://fies.mec.gov.br/','Superior','2025-11-12 19:40:58',1,NULL),(16,'Universidades Públicas','Lista de universidades públicas brasileiras','https://www.gov.br/mec/pt-br/universidades-publicas','Superior','2025-11-12 19:40:58',1,NULL),(17,'e-MEC','Sistema de regulação do ensino superior','https://emec.mec.gov.br/','Superior','2025-11-12 19:40:58',1,NULL),(18,'Capes','Coordenação de Aperfeiçoamento de Pessoal de Nível Superior','https://www.gov.br/capes/','Superior','2025-11-12 19:40:58',1,NULL),(19,'Biblioteca Digital Mundial','Acervo digital gratuito da UNESCO com materiais de todo o mundo','https://www.wdl.org/pt/','Basico,Fundamental,Medio,Superior','2025-11-12 19:40:58',1,NULL),(20,'Domínio Público','Biblioteca digital desenvolvida pelo MEC com obras em domínio público','http://www.dominiopublico.gov.br/','Basico,Fundamental,Medio,Superior','2025-11-12 19:40:58',1,NULL),(21,'Portal do Professor','Recursos educacionais para professores de todas as etapas','http://portaldoprofessor.mec.gov.br/','Basico,Fundamental,Medio','2025-11-12 19:40:58',1,NULL),(22,'Teste de novo recurso','Este é apenas um teste da função de criar novos recursos do site','http://localhost:3000','Basico,Fundamental,Medio','2025-11-20 19:12:30',0,NULL),(23,'teste 2','blablabla tralalero','http://localhost:3000/sobre','Basico,Fundamental,Medio','2025-11-23 01:24:51',0,NULL);
/*!40000 ALTER TABLE `recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recursos_backup`
--

DROP TABLE IF EXISTS `recursos_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos_backup` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recurso_id` int DEFAULT NULL,
  `dados_anteriores` json DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `data_backup` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `motivo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `recursos_backup_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recursos_backup`
--

LOCK TABLES `recursos_backup` WRITE;
/*!40000 ALTER TABLE `recursos_backup` DISABLE KEYS */;
INSERT INTO `recursos_backup` VALUES (1,1,'{\"ativo\": 1, \"etapa\": \"Basico,Fundamental,Medio\", \"titulo\": \"Khan Academy\", \"descricao\": \"Plataforma gratuita de ensino online com exercícios, videoaulas e painel de aprendizado personalizado\", \"link_externo\": \"https://pt.khanacademy.org/\"}',1,'2025-11-20 19:11:12','exclusao'),(2,22,'{\"ativo\": 1, \"etapa\": \"Basico,Fundamental,Medio\", \"titulo\": \"Teste de novo recurso\", \"descricao\": \"Este é apenas um teste da função de criar novos recursos do site\", \"link_externo\": \"http://localhost:3000\"}',1,'2025-11-20 19:12:46','exclusao');
/*!40000 ALTER TABLE `recursos_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sistema_logs`
--

DROP TABLE IF EXISTS `sistema_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sistema_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_log` enum('admin','seguranca','login','backup','permissao') NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `acao` varchar(100) NOT NULL,
  `descricao` text,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `metadata` json DEFAULT NULL,
  `data_log` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `idx_logs_tipo_data` (`tipo_log`,`data_log`),
  CONSTRAINT `sistema_logs_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sistema_logs`
--

LOCK TABLES `sistema_logs` WRITE;
/*!40000 ALTER TABLE `sistema_logs` DISABLE KEYS */;
INSERT INTO `sistema_logs` VALUES (1,'admin',1,'alterar_nivel_acesso','Alterou nível de acesso do usuário 2 para editor','::ffff:127.0.0.1',NULL,NULL,'2025-11-20 19:10:00'),(2,'admin',1,'excluir_recurso','Excluiu recurso ID: 1','::ffff:127.0.0.1',NULL,NULL,'2025-11-20 19:11:12'),(3,'admin',1,'restaurar_recurso','Restaurou recurso ID: 1','::ffff:127.0.0.1',NULL,NULL,'2025-11-20 19:11:16'),(4,'admin',1,'criar_recurso','Criou recurso: Teste de novo recurso','::ffff:127.0.0.1',NULL,NULL,'2025-11-20 19:12:30'),(5,'admin',1,'excluir_recurso','Excluiu recurso ID: 22','::ffff:127.0.0.1',NULL,NULL,'2025-11-20 19:12:46'),(12,'permissao',1,'Atualização de Permissões','Alterou permissões de super@educa.com: moderador → superadmin (is_admin: true)','::ffff:127.0.0.1',NULL,NULL,'2025-11-22 21:24:41'),(35,'permissao',12,'Atualização de Permissões','Alterou permissões de editor@educa.com: editor → usuario (is_admin: false)','::ffff:127.0.0.1',NULL,NULL,'2025-11-23 03:16:23'),(36,'permissao',12,'Atualização de Permissões','Alterou permissões de editor@educa.com: usuario → editor (is_admin: true)','::ffff:127.0.0.1',NULL,NULL,'2025-11-23 03:16:30');
/*!40000 ALTER TABLE `sistema_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` varchar(2) DEFAULT NULL,
  `etapa_preferida` varchar(50) DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_admin` tinyint(1) DEFAULT '0',
  `nivel_acesso` enum('superadmin','moderador','editor','usuario') DEFAULT 'usuario',
  `ultimo_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_usuarios_admin` (`is_admin`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'daniel.amparado.junior@gmail.com','$2b$10$raPEBCHAZUWWoE2bUg2Z3eU5OxkdS4sgKgoQYBJrW4gHU/y4yAQhu','Franca','SP','Superior','2025-11-12 21:12:08',1,'superadmin',NULL),(12,'super@educa.com','$2b$10$Mc06mCksyckYHAxq4GhPleEnfiThboyY0WRTv5UsbKodrClQaGKX2','São Paulo','SP','Superior','2025-11-23 03:14:13',1,'superadmin',NULL),(13,'moderador@educa.com','$2b$10$Mc06mCksyckYHAxq4GhPleEnfiThboyY0WRTv5UsbKodrClQaGKX2','Rio de Janeiro','RJ','Medio','2025-11-23 03:14:13',1,'moderador',NULL),(14,'editor@educa.com','$2b$10$Mc06mCksyckYHAxq4GhPleEnfiThboyY0WRTv5UsbKodrClQaGKX2','Belo Horizonte','MG','Fundamental','2025-11-23 03:14:13',1,'editor',NULL),(15,'usuario@educa.com','$2b$10$Mc06mCksyckYHAxq4GhPleEnfiThboyY0WRTv5UsbKodrClQaGKX2','Curitiba','PR','Basico','2025-11-23 03:14:13',0,'usuario',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'educa'
--

--
-- Dumping routines for database 'educa'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-23  0:46:37
