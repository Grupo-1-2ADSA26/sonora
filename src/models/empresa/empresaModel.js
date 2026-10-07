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


function buscarPorId(id) {
  var instrucaoSql = `SELECT * FROM empresa WHERE id = '${id}'`;

  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `SELECT id, razao_social, cnpj, codigo_ativacao FROM empresa`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT * FROM empresa WHERE cnpj = '${cnpj}'`;

  return database.executar(instrucaoSql);
}

function cadastrar(razaoSocial, cnpj) {
  var instrucaoSql = `INSERT INTO empresa (razao_social, cnpj) VALUES ('${razaoSocial}', '${cnpj}')`;

  return database.executar(instrucaoSql);
}


module.exports = {
    atualizar,
    buscarPorCnpj, 
    buscarPorId, 
    cadastrar, 
    listar,
}