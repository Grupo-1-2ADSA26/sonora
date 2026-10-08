var database = require("../../database/config");

function cadastrar(nome, cnpj, senha, tipoEstabelecimento) {
    var instrucaoSql = `
        INSERT INTO empresa (nome, cnpj, senha, tipo_estabelecimento) 
        VALUES ('${nome}', '${cnpj}', '${senha}', '${tipoEstabelecimento}');
    `;
    return database.executar(instrucaoSql);
}

function listar() {
    var instrucaoSql = `
        SELECT id_empresa, nome, cnpj, tipo_estabelecimento 
        FROM empresa;
    `;
    return database.executar(instrucaoSql);
}

function buscarPorId(idEmpresa) {
    var instrucaoSql = `
        SELECT id_empresa, nome, cnpj, tipo_estabelecimento 
        FROM empresa 
        WHERE id_empresa = ${idEmpresa};
    `;
    return database.executar(instrucaoSql);
}

function atualizar(idEmpresa, nome, cnpj, senha, tipoEstabelecimento) {
    var instrucaoSql = `
        UPDATE empresa 
        SET nome = '${nome}', cnpj = '${cnpj}', senha = '${senha}', tipo_estabelecimento = '${tipoEstabelecimento}' 
        WHERE id_empresa = ${idEmpresa};
    `;
    return database.executar(instrucaoSql);
}

function deletar(idEmpresa) {
    var instrucaoSql = `
        DELETE FROM empresa 
        WHERE id_empresa = ${idEmpresa};
    `;
    return database.executar(instrucaoSql);
}

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT 
            u.id_usuario,
            u.nome AS nome_usuario,
            u.email,
            u.id_empresa,
            e.nome AS nome_empresa,
            u.id_cargo,
            c.nome AS nome_cargo
        FROM usuario u
        JOIN empresa e ON u.id_empresa = e.id_empresa
        JOIN cargo c ON u.id_cargo = c.id_cargo
        WHERE u.email = '${email}' AND u.senha = '${senha}';
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    listar,
    buscarPorId,
    atualizar,
    deletar,
    autenticar
};