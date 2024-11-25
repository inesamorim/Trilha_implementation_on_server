
class trilha{
    // 0 corresponde ao P1 | 1 corresponde ao P2

    constructor(size_board,player_inicial, player_1, diff_1, player_2, diff_2){
        this.board = Array.from({ length: size_board }, () => Array(8).fill("empty")); // inicia a board cada array com 8 entradas a "empty"
        this.turn = player_inicial == 'P1' ? 0 : 1;
        this.pieces_por_colocar = [size_board*3,size_board*3];
        this.pieces = [size_board*3,size_board*3];
        this.fase = 0; // 0 -> colocar pecas | 1 -> mover | 2 -> terminado
        this.remove_peca = false;
        this.size_board = size_board;
        this.peca_para_mover;
        this.pos_validas;
        this.player_info = [player_1,player_2];
        this.dificuldade = [diff_1,diff_2];
        this.winner = null;
        this.jogadas_para_empatar = 10; // quando estao 3pecas vs 3pecas apos 10 jogadas se ninguem ganhar fica empate
    }

    colocar_peca(sq,pos){
        this.board[sq][pos] = this.turn == 0 ? 'piece_1' : 'piece_2';
        this.pieces_por_colocar[this.turn]--;
    }

    remover_peca(sq,pos){
        if( this.board[sq][pos] == 'piece_1' && this.turn == 1 // garantir que e valido eliminar
            || this.board[sq][pos] == 'piece_2' && this.turn == 0){
            this.board[sq][pos] = 'empty';
            this.pieces[Math.abs(this.turn-1)]--;
        }
    }

    mover_peca(sq,pos){
        let [sq_ant,pos_ant] = this.peca_para_mover;
        this.board[sq_ant][pos_ant] = 'empty';
        this.board[sq][pos] = this.turn == 0 ? 'piece_1' : 'piece_2';
    }

    jogadas_possiveis(){ // 3 possibilidade colocar | mover | mover sem restricoes
        /*
        chamar esta funcao esta para usar antes de jogarmos,
        quando turn = 0 retorna as posicoes para jogador 1
        quando turn = 1 retorna as posicoes para jogador 2
        */

        let prox_a_jogar = this.turn == 0 ? 'piece_1' : 'piece_2'; // se estiver a retornar alterado apenas troccar 'piece_1' : 'piece_2' para 'piece_2' : 'piece_1'
        var possiveis;

        if( !this.fase ){ // colocar peca -done-
            possiveis = [];
            let n = 0;
            for (let i=0; i<this.board.length;i++){
                for(let j=0;j<this.board[i].length;j++){
                    if ( this.board[i][j] == "empty" ){
                        possiveis[n++] = [i,j];
                    }
                }
            }
        }

        else if ( this.pieces[this.turn] > 3 ){ // colocar em posicao adjacente
            let n = 0;
            possiveis = []; // [ [ [pos_peca_escolhida], [pos_valida_1],[pos_valida_2] ], [ [pos_peca_escolhida], [pos_valida_1],[pos_valida_2] ], ... ]
            for (let i=0; i<this.board.length;i++){
                for(let j=0;j<this.board[i].length;j++){
                    let pos_valida = [];
                    let m = 0;
                    if ( this.board[i][j] == prox_a_jogar ){ // verificar se e a peca correta do player
                        pos_valida[m++]=[i,j];

                        if (j == 1 || j == 6){
                            if(this.board[i][j+1]=='empty'){
                                pos_valida[m++]=[i,j+1];
                            }
                            if(this.board[i][j-1]=='empty'){
                                pos_valida[m++]=[i,j-1];
                            }
                            if(this.board[Math.max(i-1,0)][j]=='empty'){
                                pos_valida[m++]=[Math.max(i-1,0), j];
                            }
                            if(this.board[Math.min(i+1,this.board.length-1)][j]=='empty'){
                                pos_valida[m++]=[Math.min(i+1,this.board.length-1), j];
                            }
                        }else if(j == 3 || j == 4){
                            let calc = j%2==0 ? [2,3]:[3,2]; // pq é diferente quando j=3 ou j=4,

                            if(this.board[i][j-calc[0]]=='empty'){
                                pos_valida[m++]=[i,j-calc[0]];
                            }
                            if(this.board[i][j+calc[1]]=='empty'){
                                pos_valida[m++]=[i,j+calc[1]];
                            }
                            if(this.board[Math.max(i-1,0)][j]=='empty'){
                                pos_valida[m++]=[Math.max(i-1,0), j];
                            }
                            if(this.board[Math.min(i+1,this.board.length-1)][j]=='empty'){
                                pos_valida[m++]=[Math.min(i+1,this.board.length-1), j];
                            }
                        }else if(j==0 || j==7){
                            let calc = j%2==0 ? [1,3]:[-1,-3]; // pq é diferente quando j=0 ou j=7,

                            if(this.board[i][j+calc[0]]=='empty'){
                                pos_valida[m++]=[i,j+calc[0]];
                            }
                            if(this.board[i][j+calc[1]]=='empty'){
                                pos_valida[m++]=[i,j+calc[1]];
                            }
                        }else if(j==2 || j==5){
                            let calc = j%2==0 ? [-1,2]:[1,-2]; // pq é diferente quando j=2 ou j=5,

                            if(this.board[i][j+calc[0]]=='empty'){
                                pos_valida[m++]=[i,j+calc[0]];
                            }
                            if(this.board[i][j+calc[1]]=='empty'){
                                pos_valida[m++]=[i,j+calc[1]];
                            }
                        }
                    }
                    if ( pos_valida.length > 1 ){ // se for == 1 entao nao tem movimentos adjacentes possiveis pelo que ignoramos
                        possiveis[n++] = pos_valida;
                    }
                }
            }
        }else{ // mover para qualquer pos -done-
            // formato novo [ [peça nossa],[casas vazias], [peça nossa],[casas vazias], [peça nossa],[casas vazias]]
            let vazias = [];
            let nossas = [];
            possiveis = [];
            for (let i=0; i<this.board.length;i++){
                for(let j=0;j<this.board[i].length;j++){
                    if ( this.board[i][j] == prox_a_jogar ){ // pos das nossas pecas
                        nossas.push([i,j]);
                        continue;
                    }
                    if (this.board[i][j] == "empty" ){ // pos validas
                        vazias.push([i,j]);
                        continue;
                    }
                }
            }
            for(let i = 0; i<nossas.length; i++){
                possiveis.push([nossas[i],vazias]);

            }
        }

        return possiveis;
    }

