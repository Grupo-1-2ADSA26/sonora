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

module.exports = {
    cadastrar,
    listarPorEmpresa,
    buscarPorId,
    atualizar,
    atualizarSemSenha,
    deletar,
    autenticar
};