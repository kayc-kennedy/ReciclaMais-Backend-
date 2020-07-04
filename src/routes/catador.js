'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/catador-controller.js')

router.get('/:associacao/:catador', controller.get);//busca somente 1 catador - idassociacao/idcatador

router.get('/:associacao?', controller.getAll);//Todos os catadores de uma associacao

router.post('/', controller.post);

router.put('/atualizar', controller.put);//Atualizar cadastro de Catador

router.delete('/:id', controller.del);

module.exports = router;
