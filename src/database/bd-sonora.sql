DROP DATABASE IF EXISTS sonora;

CREATE DATABASE sonora;

USE sonora;


-- =========================================================
-- TABELA: TIPO DE ESTABELECIMENTO
-- =========================================================

CREATE TABLE tipo_estabelecimento (
    id_tipo_estabelecimento INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO tipo_estabelecimento (nome) VALUES
('Casa de Shows'),
('Boate'),
('Bar'),
('Teatro'),
('Centro Cultural'),
('Festival'),
('Arena'),
('Restaurante'),
('Pub'),
('Clube'),
('Outro');


-- =========================================================
-- TABELA: STATUS DA EMPRESA
-- =========================================================

CREATE TABLE status_empresa (
    id_status_empresa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL UNIQUE
);

INSERT INTO status_empresa (nome) VALUES
('ATIVA'),
('PENDENTE');


-- =========================================================
-- TABELA: EMPRESA
-- =========================================================

CREATE TABLE empresa (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(100) NOT NULL,
    email_responsavel VARCHAR(150) NOT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE,

    id_tipo_estabelecimento INT NOT NULL,

    codigo_ativacao VARCHAR(50) NOT NULL UNIQUE,

    id_status_empresa INT NOT NULL DEFAULT 2,

    FOREIGN KEY (id_tipo_estabelecimento)
        REFERENCES tipo_estabelecimento(id_tipo_estabelecimento),

    FOREIGN KEY (id_status_empresa)
        REFERENCES status_empresa(id_status_empresa)
);


-- =========================================================
-- TABELA: CARGO
-- =========================================================

CREATE TABLE cargo (
    id_cargo INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

-- =========================================================
-- TABELA: ACESSO
-- =========================================================

CREATE TABLE acesso (
    id_acesso INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

-- =========================================================
-- TABELA: CARGO ACESSO
-- =========================================================

CREATE TABLE cargo_acesso (
    id_cargo INT NOT NULL,
    id_acesso INT NOT NULL,

    PRIMARY KEY (id_cargo, id_acesso),

    FOREIGN KEY (id_cargo)
        REFERENCES cargo(id_cargo),

    FOREIGN KEY (id_acesso)
        REFERENCES acesso(id_acesso)
);

-- =========================================================
-- TABELA: USUARIO
-- =========================================================

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


-- =========================================================
-- TABELA: STATUS DO EVENTO
-- =========================================================

CREATE TABLE status_evento (
    id_status_evento INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL UNIQUE
);

INSERT INTO status_evento (nome) VALUES
('Planejado'),
('Confirmado'),
('Cancelado'),
('Finalizado');


-- =========================================================
-- TABELA: EVENTO
-- =========================================================

CREATE TABLE evento (
    id_evento INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_evento DATE NOT NULL,
    local_evento VARCHAR(150) NOT NULL,

    id_status_evento INT NOT NULL DEFAULT 1,

    id_empresa INT NOT NULL,

    FOREIGN KEY (id_status_evento)
        REFERENCES status_evento(id_status_evento),

    FOREIGN KEY (id_empresa)
        REFERENCES empresa(id_empresa)
);


-- =========================================================
-- TABELA: GÊNERO
-- =========================================================

CREATE TABLE genero (
    id_genero INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- =========================================================
-- TABELA: GÊNERO - EMPRESA
-- =========================================================

CREATE TABLE empresa_genero (
    id_empresa INT NOT NULL,
    id_genero INT NOT NULL,

    PRIMARY KEY (id_empresa, id_genero),

    FOREIGN KEY (id_empresa)
        REFERENCES empresa(id_empresa),

    FOREIGN KEY (id_genero)
        REFERENCES genero(id_genero)
);


-- =========================================================
-- TABELA: ARTISTA
-- =========================================================

CREATE TABLE artista (
    id_artista INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    url_artista VARCHAR(250),
    genero VARCHAR(250) NULL,
    genero_status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE'
);


-- =========================================================
-- TABELA: MUSICA
-- =========================================================

CREATE TABLE musica (
    id_musica INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(500) NOT NULL,
    album VARCHAR(500),
    id_artista INT NOT NULL,

    FOREIGN KEY (id_artista)
        REFERENCES artista(id_artista)
);


-- =========================================================
-- TABELA: PLATAFORMA
-- =========================================================

CREATE TABLE plataforma (
    id_plataforma INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL
);

INSERT INTO plataforma (id_plataforma, nome) VALUES
(1, 'Spotify'),
(2, 'YouTube');


-- =========================================================
-- TABELA: METRICA_STREAMING
-- =========================================================

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


-- =========================================================
-- TABELA: LOG
-- =========================================================

CREATE TABLE log (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50) NOT NULL,
    mensagem VARCHAR(255) NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL
);


-- =========================================================
-- TABELA: ARTISTA APROVADO
-- =========================================================

CREATE TABLE artista_aprovado (
    id_empresa INT NOT NULL,
    id_artista INT NOT NULL,
    id_usuario INT NOT NULL,
    id_evento INT NOT NULL,

    status_aprovacao VARCHAR(30) NOT NULL DEFAULT 'PENDENTE',
    status_visualizacao VARCHAR(30) NOT NULL DEFAULT 'NAO_VISUALIZADO',

    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id_empresa, id_artista),

    FOREIGN KEY (id_empresa)
        REFERENCES empresa(id_empresa),

    FOREIGN KEY (id_artista)
        REFERENCES artista(id_artista),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),

    FOREIGN KEY (id_evento)
        REFERENCES evento(id_evento)
);


-- =========================================================
-- TABELA: NOTIFICAÇÃO
-- =========================================================

CREATE TABLE notificacao (
    id_usuario INT PRIMARY KEY,

    evento_criado BOOLEAN DEFAULT FALSE,
    evento_atualizado BOOLEAN DEFAULT FALSE,
    evento_cancelado BOOLEAN DEFAULT FALSE,
    evento_proximo BOOLEAN DEFAULT FALSE,

    artista_sugerido BOOLEAN DEFAULT FALSE,
    artista_aprovado BOOLEAN DEFAULT FALSE,
    artista_rejeitado BOOLEAN DEFAULT FALSE,

    analise_concluida BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);


-- =========================================================
-- TABELA: NOTIFICAÇÃO MENSAGEM
-- =========================================================

CREATE TABLE notificacao_mensagem (
    id_notificacao INT PRIMARY KEY AUTO_INCREMENT,

    id_usuario INT NOT NULL,

    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensagem VARCHAR(500) NOT NULL,

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);

-- =========================================================
-- Tabela: Histórico Monitoramento
-- =========================================================

CREATE TABLE historico_monitoramento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    servico VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    tempo_resposta_ms BIGINT NOT NULL,
    data_hora DATETIME(3) NOT NULL
);

CREATE INDEX idx_monitoramento_servico_data
ON historico_monitoramento (servico, data_hora);


-- =========================================================
-- INSERÇÕES DE DADOS INICIAIS
-- =========================================================

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


-- =========================================================
-- EMPRESA SONORA
-- =========================================================

INSERT INTO empresa (
    razao_social,
    email_responsavel,
    cnpj,
    id_tipo_estabelecimento,
    codigo_ativacao,
    id_status_empresa
)
VALUES (
    'Sonora Entretenimento Ltda',
    'contato@sonora.com',
    '12345678000199',
    1,
    'SONORA2026',
    1
);


-- =========================================================
-- USUÁRIO DE SUPORTE
-- =========================================================

INSERT INTO usuario (
    nome,
    email,
    senha,
    id_empresa,
    id_cargo
)
VALUES (
    'Analista de Suporte',
    'suporte@sonora.com',
    'senha_segura_hash',
    1,
    3
);