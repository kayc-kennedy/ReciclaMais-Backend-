'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/lixo-controller.js')

router.get('/', controller.get);//busca os tipos de lixo

module.exports = router;
