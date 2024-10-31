/*
    size_board = n
    vamos ter n*4 + 1 objetos por linha

*/

class trilha{
    // 0 corresponde ao P1 | 1 corresponde ao P2

    constructor(size_board,player_inicial){
        this.board = Array.from({ length: size_board }, () => Array(8).fill("empty")); // inicia a board cada array com 8 entradas a "empty"
        this.turn = player_inicial == 'P1' ? 0 : 1;
        this.pieces = Array.from({ length: 2 }, () => Array(size_board**3).fill("to_place")); // decidir melhor qual terminação usar
    }


}


function main(){ // usado para criar o jogo e apresentar no html

    const BoardSize = document.querySelector('select[name="size"]').value;
    const startPlayer = document.querySelector('select[name="start"]').value;
    const player1 = document.querySelector('select[name="p1"]').value;
    const player2 = document.querySelector('select[name="p2"]').value;

    jogo = new trilha(BoardSize,startPlayer);

    gerar_board(BoardSize);
}


function gerar_board(n) {
    // com o exemplo de como o prof fez o tabuleiro dele nos slides, n quadrados tem n*4+1 celulas por linha numa matriz quadrada
    const gridSize = n * 4 + 1;
    
    // a div on vamos colocar o tabuleiro
    const container = document.getElementById('tabu');
    container.innerHTML = ''; // limpar a div caso tenha algo
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;
    container.style.gridTemplateRows = `repeat(${gridSize}, 30px)`;
    

    // gerar o tabuleiro dinamicamente em funcao do num que quadrados
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';

            // Determine the pattern for concentric squares
            const layer = Math.min(row, col, gridSize - row - 1, gridSize - col - 1);

            // Determine if this is an "O" position (end or midpoint)
            const isEdgeRow = (row === layer || row === gridSize - layer - 1);
            const isEdgeCol = (col === layer || col === gridSize - layer - 1);
            const isMidRow = row === Math.floor((gridSize - 1) / 2);
            const isMidCol = col === Math.floor((gridSize - 1) / 2);

            if (layer % 2 === 0 && layer / 2 < n) {
                // Determine positions for circles "O" at midpoints and edges of each face
                if (
                    (isEdgeRow && (col === layer || col === gridSize - layer - 1 || col === Math.floor((gridSize - 1) / 2))) || 
                    (isEdgeCol && (row === layer || row === gridSize - layer - 1 || row === Math.floor((gridSize - 1) / 2)))
                ) {
                    cell.classList.add('cell');
                } else if (isEdgeRow) {
                    cell.classList.add('hrule');
                } else if (isEdgeCol) {
                    cell.classList.add('vrule');
                }
            }
            else{
                if(isMidCol && layer/2 +1 < n){
                    cell.classList.add('vrule');
                } else if (isMidRow && layer/2+1 < n){
                    cell.classList.add('hrule');
                }
            }

            container.appendChild(cell);
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const start = document.querySelectorAll('.comecar_jogo');
    
    start.forEach(button => {
        button.addEventListener('click', function() { // iniciar o jogo
            console.log("ola 222");
            main();
        });
    });
});