var database = require("../../database/config");

function registrarLog(tipo, mensagem, status) {
    var instrucaoSql = `
        INSERT INTO log (tipo, mensagem, status)
        VALUES (?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        tipo,
        mensagem,
        status
    ]);
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
        WHERE id_log = ?;
    `;

    return database.executar(instrucaoSql, [idLog]);
}

function atualizarStatus(idLog, status) {
    var instrucaoSql = `
        UPDATE log
        SET status = ?
        WHERE id_log = ?;
    `;

    return database.executar(instrucaoSql, [
        status,
        idLog
    ]);
}

function deletar(idLog) {
    var instrucaoSql = `
        DELETE FROM log
        WHERE id_log = ?;
    `;

    return database.executar(instrucaoSql, [idLog]);
}

module.exports = {
    registrarLog,
    listarLogs,
    buscarPorId,
    atualizarStatus,
    deletar
};