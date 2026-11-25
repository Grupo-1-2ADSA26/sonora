var database = require("../../database/config");
var gerarCodigoAtivacao = require("../../utils/gerarCodigoAtivacao");

function cadastrar(razaoSocial, cnpj, idTipoEstabelecimento, email) {
    const codigo = gerarCodigoAtivacao.gerarCodigoAtivacao();

    const instrucaoSql = `
        INSERT INTO empresa (
            razao_social,
            email_responsavel,
            cnpj,
            id_tipo_estabelecimento,
            codigo_ativacao,
            id_status_empresa
        )
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        razaoSocial,
        email,
        cnpj,
        idTipoEstabelecimento,
        codigo,
        2
    ]).then(resultado => {
        return {
            resultado: resultado,
            codigoAtivacao: codigo
        };
    });
}

function validar_codigo(codigo) {
    const instrucaoSql = `
        SELECT e.id_empresa
        FROM empresa e
        JOIN status_empresa se
            ON e.id_status_empresa = se.id_status_empresa
        WHERE e.codigo_ativacao = ?
          AND se.nome = 'PENDENTE';
    `;

    return database.executar(instrucaoSql, [codigo]);
}

function ativar_codigo(idEmpresa) {
    const instrucaoSql = `
        UPDATE empresa e
        JOIN status_empresa se
            ON se.nome = 'ATIVA'
        SET e.id_status_empresa = se.id_status_empresa
        WHERE e.id_empresa = ?;
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

function buscarPorId(idEmpresa) {
    const instrucaoSql = `
        SELECT
            e.id_empresa,
            e.razao_social,
            e.email_responsavel,
            e.cnpj,
            e.id_tipo_estabelecimento,
            te.nome AS tipo_estabelecimento,
            e.id_status_empresa,
            se.nome AS status_empresa
        FROM empresa e
        JOIN tipo_estabelecimento te
            ON e.id_tipo_estabelecimento = te.id_tipo_estabelecimento
        JOIN status_empresa se
            ON e.id_status_empresa = se.id_status_empresa
        WHERE e.id_empresa = ?;
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

function atualizar(idEmpresa, razaoSocial, cnpj, idTipoEstabelecimento) {
    const instrucaoSql = `
        UPDATE empresa
        SET
            razao_social = ?,
            cnpj = ?,
            id_tipo_estabelecimento = ?
        WHERE id_empresa = ?;
    `;

    return database.executar(instrucaoSql, [
        razaoSocial,
        cnpj,
        idTipoEstabelecimento,
        idEmpresa
    ]);
}

function deletar(idEmpresa) {
    const instrucaoSql = `
        DELETE FROM empresa
        WHERE id_empresa = ?;
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

module.exports = {
    cadastrar,
    validar_codigo,
    ativar_codigo,
    buscarPorId,
    atualizar,
    deletar
};