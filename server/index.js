const http = require('http'); //import do módulo http
const { handleRegister } = require('./modulos/register');
const { handleRanking } = require('./modulos/ranking');
const { handleJoin } = require('./modulos/join');
const { handleUpdate } = require('./modulos/update');
const { handleNotify } = require('./modulos/notify');
const { handleLeave } = require('./modulos/leave');

const port = 8102;
const url = 'http://localhost:8102';

//const users = {};



const server = http.createServer((req, res) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    //console.log(req.url.startsWith('/update'), req.method === 'GET');
    //const url = new URL(req.url, 'http://${req.headers.host}');

    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite qualquer origem
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Cabeçalhos permitidos

    if (req.method === 'OPTIONS') {
        res.writeHead(204); // Responde às requisições OPTIONS
        res.end();
        return;
    }

    if (req.method == 'POST' && req.url == '/join') {
        let body = '';
        req.on('data', chunk => {
            console.log('Chunk recebido:', chunk.toString());
            body += chunk.toString();
        });

        req.on('end', () => {
            handleJoin(req, res, body);
        });
    } else if (req.method == 'POST' && req.url == '/register') {
        let body = '';
        req.on('data', chunk => {
            console.log('Chunk recebido:', chunk.toString());
            body += chunk.toString();
        });

        req.on('end', () => {
            handleRegister(req, res, body);
        });
    } else if (req.method == 'POST' && req.url == '/ranking') {
        let body = '';
        req.on('data', chunk => {
            console.log('Chunk recebido:', chunk.toString());
            body += chunk.toString();
        });

        req.on('end', () => {
            handleRanking(req, res, body);
        });
    } else if (req.method == 'POST' && req.url == '/notify'){
        let body = '';
        req.on('data', chunk => {
            console.log('Chunk recebido:', chunk.toString());
            body += chunk.toString();
        });

        req.on('end', () => {
            handleNotify(req, res, body);
        });
    } else if (req.url.startsWith('/update') && req.method === 'GET') {
        console.log("Received update request")

        let body = '';
        req.on('data', chunk => {
            console.log('Chunk recebido:', chunk.toString());
            body += chunk.toString();
        });

        req.on('end', () => {
            handleUpdate(req, res, body);
        });
    } else if(req.method == 'POST' && req.url == '/leave'){
        let body = '';
        req.on('data', chunk => {
            console.log('Chunk recebido:', chunk.toString());
            body += chunk.toString();
        });

        req.on('end', () => {
            handleLeave(req, res, body);
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint não encontrado.' }));
    }
});

server.listen(port, () => {
    console.log("Server listening in http://localhost:8102");
});
