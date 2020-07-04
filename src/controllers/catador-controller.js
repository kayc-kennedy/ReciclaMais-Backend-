'use strict';
const db = require("../../database/database.js")

exports.get = async (req, res, next) => {

    if (req.params) {
        let objeto = {'id_associacao':req.params.associacao, 'id_catador':req.params.catador}
        const resposta = await db.select_catador(objeto);
    
        if (resposta == '') {
            return res.status(201).send({
                error: 'Usuário não encontrado'
            });
        }
        return res.status(201).send({
            catador: resposta
        });
    }else{
        return res.status(201).send({
            error: 'error'
        });
    }
};

exports.getAll = async (req, res, next) => {
    if (req.params) {
        const resposta = await db.select_AllCatador(req.params.associacao);
        if (resposta == '') {
            return res.status(201).send({
                error: 'Usuários não encontrados'
            });
        }
        return res.status(201).send({
            catadores: resposta
        });
    }else{
        return res.status(200).send({
            error: 'Informar o ID da Associação'
        });
    }
};

exports.post = async (req, res, next) => {
    const resposta = await db.insert_catador(req.body);
    if(!resposta.success){
        return res.status(400).send({
            status: 'Catador já cadastrado'
        });
    }
    
    res.status(201).send({
        status: 'Catador cadastrado'
    });
};



exports.put = async (req, res, next) => {
    let resposta = await db.update_catador(req.body);
    if(!resposta){
        return res.status(200).send({
            error: "Não foi possível atualizar o cadastro do catador"
        });   
    }
    res.status(201).send({
        status: resposta
    });
};

exports.del = async (req, res, next) => {
    let resposta = await db.inativar_catador(req.params.id);
    if(!resposta){
        return res.status(200).send({
            error: "Não foi possivel excluir o catador"
        });   
    }
    res.status(201).send({
        status: resposta
    });
};