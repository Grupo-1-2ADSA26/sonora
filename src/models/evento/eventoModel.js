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
            id_evento,
            nome,
            descricao,
            data_evento,
            local_evento,
            status_evento
        FROM evento
        WHERE id_empresa = ${id_empresa}
        ORDER BY data_evento ASC;
    `;

    return database.executar(instrucaoSql);
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
    atualizar,
    excluir
};