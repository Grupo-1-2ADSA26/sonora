CREATE DATABASE sonora;

USE sonora;


-- TABELA: EMPRESA
CREATE TABLE empresa (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_estabelecimento VARCHAR(100) NOT NULL
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
    data_evento DATE,
    local_evento VARCHAR(150),

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

-- =============================================
-- 4. CADASTRO DA EMPRESA
-- =============================================
INSERT INTO empresa (nome, cnpj, senha, tipo_estabelecimento) VALUES 
('Sonora Eventos LTDA', '12.345.678/0001-90', 'senha123', 'Casa de Shows');

-- =============================================
-- 5. CADASTRO DOS USUÁRIOS DE TESTE
-- =============================================
INSERT INTO usuario (nome, email, senha, id_empresa, id_cargo) VALUES 
('Carla ADM', 'carla@sonora.com', '123456', 1, 1),       -- Persona Carla (ADM)
('Lucas Operacional', 'lucas@sonora.com', '123456', 1, 2),-- Persona Lucas (Operacional)
('Suporte Técnico', 'suporte@sonora.com', '123456', 1, 3);-- Suporte


SELECT 
    u.id_usuario,
    u.nome AS nome_usuario,
    u.email,
    u.id_empresa,
    e.nome AS nome_empresa,
    u.id_cargo,
    c.nome AS nome_cargo
FROM usuario u
JOIN empresa e ON u.id_empresa = e.id_empresa
JOIN cargo c ON u.id_cargo = c.id_cargo
WHERE u.email = 'carla@sonora.com' AND u.senha = '123456';

select * from empresa;