'use strict';
const db = require("../../database/database");

exports.post = async (req, res, next) => {
    if (!req.body.mail || !req.body.senha) {
        res.status(400).send({
            error: "Informe o e-mail/senha"
        });

    } else {
        let resposta = await db.login_solicitante(req.body);
        if (resposta == '') {
            res.status(201).send({
                error: 'Usuário não cadastrado'
            });
        }
        res.status(201).send({
            usuario: resposta,
        });
    }
};
