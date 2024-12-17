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
        let { nick, password, game, cell } = JSON.parse(body);

        // Verifica se todos os argumentos foram fornecidos
        if (!nick || !password || !game || !cell) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Todos os argumentos são obrigatórios.' }));
            return;
        }

        if (
            typeof nick !== 'string' ||
            typeof password !== 'string' ||
            typeof game !== 'string' ||
            typeof cell !== 'object'
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
            typeof cell.square !== 'number' ||
            typeof cell.position !== 'number' ||
            cell.square < 0 || cell.square >= currentGame['size'] ||
            cell.position < 0 || cell.position >= 8
        ) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Argumentos inválidos.' }));
            return;
        }
        
        const turn = jogo.turn == 0 ? currentGame['player_1'] : currentGame['player_2'];
        // Verifica se é a vez do jogador
        if (turn !== nick) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Não é a sua vez de jogar.' }));
            return;
        }

        // Verifica se a jogada é válida (implementação das regras específicas)
        let jogadas = jogo.jogadas_possiveis();
        let move = [cell.square, cell.position];
        //console.log('Move:', move);
        //console.log('Jogadas possíveis:', jogadas);
        let jogada_escolhida = null;
        if(!jogo.fase){
            console.log('Fase 1');
            for(let i = 0; i < jogadas.length; i++){
                //console.log('Jogada possível:', jogadas[i][0], jogadas[i][1]);
                //console.log(move[0] == jogadas[i][0]);
                //console.log(move[1] == jogadas[i][1]);
                if(jogadas[i][0] == move[0] && jogadas[i][1] == move[1]){
                    jogada_escolhida = i;
                    break;
                }
            }
            //console.log('Jogada escolhida:', jogada_escolhida);
            if(jogada_escolhida == null){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Jogada inválida.' }));
                return;
            }
            else{
                res.writeHead(200, { 'Content-Type': 'application/json' });
                //res.end(JSON.stringify({}));
                player_move(jogo, move[0], move[1], currentGame.flags);
            }
        }
        else{
            jogadas_possiveis = jogo.jogadas_possiveis_dada_peca(move[0], move[1]);
            console.log(jogo.board);
            console.log('Fase 2');
            console.log(currentGame['flags']);
            if(!currentGame['flags'].mover_peca){
                console.log(move);
                console.log(jogadas);
                if(move !== jogadas[0][0]){
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Jogada inválida.' }));
                    return;
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    //res.end(JSON.stringify({}));
                    player_move(jogo, move[0], move[1], currentGame.flags);
                }
            } else {
                if(jogadas[0].slice(1).includes(move)){
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Jogada inválida.' }));
                    return;
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    //res.end(JSON.stringify({}));
                    player_move(jogo, move[0], move[1], currentGame.flags);
                }
            }
        }

        console.log('Move realizado com sucesso');
        // Chamada à função sendUpdate
        move = {'square': move[0], 'position': move[1]};
        sendUpdate(currentGame, move);
        res.end(JSON.stringify({}));
        
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

    const players = {};
    players[game.player_1] = 'blue'
    players[game.player_2] =  'red';
    response.players = players;

    const turn = game.jogo.turn == 0 ? game.player_1 : game.player_2;
    response.turn = turn;

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
