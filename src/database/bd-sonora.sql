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

    FOREIGN KEY (id_cargo)
        REFERENCES cargo(id_cargo),

    FOREIGN KEY (id_acesso)
        REFERENCES acesso(id_acesso)
);



-- TABELA: USUARIO
CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,

    id_empresa INT NOT NULL,
    id_cargo INT NOT NULL,

    FOREIGN KEY (id_empresa)
        REFERENCES empresa(id_empresa),

    FOREIGN KEY (id_cargo)
        REFERENCES cargo(id_cargo)
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
    FOREIGN KEY (id_empresa)
        REFERENCES empresa(id_empresa)
);

-- TABELA: ARTISTA
CREATE TABLE artista (
    id_artista INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);


-- TABELA: MUSICA
CREATE TABLE musica (
    id_musica INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    album VARCHAR(150),
    genero VARCHAR(100),

    id_artista INT NOT NULL,

    FOREIGN KEY (id_artista)
        REFERENCES artista(id_artista)
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

    FOREIGN KEY (id_musica)
        REFERENCES musica(id_musica),

    FOREIGN KEY (id_plataforma)
        REFERENCES plataforma(id_plataforma)
);


-- TABELA: LOG
CREATE TABLE log (
    id_log INT PRIMARY KEY AUTO_INCREMENT,

    tipo VARCHAR(50) NOT NULL,
    mensagem VARCHAR(255) NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL
);

CREATE TABLE empresa_artista (
    id_empresa INT NOT NULL,
    id_artista INT NOT NULL,
    status_aprovacao VARCHAR(30) NOT NULL DEFAULT 'PENDENTE',
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_empresa, id_artista),
    FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa),
    FOREIGN KEY (id_artista) REFERENCES artista(id_artista)
);


-- =============================================
-- 1. CADASTRO DOS CARGOS (Personas)
-- =============================================
INSERT INTO cargo (nome) VALUES 
('Gerente / ADM (Carla)'),      -- id_cargo = 1
('Operacional (Lucas)'),         -- id_cargo = 2
('Suporte do Sistema');          -- id_cargo = 3

-- =============================================
-- 2. CADASTRO DOS ACESSOS / TELAS DO SISTEMA
-- =============================================
INSERT INTO acesso (nome) VALUES 
('Tela Empresa / Perfil'),        -- id_acesso = 1
('Tela Operacional / Dashboard'), -- id_acesso = 2
('Tela Suporte / Chamados');      -- id_acesso = 3

-- =============================================
-- 3. ASSOCIAÇÃO DE CARGOS E ACESSOS (cargo_acesso)
-- =============================================
INSERT INTO cargo_acesso (id_cargo, id_acesso) VALUES 
(1, 1), -- ADM (Carla) -> Tela Empresa
(2, 2), -- Operacional (Lucas) -> Tela Operacional
(3, 3); -- Suporte -> Tela Suporte