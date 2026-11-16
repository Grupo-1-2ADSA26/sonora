var database = require("../../database/config");

function cadastrar(nome, descricao, data_evento, local_evento, status_evento, id_empresa) {
    const instrucaoSql = `
        INSERT INTO evento (
            nome,
            descricao,
            data_evento,
            local_evento,
            status_evento,
            id_empresa
        )
        VALUES (
            '${nome}',
            '${descricao}',
            '${data_evento}',
            '${local_evento}',
            '${status_evento}',
            ${id_empresa}
        );
    `;
    return database.executar(instrucaoSql);
}

function listarPorEmpresa(id_empresa) {
    const instrucaoSql = `
        SELECT
            e.id_evento,
            e.nome,
            e.descricao,
            DATE_FORMAT(e.data_evento, '%d/%m/%Y') AS data_evento,
            e.local_evento,
            e.status_evento,
            COUNT(aa.id_artista) AS quantidade_artistas
        FROM evento e
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
            e.status_evento
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

function atualizar(id_evento, nome, descricao, data_evento, local_evento, status_evento) {
    const instrucaoSql = `
        UPDATE evento
        SET
            nome = '${nome}',
            descricao = '${descricao}',
            data_evento = '${data_evento}',
            local_evento = '${local_evento}',
            status_evento = '${status_evento}'
        WHERE id_evento = ${id_evento};
    `;

    return database.executar(instrucaoSql);
}

function excluir(id_evento) {
    const instrucaoSql = `
        DELETE FROM evento
        WHERE id_evento = ${id_evento};
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    listarPorEmpresa,
    listarArtistasPorEvento,
    atualizar,
    excluir
};