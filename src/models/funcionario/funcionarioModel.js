var database = require("../../database/config");

function cadastrar(nome, email, senha, idEmpresa, idCargo) {
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, id_empresa, id_cargo)
        VALUES (?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [nome, email, senha, idEmpresa, idCargo]);
}

function listarPorEmpresa(idEmpresa) {
    var instrucaoSql = `
        SELECT
            u.id_usuario,
            u.nome,
            u.email,
            c.nome AS cargo
        FROM usuario u
        JOIN cargo c
            ON u.id_cargo = c.id_cargo
        WHERE u.id_empresa = ?;
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

function buscarPorId(idUsuario) {
    var instrucaoSql = `
        SELECT
            id_usuario,
            nome,
            email,
            id_empresa,
            id_cargo
        FROM usuario
        WHERE id_usuario = ?;
    `;

    return database.executar(instrucaoSql, [idUsuario]);
}

function atualizar(idUsuario, nome, email, senha, idCargo) {
    var instrucaoSql = `
        UPDATE usuario
        SET nome = ?,
            email = ?,
            senha = ?,
            id_cargo = ?
        WHERE id_usuario = ?;
    `;

    return database.executar(instrucaoSql, [
        nome,
        email,
        senha,
        idCargo,
        idUsuario
    ]);
}

function atualizarSemSenha(idUsuario, nome, email, idCargo) {
    var instrucaoSql = `
        UPDATE usuario
        SET nome = ?,
            email = ?,
            id_cargo = ?
        WHERE id_usuario = ?;
    `;

    return database.executar(instrucaoSql, [
        nome,
        email,
        idCargo,
        idUsuario
    ]);
}

function deletar(idUsuario) {
    var instrucaoSql = `
        DELETE FROM usuario
        WHERE id_usuario = ?;
    `;

    return database.executar(instrucaoSql, [idUsuario]);
}

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT
            u.id_usuario,
            u.nome AS nome_usuario,
            u.email,
            u.id_empresa,
            e.razao_social,
            u.id_cargo,
            c.nome AS nome_cargo
        FROM usuario u
        JOIN empresa e
            ON u.id_empresa = e.id_empresa
        JOIN cargo c
            ON u.id_cargo = c.id_cargo
        WHERE u.email = ?
          AND u.senha = ?;
    `;

    return database.executar(instrucaoSql, [email, senha]);
}

function obterCondicaoPeriodo(filtroPeriodo, colunaData) {
    if (filtroPeriodo === 'mes_atual') {
        return `AND MONTH(${colunaData}) = MONTH(CURRENT_DATE()) AND YEAR(${colunaData}) = YEAR(CURRENT_DATE())`;
    } else if (filtroPeriodo === '3_meses') {
        return `AND ${colunaData} >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)`;
    } else if (filtroPeriodo === '6_meses') {
        return `AND ${colunaData} >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)`;
    }
    return '';
}

function buscarShowMaisProximo(idEmpresa) {
    var instrucaoSql = `
        SELECT nome AS nome_evento, DATE_FORMAT(data_evento, '%d/%m/%Y') AS data_evento 
        FROM evento 
        WHERE id_empresa = ? AND data_evento >= CURDATE() 
        ORDER BY data_evento ASC LIMIT 1;
    `;
    return database.executar(instrucaoSql, [idEmpresa]);
}

function buscarGeneroPredominante(idEmpresa) {
    var instrucaoSql = `
        SELECT a.genero, COUNT(*) as total 
        FROM artista a
        JOIN artista_aprovado ap ON a.id_artista = ap.id_artista
        WHERE ap.id_empresa = ? AND a.genero IS NOT NULL
        GROUP BY a.genero 
        ORDER BY total DESC LIMIT 1;
    `
    return database.executar(instrucaoSql, [idEmpresa])
}

function buscarArtistasPendentesTotal(idEmpresa, filtroPeriodo) {
    var condicao = obterCondicaoPeriodo(filtroPeriodo, 'ap.data_atualizacao')
    var instrucaoSql = `
        SELECT 
            SUM(CASE WHEN status_aprovacao = 'PENDENTE' THEN 1 ELSE 0 END) AS pendentes,
            COUNT(*) AS total
        FROM artista_aprovado ap
        WHERE ap.id_empresa = ? ${condicao};
    `
    return database.executar(instrucaoSql, [idEmpresa])
}

function buscarArtistasPorEvento(idEmpresa, filtroPeriodo) {
    var condicao = obterCondicaoPeriodo(filtroPeriodo, 'e.data_evento')
    var instrucaoSql = `
        SELECT e.nome AS evento,
               SUM(CASE WHEN ap.status_aprovacao = 'APROVADO' THEN 1 ELSE 0 END) AS aprovados,
               SUM(CASE WHEN ap.status_aprovacao = 'PENDENTE' THEN 1 ELSE 0 END) AS pendentes
        FROM evento e
        LEFT JOIN artista_aprovado ap ON e.id_evento = ap.id_evento
        WHERE e.id_empresa = ? ${condicao}
        GROUP BY e.id_evento, e.nome;
    `
    return database.executar(instrucaoSql, [idEmpresa])
}

function buscarImportanciaEvento(idEmpresa, filtroPeriodo) {
    var condicao = obterCondicaoPeriodo(filtroPeriodo, 'e.data_evento')
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
    `
    return database.executar(instrucaoSql, [idEmpresa])
}

function buscarAprovacoesMensais(idEmpresa, filtroPeriodo) {
    var condicao = obterCondicaoPeriodo(filtroPeriodo, 'ap.data_atualizacao')
    var instrucaoSql = `
        SELECT 
            DATE_FORMAT(ap.data_atualizacao, '%b/%Y') AS mes,
            COUNT(*) AS total
        FROM artista_aprovado ap
        WHERE ap.id_empresa = ? AND ap.status_aprovacao = 'APROVADO' ${condicao}
        GROUP BY DATE_FORMAT(ap.data_atualizacao, '%b/%Y'), YEAR(ap.data_atualizacao), MONTH(ap.data_atualizacao)
        ORDER BY YEAR(ap.data_atualizacao), MONTH(ap.data_atualizacao) ASC;
    `
    return database.executar(instrucaoSql, [idEmpresa])
}

module.exports = {
    cadastrar,
    listarPorEmpresa,
    buscarPorId,
    atualizar,
    atualizarSemSenha,
    deletar,
    autenticar,
    obterCondicaoPeriodo,
    buscarShowMaisProximo,
    buscarGeneroPredominante,
    buscarArtistasPendentesTotal,
    buscarArtistasPorEvento,
    buscarImportanciaEvento,
    buscarAprovacoesMensais
};