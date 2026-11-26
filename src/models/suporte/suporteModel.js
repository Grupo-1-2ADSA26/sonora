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

function buscarKpis() {
    var instrucaoSql = `
        SELECT
            COUNT(*) AS ocorrencias,
            COALESCE(
                SUM(
                    CASE
                        WHEN tipo = 'Falha'
                        AND status = 'Crítico'
                        THEN 1
                        ELSE 0
                    END
                ),
                0
            ) AS falhas_criticas,
            COALESCE(
                SUM(
                    CASE
                        WHEN tipo = 'Atraso'
                        THEN 1
                        ELSE 0
                    END
                ),
                0
            ) AS atrasos
        FROM log
        WHERE DATE(data_hora) = CURDATE();
    `;

    return database.executar(instrucaoSql);
}

function buscarEmpresasMonitoradas() {
    var instrucaoSql = `
        SELECT COUNT(*) AS empresas
        FROM empresa;
    `;

    return database.executar(instrucaoSql);
}

function buscarOcorrenciasPorHora(data) {
    var instrucaoSql = `
        SELECT
            HOUR(data_hora) AS hora,
            tipo,
            COUNT(*) AS quantidade
        FROM log
        WHERE DATE(data_hora) = ?
        GROUP BY HOUR(data_hora), tipo
        ORDER BY hora, tipo;
    `;

    return database.executar(instrucaoSql, [data]);
}

function buscarOcorrenciasPorDia(dataInicio, dataFim) {
    var instrucaoSql = `
        SELECT
            DATE(data_hora) AS data,
            COUNT(*) AS quantidade
        FROM log
        WHERE data_hora >= ?
          AND data_hora < ?
        GROUP BY DATE(data_hora)
        ORDER BY data;
    `;

    return database.executar(instrucaoSql, [
        dataInicio,
        dataFim
    ]);
}

function buscarOcorrenciasPorTipo(dataInicio, dataFim) {
    var instrucaoSql = `
        SELECT
            tipo,
            COUNT(*) AS quantidade
        FROM log
        WHERE data_hora >= ?
          AND data_hora < ?
        GROUP BY tipo
        ORDER BY quantidade DESC;
    `;

    return database.executar(instrucaoSql, [
        dataInicio,
        dataFim
    ]);
}

function buscarLogsCriticos(dataInicio, dataFim) {
    var instrucaoSql = `
        SELECT
            id_log,
            tipo,
            mensagem,
            data_hora,
            status
        FROM log
        WHERE status = 'Crítico'
          AND data_hora >= ?
          AND data_hora < ?
        ORDER BY data_hora DESC
        LIMIT 10;
    `;

    return database.executar(instrucaoSql, [
        dataInicio,
        dataFim
    ]);
}

function buscarLogsRecentes(dataInicio, dataFim) {
    var instrucaoSql = `
        SELECT
            id_log,
            tipo,
            mensagem,
            data_hora,
            status
        FROM log
        WHERE data_hora >= ?
          AND data_hora < ?
        ORDER BY data_hora DESC
        LIMIT 10;
    `;

    return database.executar(instrucaoSql, [
        dataInicio,
        dataFim
    ]);
}

module.exports = {
    registrarLog,
    listarLogs,
    buscarPorId,
    atualizarStatus,
    deletar,
    buscarKpis,
    buscarEmpresasMonitoradas,
    buscarOcorrenciasPorHora,
    buscarOcorrenciasPorDia,
    buscarOcorrenciasPorTipo,
    buscarLogsCriticos,
    buscarLogsRecentes
};