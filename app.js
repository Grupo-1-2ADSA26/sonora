// var ambiente_processo = 'producao';
let ambiente_processo = 'desenvolvimento';

let caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

let express = require("express");
let cors = require("cors");
let path = require("path");
let PORTA_APP = process.env.APP_PORT;
let HOST_APP = process.env.APP_HOST;

let app = express();

let indexRouter = require("./src/routes/index");
let usuarioRouter = require("./src/routes/usuarios");
let avisosRouter = require("./src/routes/avisos");
let medidasRouter = require("./src/routes/medidas");
let aquariosRouter = require("./src/routes/aquarios");
let empresasRouter = require("./src/routes/empresas");


// do nosso projeto
// Importação dos ficheiros de rotas
let empresaRouter = require("./src/routes/empresa");
let funcionarioRouter = require("./src/routes/funcionario");
let suporteRouter = require("./src/routes/suporte");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/avisos", avisosRouter);
app.use("/medidas", medidasRouter);
app.use("/aquarios", aquariosRouter);
app.use("/empresas", empresasRouter);

// do nosso projeto
// Definição dos caminhos das rotas
app.use("/empresa", empresaRouter);
app.use("/funcionario", funcionarioRouter);
app.use("/suporte", suporteRouter);


app.listen(PORTA_APP, function () {
    console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});
