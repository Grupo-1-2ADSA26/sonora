var database = require("../../database/config");

function cadastrar(nome, data_evento, local_evento, id_empresa) {
    const instrucaoSql = `
        INSERT INTO evento (
            nome,
            data_evento,
            local_evento,
            id_empresa
        )
        VALUES ('${nome}', '${data_evento}', '${local_evento}', ${id_empresa})`;

    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar
}