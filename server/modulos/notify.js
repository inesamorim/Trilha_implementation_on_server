const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
const { games } = require('./join');
const { type } = require('os');
const { trilha, player_move } = require('../jogo');
//const { jogo } = require('../jogo');
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

function handleNotify(req, res, body) {
    try {
        let { nick, password, game, move } = JSON.parse(body);

        // Verifica se todos os argumentos foram fornecidos
        if (!nick || !password || !game || !move) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Todos os argumentos são obrigatórios.' }));
            return;
        }

        if (
            typeof nick !== 'string' ||
            typeof password !== 'string' ||
            typeof game !== 'string' ||
            typeof move !== 'object'
        ) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Argumentos inválidos.' }));
            return;
        }
        
        const users = readPlayersFromFile();
        const encrypted = encryptPassword(password);
        
        
        // Verifica se o jogador está autenticado
        if (!users[nick] || users[nick] !== encryptPassword(password)) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Autenticação falhou.' }));
            return;
        }
        

        // Verifica se o jogo existe
        if (!games[game]) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Jogo não encontrado.' }));
            return;
        }

        const currentGame = games[game];
        const jogo = currentGame['jogo'];

        if (
            typeof move.square !== 'number' ||
            typeof move.position !== 'number' ||
            move.square < 0 || move.square >= currentGame['size'] ||
            move.position < 0 || move.position >= 8
        ) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Argumentos inválidos.' }));
            return;
        }

        // Verifica se é a vez do jogador
        if (jogo.turn !== 'P1') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Não é a sua vez de jogar.' }));
            return;
        }

        // Verifica se a jogada é válida (implementação das regras específicas)
        const jogadas = jogo.jogadas_possiveis();
        move = [move.square, move.position];
        //let jogada_escolhida = 0;
        if(!jogo.fase){
            if(!jogadas.includes([move[0],move[1]])){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Jogada inválida.' }));
                return;
            }
            else{
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: 'Jogada Válida' }));
                player_move(jogo, move[0], move[1], game.flags);
            }
        }
        else{
            if(!game['flags'].mover_peca){
                if(move !== jogadas[0][0]){
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Jogada inválida.' }));
                    return;
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: 'Jogada Válida' }));
                    player_move(jogo, move[0], move[1], game.flags);
                }
            } else {
                if(jogadas[0].slice(1).includes(move)){
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Jogada inválida.' }));
                    return;
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: 'Jogada Válida' }));
                    player_move(jogo, move[0], move[1], game.flags);
                }
            }
        }

        // Chamada à função sendUpdate
        move = {'square': move[0], 'position': move[1]};
        sendUpdate(game, move);

        
    } catch (err) {
        // Lida com erros de parse ou outros erros
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro no processamento do pedido.' }));
        console.log(err);
    }
}

function sendUpdate(game, move) {
    const response = {}
    response.cell = move;

    const board = game.jogo.board;
    const board_copy = JSON.parse(JSON.stringify(game.jogo.board));
    for(let i=0; i<game.jogo.size_board; i++){
        for(let j = 0; j<8; j++){
            if (board[i][j] != 'empty'){
                if(board[i][j] == 'piece_1'){
                    board_copy[i][j] = 'blue';
                } else {
                    board_copy[i][j] = 'red';
                }
            }
        }
    }
    response.board = board_copy;

    const phase = game.jogo.fase == 0 ? 'drop' : 'move';
    response.phase = phase;
    if (phase === "move") {
        if (game.flags.remover_peca) {
            response.step = "take";
        } else if (game.flags.mover_peca) {
            response.step = "to";
        } else {
            response.step = "from";
        }
    }
    const player_1 = game['player_1'];
    const player_2 = game['player_2'];
    const players = {player_1: 'blue', player_2: 'red'};
    response.players = players;

    const turn = game.jogo.turn;
    response.turn = turn;

    const winner = game.jogo.winner;
    response.winner = winner;

    game.stream_1.write(
        `data: ${JSON.stringify(response)}\n\n`
    )
    game.stream_2.write(
        `data: ${JSON.stringify(response)}\n\n`
    )
}

/*games[game_hash] = {'player_1': nick,
                        'player_2': opponent.nick,
                        'size': size,
                        'jogo': jogo,  
                        'flags': flags ,
                        'stream_1': null,
                        'stream_2': null
            }*/

module.exports = { handleNotify };
