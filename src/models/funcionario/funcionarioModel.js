const database = require("../../database/config");

function listar(idEmpresa) {
    const instrucaoSql = `
        SELECT 
            u.id_usuario AS id,
            u.nome,
            u.email,
            c.nome AS cargo,
            u.id_cargo
        FROM usuario u
        JOIN cargo c ON u.id_cargo = c.id_cargo
        WHERE u.id_empresa = ${idEmpresa};
    `;
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, senha, idEmpresa, idCargo) {
    const instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, id_empresa, id_cargo) 
        VALUES ('${nome}', '${email}', '${senha}', ${idEmpresa}, ${idCargo});
    `;
    return database.executar(instrucaoSql);
}

function atualizar(idUsuario, idEmpresa, nome, email, idCargo, senha) {
    let instrucaoSql = `
        UPDATE usuario 
        SET nome = '${nome}', email = '${email}', id_cargo = ${idCargo}
    `;

    if (senha && senha.trim() !== '') {
        instrucaoSql += `, senha = '${senha}'`;
    }

    instrucaoSql += ` WHERE id_usuario = ${idUsuario} AND id_empresa = ${idEmpresa};`;

    return database.executar(instrucaoSql);
}

function deletar(idUsuario, idEmpresa) {
    const instrucaoSql = `
        DELETE FROM usuario 
        WHERE id_usuario = ${idUsuario} AND id_empresa = ${idEmpresa};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    listar,
    cadastrar,
    atualizar,
    deletar
};