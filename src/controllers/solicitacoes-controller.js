'use strict';
const db = require("../../database/database.js")

exports.getOneBy_id = async (req, res, next) => {//Buscar uma determinada solicitação de uma associação
    let objeto = {'id_associacao':req.params.associacao, 'id_solicitacao':req.params.solicitacao}

    let resposta = await db.solicitacoes_allId(objeto);
    if (resposta == '') {
        res.status(200).send({
            error: 'Solicitações não encontrada'
        });
    }
    res.status(200).send({
        solicitacao: resposta
    });
};

exports.list_solicitacoes_usuario = async (req, res, next) => {//Buscar uma determinada solicitação de uma usuario ou todas elas
    let objeto = {'usuario':req.params.usuario, 'id_solicitacao':req.params.id_solicitacao}

    let resposta = await db.list_solicitacoes_usuario(objeto);
    if (resposta == '') {
        return res.status(200).send({
            error: 'Solicitações não encontrada'
        });
    }
    return res.status(200).send({
        solicitacoes: resposta
    });
};

exports.listAll_active = async (req, res, next) => { //Buscar todas as solicitações que uma associação está atendendo
    console.log(req.params.associacao);
    let resposta = await db.solicitacoes_id(req.params.associacao);
    if (resposta == '') {
        res.status(200).send({
            error: 'Solicitações não encontradas'
        });
    }
    res.status(200).send({
        solicitacoes: resposta
    });
};

exports.post = async (req, res, next) => {
    let resposta = await db.insert_solicitacao(req.body);
    if(!resposta){
        return res.status(200).send({
            error: 'error'
        });
    }return res.status(200).send({
        status: 'Solicitação cadastrada'
    });
    
};

exports.put = async (req, res, next) => {

    let resposta = await db.update_solicitacao(req.body);
    if(!resposta.success){
       return  res.status(200).send({
            error:"error"
        });
    }
    res.status(200).send({
        status:resposta
    });
};

exports.del = async (req, res, next) => {
    let resposta = await db.cancelarColeta(req.params.id);
    if(!resposta.success){
        return res.status(400).send({
            status: 'Erro ao cancelar a solicitação '
        });
    }
    res.status(200).send({
        status: 'Solicitação Cancelada'
    });
};