    jogadas_possiveis_dada_peca(sq,pos){ //apenas chamar quando estamos na segunda fase
        var jogadas=[]; let m = 0;

        if ( this.pieces[this.turn] > 3 ){ //mover com restricoes
            if (pos == 1 || pos == 6){
                if(this.board[sq][pos+1]=='empty'){
                    jogadas[m++]=[sq,pos+1];
                }
                if(this.board[sq][pos-1]=='empty'){
                    jogadas[m++]=[sq,pos-1];
                }
                if(this.board[Math.max(sq-1,0)][pos]=='empty'){
                    jogadas[m++]=[Math.max(sq-1,0), pos];
                }
                if(this.board[Math.min(sq+1,this.board.length-1)][pos]=='empty'){
                    jogadas[m++]=[Math.min(sq+1,this.board.length-1), pos];
                }
            }else if(pos == 3 || pos == 4){
                let calc = pos%2==0 ? [2,3]:[3,2]; // pq é diferente quando pos=3 ou pos=4,

                if(this.board[sq][pos-calc[0]]=='empty'){
                    jogadas[m++]=[sq,pos-calc[0]];
                }
                if(this.board[sq][pos+calc[1]]=='empty'){
                    jogadas[m++]=[sq,pos+calc[1]];
                }
                if(this.board[Math.max(sq-1,0)][pos]=='empty'){
                    jogadas[m++]=[Math.max(sq-1,0), pos];
                }
                if(this.board[Math.min(sq+1,this.board.length-1)][pos]=='empty'){
                    jogadas[m++]=[Math.min(sq+1,this.board.length-1), pos];
                }
            }else if(pos==0 || pos==7){
                let calc = pos%2==0 ? [1,3]:[-1,-3]; // pq é diferente quando j=0 ou j=7,

                if(this.board[sq][pos+calc[0]]=='empty'){
                    jogadas[m++]=[sq,pos+calc[0]];
                }
                if(this.board[sq][pos+calc[1]]=='empty'){
                    jogadas[m++]=[sq,pos+calc[1]];
                }
            }else if(pos==2 || pos==5){
                let calc = pos%2==0 ? [-1,2]:[1,-2]; // pq é diferente quando j=2 ou j=5,

                if(this.board[sq][pos+calc[0]]=='empty'){
                    jogadas[m++]=[sq,pos+calc[0]];
                }
                if(this.board[sq][pos+calc[1]]=='empty'){
                    jogadas[m++]=[sq,pos+calc[1]];
                }
            }
        }else{
            for (let i=0; i<this.board.length;i++){
                for(let j=0;j<this.board[i].length;j++){
                    if ( this.board[i][j] == "empty" ){
                        jogadas[m++] = [i,j];
                    }
                }
            }
        }
        return jogadas;
    }

