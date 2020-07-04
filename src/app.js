'use strict'
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

// Carregar as rotas
const index_route = require('./routes/index.js')
const user_route = require('./routes/user.js')
const associacao_route = require('./routes/associacao.js')
const login_user_route = require('./routes/login-user.js')
const login_associacao_route = require('./routes/login-associacao.js')
const solicitacoes_route = require('./routes/solicitacoes.js')
const catador_route = require('./routes/catador.js')
const lixo_route = require('./routes/lixo.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', index_route);
app.use('/user', user_route);
app.use('/associacao', associacao_route);
app.use('/login-user', login_user_route );
app.use('/login-associacao', login_associacao_route);
app.use('/solicitacoes', solicitacoes_route);
app.use('/catador', catador_route);
app.use('/lixo', lixo_route);

module.exports = app;
