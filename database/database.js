"use strict";

require('dotenv/config'); 

const oracledb = require('oracledb');
oracledb.autoCommit = true;

module.exports = {
    insert_associacao: async object => {
        let conn;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PWD,
                connectString: process.env.CON
            });

            const { nome, mail, telefone, cnpj, razao_social, rua, numero, bairro, cidade, uf, cep, senha } = object;

            const response = await conn.execute(`
            INSERT INTO associacao 
                VALUES(
                    ID_ASSOCIACAO.nextval,
                    '${nome}',
                    '${razao_social}',
                    '${cnpj}',
                    '${cep}',
                    '${uf}',
                    '${cidade}',
                    '${bairro}',
                    '${rua}',
                    ${numero},
                    ${telefone},
                    '${mail}',
                    '${senha}'
            )`);
            
        if(response.rowsAffected == 0){
            return false;
        }
        return true;
        } catch (err) {
            await conn.close();
            console.log(err);
            return false;
        } 
    },

    insert_catador: async object => {
        let conn;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PWD,
                connectString: process.env.CON
            });

            const { nome, cpf, telefone, rua, numero, bairro, cidade, uf, cep, preferencia_coleta, id_associacao } = object;

            const inserido = await conn.execute(`
                SELECT *
                    FROM associ_coletor a
                    WHERE 1 = 1
                        AND a.cpf = '${cpf}'
                        AND a.idassociacao = ${id_associacao}
                `)
         
            if(inserido.rows == ''){
                const response = await conn.execute(`
                INSERT INTO associ_coletor 
                    VALUES(
                    ID_COLETOR.nextval,
                    '${id_associacao}',
                    '${nome}',
                    '${cpf}',
                    ${preferencia_coleta},
                    '${telefone}',
                    '${numero}',
                    '${cep}',
                    '${uf}',
                    '${cidade}',
                    '${bairro}',
                    '${rua}',
                    'A')
            `)
            conn.close();
            return {"success":true}

            }else{
                conn.close();
                return {"success":false}
            }
        } catch (err) {
            console.log(err);
            await conn.close();
            return {"success":false};
        } 
    },

    insert_usuario: async object => {
        let conn;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PWD,
                connectString: process.env.CON
            });

            const { nome, mail, cpf, telefone, rua, numero, bairro, cidade, uf, cep, senha } = object;

            const response = await conn.execute(`
            INSERT INTO usuario 
                VALUES(
                    id_usuario.nextval,
                    '${nome}',
                    '${cpf}',
                    '${mail}',
                    '${cep}',
                    '${uf}',
                    '${cidade}',
                    '${bairro}',
                    '${rua}',
                    '${numero}',
                    '${senha}',
                    '${telefone}')
            `);
            conn.close();

            return {"success":true};
        } catch (err) {
            console.log("erro", err)
            await conn.close();

            return {"success":false};
        }
    },

    insert_solicitacao: async object => {
        let conn;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PWD,
                connectString: process.env.CON
            });
            const max_id = await conn.execute(`SELECT MAX(a.idsolicitacao) ultimo_id FROM SOLICITACAO a`)
            let id;
            if(max_id.rows[0][0] == null){
                id = 1; 
            }else{
                id = parseInt(max_id.rows) + 1;
            }
           const { id_usuario, rua, numero, bairro, cidade, uf, cep, tipo_lixo} = object;
           console.log(`
           INSERT INTO solicitacao 
               VALUES(
                   ${id},
                   ${id_usuario},
                   '${uf}',
                   '${cidade}',
                   '${bairro}',
                   '${rua}',
                   ${numero},
                   sysdate,
                   'P',
                   '${cep}',
                   '',
                   '',
                   '${tipo_lixo}'
                   )`)
            const response = await conn.execute(`
            INSERT INTO solicitacao 
                VALUES(
                    ${id},
                    ${id_usuario},
                    '${uf}',
                    '${cidade}',
                    '${bairro}',
                    '${rua}',
                    ${numero},
                    sysdate,
                    'P',
                    '${cep}',
                    '',
                    '',
                    '${tipo_lixo}'
                    )`);  
            await conn.close();
            
            return true;

        } catch (err) {
            console.log("erro", err)
            await conn.close();
            return false;
        } /* finally{
            return "Ok sucesso"
        } */
    },
    
    login_associacao: async object =>{
        let conn;
        try {
                conn = await oracledb.getConnection({
                user:  process.env.USER ,
                password: process.env.PWD ,
                connectString:  process.env.CON 
            });

            const { mail, senha } = object;

            const response = await conn.execute(`
            SELECT 
                A.IDASSOCI,
                A.NOMEFANTASIA,
                a.nomerazao,
                a.cnpj,
                A.CEP,
                A.UF,
                A.CIDADE,
                A.BAIRRO,
                A.RUA,
                A.NUMERO,
                A.TELEFONE,
                A.EMAIL,
                A.SENHA
            FROM 
                ASSOCIACAO A
            WHERE a.email = '${mail}' 
                AND a.senha = '${senha}'
            `);

            let jsonReturn = [];
            for (let i = 0; i < response.rows.length; i++) {
                jsonReturn.push({
                    "idassociacao":response.rows[i][0],
                    "nomefantasia":response.rows[i][1],
                    "nomerazao":response.rows[i][2],
                    "cnpj":response.rows[i][3],
                    "cep":response.rows[i][4],
                    "uf":response.rows[i][5],
                    "cidade":response.rows[i][6],
                    "bairro":response.rows[i][7],
                    "rua":response.rows[i][8],
                    "numero":response.rows[i][9],
                    "telefone":response.rows[i][10],
                    "email":response.rows[i][11],
                    "senha":response.rows[i][12]
                });
            }
            await conn.close();

            return jsonReturn;
        } catch (err) {
            console.log(err)
            await conn.close();
            return "";
        } 
    },

    login_solicitante: async object => {
        let conn;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER ,
                password: process.env.PWD ,
                connectString: process.env.CON
            });

            const { mail, senha } = object;
            const response = await conn.execute(`
            SELECT 
                A.IDUSUARIO,
                A.NOMEUSUARIO,
                A.CPF,
                A.EMAIL,
                A.SENHA,
                a.telefone,
                A.RUA,
                A.NUMERO,
                A.BAIRRO,
                A.CIDADE,
                A.UF,
                A.CEP
            FROM 
                usuario A
            WHERE 
                A.email = '${mail}' 
                AND A.senha = '${senha}'`);

            let jsonReturn = [];
            for (let i = 0; i < response.rows.length; i++) {
                jsonReturn.push({
                    "idusuario":response.rows[i][0],
                    "nomeusuario":response.rows[i][1],
                    "cpf":response.rows[i][2],
                    "email":response.rows[i][3],
                    "senha":response.rows[i][4],
                    "telefone":response.rows[i][5],
                    "rua":response.rows[i][6],
                    "numero":response.rows[i][7],
                    "bairro":response.rows[i][8],
                    "cidade":response.rows[i][9],
                    "uf":response.rows[i][10],
                    "cep":response.rows[i][11]
                });
            }
            return jsonReturn;

        } catch (err) {
            await conn.close();
            return "";

        } 
    },


    solicitacoes_id: async id_associacao => {//Todas as solicitações que estão vinculadas a uma associação
        let conn;
        let response;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER ,
                password: process.env.PWD ,
                connectString: process.env.CON 
            });

            response = await conn.execute(`
            SELECT distinct  a.idsolicitacao,
                    a.idassoci,
                    b.nomeusuario,
                    e.coletor,
                    a.cidade,
                    a.bairro,
                    a.rua,
                    a.numero,
                    a.datahorasolici,
                    a.statussolicitacao,
                    b.telefone,
                    a.cep,
                    a.idlixo,
                    a.idcoletor,
                    a.uf
            FROM solicitacao a 
                    JOIN usuario b on a.idusuario = b.idusuario 
                    LEFT JOIN associacao d on d.idassoci = a.idassoci
                    LEFT JOIN associ_coletor e on e.idassociacao = d.idassoci
                        AND a.idcoletor = e.idcoletor
            
            WHERE d.idassoci = ${id_associacao}
                OR d.idassoci is null`);

            let jsonReturn = [];
            for (let i = 0; i < response.rows.length; i++) {
                jsonReturn.push({
                    "idsolicitacao":response.rows[i][0],
                    "idassoci":response.rows[i][1],
                    "nomeusuario":response.rows[i][2],
                    "coletor":response.rows[i][3],
                    "cidade":response.rows[i][4],
                    "bairro":response.rows[i][5],
                    "rua":response.rows[i][6],
                    "numero":response.rows[i][7],
                    "datahorasolici":response.rows[i][8],
                    "status":response.rows[i][9],
                    "telefone":response.rows[i][10],
                    "cep":response.rows[i][11],
                    "idlixo":response.rows[i][12],
                    "idcoletor":response.rows[i][13],
                    "uf":response.rows[i][14]
                });
                
            }
            await conn.close();
            return jsonReturn;
            
        } catch (err) {
            console.log(err);
            await conn.close();
            return '';
        } 
    },

    solicitacoes_allId: async object => {//Buscar uma determinada solicitação de uma associação 
        let conn;
        let response;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER ,
                password: process.env.PWD ,
                connectString: process.env.CON 
            });

            const {id_associacao, id_solicitacao} = object;

            response = await conn.execute(`
            SELECT distinct  a.idsolicitacao,
                    a.idassoci,
                    b.nomeusuario,
                    e.coletor,
                    a.cidade,
                    a.bairro,
                    a.rua,
                    a.numero,
                    a.datahorasolici,
                    a.statussolicitacao,
                    b.telefone,
                    a.cep,
                    a.idlixo,
                    a.idcoletor,
                    a.uf
            FROM solicitacao a 
                    JOIN usuario b on a.idusuario = b.idusuario 
                    LEFT JOIN associacao d on d.idassoci = a.idassoci
                    LEFT JOIN associ_coletor e on e.idassociacao = d.idassoci
                        AND a.idcoletor = e.idcoletor
            
            WHERE a.idsolicitacao = ${id_solicitacao}
                `);

            let jsonReturn = [];
            for (let i = 0; i < response.rows.length; i++) {
                jsonReturn.push({
                    "idsolicitacao":response.rows[i][0],
                    "idassoci":response.rows[i][1],
                    "nomeusuario":response.rows[i][2],
                    "coletor":response.rows[i][3],
                    "cidade":response.rows[i][4],
                    "bairro":response.rows[i][5],
                    "rua":response.rows[i][6],
                    "numero":response.rows[i][7],
                    "datahorasolici":response.rows[i][8],
                    "status":response.rows[i][9],
                    "telefone":response.rows[i][10],
                    "cep":response.rows[i][11],
                    "idlixo":response.rows[i][12],
                    "idcoletor":response.rows[i][13],
                    "uf":response.rows[i][14]
                });        
            }
            await conn.close();
            return jsonReturn;
            
        } catch (err) {
            console.log(err);
            await conn.close();
            return '';
        } 
    },
    

    update_catador: async object => {
        let conn;
        let response;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER ,
                password: process.env.PWD ,
                connectString: process.env.CON 
            });

            const {id_catador, nome, cpf, preferencia_coleta, telefone, numero, cep, uf, cidade, bairro, rua, status, id_associacao } = object;
            
            response = await conn.execute(`
            UPDATE ASSOCI_COLETOR a 
                SET a.coletor = '${nome}',
                    a.cpf = '${cpf}',
                    a.idpreferenciacoleta = '${preferencia_coleta}',
                    a.telefone = '${telefone}',
                    a.numero = ${numero},
                    a.cep = '${cep}',
                    a.uf = '${uf}',
                    a.cidade = '${cidade}',
                    a.bairro = '${bairro}',
                    a.rua = '${rua}',
                    a.status = '${status}'
                    
                WHERE a.idcoletor = ${id_catador}
                    and a.idassociacao = ${id_associacao}
            `);

            await conn.close();
            
            if(response.rowsAffected == 0){
                return false;
            }
            return true;

        } catch (err) {
            await conn.close();
            console.log(err);
            return false;
        } 
    },

    inativar_catador: async id_catador => {
        let conn;
        let response;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER ,
                password: process.env.PWD ,
                connectString: process.env.CON 
            });
            
            response = await conn.execute(`
            UPDATE ASSOCI_COLETOR a 
                SET a.status = 'I'
                WHERE a.idcoletor = ${id_catador}
                `);

            await conn.close();
            
            if(response.rowsAffected == 0){
                return false;
            }
            return true;

        } catch (err) {
            await conn.close();
            console.log(err);
            return false;
        } 
    },

    update_solicitacao: async object => {
        let conn;
        let response;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER ,
                password: process.env.PWD ,
                connectString: process.env.CON 
            });

            const {id_solicitacao, status, id_associacao, id_catador} = object
            response = await conn.execute(`
                update solicitacao a 
                    set a.statussolicitacao = '${status}',
                        a.idassoci = ${id_associacao},
                        a.idcoletor = ${id_catador}
                where a.idsolicitacao = ${id_solicitacao}
            `);

            await conn.close();          
            if(response.rowsAffected == 0){
                return {"success":false};
            }
            return {"success":true};

        } catch (err) {
            await conn.close();
            console.log(err);
            return {"success":false};
        }
    },
    
    list_user: async id => {
        
        let conn;
        try {
            conn = await oracledb.getConnection({
                user: process.env.USER ,
                password: process.env.PWD ,
                connectString: process.env.CON
            });

            const response = await conn.execute(`
            SELECT 
                A.IDUSUARIO,
                A.NOMEUSUARIO,
                A.CPF,
                A.EMAIL,
                A.SENHA,
                A.TELEFONE,
                A.RUA,
                A.NUMERO,
                A.BAIRRO,
                A.CIDADE,
                A.UF,
                A.CEP
            FROM 
                usuario A
            WHERE 
                A.idusuario = ${id}`);

            let jsonReturn = [];
            jsonReturn.push({
                "idusuario":response.rows[0][0],
                "nomeusuario":response.rows[0][1],
                "cpf":response.rows[0][2],
                "email":response.rows[0][3],
                "senha":response.rows[0][4],
                "telefone":response.rows[0][5],
                "rua":response.rows[0][6],
                "numero":response.rows[0][7],
                "bairro":response.rows[0][8],
                "cidade":response.rows[0][9],
                "uf":response.rows[0][10],
                "cep":response.rows[0][11]
            });
        await conn.close();
        return jsonReturn;

        } catch (err) {
            await conn.close();
            return "";

        } 
    },

    update_usuario: async object => {
        let conn;
        let response;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER ,
                password: process.env.PWD ,
                connectString: process.env.CON 
            });

            const {idusuario, nome, cpf, mail, telefone, numero, cep, uf, cidade, bairro, rua, senha } = object;       
            response = await conn.execute(`
            UPDATE USUARIO a 
                SET a.nomeusuario = '${nome}',
                    a.cpf = ${cpf},
                    a.telefone = ${telefone},
                    a.numero = ${numero},
                    a.cep = ${cep},
                    a.uf = '${uf}',
                    a.cidade = '${cidade}',
                    a.bairro = '${bairro}',
                    a.rua = '${rua}',
                    a.email = '${mail}',
                    a.senha = '${senha}' 

                WHERE a.idusuario = ${idusuario}
            `);
            await conn.close();
            
            if(response.rowsAffected == 0){
                return false;
            }
            return true;

        } catch (err) {
            await conn.close();
            console.log(err);
            return false;
        }
    },
    
    select_AllCatador: async associacao => {
        let conn;
        let response;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER ,
                password: process.env.PWD ,
                connectString: process.env.CON 
            });      

            let sql = `a.status != 'I'`;

            if(associacao){
                sql += `and a.idassociacao = ${associacao}`
            }
            response = await conn.execute(`
                SELECT 
                    a.idcoletor,
                    a.idassociacao,
                    a.coletor,
                    a.cpf,
                    a.idpreferenciacoleta,
                    a.telefone,
                    a.numero,
                    a.cep,
                    a.uf,
                    a.cidade,
                    a.bairro,
                    a.rua,
                    a.status
                FROM ASSOCI_COLETOR a
                    where ${sql}
            `);

            let jsonReturn = [];
            for (let i = 0; i < response.rows.length; i++) {
                jsonReturn.push({
                    "idcoletor":response.rows[i][0],
                    "idassociacao":response.rows[i][1],
                    "coletor":response.rows[i][2],
                    "cpf":response.rows[i][3],
                    "preferenciacoleta":response.rows[i][4],
                    "telefone":response.rows[i][5],
                    "numero":response.rows[i][6],
                    "cep":response.rows[i][7],
                    "uf":response.rows[i][8],
                    "cidade":response.rows[i][9],
                    "bairro":response.rows[i][10],
                    "rua":response.rows[i][11],
                    "status":response.rows[i][12]
                });
                
            }
            conn.close();
            return jsonReturn;           
        } catch (err) {
            console.log(err);
            await conn.close();
        }
    },

    select_catador: async object => {
        let conn;
        let response;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER ,
                password: process.env.PWD ,
                connectString: process.env.CON 
            });
            const {id_associacao, id_catador} = object;
            response = await conn.execute(`
                SELECT 
                    a.idcoletor,
                    a.idassociacao,
                    a.coletor,
                    a.cpf,
                    a.idpreferenciacoleta,
                    a.telefone,
                    a.numero,
                    a.cep,
                    a.uf,
                    a.cidade,
                    a.bairro,
                    a.rua,
                    a.status
                FROM ASSOCI_COLETOR a
                    where a.idcoletor = ${id_catador}
                        and a.idassociacao = ${id_associacao}
            `);
        
             let jsonReturn = [];

            for (let i = 0; i < response.rows.length; i++) {
                jsonReturn.push({
                    "idcoletor":response.rows[i][0],
                    "idassociacao":response.rows[i][1],
                    "coletor":response.rows[i][2],
                    "cpf":response.rows[i][3],
                    "preferenciacoleta":response.rows[i][4],
                    "telefone":response.rows[i][5],
                    "numero":response.rows[i][6],
                    "cep":response.rows[i][7],
                    "uf":response.rows[i][8],
                    "cidade":response.rows[i][9],
                    "bairro":response.rows[i][10],
                    "rua":response.rows[i][11],
                    "status":response.rows[i][12]
                }); 
                
            } 
            await conn.close();
            return jsonReturn;

        } catch (err) {
            console.log(err);
            await conn.close();
        } 
    },


    select_typesLixo:async teste => {
        let conn;
        let response;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER ,
                password: process.env.PWD ,
                connectString: process.env.CON 
            });

            response = await conn.execute(`
                SELECT a.idlixo, a.tipolixo FROM tipolixo a
            `);

             let jsonReturn = [];

            for (let i = 0; i < response.rows.length; i++) {
                jsonReturn.push({
                    "idlixo":response.rows[i][0],
                    "tipolixo":response.rows[i][1]
                });               
            } 
            await conn.close();
            return jsonReturn;
            
        } catch (err) {
            console.log(err);
            await conn.close();
            return false;
        } 
    },

    update_associacao: async object => {
        let conn;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER ,
                password: process.env.PWD ,
                connectString: process.env.CON 
            });

            const {id, nomefantasia, nomerazao, cnpj, telefone, numero, cep, uf, cidade, bairro, rua, mail, senha } = object;
            
            const response = await conn.execute(`
            UPDATE  ASSOCIACAO a SET  
                a.nomefantasia = '${nomefantasia}',
                a.nomerazao = '${nomerazao}',
                a.cnpj = '${cnpj}',
                a.cep = '${cep}',
                a.uf = '${uf}',
                a.cidade = '${cidade}',
                a.bairro = '${bairro}',
                a.rua = '${rua}',
                a.numero = ${numero},
                a.telefone = ${telefone},
                a.email = '${mail}',
                a.senha = '${senha}'
                        
                WHERE a.idassoci = ${id}
            `);

            if(response.rowsAffected == 0){
                return {"success":false}
            }
            return {"success":true};

        } catch (err) {
            await conn.close();
            console.log(err);
            return {"success":false};
        } 
    },
    
    list_solicitacoes_usuario: async object => {//Buscar uma determinada solicitação de uma associação 
        let conn;
        let response;
        try {
                conn = await oracledb.getConnection({
                user: process.env.USER ,
                password: process.env.PWD ,
                connectString: process.env.CON 
            });

            const {usuario, id_solicitacao} = object;
            let sql = `b.idusuario = ${usuario}`;

            if(id_solicitacao){
                sql += `and a.idsolicitacao = ${id_solicitacao}`
            }
           
            response = await conn.execute(`
            SELECT distinct  a.idsolicitacao,
                    a.idassoci,
                    b.nomeusuario,
                    e.coletor,
                    a.cidade,
                    a.bairro,
                    a.rua,
                    a.numero,
                    a.datahorasolici,
                    a.statussolicitacao,
                    b.telefone,
                    a.cep,
                    a.idlixo,
                    a.idcoletor,
                    a.uf
            FROM solicitacao a 
                    JOIN usuario b on a.idusuario = b.idusuario 
                    LEFT JOIN associacao d on d.idassoci = a.idassoci
                    LEFT JOIN associ_coletor e on e.idassociacao = d.idassoci
                        AND a.idcoletor = e.idcoletor
            
            WHERE ${sql}

                `);

            let jsonReturn = [];
            for (let i = 0; i < response.rows.length; i++) {
                jsonReturn.push({
                    "idsolicitacao":response.rows[i][0],
                    "idassoci":response.rows[i][1],
                    "nomeusuario":response.rows[i][2],
                    "coletor":response.rows[i][3],
                    "cidade":response.rows[i][4],
                    "bairro":response.rows[i][5],
                    "rua":response.rows[i][6],
                    "numero":response.rows[i][7],
                    "datahorasolici":response.rows[i][8],
                    "status":response.rows[i][9],
                    "telefone":response.rows[i][10],
                    "cep":response.rows[i][11],
                    "idlixo":response.rows[i][12],
                    "idcoletor":response.rows[i][13],
                    "uf":response.rows[i][14]
                });        
            }
            await conn.close();
            return jsonReturn;
            
        } catch (err) {
            console.log(err);
            await conn.close();
            return '';
        } 
    }
    
};