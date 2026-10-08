var database = require("../../database/config");

function cadastrar(nome, email, senha, idEmpresa, idCargo) {
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, id_empresa, id_cargo) 
        VALUES ('${nome}', '${email}', '${senha}', ${idEmpresa}, ${idCargo});
    `;
    return database.executar(instrucaoSql);
}

function listarPorEmpresa(idEmpresa) {
    var instrucaoSql = `
        SELECT 
            u.id_usuario, 
            u.nome, 
            u.email, 
            c.nome AS cargo 
        FROM usuario u
        JOIN cargo c ON u.id_cargo = c.id_cargo
        WHERE u.id_empresa = ${idEmpresa};
    `;
    return database.executar(instrucaoSql);
}

function buscarPorId(idUsuario) {
    var instrucaoSql = `
        SELECT id_usuario, nome, email, id_empresa, id_cargo 
        FROM usuario 
        WHERE id_usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function atualizar(idUsuario, nome, email, senha, idCargo) {
    var instrucaoSql = `
        UPDATE usuario 
        SET nome = '${nome}', email = '${email}', senha = '${senha}', id_cargo = ${idCargo} 
        WHERE id_usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function deletar(idUsuario) {
    var instrucaoSql = `
        DELETE FROM usuario 
        WHERE id_usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    listarPorEmpresa,
    buscarPorId,
    atualizar,
    deletar
};