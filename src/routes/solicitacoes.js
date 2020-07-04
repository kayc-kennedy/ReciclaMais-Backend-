'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/solicitacoes-controller.js')


router.get('/:associacao', controller.listAll_active);

router.get('/usuario/:usuario/:id_solicitacao?', controller.list_solicitacoes_usuario);

router.get('/:associacao/:solicitacao', controller.getOneBy_id);

router.post('/', controller.post);

router.put('/atualizar', controller.put);//atualizar uma solicitação passando um id

router.delete('/:id', controller.del);

module.exports = router;
