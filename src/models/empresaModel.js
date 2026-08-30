var database = require("../database/config")

function autenticar(email, senha) {
    console.log("Log: Entrando no Model Empresa na função autenticar!")
    
    var instrucaoSql = `
        SELECT id_empresa, nome FROM empresa WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Log: Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(cnpj, nome, tipo, email, senha) {
    console.log("Log: Entrando no Model Empresa na função cadastrar!");
  
    var instrucaoSql = `
        INSERT INTO empresa (cnpj, nome, tipo, email, senha) VALUES ('${cnpj}', '${nome}', '${tipo}', '${email}', '${senha}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar
};