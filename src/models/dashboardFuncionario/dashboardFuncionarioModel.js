var database = require("../../database/config");

function obterCondicaoPeriodo(filtroPeriodo, colunaData, inicio, fim) {
    if (filtroPeriodo === 'mes_atual') {
        return `AND MONTH(${colunaData}) = MONTH(CURRENT_DATE()) AND YEAR(${colunaData}) = YEAR(CURRENT_DATE())`;
    } else if (filtroPeriodo === '3_meses') {
        return `AND ${colunaData} >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)`;
    } else if (filtroPeriodo === '6_meses') {
        return `AND ${colunaData} >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)`;
    } else if (filtroPeriodo === 'futuros') {
        return `AND ${colunaData} >= CURDATE()`;
    } else if (filtroPeriodo === 'personalizado' && inicio && fim) {
        return `AND ${colunaData} BETWEEN '${inicio}' AND '${fim}'`;
    }
    return '';
}

function buscarShowMaisProximo(idEmpresa, filtroPeriodo, inicio, fim) {
    var condicao = obterCondicaoPeriodo(filtroPeriodo, 'data_evento', inicio, fim);
    // Se o filtro for 'futuros', já garantimos data >= CURDATE(), senão usa o período escolhido
    var filtroExtra = (filtroPeriodo === 'futuros') ? '' : 'AND data_evento >= CURDATE()';

    var instrucaoSql = `
        SELECT nome AS nome_evento, DATE_FORMAT(data_evento, '%d/%m/%Y') AS data_evento 
        FROM evento 
        WHERE id_empresa = ? ${filtroExtra} ${condicao} 
        ORDER BY data_evento ASC LIMIT 1;
    `;
    return database.executar(instrucaoSql, [idEmpresa]);
}

function buscarGeneroPredominante(idEmpresa, filtroPeriodo, inicio, fim) {
    var condicao = obterCondicaoPeriodo(filtroPeriodo, 'e.data_evento', inicio, fim);
    var instrucaoSql = `
        SELECT t.genero AS genero, COUNT(*) AS total
        FROM artista a
        JOIN artista_aprovado ap ON a.id_artista = ap.id_artista
        JOIN evento e ON ap.id_evento = e.id_evento
        JOIN JSON_TABLE(
            CONCAT('["', REPLACE(a.genero, ', ', '","'), '"]'),
            '$[*]' COLUMNS (genero VARCHAR(100) PATH '$')
        ) AS t
        WHERE ap.id_empresa = ? ${condicao}
        GROUP BY t.genero
        ORDER BY total DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql, [idEmpresa]);
}

function buscarArtistasPendentesTotal(idEmpresa, filtroPeriodo, inicio, fim) {
    var condicao = obterCondicaoPeriodo(filtroPeriodo, 'e.data_evento', inicio, fim);
    var instrucaoSql = `
        SELECT 
            SUM(CASE WHEN ap.status_aprovacao = 'PENDENTE' THEN 1 ELSE 0 END) AS pendentes,
            COUNT(*) AS total
        FROM artista_aprovado ap
        JOIN evento e ON ap.id_evento = e.id_evento
        WHERE ap.id_empresa = ? ${condicao};
    `;
    return database.executar(instrucaoSql, [idEmpresa]);
}

function buscarArtistasPorEvento(idEmpresa, filtroPeriodo, inicio, fim) {
    var condicao = obterCondicaoPeriodo(filtroPeriodo, 'e.data_evento', inicio, fim);
    var instrucaoSql = `
        SELECT e.nome AS evento,
               SUM(CASE WHEN ap.status_aprovacao = 'APROVADO' OR ap.status_aprovacao = 'ANALISE_CONCLUIDA' THEN 1 ELSE 0 END) AS aprovados,
               SUM(CASE WHEN ap.status_aprovacao = 'PENDENTE' THEN 1 ELSE 0 END) AS pendentes
        FROM evento e
        LEFT JOIN artista_aprovado ap ON e.id_evento = ap.id_evento
        WHERE e.id_empresa = ? ${condicao}
        GROUP BY e.id_evento, e.nome;
    `;
    return database.executar(instrucaoSql, [idEmpresa]);
}

function buscarImportanciaEvento(idEmpresa, filtroPeriodo, inicio, fim) {
    var condicao = obterCondicaoPeriodo(filtroPeriodo, 'e.data_evento', inicio, fim);
    var instrucaoSql = `
        SELECT e.nome AS evento, 
               COALESCE(SUM(ms.streams), 0) AS importancia
        FROM evento e
        LEFT JOIN artista_aprovado ap ON e.id_evento = ap.id_evento
        LEFT JOIN musica m ON ap.id_artista = m.id_artista
        LEFT JOIN metrica_streaming ms ON m.id_musica = ms.id_musica
        WHERE e.id_empresa = ? ${condicao}
        GROUP BY e.id_evento, e.nome
        ORDER BY importancia DESC LIMIT 5;
    `;
    return database.executar(instrucaoSql, [idEmpresa]);
}

function buscarShowsMensais(idEmpresa, filtroPeriodo, inicio, fim) {
    var condicao = obterCondicaoPeriodo(filtroPeriodo, 'data_evento', inicio, fim);
    var instrucaoSql = `
        SELECT 
            DATE_FORMAT(data_evento, '%b/%Y') AS mes,
            COUNT(*) AS total
        FROM evento
        WHERE id_empresa = ? ${condicao}
        GROUP BY DATE_FORMAT(data_evento, '%b/%Y'), YEAR(data_evento), MONTH(data_evento)
        ORDER BY YEAR(data_evento), MONTH(data_evento) ASC;
    `;
    return database.executar(instrucaoSql, [idEmpresa]);
}

module.exports = {
    buscarShowMaisProximo,
    buscarGeneroPredominante,
    buscarArtistasPendentesTotal,
    buscarArtistasPorEvento,
    buscarImportanciaEvento,
    buscarShowsMensais
};