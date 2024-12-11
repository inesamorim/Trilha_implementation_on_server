const http = require('http'); //import do módulo http
const fs = require('fs');

const port = 3000;

const users = {}; 
const RANKING_FILE = './ranking.json';
const waitingPlayers = {};

//Registo
function handleRegister(req, res, body){
    try {
        const {nick, password} = JSON.parse(body);

        if (typeof nick != 'string' || typeof password != 'string'){
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: "Os argumentos devem ser strings."}));
            return;
        }

        if (users[nick]) {
            //já se encontra registado
            if (users[nick] == password){
                //senha correta
                res.writeHead(200, {'COntent-Type': 'application/json'});
                res.end(JSON.stringify({sucess: 'Login bem sucedido'}));
            } else {
                //senha incorreta
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Jogador já registado com outra senha.' }));
            }
        } else {
            //novo registo
            users[nick] = password;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: 'Registo bem-sucedido.' }));
        }
    }
    
    catch {
        // Erro de parse ou outro erro interno
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Formato inválido de dados.' }));
    }
}

//Ranking

// ler o ranking
const readRankingfFromFile = () => {
    if (fs.existsSync(RANKING_FILE)){
        const data = fs.readFileSync(RANKING_FILE);
        return JSON.parse(data);
    }
    return {};
};

//escrever o ranking
const writeRankingToFile = (ranking) => {
    fs.write
}



//Join
function handleJoin(req, res, body){
    try {
        const {group, nick, password, size} = JSON.parse(body);

        

        if (
            typeof group !== 'string' ||
            typeof nick !== 'string' ||
            typeof password !== 'string' ||
            typeof size !== 'number' ||
            size <= 0
        ) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Argumentos inválidos.' }));
            return;
        }

        if (!users[nick] || user[nick] !== password) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Autenticação falhou.' }));
            return;
        }

        // Emparelhamento
        if (!waitingPlayers[size]) {
            waitingPlayers[size] = [];
        }

        if (waitingPlayers[size].length > 0) {
            //encontrar jogador
            const opponent = waitingPlayers[size].shift();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(
                JSON.stringify({
                    success: 'Emparelhado com outro jogador.',
                    opponent: opponent.nick,
                })
            );

            console.log(`Notificação: ${opponent.nick} foi emparelhado com ${nick}`);
        } else {
            //adicionar jogador à lista de espera
            waitingPlayers[size].push({group, nick});
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: 'Aguardando emparelhamento.' }));
        }
    }

    catch (err) {
        // Erro de parse ou outro erro interno
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Formato inválido de dados.' }));
    }
}

const server = http.createServer((req, res) => {
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
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint não encontrado.' }));
    }
});

server.listen(port, () => {
    console.log("Server listening in http://localhost:3000/");
});