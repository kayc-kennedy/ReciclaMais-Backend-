'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/login-associacao-controller.js')

router.post('/', controller.post);

module.exports = router;
