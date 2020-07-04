'use strict';
const db = require("../../database/database.js")

exports.get = async (req, res, next) => {
    const resposta = await db.select_typesLixo();
    if (resposta != false) {
        return res.status(200).send({
            tipo_lixo: resposta
        });
    }
    return res.status(201).send({
        error: "error"
    });
};