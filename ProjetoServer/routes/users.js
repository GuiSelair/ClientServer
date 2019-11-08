const NeDB = require("nedb")
const {check, validationResult} = require("express-validator")
let db = new NeDB({
    filename: "users.db",
    autoload: true
})

module.exports = (app) => {

    const route = app.route("/")
    const routeID = app.route("/:id");

    // GET
    route.get((req, res) => {
        
        // FIND: Método do NEDB para encontrar algo (Como se fosse um SELECT). Foi passado um JSON vazio para buscar todas as ocorrencias.
        // SORT: Ordenar o resultado por ordem crescente seguindo o ID. (-1 caso em ordem decrescente)
        // EXEC: Executar o comando FIND, sempre contendo possibilidade de erro e sucesso. Caso de sucesso o que ele imprimirá na tela.
        db.find({}).sort({_name:1}).exec((erro, users) => {
            if (erro){
                app.utils.erros.send(erro, req, res, 200)
            }
            else{
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.json({
                    users
                })
            }
        })
        
    })

    // POST
    route.post([check("_name", "O nome é obrigatório e não pode ser nulo").isLength({ min: 5 }), check("_email", "Obrigatório ser um email valido").isEmail()], (req, res) => {

        const errors = validationResult(req)
        
        if (!errors.isEmpty()){
            app.utils.erros.send(errors, req, res)
            return false;
        }
        

        // INSERT: Insere um registro ao NEDB, contendo também instancias para erro e sucesso.
        db.insert(req.body, (erro, user) => {
            if (erro){
                app.utils.erros.send(erro, req, res)
            }
            else{
                res.status(200).json(user)
            }
            
        })

    })

    // GET COM FILTRO
    routeID.get((req, res) => {

        // FINDONE: Encontra apena uma ocorrência de um determinado item, por isso deve-se informar o ID do objeto que procura
        db.findOne({_id:req.params.id}).exec((error, user) =>{
            if (error){
                app.utils.erros.send(erro, req, res)
            }
            else{
                res.status(200).json(user)
            }
        })
    })

    // PUT: Método do HTTP que realizar modificações
    routeID.put([check("_name", "O nome é obrigatório e não pode ser nulo").isLength({ min: 5 }),check("_email", "A idade é obritoria e tem que conter apenas números").isEmail()],(req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()){
            app.utils.erros.send(errors, req, res)
            return false;
        }
        
        //  UPDATE: Realiza alterações no banco de dados
        db.update({_id:req.params.id}, req.body, error => {
            if (error){
                app.utils.erros.send(erro, req, res)
            }
            else{
                res.status(200).json(Object.assign(req.params, req.body))
            }
        })
    })

    routeID.delete((req, res) => {

        // REMOVE: Apaga a ocorrência do banco de dados
        db.remove({_id:req.params.id}, {}, error => {
            if (error){
                app.utils.erros.send(erro, req, res)
            }
            else{
                res.status(200).json(req.params.id)
            }
        })
    })
    
}