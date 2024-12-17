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

module.exports = { handleRanking };
