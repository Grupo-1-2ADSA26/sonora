var database = require("../../database/config");

function buscarCabecalhoArtista(idArtista, idEmpresa) {
    var instrucaoSql = `
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

    return database.executar(instrucaoSql, [idEmpresa, idArtista]);
}

function buscarMetricasPlataforma(idArtista) {
    var instrucaoSql = `
        SELECT
            p.nome AS plataforma,
            SUM(ms.streams) AS streams,
            SUM(ms.views) AS views,
            SUM(ms.likes) AS likes,
            SUM(ms.comentarios) AS comentarios
        FROM metrica_streaming ms
        JOIN plataforma p
            ON ms.id_plataforma = p.id_plataforma
        JOIN musica mu
            ON ms.id_musica = mu.id_musica
        WHERE mu.id_artista = ?
        GROUP BY p.id_plataforma, p.nome;
    `;

    return database.executar(instrucaoSql, [idArtista]);
}

function buscarBpmPorFaixa(idArtista) {
    var instrucaoSql = `
        SELECT
            mu.titulo,
            ROUND(AVG(ms.tempo)) AS tempo
        FROM metrica_streaming ms
        JOIN musica mu
            ON ms.id_musica = mu.id_musica
        WHERE mu.id_artista = ?
        GROUP BY mu.id_musica, mu.titulo
        ORDER BY SUM(ms.streams) DESC
        LIMIT 10;
    `;

    return database.executar(instrucaoSql, [idArtista]);
}

module.exports = {
    buscarCabecalhoArtista,
    buscarMetricasPlataforma,
    buscarBpmPorFaixa
};