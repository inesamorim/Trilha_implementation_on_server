const fs = require('fs');
const { games } = require('./join');

function handleUpdate(req, res) {
    console.log("Handling update");
    try {
        const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
        const game = urlParams.get('game');
        const nick = urlParams.get('nick');

        // Verifica se os parâmetros foram fornecidos
        if (!game || !nick) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Os parâmetros game e nick são obrigatórios.' }));
            console.log("faltam parametros")
            return;
        }

        if (
            typeof nick !== 'string' ||
            typeof game !== 'string'
        ) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Argumentos inválidos.' }));
            console.log("parametros invalidos")
            return;
        }

        // Verifica se o jogo existe
        if (!games[game]) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Jogo não encontrado.' }));
            console.log("jogo n existe")
            return;
        }

        const currentGame = games[game];
        const jogo = currentGame['jogo'];

        // Configura o cabeçalho para Server-Sent Events
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });


        if(currentGame['player_2'] == nick){
            console.log("stream 2");
            currentGame['stream_2'] = res;
            sendUpdate(currentGame);
        } else {
            console.log("stream 1");
            currentGame['stream_1'] = res;
        }
        

        // Envia atualizações do jogo periodicamente
        const interval = setInterval(() => {
            console.log("timeout");
            res.write(`data: ${JSON.stringify({ gameState: currentGame })}\n\n`);

            // Fecha o EventSource quando o jogo termina
            if (jogo.winner) {
               
                clearInterval(interval);
                res.write(`event: end\ndata: Jogo terminado\n O jogador ${jogo.winner} ganhou\n`);
                res.end();
            }
        }, 60*1000*10);

        // Lida com a desconexão do cliente
        /*req.on('close', () => {
            clearInterval(interval);
            res.end();
        });*/
    } catch (err) {
        // Lida com erros no servidor
        console.log(err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro no servidor ao enviar atualizações.' }));
    }
}

function sendUpdate(game) {
    const response = {}

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

    //console.log(response);
}

module.exports = { handleUpdate };
