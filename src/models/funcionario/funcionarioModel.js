var database = require("../../database/config");

function cadastrar(nome, email, senha, idEmpresa, idCargo) {
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, id_empresa, id_cargo) 
        VALUES ('${nome}', '${email}', '${senha}', ${idEmpresa}, ${idCargo});
    `;
    return database.executar(instrucaoSql);
}

function listarPorEmpresa(idEmpresa) {
    var instrucaoSql = `
        SELECT 
            u.id_usuario, 
            u.nome, 
            u.email, 
            c.nome AS cargo 
        FROM usuario u
        JOIN cargo c ON u.id_cargo = c.id_cargo
        WHERE u.id_empresa = ${idEmpresa};
    `;
    return database.executar(instrucaoSql);
}

function buscarPorId(idUsuario) {
    var instrucaoSql = `
        SELECT id_usuario, nome, email, id_empresa, id_cargo 
        FROM usuario 
        WHERE id_usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function atualizar(idUsuario, nome, email, senha, idCargo) {
    var instrucaoSql = `
        UPDATE usuario
            SET nome = '${nome}', email = '${email}', senha = '${senha}', id_cargo = ${idCargo}
        WHERE id_usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function atualizarSemSenha(idUsuario, nome, email, idCargo) {
    var instrucaoSql = `
        UPDATE usuario
        SET nome = '${nome}',
            email = '${email}',
            id_cargo = ${idCargo}
        WHERE id_usuario = ${idUsuario};
    `;

    return database.executar(instrucaoSql);
}

function deletar(idUsuario) {
    var instrucaoSql = `
        DELETE FROM usuario 
        WHERE id_usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function autenticar(email, senha) {
    console.log("ACESSEI O FUNCIONARIO MODEL \n \n function autenticar(): ", email, senha);
    
    var instrucaoSql = `
        SELECT 
            u.id_usuario,
            u.nome AS nome_usuario,
            u.email,
            u.id_empresa,
            e.razao_social,
            u.id_cargo,
            c.nome AS nome_cargo
        FROM usuario u
        INNER JOIN empresa e ON u.id_empresa = e.id_empresa
        INNER JOIN cargo c ON u.id_cargo = c.id_cargo
        WHERE u.email = '${email}' AND u.senha = '${senha}';
    `;
    
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// ===== ANÁLISE DO ARTISTA =====
function buscarCabecalhoArtista(idArtista, idEmpresa) {
    var instrucao = `
        SELECT
            a.nome AS nome_artista,
            a.genero AS genero_principal,
            aa.status_aprovacao
        FROM artista a
        LEFT JOIN artista_aprovado aa
            ON aa.id_artista = a.id_artista
           AND aa.id_empresa = ?
        WHERE a.id_artista = ?
        LIMIT 1;
    `;
    return database.executar(instrucao, [idEmpresa, idArtista]);
}

function buscarKpisEPerfilSonoro(idArtista) {
    var instrucao = `
        SELECT 
            AVG(ms.energy) AS media_energy,
            AVG(ms.danceability) AS media_danceability,
            AVG(ms.tempo) AS media_bpm,
            AVG(ms.acousticness) AS acousticness,
            AVG(ms.valence) AS valence,
            AVG(ms.speechiness) AS speechiness
        FROM metrica_streaming ms
        JOIN musica mu ON ms.id_musica = mu.id_musica
        WHERE mu.id_artista = ?;
    `;
    return database.executar(instrucao, [idArtista]);
}

function buscarEngajamentoPlataforma(idArtista) {
    var instrucao = `
        SELECT 
            p.nome AS plataforma,
            SUM(ms.streams) AS streams,
            SUM(ms.views) AS views,
            SUM(ms.likes) AS likes,
            SUM(ms.comentarios) AS comentarios
        FROM metrica_streaming ms
        JOIN plataforma p ON ms.id_plataforma = p.id_plataforma
        JOIN musica mu ON ms.id_musica = mu.id_musica
        WHERE mu.id_artista = ?
        GROUP BY p.id_plataforma, p.nome;
    `;
    return database.executar(instrucao, [idArtista]);
}

// Uma linha por música (as 10 mais ouvidas), em vez de uma por música e plataforma
function buscarVariacaoRitmo(idArtista) {
    var instrucao = `
        SELECT 
            mu.titulo,
            ROUND(AVG(ms.tempo)) AS tempo
        FROM metrica_streaming ms
        JOIN musica mu ON ms.id_musica = mu.id_musica
        WHERE mu.id_artista = ?
        GROUP BY mu.id_musica, mu.titulo
        ORDER BY SUM(ms.streams) DESC
        LIMIT 10;
    `;
    return database.executar(instrucao, [idArtista]);
}

module.exports = {
    cadastrar,
    listarPorEmpresa,
    buscarPorId,
    atualizar,
    atualizarSemSenha,
    deletar,
    autenticar,
    buscarCabecalhoArtista,
    buscarKpisEPerfilSonoro,
    buscarEngajamentoPlataforma,
    buscarVariacaoRitmo
};