    jogadas_remover(){
        let possiveis = []; let n = 0;
        let peca_eliminar = this.turn==0 ? 'piece_2' : 'piece_1';

        for (let i=0; i<this.board.length;i++){
            for(let j=0;j<this.board[i].length;j++){
                if ( this.board[i][j] == peca_eliminar ){
                    possiveis[n++] = [i,j];
                }
            }
        }
        return possiveis;
    }

    check_almost_moinho(sq, pos){
        let piece = "";
        if(this.turn == 0){
            piece = "piece_1";
        }
        else{
            piece = "piece_2";
        }

        if (this.board[sq][pos] != piece) return false;

        // check vertical - same square
        if(pos == 0  && (this.board[sq][pos+3] == piece || this.board[sq][pos+5] == piece)) return true;
        else if(pos == 2  && (this.board[sq][pos+2] == piece || this.board[sq][pos+5] == piece)) return true;
        else if(pos == 3  && (this.board[sq][pos+2] == piece || this.board[sq][pos-3] == piece)) return true;
        else if(pos == 4  && (this.board[sq][pos+3] == piece || this.board[sq][pos-2] == piece)) return true;
        else if(pos == 5  && (this.board[sq][pos-2] == piece || this.board[sq][pos-5] == piece)) return true;
        else if(pos == 7  && (this.board[sq][pos-3] == piece || this.board[sq][pos-5] == piece)) return true;

        //check horizontal - same square
        else if((pos == 0 || pos == 5) && (this.board[sq][pos+1] == piece || this.board[sq][pos+2] == piece)) return true;
        else if((pos == 1 || pos == 6) && (this.board[sq][pos+1] == piece || this.board[sq][pos-1] == piece)) return true;
        else if((pos == 2 || pos == 7) && (this.board[sq][pos-1] == piece || this.board[sq][pos-2] == piece)) return true;

        //check horizontal e vertical - different squares
        let i = 0;
        let counter = 1;
        if(pos == 1 || pos == 3 || pos == 4 || pos == 6){            for(i = 1; i<3; i++){
                if(this.is_valid_pos(sq-i,pos)){
                    if(this.board[sq-i][pos] == piece) counter+=1;
                }
                else break;
            }
            for(i = 1; i<3; i++){
                if(this.is_valid_pos(sq+i,pos)){
                    if(this.board[sq+i][pos] == piece) counter+=1;
                }
                else break;
            }
            if(counter >= 2){
                return true;
            }

        }
        return false;
    }

