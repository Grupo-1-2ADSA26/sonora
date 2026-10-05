let database = require("../../database/config")

function listar(idEmpresa) {
    let instrucaoSql = `
        SELECT u.id_usuario, u.nome, u.email, u.id_cargo, c.nome AS cargo
        FROM usuario u
        JOIN cargo c ON c.id_cargo = u.id_cargo
        WHERE u.id_empresa = ?
        ORDER BY u.nome`
    return database.executar(instrucaoSql, [idEmpresa])
}

function cadastrar(nome, email, senha, idCargo, idEmpresa) {
    let instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, id_cargo, id_empresa)
        VALUES (?, ?, ?, ?, ?)`
    return database.executar(instrucaoSql, [nome, email, senha, idCargo, idEmpresa])
}

function editar(id, nome, email, idCargo, senha) {

    if (senha) {
        let instrucaoSql = `
            UPDATE usuario
            SET nome = ?, email = ?, id_cargo = ?, senha = ?
            WHERE id_usuario = ?`
        return database.executar(instrucaoSql, [nome, email, idCargo, senha, id])
    }

    let instrucaoSql = `
        UPDATE usuario
        SET nome = ?, email = ?, id_cargo = ?
        WHERE id_usuario = ?`
    return database.executar(instrucaoSql, [nome, email, idCargo, id])
}

function deletar(id) {
    let instrucaoSql = `DELETE FROM usuario WHERE id_usuario = ?`
    return database.executar(instrucaoSql, [id])
}

module.exports = { listar, cadastrar, editar, deletar }
