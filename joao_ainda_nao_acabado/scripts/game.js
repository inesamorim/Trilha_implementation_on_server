
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