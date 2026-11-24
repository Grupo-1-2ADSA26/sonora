const { bus } = require("nodemon/lib/utils");
var database = require("../../database/config");

function buscarGenerosArtistas() {
    var instrucaoSql = `
        SELECT genero
        FROM artista
        WHERE genero IS NOT NULL
        AND TRIM(genero) <> '';
    `;

    return database.executar(instrucaoSql);
}

function cadastrarGenero(nome) {
    var instrucaoSql = `
        INSERT IGNORE INTO genero (nome)
        VALUES (?);
    `;

    return database.executar(instrucaoSql, [nome]);
}

function listarPorEmpresa(idEmpresa) {
    var instrucaoSql = `
        SELECT
            g.id_genero,
            g.nome,
            CASE
                WHEN eg.id_genero IS NOT NULL THEN 1
                ELSE 0
            END AS selecionado
        FROM genero g
        LEFT JOIN empresa_genero eg
            ON eg.id_genero = g.id_genero
            AND eg.id_empresa = ?
        ORDER BY g.nome ASC;
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

function limparPreferencias(idEmpresa) {
    var instrucaoSql = `
        DELETE FROM empresa_genero
        WHERE id_empresa = ?;
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

function salvarPreferencias(idEmpresa, idsGeneros) {

    if (idsGeneros.length === 0) {
        return Promise.resolve();
    }

    var placeholders = idsGeneros.map(() => "?").join(", ");

    var instrucaoSql = `
        INSERT IGNORE INTO empresa_genero (
            id_empresa,
            id_genero
        )
        SELECT ?, id_genero
        FROM genero
        WHERE id_genero IN (${placeholders});
    `;

    return database.executar(instrucaoSql, [
        idEmpresa,
        ...idsGeneros
    ]);
}

function buscarArtistasRecomendados(idEmpresa) {
    var instrucaoSql = `
        SELECT DISTINCT
            a.id_artista,
            a.nome,
            a.url_artista,
            a.genero,
            a.genero_status
        FROM artista a
        INNER JOIN empresa_genero eg
            ON eg.id_empresa = ?
        INNER JOIN genero g
            ON g.id_genero = eg.id_genero
        WHERE a.genero IS NOT NULL
          AND LOWER(a.genero) LIKE CONCAT('%', LOWER(g.nome), '%')
        ORDER BY a.nome ASC;
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

module.exports = {
    buscarGenerosArtistas,
    cadastrarGenero,
    listarPorEmpresa,
    limparPreferencias,
    salvarPreferencias,
    buscarArtistasRecomendados
};
