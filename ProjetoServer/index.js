const express = require("express")
const consign = require("consign")
const bodyParser = require("body-parser")

// CRIA O SERVER 
let app = express()

// CONVERTE INFORMAÇÕES RECEBIDAS VIA METODO POST
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// DEFINE AS ROTAS AUTOMATICAMENTE
// --> BUSCA NA PASTA ROUTES E APLICA AS ROTAS NO APP
consign().include("routes").include("utils").into(app)

// EXECUTA O SERVER COM AS ESPECIFICAÇÕES PASSADAS
app.listen(4000, "127.0.0.1", ()=>{
    console.log("Servidor rodando.")
})

