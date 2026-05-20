var express = require("express");
var router = express.Router();
//requisição do Model uso onrigatório de chaves e nome definido no objeto
const {tarefasModel} = require("../models/tarefasModel");
const { body, validationResult } = require("express-validator");
const moment = require("moment");
moment.locale('pt-br');



router.get("/", async function (req, res) {
    res.locals.moment = moment;
    //recuperar a página solicitada caso não exista será a página 1
    let paginaAtual = req.query.pagina == undefined ? 1 : req.query.pagina;
    //definir a qtde de registros por página
    let qtdePagina = 5;
    //definir o offset em relação a pagina atual
    let offset = (paginaAtual - 1) * qtdePagina;
    //definir o número de páginas de resultados
    let totalPaginas = Math.ceil(await tarefasModel.totRegistros() / qtdePagina);

    if(totalPaginas > 1){
        var paginador = {"paginaAtual":paginaAtual, "totalPaginas": totalPaginas}
    }else{
        var paginador = null
    }
    

    try{
        const linhas = await tarefasModel.findAll(offset,qtdePagina);
        res.render("pages/index", {linhasTabela:linhas,"notificador":paginador});
    }catch(erro){
        console.log(erro);
    }
});


router.get("/cadastro", (req, res)=>{
    res.locals.moment = moment;
    res.render("pages/cadastro",{tituloAba:"Cadastro de tarefa",tituloPagina:"Nova Tarefa",
        tarefa:{id_tarefa:0,nome_tarefa:"",prazo_tarefa:"",situacao_tarefa:1}
    });
});

router.get("/alterar", async (req, res)=>{
    res.locals.moment = moment;
    //recuperar o id da queryString
    const id = req.query.id;
    try{
        const tarefa = await tarefasModel.findById(id);

        res.render("pages/cadastro",{tituloAba:"Edição de tarefa",tituloPagina:"Alterar Tarefa",
            tarefa:tarefa[0]
        });
    }catch(erro){
        console.log(erro);
    }
});

router.post("/cadastro",
    [
        body("tarefa")
            .trim()
            .isLength({ min: 4, max: 45 })
            .withMessage("Nome precisa ter entre 4 e 45 caracteres"),
        body("prazo")
            .notEmpty()
            .withMessage("Prazo é obrigatório")
            .bail()
            .isDate({ format: "YYYY-MM-DD" })
            .withMessage("Prazo inválido")
            .bail()
            .custom((value) => {
                const hoje = new Date();
                const prazo = new Date(value + "T00:00:00");
                const hojeZero = new Date(hoje.toISOString().slice(0, 10) + "T00:00:00");
                if (prazo < hojeZero) {
                    throw new Error("Prazo deve ser hoje ou uma data futura");
                }
                return true;
            }),
        body("situacao")
            .isInt({ min: 0, max: 5 })
            .withMessage("Situação deve ser um número entre 0 e 5")
    ],
    async (req, res)=>{
        const errors = validationResult(req);
        const objJson = {
            id: req.body.id,
            nome:req.body.tarefa,
            prazo:req.body.prazo,
            situacao:req.body.situacao
        }

        if (!errors.isEmpty()) {
            res.locals.moment = moment;
            return res.render("pages/cadastro", {
                tituloAba: objJson.id == 0 ? "Cadastro de tarefa" : "Edição de tarefa",
                tituloPagina: objJson.id == 0 ? "Nova Tarefa" : "Alterar Tarefa",
                tarefa: {
                    id_tarefa: objJson.id,
                    nome_tarefa: objJson.nome,
                    prazo_tarefa: objJson.prazo,
                    situacao_tarefa: Number(objJson.situacao)
                },
                errors: errors.array()
            });
        }

        try{
            if(objJson.id == 0){
                var result = await tarefasModel.create(objJson);
            }else{
                var result = await tarefasModel.update(objJson);
            }
            console.log(result);
            res.redirect("/");
        }catch(erro){
            console.log(erro)
            res.status(500).send("Erro no servidor ao salvar tarefa");
        }    
});


router.get("/teste-insert", async (req, res)=>{
    const dadosInsert =  {
            nome: "instalar o fortnite no Lab 1 Terreo",
            prazo:"2026-03-19"
            }
    try{
        const resultInsert = await tarefasModel.create(dadosInsert);
        res.send(resultInsert)    
    }catch(erro){
        console.log(erro);
    }

});


//delete físico - hard delete
router.get("/teste-delete", async (req, res)=>{
    let idTarefa = req.query.id || 17;
    try{
        const resultDelete = await tarefasModel.deleteFisico(idTarefa);
        res.send({mensagem: "Tarefa deletada permanentemente", resultado: resultDelete})    
    }catch(erro){
        console.log(erro);
        res.send({erro: "Erro ao deletar tarefa"})
    }
});

// delete lógico - soft delete
router.get("/teste-soft-delete", async (req, res)=>{
    let idTarefa = req.query.id || 15;
    try{
        const resultUpdate = await tarefasModel.deleteLogico(idTarefa);
        res.send({mensagem: "Tarefa desativada (soft delete)", resultado: resultUpdate});    
    }catch(erro){
        console.log(erro);
        res.send({erro: "Erro ao desativar tarefa"})
    }
});

// Rota para esconder uma tarefa (muda status para 5)
router.get("/esconder/:id", async (req, res)=>{
    const id = req.params.id;
    try{
        await tarefasModel.hideTask(id);
        res.redirect("/");
    }catch(erro){
        console.log(erro);
        res.status(500).send("Erro ao esconder tarefa");
    }
});

// Rota para ver tarefas escondidas
router.get("/tarefas-escondidas", async function (req, res) {
    res.locals.moment = moment;
    let paginaAtual = req.query.pagina == undefined ? 1 : req.query.pagina;
    let qtdePagina = 5;
    let offset = (paginaAtual - 1) * qtdePagina;
    let totalPaginas = Math.ceil(await tarefasModel.totEscondidas() / qtdePagina);

    if(totalPaginas > 1){
        var paginador = {"paginaAtual":paginaAtual, "totalPaginas": totalPaginas}
    }else{
        var paginador = null
    }

    try{
        const linhas = await tarefasModel.findHidden(offset, qtdePagina);
        res.render("pages/escondidas", {linhasTabela:linhas, "notificador":paginador});
    }catch(erro){
        console.log(erro);
    }
});

// Rota para deletar uma tarefa (delete físico)
router.get("/deletar/:id", async (req, res)=>{
    const id = req.params.id;
    try{
        await tarefasModel.deleteFisico(id);
        res.redirect("/");
    }catch(erro){
        console.log(erro);
        res.status(500).send("Erro ao deletar tarefa");
    }
});

module.exports = router;