    check_moinho(sq,pos){
        let piece = "";
        if(this.turn == 0){
            piece = "piece_1";
        }
        else{
            piece = "piece_2";
        }

        const n = 3; //numero de peças seguidas necessário para fazer moinho

        if (this.board[sq][pos] != piece) return false;

        // check vertical - same square
        if(pos == 0  && this.board[sq][pos+3] == piece && this.board[sq][pos+5] == piece) return true;
        else if(pos == 2  && this.board[sq][pos+2] == piece && this.board[sq][pos+5] == piece) return true;
        else if(pos == 3  && this.board[sq][pos+2] == piece && this.board[sq][pos-3] == piece) return true;
        else if(pos == 4  && this.board[sq][pos+3] == piece && this.board[sq][pos-2] == piece) return true;
        else if(pos == 5  && this.board[sq][pos-2] == piece && this.board[sq][pos-5] == piece) return true;
        else if(pos == 7  && this.board[sq][pos-3] == piece && this.board[sq][pos-5] == piece) return true;

        //check horizontal - same square
        else if((pos == 0 || pos == 5) && this.board[sq][pos+1] == piece && this.board[sq][pos+2] == piece) return true;
        else if((pos == 1 || pos == 6) && this.board[sq][pos+1] == piece && this.board[sq][pos-1] == piece) return true;
        else if((pos == 2 || pos == 7) && this.board[sq][pos-1] == piece && this.board[sq][pos-2] == piece) return true;

        //check horizontal e vertical - different squares
        let i = 0;
        let counter = 1;
        if(pos == 1 || pos == 3 || pos == 4 || pos == 6){            for(i = 1; i<3; i++){
                if(this.is_valid_pos(sq-i,pos)){
                    if(this.board[sq-i][pos] == piece) counter+=1;
                }
                else break;
            }
            for(i = 1; i<3; i++){
                if(this.is_valid_pos(sq+i,pos)){
                    if(this.board[sq+i][pos] == piece) counter+=1;
                }
                else break;
            }
            if(counter >= n){
                return true;
            }

        }
        return false;

    }

    is_terminal_move() {
        if (this.pieces[0] < 3 || this.pieces[1] < 3){
            this.fase = 2;
            this.winner = this.player_info[this.turn];

            if(this.player_info[0]=='player'){
                updatenGames();
                if (this.winner == 'player'){ // player ganhou
                    updateGamesWon();
                    updateScorewinner();
                }else if(this.winner != 'draw'){ // player perdeu
                    updateScoreloser();
                } // else para quando empate pelo que nao fazemos alteracao
                showSingleStats();      
            }
            return true;
        }
        return false;
    }

    is_valid_pos(sq,pos) {
        if (sq < 0 || pos < 0) return false;
        else if (sq > this.size_board-1 || pos > 7) return false;
        return true;
    }

}


async function main(){ // usado para criar o jogo e apresentar no html

    const BoardSize = document.querySelector('select[name="size"]').value;
    const P1 = document.querySelector('select[name="p1"]').value;
    const P2 = document.querySelector('select[name="p2"]').value;
    let Dific_P1;
    let Dific_P2;
    try{
        Dific_P1 = document.querySelector('select[name="difficulty"]').value;
    }catch (error) {
        Dific_P1 = 0;
    }
    try{
        Dific_P2 = document.querySelector('select[name="difficulty2"]').value;
    }catch (error) {
        Dific_P2 = 0;
    }

    let startPlayer = document.querySelector('select[name="start"]').value;

    const board_structurs = [[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[0,3],[1,3],[2,3],[2,4],[1,4],[0,4],[2,5],[2,6],[2,7],[1,5],[1,6],[1,7],[0,5],[0,6],[0,7]],
                           [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2],[0,3],[1,3],[2,3],[3,3],[3,4],[2,4],[1,4],[0,4],[3,5],[3,6],[3,7],[2,5],[2,6],[2,7],[1,5],[1,6],[1,7],[0,5],[0,6],[0,7]],
                           [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2],[4,0],[4,1],[4,2],[0,3],[1,3],[2,3],[3,3],[4,3],[4,4],[3,4],[2,4],[1,4],[0,4],[4,5],[4,6],[4,7],[3,5],[3,6],[3,7],[2,5],[2,6],[2,7],[1,5],[1,6],[1,7],[0,5],[0,6],[0,7]]];

    if (startPlayer == 'random'){
        startPlayer = Math.random() < 0.5 ? "P1" : "P2";
    }

    document.querySelector('.player_turn').textContent = startPlayer; //alterar
    document.querySelector('.game_fase').textContent = "Colocar Peças";

    jogo = new trilha(BoardSize,startPlayer,P1,Dific_P1,P2,Dific_P2);

    gerar_board(BoardSize,board_structurs[BoardSize-3]);
    gerar_player_info(BoardSize);

    if(P1 != 'random' && P1 != 'AI'){ // player vs player || player vs AI
        await start_game(jogo);
    }
    else{ // jogo AI vs AI
        await AIduel(jogo);
    }

    return jogo;
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

    let piece_id = 0;
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
                    cell.setAttribute('data-index', structure[piece_id++]);
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


