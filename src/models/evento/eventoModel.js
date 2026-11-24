var database = require("../../database/config");

function cadastrar(nome, descricao, data_evento, local_evento, idStatusEvento, id_empresa) {
    const instrucaoSql = `
        INSERT INTO evento (
            nome,
            descricao,
            data_evento,
            local_evento,
            id_status_evento,
            id_empresa
        )
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        nome,
        descricao,
        data_evento,
        local_evento,
        idStatusEvento,
        id_empresa
    ]);
}

function listarPorEmpresa(id_empresa) {
    const instrucaoSql = `
        SELECT
            e.id_evento,
            e.nome,
            e.descricao,
            DATE_FORMAT(e.data_evento, '%d/%m/%Y') AS data_evento,
            e.local_evento,
            e.id_status_evento,
            se.nome AS status_evento,
            COUNT(aa.id_artista) AS quantidade_artistas
        FROM evento e
        JOIN status_evento se
            ON e.id_status_evento = se.id_status_evento
        LEFT JOIN artista_aprovado aa
            ON aa.id_evento = e.id_evento
            AND aa.id_empresa = e.id_empresa
        WHERE e.id_empresa = ?
        GROUP BY
            e.id_evento,
            e.nome,
            e.descricao,
            e.data_evento,
            e.local_evento,
            e.id_status_evento,
            se.nome
        ORDER BY e.data_evento ASC;
    `;

    return database.executar(instrucaoSql, [id_empresa]);
}

function listarArtistasPorEvento(idEvento, idEmpresa) {
    var instrucaoSql = `
        SELECT
            a.id_artista,
            a.nome AS nome_artista,
            a.genero,
            aa.status_aprovacao
        FROM artista_aprovado aa
        JOIN artista a
            ON aa.id_artista = a.id_artista
        WHERE aa.id_evento = ?
          AND aa.id_empresa = ?
        ORDER BY a.nome;
    `;

    return database.executar(instrucaoSql, [idEvento, idEmpresa]);
}

function atualizar(id_evento, nome, descricao, data_evento, local_evento, idStatusEvento) {
    const instrucaoSql = `
        UPDATE evento
        SET
            nome = ?,
            descricao = ?,
            data_evento = ?,
            local_evento = ?,
            id_status_evento = ?
        WHERE id_evento = ?;
    `;

    return database.executar(instrucaoSql, [
        nome,
        descricao,
        data_evento,
        local_evento,
        idStatusEvento,
        id_evento
    ]);
}

function excluir(id_evento) {
    const instrucaoSql = `
        DELETE FROM evento
        WHERE id_evento = ?;
    `;

    return database.executar(instrucaoSql, [id_evento]);
}

module.exports = {
    cadastrar,
    listarPorEmpresa,
    listarArtistasPorEvento,
    atualizar,
    excluir
};