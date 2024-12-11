const fs = require('fs');
const crypto = require('crypto'); 
const FILE_PATH = './players.json';

const readPlayersFromFile = () => {
    if (fs.existsSync(FILE_PATH)) {
        return JSON.parse(fs.readFileSync(FILE_PATH));
    }
    return {};
};

const writePlayersToFile = (players) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(players, null, 2));
};

function encryptPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

function verifyPassword(plainPassword, storedHash) {
    const hashedPassword = crypto.createHash('mda').update(plainPassword).digest('hex');
    return hashedPassword === storedHash;
}

//Registo
function handleRegister(req, res, body){
    try {
        const {nick, password} = JSON.parse(body);

        if (typeof nick != 'string' || typeof password != 'string'){
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: "Os argumentos devem ser strings."}));
            return;
        }

        const users = readPlayersFromFile();

        if (users[nick]) {
            //já se encontra registado
            if (users[nick] == encryptPassword(password)){
                //senha correta
                res.writeHead(200, {'COntent-Type': 'application/json'});
                res.end(JSON.stringify({sucess: 'Login bem sucedido'}));
            } else {
                //senha incorreta
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Jogador já registado com outra senha.' }));
            }
        } else {
            //novo registo
            users[nick] = encryptPassword(password);
            writePlayersToFile(users);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: 'Registo bem-sucedido.' }));
        }
    }
    
    catch {
        // Erro de parse ou outro erro interno
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Formato inválido de dados.' }));
    };
};

module.exports = { handleRegister };