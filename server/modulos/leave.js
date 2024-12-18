const fs = require('fs');
const crypto = require('crypto'); 
const { games,waitingPlayers } = require('./join');
const { updateRanking } = require('./ranking.js')

const FILE_PATH = './players.json';


const readPlayersFromFile = () => {
    if (fs.existsSync(FILE_PATH)) {
        return JSON.parse(fs.readFileSync(FILE_PATH));
    }
    return {};
};

function encryptPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}


//Leave
function handleLeave(req, res, body) {
    try {
        const { nick, password, game } = JSON.parse(body);
        const users = readPlayersFromFile();

        if (
            typeof nick !== 'string' ||
            typeof password !== 'string' ||
            typeof game !== 'string'
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

        // Verifica se o jogo existe
        if (!games[game]) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Jogo não encontrado.' }));
            return;
        }
        
        const game_data = games[game];
        delete games[game];
        const jogo = game_data.jogo;
        if (jogo){ // se exitir entao alguem vai ganhar
            if(nick == jogo.player_info[0]){ // p2 ganhou
                jogo.winner = jogo.player_info[1];
            } else { // p1 ganhou
                jogo.winner = jogo.player_info[0];
            }
            updateRanking(game_data);
            game_data.stream_1.write(
                `data: ${JSON.stringify({"winner": jogo.winner})}\n\n`
            )
            game_data.stream_2.write(
                `data: ${JSON.stringify({"winner": jogo.winner})}\n\n`
            )
            
        } else { // se nao entao vai abandonar a procura
            
            // remover da fila de espera 
            let index = waitingPlayers[game_data.size].findIndex(player => player.game_hash === game);
            if (index !== -1) {
                waitingPlayers[game_data.size].splice(index, 1);
            }
            res.writeHead(200, {'COntent-Type': 'application/json'});
            res.end(JSON.stringify({sucess: 'Abandonou a procura', "winner": null}));

            
        }
   
           

    } catch (err) {
        console.log(err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Formato inválido de dados.' }));
    }
}


module.exports.handleLeave = handleLeave;
