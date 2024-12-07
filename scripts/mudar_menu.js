document.addEventListener('DOMContentLoaded', function() {
    
    button_menu_inicial.forEach(button => {
        button.onclick = function(){ // ir para menu inicial      
        if (jogo && jogo.fase != 2){// jogo ainda nao acabou entao prompt para informar que vai desistir
            let desistir_do_jogo = confirm("Vai desistir do jogo.\nConfirmar:");
            if (desistir_do_jogo) {
                if (jogo_online){
                    request("leave", {"nick": USERNAME, "password": PASSWORD, "game": GAMEID});
                    GAMEID = null;
                    jogo_online = false;
                    eventSource.close(); // fechar a ligacao com o servidor
                }
                jogo.fase = 2;
                jogo.winner = jogo.player_info[1]; // adversario ganha

                menu_jogo.style.display = 'none';
                menu_inicial.style.display = 'block';
            }
        }else if(jogo_online){
            let abandonar = confirm("Vai abandonar a procura.\nConfirmar:");
            if (abandonar){
                request("leave", {"nick": USERNAME, "password": PASSWORD, "game": GAMEID});
                GAMEID = null;
                jogo_online = false;
                menu_jogo.style.display = 'none';
                menu_inicial.style.display = 'block';
            }
        }
        else{ // podemos voltar ao menu inicial sem problemas
            menu_regras.style.display = 'none';
            menu_config.style.display = 'none';
            menu_jogo.style.display = 'none';
            menu_inicial.style.display = 'block';
        }
    }});

    button_menu_config.forEach(button => {
        button.onclick = function(){ // ir para menu de config
        menu_inicial.style.display = 'none';
        menu_regras.style.display = 'none';
        menu_config.style.display = 'block';
    }});
    
    button_menu_regras.forEach(button => {
        button.onclick = function(){ // mostrar menu de regras
        menu_inicial.style.display = 'none';
        menu_config.style.display = 'none';
        menu_regras.style.display = 'block';
    }});


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
    


    
    // iniciar jogo local
    button_start_local_game.onclick = async function(){
        // se P1 for nao for player entao P2 tambem nao pode ser
        if (document.querySelector('select[name="p1"]').value != 'player' && document.querySelector('select[name="p2"]').value == 'player'){
            alert('Formato inválido\nNão pode escolher CPU VS Player');
        }else{ // trocar para o menu do tabuleiro e iniciar jogo
            jogo_online = false;
            await main_local_game();
            menu_config.style.display = 'none';
            menu_jogo.style.display = 'flex';
        }
    }
});