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