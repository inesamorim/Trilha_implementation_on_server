
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


function player_move(game,square, position, flags){
    if (flags.eliminar_peca){
        let peca_a_eliminar = game.turn == 0 ? 'piece_2' : 'piece_1';
        if (game.board[square][position] != peca_a_eliminar) return; // true se nao escolher nenhuma peca ou estiver ocupado com uma peca propria

        game.remover_peca(square,position);
        flags.eliminar_peca = false;

        if (!game.is_terminal_move()){
            game.turn = game.turn == 1 ? 0 : 1;
            return;
        }
    }

    // dividir em 2 fases, colocar e mover as pecas
    if( !game.fase ){ //colocar
        if(game.board[square][position] != 'empty') return; // ignorar caso seja escolhido uma celula com peca
        game.colocar_peca(square,position);
        
        game.turn = game.turn == 1 ? 0 : 1; // alternar a vez
        if (game.pieces_por_colocar[game.turn] == 0){
            game.fase = 1;
        }
    }
    else if(game.fase == 1){ // mover a peca
        // escolher
        let peca_valida_escolher = game.turn == 0 ? 'piece_1' : 'piece_2';
        if(!flags.mover_peca){ // escolher a peca para mover
            if (game.board[square][position] != peca_valida_escolher) return; // true se escolher celula que nao seja a sua

            game.pos_validas = game.jogadas_possiveis_dada_peca(square,position);
            if (game.pos_validas.length == 0) return; // caso nao existam movimentos para a peca

            game.peca_para_mover=[square,position];
            flags.mover_peca = true;
            return;

        }else{ // mover a pecax
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

            game.mover_peca(square,position); // mover no objeto

            flags.mover_peca = false;
            if (game.check_moinho(square,position)){
                flags.eliminar_peca = true;
            }else{
                game.turn = game.turn == 1 ? 0 : 1; // alternar a vez
            }
        }
    }
}


module.exports.trilha = trilha;
module.exports.player_move = player_move;
