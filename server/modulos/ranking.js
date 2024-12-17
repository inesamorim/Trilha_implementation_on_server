const fs = require('fs');
const FILE_PATH = './ranking.json';
const url = new URL('http://localhost:8102/ranking')

const readRankingFromFile = () => {
    if (fs.existsSync(FILE_PATH)) {
        return JSON.parse(fs.readFileSync(FILE_PATH));
    }
    return {};
};

const writeRankingToFile = (ranking) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(ranking, null, 2));
};

function handleRanking(req, res, body)  {
    //const url = new URL(req.url, 'http://${req.headers.host}')
    const {group, size} = JSON.parse(body);

    if (!group || !size) {
        // os parâmetros foram omitidos
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Parâmetros group e size são obrigatórios'}));
        return;
    }   

    const groupInt = parseInt(group);
    const sizeInt =parseInt(size);

    if (isNaN(groupInt) || groupInt <= 0 || isNaN(sizeInt) || sizeInt <= 0) {
        res.write(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Os parâmetros group e size devem ser inteiros positivos' }));
        return;
    }

    const rankingData = readRankingFromFile();

    if (!rankingData[group] || !rankingData[group][size]) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ranking: []}));
        return;
    }

    const sortedRanking = rankingData[group][size]
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ranking: sortedRanking} ));
}

module.exports = { handleRanking };