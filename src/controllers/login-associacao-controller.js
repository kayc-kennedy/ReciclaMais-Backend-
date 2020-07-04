'use strict';
const db = require('../../database/database');
 
exports.post = async (req, res, next) => {

    if (!req.body.mail || !req.body.senha) {
        console.log("teste ?");
        res.status(400).send({
            error: 'Informe o e-mail/senha'
        });

    } else {
        let resposta = await db.login_associacao(req.body);
        console.log("respostasssss", resposta);
        if (resposta == '') {
            res.status(200).send({
                error: 'Usuário não encontrado'
            });
        }
        res.status(200).send({
            usuario: resposta
        });
    }
};
