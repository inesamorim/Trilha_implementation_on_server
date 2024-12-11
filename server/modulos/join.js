const fs = require('fs');
const FILE_PATH = './ranking.json';

const readPlayersFromFile = () => {
    if (fs.existsSync(FILE_PATH)) {
        return JSON.parse(fs.readFileSync(FILE_PATH));
    }
    return {};
};

//Join
function handleJoin(req, res, body){
    try {
        const {group, nick, password, size} = JSON.parse(body);
        const users = readPlayersFromFile();

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

        if (!users[nick] || users[nick] !== password) {
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

module.exports = { handleJoin };