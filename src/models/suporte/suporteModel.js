var database = require("../../database/config");

function registrarLog(tipo, mensagem, status) {
    var instrucaoSql = `
        INSERT INTO log (tipo, mensagem, status) 
        VALUES ('${tipo}', '${mensagem}', '${status}');
    `;
    return database.executar(instrucaoSql);
}

function listarLogs() {
    var instrucaoSql = `
        SELECT id_log, tipo, mensagem, data_hora, status 
        FROM log 
        ORDER BY data_hora DESC;
    `;
    return database.executar(instrucaoSql);
}

function buscarPorId(idLog) {
    var instrucaoSql = `
        SELECT id_log, tipo, mensagem, data_hora, status 
        FROM log 
        WHERE id_log = ${idLog};
    `;
    return database.executar(instrucaoSql);
}

function atualizarStatus(idLog, status) {
    var instrucaoSql = `
        UPDATE log 
        SET status = '${status}' 
        WHERE id_log = ${idLog};
    `;
    return database.executar(instrucaoSql);
}

function deletar(idLog) {
    var instrucaoSql = `
        DELETE FROM log 
        WHERE id_log = ${idLog};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    registrarLog,
    listarLogs,
    buscarPorId,
    atualizarStatus,
    deletar
};