
class trilha{
    // 0 corresponde ao P1 | 1 corresponde ao P2

    constructor(size_board,player_inicial){
        this.board = Array.from({ length: size_board }, () => Array(8).fill("empty")); // inicia a board cada array com 8 entradas a "empty"
        this.turn = player_inicial == 'P1' ? 0 : 1;
        //this.pieces = Array.from({ length: 2 }, () => Array(size_board*3).fill("to_place")); // decidir melhor qual terminação usar
        this.pieces = [size_board*3,size_board*3]; // ? provavelmente podemos retirar
        this.fase = 0; // 0 -> colocar pecas | 1 -> mover
        this.remove_peca = false;
    }

    colocar_peca(sq,pos){
        this.board[sq][pos] = this.turn == 0 ? 'piece_1' : 'piece_2';
    }

    remover_peca(sq,pos){
        if( this.board[sq][pos] == 'piece_1' && this.turn == 1 // garantir que e valido eliminar
            || this.board[sq][pos] == 'piece_2' && this.turn == 0
        ){
            this.board[sq][pos] = 'empty';
        }
    }

    jogadas_possiveis(){ // 3 possibilidade colocar | mover | mover sem restricoes
        let possiveis = [];  let n = 0;
        let prox_a_jogar = this.turn == 0 ? 'piece_1' : 'piece_2';
        
        if( !this.fase ){ // colocar peca
            for (let i=0; i<this.board.length;i++){
                for(let j=0;j<this.board[i].length;j++){
                    if ( this.board[i][j] == "empty" ){
                        possiveis[n++] = [i,j];
                        continue;
                    }
                }
            }
        } else if ( this.pieces[this.turn] > 3 ){ // colocar em posicao adjacente
            for (let i=0; i<this.board.length;i++){
                for(let j=0;j<this.board[i].length;j++){


                }
            }
        }else{ // mover para qualquer pos
            for (let i=0; i<this.board.length;i++){
                for(let j=0;j<this.board[i].length;j++){ // [ [pos das nossas pecas],  [pos de celulas vazias]  ]


                }
            }
        }

        return possiveis
    }

    check_moinho(sq,pos){
        // check vertical


        //check horizontal

        return false;
    }

}



function main(){ // usado para criar o jogo e apresentar no html
    
    const BoardSize = document.querySelector('select[name="size"]').value;
    let startPlayer = document.querySelector('select[name="start"]').value;
    
    const board_structurs = [[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[0,3],[1,3],[2,3],[2,4],[1,4],[0,4],[2,5],[2,6],[2,7],[1,5],[1,6],[1,7],[0,5],[0,6],[0,7]],
                           [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2],[0,3],[1,3],[2,3],[3,3],[3,4],[2,4],[1,4],[0,4],[3,5],[3,6],[3,7],[2,5],[2,6],[2,7],[1,5],[1,6],[1,7],[0,5],[0,6],[0,7]],
                           [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2],[4,0],[4,1],[4,2],[0,3],[1,3],[2,3],[3,3],[4,3],[4,4],[3,4],[2,4],[1,4],[0,4],[4,5],[4,6],[4,7],[3,5],[3,6],[3,7],[2,5],[2,6],[2,7],[1,5],[1,6],[1,7],[0,5],[0,6],[0,7]]];
    
    if (startPlayer == 'random'){
        startPlayer = Math.random() < 0.5 ? "P1" : "P2";
    }
    
    document.querySelector('.player_turn').textContent = startPlayer; //alterar
    document.querySelector('.game_fase').textContent = "Colocar peças";
    
    var jogo = new trilha(BoardSize,startPlayer);

    gerar_board(BoardSize,board_structurs[BoardSize-3]);
    gerar_player_info(BoardSize);
    
    setupBoardEvents(jogo);
}


