let funcionarioModel = require("../../models/funcionario/funcionarioModel")

function ehEspaco(c) { return c.trim() === "" }
function ehNumero(c) { return c >= "0" && c <= "9" }
function ehMaiuscula(c) { return c === c.toUpperCase() && c !== c.toLowerCase() }
function ehMinuscula(c) { return c === c.toLowerCase() && c !== c.toUpperCase() }
function ehEspecial(c) { return !ehMaiuscula(c) && !ehMinuscula(c) && !ehNumero(c) && !ehEspaco(c) }

function validarEmail(email) {
    const invalido = "E-mail inválido."

    if (!email) return "Informe o e-mail."
    if (email.length > 100) return "O e-mail pode ter no máximo 100 caracteres."
    if (Array.from(email).some(ehEspaco)) return invalido

    const partes = email.split("@")
    if (partes.length !== 2) return invalido
    const usuario = partes[0]
    const dominio = partes[1]
    if (usuario === "" || dominio === "") return invalido

    if (!dominio.includes(".")) return invalido
    if (dominio.startsWith(".") || dominio.endsWith(".") || dominio.includes("..")) return invalido

    const extensao = dominio.split(".").pop()
    if (extensao.length < 2) return invalido

    return ""
}

function validarSenha(senha) {
    if (!senha) return "Informe a senha."
    if (senha.length < 8 || senha.length > 50) return "A senha deve ter entre 8 e 50 caracteres."

    const caracteres = Array.from(senha)
    if (caracteres.some(ehEspaco)) return "A senha não pode ter espaços."
    if (!caracteres.some(ehMaiuscula)) return "A senha precisa ter uma letra maiúscula."
    if (!caracteres.some(ehMinuscula)) return "A senha precisa ter uma letra minúscula."
    if (!caracteres.some(ehNumero)) return "A senha precisa ter um número."
    if (!caracteres.some(ehEspecial)) return "A senha precisa ter um caractere especial."
    return ""
}

function tratarErro(erro, res) {
    console.log("Erro no controller de funcionário:", erro)

    if (erro && erro.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ mensagem: "Este e-mail já está cadastrado." })
    }
    if (erro && erro.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({ mensagem: "Cargo ou empresa inexistente no banco." })
    }
    return res.status(500).json({ mensagem: "Erro interno no servidor.", detalhe: erro.sqlMessage || erro.message || erro })
}

function listar(req, res) {
    let idEmpresa = req.params.idEmpresa

    funcionarioModel.listar(idEmpresa).then((resultado) => {
        res.status(200).json(resultado)
    }).catch((erro) => tratarErro(erro, res))
}

function cadastrar(req, res) {
    let nome = (req.body.nomeServer || "").trim()
    let email = (req.body.emailServer || "").trim().toLowerCase()
    let cargo = req.body.cargoServer
    let senha = req.body.senhaServer
    let empresa = req.body.empresaServer

    if (!nome || !cargo || !empresa) {
        return res.status(400).json({ mensagem: "Preencha todos os campos." })
    }

    let erroEmail = validarEmail(email)
    if (erroEmail) return res.status(400).json({ mensagem: erroEmail })

    let erroSenha = validarSenha(senha)
    if (erroSenha) return res.status(400).json({ mensagem: erroSenha })

    funcionarioModel.cadastrar(nome, email, senha, cargo, empresa).then((resultado) => {
        res.status(201).json(resultado)
    }).catch((erro) => tratarErro(erro, res))
}

function editar(req, res) {
    let id = req.params.id
    let nome = (req.body.nomeServer || "").trim()
    let email = (req.body.emailServer || "").trim().toLowerCase()
    let cargo = req.body.cargoServer
    let senha = req.body.senhaServer

    if (!nome || !cargo) {
        return res.status(400).json({ mensagem: "Preencha nome e cargo." })
    }

    let erroEmail = validarEmail(email)
    if (erroEmail) return res.status(400).json({ mensagem: erroEmail })

    if (senha) {
        let erroSenha = validarSenha(senha)
        if (erroSenha) return res.status(400).json({ mensagem: erroSenha })
    }

    funcionarioModel.editar(id, nome, email, cargo, senha).then((resultado) => {
        res.status(200).json(resultado)
    }).catch((erro) => tratarErro(erro, res))
}

function deletar(req, res) {
    let id = req.params.id

    funcionarioModel.deletar(id).then((resultado) => {
        res.status(200).json(resultado)
    }).catch((erro) => tratarErro(erro, res))
}

module.exports = { listar, cadastrar, editar, deletar }
