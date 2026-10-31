var database = require("../../database/config");

function listarAprovadosPorEmpresa(idEmpresa) {
    var instrucaoSql = `
        SELECT
            u.nome AS criador,
            a.id_artista,
            a.nome AS nome_artista,
            MAX(m.genero) AS genero,
            ROUND(AVG(ms.energy), 2) AS energy,
            ROUND(AVG(ms.danceability), 2) AS danceability,
            ROUND(AVG(ms.tempo)) AS bpm,
            LEAST(ROUND(AVG(ms.streams) / 500000), 100) AS popularidade
        FROM artista_aprovado aa
        JOIN usuario u ON aa.id_usuario = u.id_usuario
        JOIN artista a ON aa.id_artista = a.id_artista
        LEFT JOIN musica m ON a.id_artista = m.id_artista
        LEFT JOIN metrica_streaming ms ON m.id_musica = ms.id_musica
        WHERE aa.id_empresa = ${idEmpresa} 
          AND aa.status_aprovacao = 'APROVADO'
        GROUP BY u.id_usuario, u.nome, a.id_artista, a.nome;
    `;
    return database.executar(instrucaoSql);
}

function enviarParaAprovados(idEmpresa, idArtista, idUsuario, idEvento) {
    var instrucaoSql = `
        INSERT INTO artista_aprovado (
            id_empresa,
            id_artista,
            id_usuario,
            id_evento
        ) VALUES (
            ${idEmpresa},
            ${idArtista},
            ${idUsuario},
            ${idEvento}
        );
    `;
    return database.executar(instrucaoSql);
}

function verificarArtistaEnviado(idEmpresa, idArtista) {
    var instrucaoSql = `
        SELECT id_artista
        FROM artista_aprovado
        WHERE id_empresa = ${idEmpresa}
          AND id_artista = ${idArtista};
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    listarAprovadosPorEmpresa,
    enviarParaAprovados,
    verificarArtistaEnviado
}