function gerar_player_info(n){

    for (let i = 0; i<2; i++){
        let container =  i%2 === 0 ? document.querySelector('.player_1_pieces') : document.querySelector('.player_2_pieces');
        container.innerHTML = '';
        // player name quando criarmos o loggin podemos formatar para aparecer o nome do player
        let cell_player = document.createElement('div');
        let h2 = document.createElement('h2');
        h2.classList.add("player_name");
        h2.textContent = h2.className; // <---- alterar aqui
        cell_player.appendChild(h2)
        container.appendChild(cell_player);
        
        let h3 = document.createElement('h3');
        h3.textContent = 'Peças Disponíveis:';
        container.appendChild(h3)

        // add pecas
        let cell_pecas = document.createElement('div');
        cell_pecas.classList.add("pecas_por_colocar");
        
        for (let j = 0; j<n*3;j++){
            let cell_peca = document.createElement('div');
            cell_peca.classList.add("peca");
            cell_pecas.appendChild(cell_peca);
        }
        container.appendChild(cell_pecas);

        let h3_1 = document.createElement('h3');
        h3_1.textContent = 'Peças Eliminadas:';
        container.appendChild(h3_1)

        let cell_eliminadas = document.createElement('div'); // div para mostrar os peças eliminadas
        cell_eliminadas.classList.add('pecas_eliminadas');
        container.appendChild(cell_eliminadas);
    }
}

function gerar_board(n,structure) {
    // com o exemplo de como o prof fez o tabuleiro dele nos slides, n quadrados tem n*4+1 celulas por linha numa matriz quadrada
    const gridSize = n * 4 + 1;
    
    
    // a div on vamos colocar o tabuleiro
    const container = document.getElementById('tabu');
    container.innerHTML = ''; // limpar a div caso tenha algo
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;
    container.style.gridTemplateRows = `repeat(${gridSize}, 30px)`;
    

    // gerar o tabuleiro dinamicamente em funcao do num que quadrados

    let piecee = 0;
    for (let row = 0; row < gridSize; row++){
        
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');

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
                    cell.setAttribute('data-index', structure[piecee++]);
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


function setupBoardEvents(game){

    document.querySelectorAll('div[data-index]').forEach((div) => {
        // Add a click event listener to each div
        div.addEventListener('click', (event) => {
            const [square, position] = event.target.getAttribute('data-index').split(',').map(Number); // obter a posicao da celula escolhida
            
            // dividir em 2 fases, colocar e mover as pecas
            if( !game.fase ){ //colocar 

                if(game.board[square][position] != 'empty') return; // ignorar caso seja escolhido uma celula com peca

                game.colocar_peca(square,position);
                // editar a classe da div de forma a representar a nova cor
                div.classList.add(game.board[square][position]);
                
                // editar a representacao da pecas disponiveis
                const container = game.turn == 0 ? document.querySelector('.player_1_pieces > .pecas_por_colocar') : document.querySelector('.player_2_pieces > .pecas_por_colocar');
                container.removeChild(container.lastChild);

            }
            else{ // mover
                
            }
            
            
            // analizar se é para trocar de fase
            if (document.querySelector('.player_1_pieces > .pecas_por_colocar').childElementCount == 0 
            && document.querySelector('.player_2_pieces > .pecas_por_colocar').childElementCount == 0){
                    game.fase = 1;
                    document.querySelector('.game_fase').textContent = 'Mover peças';
                }
                
            // analizar se criou moinho na jogada
            if (game.check_moinho(square,position)){
                
            }
                
                
                
                
                
                
                
                
            game.turn = game.turn == 1 ? 0 : 1; // alternar a vez
            document.querySelector('.player_turn').textContent = game.turn == 0 ? 'P1': 'P2'; // alternar o texto a indicar a vez

            
            console.log(game.board);
            // Example action: show an alert
            //alert(`Action triggered for square ${square} and position ${position}`);
        });
      });

}


document.addEventListener("DOMContentLoaded", () => {
    const start = document.getElementById('inicar_jogo');
    start.onclick = function(){
        main();
    }
});
    