async function start_game(game){

    if (game.player_info[game.turn] == 'AI' || game.player_info[game.turn] == 'random'){ // caso seja o CPU a comecar
        CPU_move(game,game.player_info[game.turn]);
    }

    const flags = {
        eliminar_peca: false,
        mover_peca: false
      };

    document.querySelectorAll('div[data-index]').forEach((div) => {
        div.addEventListener('click', async (event) => {

            if (game.fase != 2){
                if (game.player_info[game.turn] != 'AI' || game.player_info[game.turn] != 'random'){ // player a jogar
                    player_move(game,div,flags);

                    if (game.fase){ // se nao esta mover entao vamos escolher uma peca e caso nao existam jogadas é empate
                        if(game.jogadas_possiveis().length == 0 || game.jogadas_para_empatar == 0){ // verificar se existem jogadas possiveis para o prox caso nao entao é empate
                            game.winner = 'draw';
                            game.fase = 2;
                            document.querySelector('.player_turn').textContent = "Jogo terminado";
                            document.querySelector('.game_fase').textContent = "Empate";
                        }
                    }
                }
                
                if (game.player_info[game.turn] == 'AI' || game.player_info[game.turn] == 'random'){ // tem de ser um if novo pois caso o player tenha de escolher uma peca para mover ou eliminar o cpu ainda nao pode jogar
                    await CPU_move(game,game.player_info[game.turn]);

                    if (game.fase){
                        if(game.jogadas_possiveis().length == 0 || game.jogadas_para_empatar == 0){ // verificar se existem jogadas possiveis para o prox caso nao entao é empate
                            game.winner = 'draw';
                            game.fase = 2;
                            document.querySelector('.player_turn').textContent = "Jogo terminado";
                            document.querySelector('.game_fase').textContent = "Empate";
                        }
                    }
                }

                

            }




        });
      });
}

async function AIduel(game) { // funcao para jogar AI vs AI ate o jogo acabar

    while (game.fase != 2){       
        await CPU_move(game,game.player_info[game.turn]);
        if (game.fase){
            if(game.jogadas_possiveis().length == 0 || game.jogadas_para_empatar == 0){ // verificar se existem jogadas possiveis para o prox caso nao entao é empate
                game.winner = 'draw';
                game.fase = 2;
                document.querySelector('.player_turn').textContent = "Jogo terminado";
                document.querySelector('.game_fase').textContent = "Empate";
            }
        }
    }
}


