const fs = require('fs');
const crypto = require('crypto'); 
const { trilha } = require('../jogo');
const FILE_PATH = './players.json';
const waitingPlayers = {};
const games = {};


const readPlayersFromFile = () => {
    if (fs.existsSync(FILE_PATH)) {
        return JSON.parse(fs.readFileSync(FILE_PATH));
    }
    return {};
};


function encryptPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

function generateGameHash(username, boardSize) {
    // Get the plaintext to use for the hash (Uses the username, board size and current date)
    const plainText = username + boardSize + Date.now().toString();
    // Compute and return the game hash
    return crypto.createHash("sha256").update(plainText).digest("hex");
  }

//Join
function handleJoin(req, res, body) {
    try {
        const { group, nick, password, size } = JSON.parse(body);
        const users = readPlayersFromFile();

        if (
            typeof group !== 'number' ||
            typeof nick !== 'string' ||
            typeof password !== 'string' ||
            typeof size !== 'number' ||
            size <= 0
        ) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Argumentos inválidos.' }));
            return;
        }

        if (!users[nick] || users[nick] !== encryptPassword(password)) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Autenticação falhou.' }));
            return;
        }

        // Emparelhamento
        if (!waitingPlayers[size]) {
            waitingPlayers[size] = [];
        }

        if (waitingPlayers[size].length > 0) {
            const opponent = waitingPlayers[size].shift(); //pop
            games[opponent.game_hash].player_2 = nick;
            const jogo = new trilha(size, 'P1', opponent.nick, 0, nick, 0);
            games[opponent.game_hash].jogo = jogo;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(
                JSON.stringify({
                    'game': opponent.game_hash
                })
            );
            console.log(`Notificação: ${opponent.nick} foi emparelhado com ${nick}`);

           
            
        } else {
            const game_hash = generateGameHash(nick, size);
            

            const flags = {
                eliminar_peca: false,
                mover_peca: false
            };

            games[game_hash] = {'player_1': nick,
                                'player_2': null,
                                'size': size,
                                'jogo': null,  
                                'flags': flags ,
                                'stream_1': null,
                                'stream_2': null,
                                'group': group
            }
            waitingPlayers[size].push({ group, nick, game_hash });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 'game': game_hash }));
            
        }


    } catch (err) {
        console.log(err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Formato inválido de dados.' }));
    }
}


module.exports.handleJoin = handleJoin;
module.exports.games = games;
module.exports.waitingPlayers = waitingPlayers;