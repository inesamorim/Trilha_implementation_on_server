const textStates = ["A procurar adversário .", "A procurar adversário ..", "A procurar adversário ..."];
let currentIndex = 0;


function wait_game_text(){
    // limpar as divs caso tenha existido um jogo antes
    document.querySelector('.player_1_pieces').innerHTML = '';
    document.querySelector('.player_2_pieces').innerHTML = '';
    let game_slot = document.getElementById('tabu');
    game_slot.innerHTML = '';
    let esperar_div = document.createElement('div');
    esperar_div.textContent = textStates[currentIndex];
    currentIndex = (currentIndex + 1) % textStates.length;
    esperar_div.style.fontSize = "50px";esperar_div.style.textShadow = "0px 1px 4px #23430C";
    game_slot.appendChild(esperar_div);
}

async function main_online_game(game_data){
    console.log("ola");
    let size = game_data.board.length;
    const playerNames = Object.keys(game_data.players);

    a = {"board": [["empty","empty","empty","empty","empty","empty","empty","empty"],
                    ["empty","empty","empty","empty","empty","empty","empty","empty"],
                    ["empty","empty","empty","empty","empty","empty","empty","empty"]],
        "phase":"drop",
        "step":"from",
        "turn":"ines",
        "players":{"ines":"blue","daniela":"red"}}

    jogo = new trilha(size,'P1',playerNames[0],0,playerNames[1],0);

    gerar_board(size,board_structurs[size-3]);
    gerar_player_info(size);

}