function player_move(game,peca_div,flags){
    let [square, position] = peca_div.getAttribute('data-index').split(',').map(Number); // obter a posicao da celula escolhida

    if (flags.eliminar_peca){
        let peca_a_eliminar = game.turn == 0 ? 'piece_2' : 'piece_1';
        if (game.board[square][position] != peca_a_eliminar) return; // true se nao escolher nenhuma peca ou estiver ocupado com uma peca propria

        game.remover_peca(square,position);
        flags.eliminar_peca = false;

        // adicina no html na div de pecas eliminadas uma nova peca
        let cell_pecas = game.turn == 0 ? document.querySelector('.player_2_pieces > .pecas_eliminadas') : document.querySelector('.player_1_pieces > .pecas_eliminadas');
        let cell_peca = document.createElement('div');
        cell_peca.classList.add("peca");
        cell_pecas.appendChild(cell_peca);
        // retirar do html a peca na board
        let celula_remover = document.querySelector(`[data-index="${square},${position}"]`);
        celula_remover.classList.remove(celula_remover.classList[1]);

        if (game.is_terminal_move()){
            document.querySelector('.player_turn').textContent = "Jogo terminado";
            document.querySelector('.game_fase').textContent = `${game.player_info[game.turn]} ganhou`;
        }else{
            game.turn = game.turn == 1 ? 0 : 1; // alternar a vez
            document.querySelector('.player_turn').textContent = `${game.player_info[game.turn]}`; // alternar o texto a indicar a vez
            document.querySelector('.game_fase').textContent = game.fase ? 'Mover peças': 'Colocar Peças';
            return;
        }
    }

    // dividir em 2 fases, colocar e mover as pecas
    if( !game.fase ){ //colocar

        if(game.board[square][position] != 'empty') return; // ignorar caso seja escolhido uma celula com peca

        game.colocar_peca(square,position);
        // editar a classe da div de forma a representar a nova cor
        peca_div.classList.add(game.board[square][position]);

        // editar a representacao da pecas disponiveis
        const container = game.turn == 0 ? document.querySelector('.player_1_pieces > .pecas_por_colocar') : document.querySelector('.player_2_pieces > .pecas_por_colocar');
        container.removeChild(container.lastChild);

        game.turn = game.turn == 1 ? 0 : 1; // alternar a vez
        document.querySelector('.player_turn').textContent = `${game.player_info[game.turn]}`; // alternar o texto a indicar a vez // alternar o texto a indicar a vez
        
        // analizar se é para trocar de fase
        if (document.querySelector('.player_1_pieces > .pecas_por_colocar').childElementCount == 0
        && document.querySelector('.player_2_pieces > .pecas_por_colocar').childElementCount == 0){
            game.fase = 1;
            document.querySelector('.game_fase').textContent = 'Mover peças';
        }
    }
    else if(game.fase == 1){ // mover a peca
        // escolher
        let peca_valida_escolher = game.turn == 0 ? 'piece_1' : 'piece_2';
        if(!flags.mover_peca){ // escolher a peca para mover
            if (game.board[square][position] != peca_valida_escolher) return; // true se escolher celula que nao seja a sua


            game.pos_validas = game.jogadas_possiveis_dada_peca(square,position);
            if (game.pos_validas.length == 0) return; // caso nao existam movimentos para a peca

            // falta desenhar os locais validos para mover
            game.peca_para_mover=[square,position];
            flags.mover_peca = true;


        }else{ // mover a peca
            if (peca_valida_escolher == game.board[square][position]){ // para o caso de escolher a peca errada para mover
                game.peca_para_mover = [square,position];
                game.pos_validas = game.jogadas_possiveis_dada_peca(square,position);
                if (game.pos_validas.length == 0) flags.mover_peca = false;
                return;
            }

            if (game.board[square][position] != 'empty') return; // ignora se a celula estiver ocupada

            let posicao_valida_para_mover = false;
            for (let index in game.pos_validas){
                if (game.pos_validas[index][0] == square && game.pos_validas[index][1] == position) {posicao_valida_para_mover = true;break;}
            }
            if (!posicao_valida_para_mover) return;


            if (game.pieces[0] == 3 && game.pieces[1] == 3) game.jogadas_para_empatar--; // se chegar aqui significa que vai gastar uma jogada caso esteja 3pecas vs 3pecas

            let div_peca_escolhida = document.querySelector(`[data-index="${game.peca_para_mover[0]},${game.peca_para_mover[1]}"]`);
            let nome_peca_escolhida = div_peca_escolhida.classList[1];


            div_peca_escolhida.classList.remove(nome_peca_escolhida); //eliminar no html do local atual
            peca_div.classList.add(nome_peca_escolhida); // mover no html para o novo local
            game.mover_peca(square,position); // mover no objeto

            flags.mover_peca = false;

            if (game.check_moinho(square,position)){
                flags.eliminar_peca = true;
                document.querySelector('.game_fase').textContent = 'Eliminar Peça';
                // talvez adicionar algo no ecra para indicar que e para eliminar uma peca
            }else{
                game.turn = game.turn == 1 ? 0 : 1; // alternar a vez
                document.querySelector('.player_turn').textContent = `${game.player_info[game.turn]}`; // alternar o texto a indicar a vez
            }
        }
    }
    else{ // jogo terminou

    }
}


