'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/user-controller.js')

router.get('/:id', controller.get);

router.post('/', controller.post);

router.put('/alterar', controller.put);

router.delete('/:id', controller.del);

module.exports = router;
