
function wait_game_text(){
    // limpar as divs caso tenha existido um jogo antes
    document.querySelector('.player_1_pieces').innerHTML = '';
    document.querySelector('.player_2_pieces').innerHTML = '';
    let game_slot = document.getElementById('tabu');
    game_slot.style.display = "flex";
    game_slot.innerHTML = '';
    let esperar_div = document.createElement('div');
    esperar_div.textContent = textStates[currentIndex];
    currentIndex = (currentIndex + 1) % textStates.length;
    esperar_div.style.fontSize = "50px";esperar_div.style.textShadow = "0px 1px 4px #23430C";esperar_div.style.width = "100%";
    game_slot.appendChild(esperar_div);
}

async function main_online_game(game_data){
    console.log("ola");
    let size = game_data.board.length;
    const playerNames = Object.keys(game_data.players);

    jogo = new trilha(size,'P1',playerNames[0],0,playerNames[1],0);

    overlayInfo.style.display = 'block';
    document.querySelector('.player_turn').textContent = `${jogo.player_info[jogo.turn]}`; // alternar o texto a indicar a vez
    document.querySelector('.game_fase').textContent = "Colocar Peças";

    gerar_board(size,board_structurs[size-3]);
    gerar_player_info(size);


    // recebe as mensagens de update e executa a logica
    eventSource.onmessage = function(event) { // vai ler as mensagens recebidas
        const data = JSON.parse(event.data);
        //console.log("update:", event.data);
        if((data.winner || data.winner === null) && data.board){ // true apenas quando o jogo acabou e nao foi por abandono (pode ter sido por empate ou remocao de pecas)
            jogo.fase = 2; GAMEID = null; jogo_online = false;
            jogo.winner = data.winner === null ? "draw" : data.winner;
            document.querySelector('.player_turn').textContent = "Jogo terminado";
            document.querySelector('.game_fase').textContent = data.winner === null ? "Empate" : `Vitória de ${jogo.winner}`;
            eventSource.close();

            document.querySelectorAll('.jogo .cell').forEach(cell => { // Limpar as funções 
                cell.classList.remove('poss_vacate','selected','old_position','new_position');
            });
            let sq = data.cell.square;
            let pos = map_server_client[data.cell.position];
            let peca_div = document.querySelector(`[data-index="${sq},${pos}"]`);

            // vitoria por num de pecas
            if (jogo.remove_peca){
                jogo.remover_peca(sq,pos);
                // adicina no html na div de pecas eliminadas uma nova peca
                let cell_pecas = jogo.turn == 0 ? document.querySelector('.player_2_pieces > .pecas_eliminadas') : document.querySelector('.player_1_pieces > .pecas_eliminadas');
                let cell_peca = document.createElement('div');
                cell_peca.classList.add("peca");
                cell_pecas.appendChild(cell_peca);
                // retirar do html a peca na board
                let celula_remover = document.querySelector(`[data-index="${sq},${pos}"]`);
                celula_remover.classList.remove(celula_remover.classList[1]);
                celula_remover.classList.add('old_position'); 
            }
            else{// empate por afogamento
                let div_peca_escolhida = document.querySelector(`[data-index="${jogo.peca_para_mover[0]},${jogo.peca_para_mover[1]}"]`);
                let nome_peca_escolhida = div_peca_escolhida.classList[1];
                div_peca_escolhida.classList.remove(nome_peca_escolhida); //eliminar no html do local atual
                peca_div.classList.add(nome_peca_escolhida); // mover no html para o novo local
                jogo.mover_peca(sq,pos); // mover no jogo.board
                div_peca_escolhida.classList.add('old_position');
                let div_nova_posicao = document.querySelector(`[data-index="${sq},${pos}"]`);
                div_nova_posicao.classList.add(nome_peca_escolhida);
                div_nova_posicao.classList.add('new_position');
            }
            

        }else if (data.winner){ // quando o jogador adversario abandonou o jogo
            jogo.fase = 2; jogo_online = false; GAMEID = null;
            jogo.winner = data.winner;
            document.querySelector('.player_turn').textContent = "Jogo terminado";
            document.querySelector('.game_fase').textContent = `Vitória de ${jogo.winner}`;
            eventSource.close();
        }else if (data.cell){ // atualizar perante uma jogada
            let sq = data.cell.square;
            let pos = map_server_client[data.cell.position];
            let peca_div = document.querySelector(`[data-index="${sq},${pos}"]`);

            if (jogo.fase == 0){ // colocar uma peca
                jogo.colocar_peca(sq,pos);
                // editar a classe da div de forma a representar a nova cor
                peca_div.classList.add(jogo.board[sq][pos]);
                // editar a representacao da pecas disponiveis
                let container = jogo.turn == 0 ? document.querySelector('.player_1_pieces > .pecas_por_colocar') : document.querySelector('.player_2_pieces > .pecas_por_colocar');
                container.removeChild(container.lastChild);

                if (data.phase == "move"){
                    jogo.fase = 1; // atualizar a fase do jogo
                    document.querySelector('.game_fase').textContent = 'Escolher peça a mover';
                }
            }
            else if (jogo.fase == 1){ // eliminar|mover|escolher uma peca
                document.querySelectorAll('.jogo .cell').forEach(cell => { // Limpar as funções 
                    cell.classList.remove('poss_vacate','selected','old_position','new_position');
                });

                if(data.step == "take"){ // movida a peca em jogo.peca_para_mover para o local de <cell>, e prox acao vai ser remover uma peca
                    jogo.remove_peca = true;

                    let div_peca_escolhida = document.querySelector(`[data-index="${jogo.peca_para_mover[0]},${jogo.peca_para_mover[1]}"]`);
                    let nome_peca_escolhida = div_peca_escolhida.classList[1];
                    div_peca_escolhida.classList.remove(nome_peca_escolhida); //eliminar no html do local atual
                    peca_div.classList.add(nome_peca_escolhida); // mover no html para o novo local
                    jogo.mover_peca(sq,pos); // mover no jogo.board
                    document.querySelector('.game_fase').textContent = `Remover peça`;
                    
                    let div_nova_posicao = document.querySelector(`[data-index="${sq},${pos}"]`);
                    div_peca_escolhida.classList.add('old_position');
                    div_nova_posicao.classList.add(nome_peca_escolhida);
                    div_nova_posicao.classList.add('new_position');
                }
                else if (data.step == "from"){ // 
                    if (jogo.remove_peca){ // eliminar a peca escolhida
                        jogo.remove_peca = false;

                        jogo.remover_peca(sq,pos);
                        // adicina no html na div de pecas eliminadas uma nova peca
                        let cell_pecas = jogo.turn == 0 ? document.querySelector('.player_2_pieces > .pecas_eliminadas') : document.querySelector('.player_1_pieces > .pecas_eliminadas');
                        let cell_peca = document.createElement('div');
                        cell_peca.classList.add("peca");
                        cell_pecas.appendChild(cell_peca);
                        // retirar do html a peca na board
                        let celula_remover = document.querySelector(`[data-index="${sq},${pos}"]`);
                        celula_remover.classList.remove(celula_remover.classList[1]);
                        celula_remover.classList.add('old_position'); 

                        document.querySelector('.game_fase').textContent = 'Escolher peça a mover';
                    }
                    else{
                        
                        let div_peca_escolhida = document.querySelector(`[data-index="${jogo.peca_para_mover[0]},${jogo.peca_para_mover[1]}"]`);
                        let nome_peca_escolhida = div_peca_escolhida.classList[1];
                        div_peca_escolhida.classList.remove(nome_peca_escolhida); //eliminar no html do local atual
                        peca_div.classList.add(nome_peca_escolhida); // mover no html para o novo local
                        
                        let div_nova_posicao = document.querySelector(`[data-index="${sq},${pos}"]`);
                        div_peca_escolhida.classList.add('old_position');
                        div_nova_posicao.classList.add(nome_peca_escolhida);
                        div_nova_posicao.classList.add('new_position');

                        jogo.mover_peca(sq,pos); // mover no jogo.board
                    }
                }
                else if(data.step == "to"){ // a peca escolhida e vamos indicar quais os locais validos
                    //alterar a cor da border
                    peca_div.classList.add('selected');
                    
                    jogo.peca_para_mover=[sq,pos];
                    jogo.pos_validas = jogo.jogadas_possiveis_dada_peca(sq,pos);

                    jogo.pos_validas.forEach(([sq, pos]) => {
                        let cell = document.querySelector(`[data-index="${sq},${pos}"]`);
                        if (cell) cell.classList.add('poss_vacate');
                    })
                }
            }
            jogo.turn = data.turn == jogo.player_info[0] ? 0 : 1; //atualizar a turn
            document.querySelector('.player_turn').textContent = `${jogo.player_info[jogo.turn]}`; // alternar o texto a indicar a vez
        }
    }


    // para executar jogada
    document.querySelectorAll('div[data-index]').forEach((div) => {
        div.addEventListener('click', async (event) => {
            let [square, position] = div.getAttribute('data-index').split(',').map(Number); // obter a posicao da celula escolhida
            position = map_client_server[position];

            if (jogo.fase != 2 && jogo.player_info[jogo.turn] == USERNAME){ // jogo nao acabou e vez correta de jogar
                await request("notify", {"nick": USERNAME, "password": PASSWORD, "game": GAMEID, "cell": {"square": square, "position": position}}); 
            }
        });
      });
}