async function CPU_move(game,CPU){ // CPU toma a string random ou AI (minimax)

    await new Promise((r)=>setTimeout(r, 400));

    if( !game.fase ){ //colocar

        let square, position;
        if(CPU == 'AI'){ //minimax
            const celulas_validas = executeMinimaxMove(evaluateBoard, game.dificuldade[game.turn])(game); // receber a posicao para colocar
            square = celulas_validas[0][0];
            position = celulas_validas[0][1];
        }else{ //random
            const celulas_validas = game.jogadas_possiveis();
            const index_celulas_validas = Math.floor(Math.random() * celulas_validas.length);
            square = celulas_validas[index_celulas_validas][0];
            position = celulas_validas[index_celulas_validas][1];
        }

        game.colocar_peca(square,position);
        let div_peca_escolhida = document.querySelector(`[data-index="${square},${position}"]`);
        div_peca_escolhida.classList.add(game.board[square][position]);
        const container = game.turn == 0 ? document.querySelector('.player_1_pieces > .pecas_por_colocar') : document.querySelector('.player_2_pieces > .pecas_por_colocar');
        container.removeChild(container.lastChild);

         // analizar se é para trocar de fase
        if (document.querySelector('.player_1_pieces > .pecas_por_colocar').childElementCount == 0
        && document.querySelector('.player_2_pieces > .pecas_por_colocar').childElementCount == 0){
            game.fase = 1;
            document.querySelector('.game_fase').textContent = 'Mover peças';
        }

        game.turn = game.turn == 1 ? 0 : 1; // alternar a vez
        document.querySelector('.player_turn').textContent = `${game.player_info[game.turn]}`; // alternar o texto a indicar a vez
    }
    else if(game.fase == 1){ // mover a peca

        let antiga =[], nova=[]; // antiga=[sq,pos] e nova=[sq,pos]
        if(CPU == 'AI'){ //minimax
            const celulas_validas = executeMinimaxMove(evaluateBoard, game.dificuldade[game.turn])(game); // receber a posicao para colocar
            nova = celulas_validas[0];
            antiga = celulas_validas[1];
            game.peca_para_mover = [antiga[0], antiga[1]];

        }else{ //random
            const celulas_validas = game.jogadas_possiveis();
            if(game.pieces[game.turn] > 3){ // [ [ [pos_peca_escolhida], [pos_valida_1],[pos_valida_2] ], [ [pos_peca_escolhida], [pos_valida_1],[pos_valida_2] ], ... ]

                const index_celulas_validas = Math.floor(Math.random() * celulas_validas.length);
                antiga[0]=celulas_validas[index_celulas_validas][0][0];
                antiga[1]=celulas_validas[index_celulas_validas][0][1];
                const index_nova_cell = Math.floor(Math.random() * ((celulas_validas[index_celulas_validas].length-1)))+1;
                nova[0]=celulas_validas[index_celulas_validas][index_nova_cell][0];
                nova[1]=celulas_validas[index_celulas_validas][index_nova_cell][1];
            }else{              // [ [pos das nossas pecas], [pos de celulas vazias]]
                   // formato novo [ [[peça nossa],[casas vazias]], [[peça nossa],[casas vazias]], [[peça nossa],[casas vazias]]]
                const index_peca = Math.floor(Math.random() * 3); // returna um indice 0 , 1 ou 2 para escolher qual peca mover
                const index_celula = Math.floor(Math.random() * celulas_validas[index_peca][1].length);
                antiga[0]=celulas_validas[index_peca][0][0];
                antiga[1]=celulas_validas[index_peca][0][1];
                nova[0]=celulas_validas[index_peca][1][index_celula][0];
                nova[1]=celulas_validas[index_peca][1][index_celula][1];
            }

            game.peca_para_mover = [antiga[0],antiga[1]];
        }

        if(antiga != [-1,-1] && nova != [-1,-1]){
            if (game.pieces[0] == 3 && game.pieces[1] == 3) game.jogadas_para_empatar--; // se chegar aqui significa que vai gastar uma jogada caso esteja 3pecas vs 3pecas

            let div_peca_escolhida = document.querySelector(`[data-index="${antiga[0]},${antiga[1]}"]`);
            let nome_peca_escolhida = div_peca_escolhida.classList[1];
            let div_nova_posicao = document.querySelector(`[data-index="${nova[0]},${nova[1]}"]`);

            div_peca_escolhida.classList.remove(nome_peca_escolhida); //eliminar no html do local atual
            div_nova_posicao.classList.add(nome_peca_escolhida); // mover no html para o novo local
            game.mover_peca(nova[0],nova[1]); // mover no objeto
        }


        if (game.check_moinho(nova[0],nova[1])){
            game.remove_peca = true;
            document.querySelector('.game_fase').textContent = 'Eliminar Peça';
        }else{
            game.turn = game.turn == 1 ? 0 : 1; // alternar a vez
            document.querySelector('.player_turn').textContent = `${game.player_info[game.turn]}`; // alternar o texto a indicar a vez
        }
    }

    if (game.remove_peca){

        // obter a posicao da peca a eliminar
        let square, position;
        if(CPU == 'AI'){ //minimax
            const celulas_validas = executeMinimaxMove(evaluateBoard, game.dificuldade[game.turn])(game); // receber a posicao para colocar
            square = celulas_validas[0][0];
            position = celulas_validas[0][1];

        }else{ //random
            const celulas_validas = game.jogadas_remover();
            const index_celulas_validas = Math.floor(Math.random() * celulas_validas.length);
            square = celulas_validas[index_celulas_validas][0];
            position = celulas_validas[index_celulas_validas][1];
        }


        game.remover_peca(square,position);
        game.remove_peca = false;

        // adicina no html na div de pecas eliminadas uma nova peca
        let cell_pecas = game.turn == 0 ? document.querySelector('.player_2_pieces > .pecas_eliminadas') : document.querySelector('.player_1_pieces > .pecas_eliminadas');
        let cell_peca = document.createElement('div');
        cell_peca.classList.add("peca");
        cell_pecas.appendChild(cell_peca);
        // retirar do html a peca na board
        let celula_remover = document.querySelector(`[data-index="${square},${position}"]`);
        celula_remover.classList.remove(celula_remover.classList[1]);

        if (game.is_terminal_move()){
            document.querySelector('.player_turn').textContent = "Jogo terminado";
            document.querySelector('.game_fase').textContent = `${CPU} ganhou`;
        }else{
            game.turn = game.turn == 1 ? 0 : 1; // alternar a vez
            document.querySelector('.player_turn').textContent = `${game.player_info[game.turn]}`; // alternar o texto a indicar a vez
            document.querySelector('.game_fase').textContent = game.fase ? 'Mover peças': 'Colocar Peças';
            return;
        }

    }
}


