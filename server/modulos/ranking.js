const fs = require('fs');
const FILE_PATH = './ranking.json';

const readRankingFromFile = () => {
    if (fs.existsSync(FILE_PATH)) {
        return JSON.parse(fs.readFileSync(FILE_PATH));
    }
    return {};
};

const writeRankingToFile = (ranking) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(ranking, null, 2));
};

function handleRanking(req, res, body) {
    const { group, size } = JSON.parse(body);

    // Validação dos parâmetros
    if (!group || !size) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Parâmetros group e size são obrigatórios' }));
        return;
    }

    const groupInt = parseInt(group);
    const sizeInt = parseInt(size);

    if (isNaN(groupInt) || groupInt <= 0 || isNaN(sizeInt) || sizeInt <= 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Parâmetros devem ser inteiros positivos' }));
        return;
    }

    // Lê os dados do arquivo
    const rankingData = readRankingFromFile();

    if (!rankingData[group] || !rankingData[group][size]) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ranking: [] }));
        return;
    }

    // Ordena o ranking por victories
    const sortedRanking = rankingData[group][size]
        .sort((a, b) => b.victories - a.victories)
        .slice(0, 10);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ranking: sortedRanking }));
}

function updateRanking(game_data){
    const rankingData = readRankingFromFile();

    const group = rankingData[game_data.group];
    if (!group) {
      console.error(`Group ${game_data.group} does not exist.`);
      return;
    }
  
    const boardSize = group[game_data.jogo.size_board];
    if (!boardSize) {
      console.error(`Board size ${game_data.jogo.size_board} does not exist.`);
      return;
    }
  
    // Find the player by nick
    let player1 = boardSize.find(player => player.nick === game_data.jogo.player_info[0]);
    if (!player1) {
        console.error(`Player ${nick} does not exist.`);
        return;
    }
    let player2 = boardSize.find(player => player.nick === game_data.jogo.player_info[1]);
    if (!player2) {
      console.error(`Player ${nick} does not exist.`);
      return;
    }
    
    player1.games++; player2.games++;
    if (game_data.jogo.winner == player1.nick){
        player1.victories++; 
    }else{
        player2.victories++;
    }


    writeRankingToFile(rankingData);
}

module.exports = { handleRanking, updateRanking };
