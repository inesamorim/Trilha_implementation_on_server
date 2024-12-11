const http = require('http'); //import do módulo http
const { handleRegister } = require('./modulos/register');
const { handleRanking } = require('./modulos/ranking');

const port = 8102;

const users = {}; 
const waitingPlayers = {};


const server = http.createServer((req, res) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    const url = new URL(req.url, 'http://${req.headers.host}');

    if (req.method === 'POST' && req.url === '/join') {
        // Coletando o corpo da requisição
        let body = '';
        req.on('data', chunk => {
            console.log('Chunk recebido:', chunk.toString()); 
            body += chunk.toString();
        });

        req.on('end', () => {
            handleJoin(req, res, body);
        });
    } else if (req.method === 'POST' && req.url === '/register') {
        // Reutilizando a função de registro do exemplo anterior
        let body = '';
        req.on('data', chunk => {
            console.log('Chunk recebido:', chunk.toString()); 
            body += chunk.toString();
        });

        req.on('end', () => {
            handleRegister(req, res, body);
        });
    } else if (req.method === 'GET' && url.pathname === '/ranking') {
        handleRanking(req, res);
    } 
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint não encontrado.' }));
    }
});

server.listen(port, () => {
    console.log("Server listening in http://localhost:8102");
});



