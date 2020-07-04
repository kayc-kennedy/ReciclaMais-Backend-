'use strict';
const db = require("../../database/database.js")

exports.post = async (req, res, next) => {
    const resposta = await db.insert_associacao(req.body);
    if(!resposta){
        return res.status(200).send({
            error: 'Error'
        });    
    }
    return res.status(201).send({
        status: 'Associação Cadastrada'
    });
};

exports.put = async (req, res, next) => {
    const resposta = await db.update_associacao(req.body);
    res.status(201).send({
        status: 'Associação atualizada'
    });
};

exports.del = async (req, res, next) => {
    const resposta = await db.delete_associacao(req.params.id);
    res.status(200).send({
        status: 'Associação deletada'
    });
};