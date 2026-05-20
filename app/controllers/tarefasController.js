
// Este arquivo pode ser usado para centralizar lógica de negócio
const { tarefasModel } = require("../models/tarefasModel");

const tarefasController = {
    
    // Listar todas as tarefas com paginação
    listarTodas: async (req, res) => {
        try {
            const tarefas = await tarefasModel.findAll();
            return tarefas;
        } catch (erro) {
            console.log("Erro ao listar tarefas:", erro);
            return erro;
        }
    },

    // Buscar tarefa por ID
    buscarPorId: async (id) => {
        try {
            const tarefa = await tarefasModel.findById(id);
            return tarefa;
        } catch (erro) {
            console.log("Erro ao buscar tarefa:", erro);
            return erro;
        }
    },

    // Criar nova tarefa
    criar: async (dados) => {
        try {
            const resultado = await tarefasModel.create(dados);
            return resultado;
        } catch (erro) {
            console.log("Erro ao criar tarefa:", erro);
            return erro;
        }
    },

    // Atualizar tarefa
    atualizar: async (dados) => {
        try {
            const resultado = await tarefasModel.update(dados);
            return resultado;
        } catch (erro) {
            console.log("Erro ao atualizar tarefa:", erro);
            return erro;
        }
    },

    // Total de registros
    totalRegistros: async () => {
        try {
            const total = await tarefasModel.totRegistros();
            return total;
        } catch (erro) {
            console.log("Erro ao contar registros:", erro);
            return erro;
        }
    },

    // Delete lógico (soft delete) - desativa a tarefa
    deleteLogico: async (id) => {
        try {
            const resultado = await tarefasModel.deleteLogico(id);
            return resultado;
        } catch (erro) {
            console.log("Erro ao desativar tarefa:", erro);
            return erro;
        }
    },

    // Esconder tarefa (muda status para 5)
    hideTask: async (id) => {
        try {
            const resultado = await tarefasModel.hideTask(id);
            return resultado;
        } catch (erro) {
            console.log("Erro ao esconder tarefa:", erro);
            return erro;
        }
    },

    // Buscar tarefas escondidas
    findHidden: async (offset, qtde) => {
        try {
            const resultado = await tarefasModel.findHidden(offset, qtde);
            return resultado;
        } catch (erro) {
            console.log("Erro ao buscar tarefas escondidas:", erro);
            return erro;
        }
    },

    // Total de tarefas escondidas
    totEscondidas: async () => {
        try {
            const total = await tarefasModel.totEscondidas();
            return total;
        } catch (erro) {
            console.log("Erro ao contar tarefas escondidas:", erro);
            return erro;
        }
    },

    // Delete físico (hard delete) - remove permanentemente
    deleteFisico: async (id) => {
        try {
            const resultado = await tarefasModel.deleteFisico(id);
            return resultado;
        } catch (erro) {
            console.log("Erro ao deletar tarefa:", erro);
            return erro;
        }
    }
};

module.exports = tarefasController;
