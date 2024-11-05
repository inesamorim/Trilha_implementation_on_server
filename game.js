
class Player{
    constructor(id, color){ //n_pieces
        this.id = id;
        this.pieces = 9; /*number of pices */
        this.color = color;
        this.placePiece = 0; //quando chegar a n_pieces começar 2ºfase
        this.piecesOnBoard = [];

    }

    nPieces(){ //to see nº of pieces on board
        return this.piecesOnBoard.length;
    }

    getPieceAt(x, y){  //boolean true if found else false
        return this.piecesOnBoard.find(p => p.x === x && p.y === y);
        //why ===
    }

    placePiece(position){
        if (this.placePiece<this.pieces && !this.getPieceAt(position.x, position.y)){
            //this.pieces--; pk?
            this.placePiece++;
            this.piecesOnBoard.push({x: position.x, y: position.y});
            return true;
        }

        return false;
    }

    movePiece(piece, new_x, new_y) {
        piece.x = new_x;
        piece.y = new_y;
    }

    removePieceAt(x, y) {
        this.piecesOnBoard = this.piecesOnBoard.filter(p => !(p.x === x && p.y === y));
    }

    ////ver como fazer com as existentes~
    /*
    criar tabela que guarda poss de pieces antes de colocadas e depois quando
    uma peça é colocada remove-se o último elemento da lista
    */


    //ver para usar class piece já existente de css
    drawPieces(context, cellSize) {  //argumentos vindos da class jogo
        this.piecesOnBoard.forEach(piece => {
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(
                piece.x * cellSize + cellSize /2,
                piece.y * cellSize + cellSize /2,
                cellSize / 4,
                0, 
                Math.PI * 2
            );
            context.fill();
        });
    }


    /*

    Placing phase -> colocar peças
    Moving phase -> jogo em si

    ->nº de peças atuais ativado quando é removida peça
    ->ver possíveis posiçoes
    ->mover peça
    ?->escolher peça
    ->ver moinho
    ->comer peça

    */
}

class Game{

}

/--------------------------------------TESTE---------------------------------------------/
// ran AIdiff(num of moves it can see?)  (4, 6, 8, 10, 12)
// 1, 10, 20, 30, 40, 50   

// numa faze inicial é apenas necessário salvar um scor
//start with 0 points
localStorage.setItem("Player", 0);

 
function getScore(){
    return localStorage.getItem("Player");
}

function increaseScore(value){
    let scor = getScore();
    scor += value;
    //using same key overwrites previous value
    localStorage.setItem("Player", scor);
}

function decreaseScore(value){
    //usar valores negativos?  assumir q não
    //método de dívidas
    let scor = getScore();
    scor = Math.max(scor-value, 0);
    localStorage.setItem("Player", scor);
}


//-------------------------DEPOIS------------------------------//usar servido
// Save score to the server
function saveScore(playerName, score) {
    fetch("https://yourserver.com/api/saveScore", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ playerName, score })
    })
    .then(response => response.json())
    .then(data => console.log("Score saved:", data))
    .catch(error => console.error("Error:", error));
}

// Retrieve score from the server
function getScore(playerName) {
    fetch(`https://yourserver.com/api/getScore?playerName=${playerName}`)
        .then(response => response.json())
        .then(data => console.log("Player score:", data.score))
        .catch(error => console.error("Error:", error));
}


/--------------/

// Assuming Firebase is set up and initialized in your project
function saveScore(playerName, score) {
    firebase.firestore().collection("scores").doc(playerName).set({
        score: score
    })
    .then(() => console.log("Score saved!"))
    .catch(error => console.error("Error saving score:", error));
}

function getScore(playerName) {
    firebase.firestore().collection("scores").doc(playerName).get()
        .then(doc => {
            if (doc.exists) {
                console.log("Player score:", doc.data().score);
            } else {
                console.log("No such player!");
            }
        })
        .catch(error => console.error("Error getting score:", error));
}