document.addEventListener("DOMContentLoaded", () => {
    // Obtém o modal e o botão de abrir/fechar
    const rankingModal = document.getElementById("ranking_page");
    const openRankingBtn = document.querySelectorAll('.menu');
    const closeRankingBtn = document.getElementsByClassName("close_ranking")[0];
    
    var rankingData = [
        { posicao: 1, jogador: "player", pontuacao: 500 },
        { posicao: 2, jogador: "AI", pontuacao: 500 },
        { posicao: 3, jogador: "random", pontuacao: 500 }
    ];

    // Abre a tabela classificativa quando o botão é clicado
    openRankingBtn.forEach(button => {
        button.onclick = function() { // mostrar menu inicial
        rankingModal.style.display = "block";
        loadRanking(rankingData);  // Carrega a classificação
        }
    });

    // Fecha a tabela classificativa ao clicar no "X"
    closeRankingBtn.onclick = function() {
        rankingModal.style.display = "none";
    }

    // Fecha o modal ao clicar fora dele
    window.onclick = function(event) { // nao funciona
        if (event.target == rankingModal) {
            rankingModal.style.display = "none";
        }
    }
    
    const start = document.getElementById('inicar_jogo');
    const menu_config = document.querySelector('.configuracoes');
    const menu_jogo = document.querySelector('.jogo');

    var jogo;

    start.onclick = async function(){
        // se P1 for nao for player entao P2 tambem nao pode ser
        if (document.querySelector('select[name="p1"]').value != 'player' && document.querySelector('select[name="p2"]').value == 'player'){
            alert('Formato inválido\nNão pode escolher CPU VS Player');
        }else{ // trocar para o menu do tabuleiro e iniciar jogo
            menu_config.style.display = 'none';
            menu_jogo.style.display = 'flex';
            jogo = await main();
        }
    }

    const button_menu_inicial = document.getElementById('menu_inicial_desistir');
    const menu_inicial = document.querySelector('.menu_inicial');

    button_menu_inicial.onclick = function(){
        if (jogo.fase != 2){// jogo ainda nao acabou entao prompt para informar que vai desistir
            let desistir_do_jogo = confirm("Vai desistir do jogo.\nConfirmar:");
            if (desistir_do_jogo) {
                jogo.fase = 2;
                jogo.winner = jogo.player_info[1]; // para single player a AI/random nao conseguem desistir, quando for PvP temos de alterar
                menu_jogo.style.display = 'none';
                menu_inicial.style.display = 'block';
            }
        }
        else{ // jogo já acabou entao user pode sair sem problemas
            menu_jogo.style.display = 'none';
            menu_inicial.style.display = 'block';
        }
    };

});
