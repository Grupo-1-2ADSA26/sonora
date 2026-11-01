DROP DATABASE IF EXISTS sonora;

CREATE DATABASE sonora;

USE sonora;

-- TABELA: EMPRESA
CREATE TABLE empresa (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(100) NOT NULL,
    email_responsavel VARCHAR(150) NOT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    tipo_estabelecimento VARCHAR(150) NOT NULL,
    codigo_ativacao VARCHAR(50) NOT NULL UNIQUE,
    status_codigo ENUM('ATIVA', 'PENDENTE') NOT NULL DEFAULT 'PENDENTE'
);

-- TABELA: CARGO
CREATE TABLE cargo (
    id_cargo INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

-- TABELA: ACESSO
CREATE TABLE acesso (
    id_acesso INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

-- TABELA: CARGO ACESSO
CREATE TABLE cargo_acesso (
    id_cargo INT NOT NULL,
    id_acesso INT NOT NULL,
    PRIMARY KEY (id_cargo, id_acesso),
    FOREIGN KEY (id_cargo) REFERENCES cargo(id_cargo),
    FOREIGN KEY (id_acesso) REFERENCES acesso(id_acesso)
);

-- TABELA: USUARIO
CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    id_empresa INT NOT NULL,
    id_cargo INT NOT NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa),
    FOREIGN KEY (id_cargo) REFERENCES cargo(id_cargo)
);

-- TABELA: EVENTO
CREATE TABLE evento (
    id_evento INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_evento DATE NOT NULL,
    local_evento VARCHAR(150) NOT NULL,
    status_evento ENUM(
        'Planejado',
        'Confirmado',
        'Cancelado',
        'Finalizado'
    ) DEFAULT 'Planejado',
    id_empresa INT NOT NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa)
);

-- TABELA: GÊNERO
CREATE TABLE genero (
    id_genero INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- TABELA: GÊNERO - EMPRESA
CREATE TABLE empresa_genero (
    id_empresa INT NOT NULL,
    id_genero INT NOT NULL,
    PRIMARY KEY (id_empresa, id_genero),
    FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa),
    FOREIGN KEY (id_genero) REFERENCES genero(id_genero)
);

-- TABELA: ARTISTA
CREATE TABLE artista (
    id_artista INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    url_artista VARCHAR(250),
    genero VARCHAR(250) NULL,
    genero_status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE'
);

-- TABELA: MUSICA 
CREATE TABLE musica (
    id_musica INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(500) NOT NULL,
    album VARCHAR(500),
    id_artista INT NOT NULL,
    FOREIGN KEY (id_artista) REFERENCES artista(id_artista)
);

-- TABELA: PLATAFORMA
CREATE TABLE plataforma (
    id_plataforma INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL
);

-- TABELA: METRICA_STREAMING
CREATE TABLE metrica_streaming (
    id_metrica INT PRIMARY KEY AUTO_INCREMENT,
    views BIGINT,
    likes BIGINT,
    comentarios BIGINT,
    streams BIGINT,
    danceability DECIMAL(5,3),
    energy DECIMAL(5,3),
    loudness DECIMAL(6,3),
    speechiness DECIMAL(5,3),
    acousticness DECIMAL(5,3),
    valence DECIMAL(5,3),
    tempo DECIMAL(7,3),
    duracao_ms INT,
    id_musica INT NOT NULL,
    id_plataforma INT NOT NULL,
    FOREIGN KEY (id_musica) REFERENCES musica(id_musica),
    FOREIGN KEY (id_plataforma) REFERENCES plataforma(id_plataforma)
);

-- TABELA: LOG
CREATE TABLE log (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50) NOT NULL,
    mensagem VARCHAR(255) NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL
);

-- TABELA: ARTISTA APROVADO 
CREATE TABLE artista_aprovado (
    id_empresa INT NOT NULL,
    id_artista INT NOT NULL,
    id_usuario INT NOT NULL,
    id_evento INT NOT NULL,
    status_aprovacao VARCHAR(30) NOT NULL DEFAULT 'PENDENTE',
    status_visualizacao VARCHAR(30) NOT NULL DEFAULT 'NAO_VISUALIZADO',
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_empresa, id_artista),
    FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa),
    FOREIGN KEY (id_artista) REFERENCES artista(id_artista),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_evento) REFERENCES evento(id_evento)
);

-- INSERÇÕES DE DADOS INICIAIS
INSERT INTO cargo (nome) VALUES 
('Gerente / ADM (Carla)'),
('Operacional (Lucas)'),
('Suporte do Sistema');

INSERT INTO acesso (nome) VALUES 
('Tela Empresa / Perfil'),
('Tela Operacional / Dashboard'),
('Tela Suporte / Chamados');

INSERT INTO cargo_acesso (id_cargo, id_acesso) VALUES 
(1, 1),
(2, 2),
(3, 3);

INSERT INTO plataforma (id_plataforma, nome) VALUES 
(1, 'Spotify'),
(2, 'YouTube');

USE sonora;

-- 1. Cadastrar a Empresa Sonora
INSERT INTO empresa (razao_social, email_responsavel, cnpj, tipo_estabelecimento, codigo_ativacao, status_codigo) 
VALUES ('Sonora Entretenimento Ltda', 'contato@sonora.com', '12345678000199', 'Casa de Shows', 'SONORA2026', 'ATIVA');

-- 2. Cadastrar o Usuário de Suporte vinculado à Empresa Sonora (id_empresa = 1) e ao Cargo Suporte (id_cargo = 3)
INSERT INTO usuario (nome, email, senha, id_empresa, id_cargo) 
VALUES ('Analista de Suporte', 'suporte@sonora.com', 'senha_segura_hash', 1, 3);