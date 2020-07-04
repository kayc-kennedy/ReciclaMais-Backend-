'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/associacao-controller.js')

router.post('/', controller.post);

router.put('/atualizar', controller.put);

router.delete('/:id', controller.del);

module.exports = router;
