// ✅ Adicione mais um ../
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

module.exports = {
    atualizar
}