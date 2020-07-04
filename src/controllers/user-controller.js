'use strict';
const db = require("../../database/database.js")

exports.get = async (req, res, next) => {
    let resposta = await db.list_user(req.params.id);
    if (!resposta) {
        return res.status(200).send({
            error: 'Usuário não encontrado'
        });
    }
    return res.status(200).send({
        user: resposta
    });
};


exports.post = async (req, res, next) => {
    let resposta = await db.insert_usuario(req.body);
    if(!resposta.success){
        return res.status(200).send({
            status: 'Usuário já cadastrado'
        });    
    }
    res.status(200).send({
        status: 'Usuário cadastrado'
    });
};

exports.put = async (req, res, next) => {
    let resposta = await db.update_usuario(req.body);
    if(!resposta){
        return res.status(200).send({
            error: 'Erro inesperado'
        });    
    }
    res.status(200).send({
        status: 'Usuário atualizado'
    });
};

exports.del = async (req, res, next) => {
    let resposta = await db.delete_usuario(req.params.id);
    res.status(200).send({
        status: 'Usuário deletado'
    });
};
