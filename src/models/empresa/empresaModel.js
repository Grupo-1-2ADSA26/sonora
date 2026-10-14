var database = require("../../database/config");
var gerarCodigoAtivacao = require("../../utils/gerarCodigoAtivacao");


function cadastrar(razaoSocial, cnpj, tipoEstabelecimento, email) {
    const codigo = gerarCodigoAtivacao.gerarCodigoAtivacao();
    const instrucaoSql = `
        INSERT INTO empresa (
            razao_social,
            email_responsavel,
            cnpj,
            tipo_estabelecimento,
            codigo_ativacao
        )
        VALUES ('${razaoSocial}', '${email}', '${cnpj}', '${tipoEstabelecimento}', '${codigo}');`;
    return database.executar(instrucaoSql).then(resultado => { 
        return {
            resultado: resultado,
            codigoAtivacao: codigo
        };
    });
}

function validar_codigo(codigo) {
    const instrucaoSql = `
        SELECT id_empresa FROM empresa
        WHERE codigo_ativacao = '${codigo}' AND status_codigo = 'PENDENTE';
    `
    return database.executar(instrucaoSql);
}

function ativar_codigo(idEmpresa) {
    const instrucaoSql = `
        UPDATE empresa
        SET status_codigo = 'ATIVA'
        WHERE id_empresa = ${idEmpresa};
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

module.exports = {
    cadastrar,
    validar_codigo,
    ativar_codigo,
    listar,
    buscarPorId,
    atualizar,
    deletar
};