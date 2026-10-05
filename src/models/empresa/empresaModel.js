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

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT 
            id_usuario, 
            nome, 
            email, 
            fk_empresa AS id_empresa, 
            fk_cargo AS id_cargo 
        FROM usuario 
        WHERE email = '${email}' AND senha = '${senha}';
    `;
    return database.executar(instrucaoSql)
}

module.exports = {
    atualizar,
    autenticar
}