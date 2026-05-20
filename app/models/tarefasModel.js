// requisitar o pool de conexões
const pool = require("../../config/pool_conexoes");
// criar um objeto com funções de acesso ao SGBD
const tarefasModel = {

    //select itens ativos
    // incluir paramatros offset e qtde 
    findAll: async (offset = null, qtde = null) => {
        try {
            if(offset != null && qtde != null){
                var [linhas] = await pool.query("select * from tarefas where status_tarefa = 1 limit ? offset ?",[qtde, offset]);
            }else{
                var [linhas] = await pool.query("select * from tarefas where status_tarefa = 1");
            }
            
            return linhas;
        } catch (erro) {
            return erro;
        }
    },
    //select por id específico (inclui tarefas escondidas para edição)
    findById: async (id) => {
        try {
            const [linhas] = await pool.query(
                "select * from tarefas where id_tarefa = ?",
                [id]);
            return linhas;
        } catch (erro) {
            return erro;
        }
    },
    //insert
    create: async (dados) => {
        /*
        dados json no formato:
            {
            nome: "nome",
            prazo:"data mysql",
            situacao:"cod situacao"
            }
        */
        try {
            const [resultInsert] = await pool.query(
                "insert into tarefas(`nome_tarefa`,`prazo_tarefa`, " +
                "`situacao_tarefa`) values(?,?,?)",
                [dados.nome, dados.prazo, dados.situacao]);
            return resultInsert;
        } catch (erro) {
            return erro;
        }

    },

    // update :
    update: async (dados) => {
        /*
        dados json no formato:
            {
            id: 3
            nome: "nome",
            prazo:"data mysql",
            situacao:"cod situacao"
            }
        */
        try {
            const [resulUpdate] = await pool.query(
                "update tarefas set `nome_tarefa`= ?,`prazo_tarefa`= ?,  " +
                "`situacao_tarefa`= ? where id_tarefa = ?",
                [dados.nome, dados.prazo, dados.situacao, dados.id]);
            return resulUpdate;
        } catch (erro) {
            return erro;
        }
    },

    // esconder tarefa - muda status para 5 (escondida)
    hideTask: async (id) => {
        try {
            const [resultado] = await pool.query(
                "UPDATE tarefas SET status_tarefa = 5 WHERE id_tarefa = ?",
                [id]);
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    // buscar tarefas escondidas (status 5)
    findHidden: async (offset = null, qtde = null) => {
        try {
            if(offset != null && qtde != null){
                var [linhas] = await pool.query("select * from tarefas where status_tarefa = 5 limit ? offset ?",[qtde, offset]);
            }else{
                var [linhas] = await pool.query("select * from tarefas where status_tarefa = 5");
            }
            return linhas;
        } catch (erro) {
            return erro;
        }
    },

    // contar tarefas escondidas
    totEscondidas: async ()=>{
        try{
            const [linhas] = await pool.query("SELECT count(*) as total FROM tarefas WHERE status_tarefa = 5");
            return linhas[0].total;
        }catch(erro){
            return erro;
        }
    },

    // delete lógico - remove tarefa cancelada (status = 0)
    deleteLogico: async (id) => {
        try {
            const [resultado] = await pool.query(
                "UPDATE tarefas SET status_tarefa = 0 WHERE id_tarefa = ?",
                [id]);
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    // delete físico - hard delete (remove permanentemente do banco)
    deleteFisico: async (id) => {
        try {
            const [resultado] = await pool.query(
                "DELETE FROM tarefas WHERE id_tarefa = ?",
                [id]);
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    totRegistros: async ()=>{
        try{
            const [linhas] = await pool.query("SELECT count(*) as total FROM tarefas WHERE status_tarefa = 1");
            return linhas[0].total;
        }catch(erro){
            return erro;
        }

    }
}


//exportar este objeto como um módulo js
module.exports = { tarefasModel }
// uso de chave torna obrigatório o uso do nome indicado