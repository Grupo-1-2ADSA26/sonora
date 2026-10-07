// ✅ Adicione mais um ../
const bus = require("nodemon/lib/utils/bus");
var database = require("../../database/config");


function atualizar(idEmpresa, razaoSocial, cnpj, tipo, senha) {
    var instrucaoSql = `
        UPDATE empresa 
        SET nome = '${razaoSocial}', 
            cnpj = '${cnpj}', 
            tipo_estabelecimento = '${tipo}', 
            senha = '${senha}'
        WHERE id_empresa = ${idEmpresa};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)

}

function buscarPorId(idEmpresa) {
    // Verifique se no seu banco as colunas se chamam:
    // id_empresa (ou idEmpresa), nome (ou razao_social), cnpj, tipo (ou tipo_estabelecimento), senha
    var instrucaoSql = `
        SELECT 
            id_empresa, 
            nome, 
            cnpj, 
            tipo_estabelecimento, 
            senha 
        FROM empresa 
        WHERE id_empresa = ${idEmpresa};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function autenticar(email, senha) {
    var instrucaoSql = `
       SELECT 
            id_usuario, 
            nome, 
            email, 
            id_empresa, 
            id_cargo 
        FROM usuario 
        WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
}

module.exports = {
    atualizar,
    buscarPorId,
    autenticar
}