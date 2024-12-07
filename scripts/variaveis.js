
// requests
var USERNAME = "utilizador";
var PASSWORD = "123456";
const BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8008";
var GAMEID;
var LOGGED = false;
var jogo_online = false;
var eventSource;
var dados_jogo;

// jogo
var jogo;
const board_structurs = [[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[0,3],[1,3],[2,3],[2,4],[1,4],[0,4],[2,5],[2,6],[2,7],[1,5],[1,6],[1,7],[0,5],[0,6],[0,7]],
                         [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2],[0,3],[1,3],[2,3],[3,3],[3,4],[2,4],[1,4],[0,4],[3,5],[3,6],[3,7],[2,5],[2,6],[2,7],[1,5],[1,6],[1,7],[0,5],[0,6],[0,7]],
                         [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2],[4,0],[4,1],[4,2],[0,3],[1,3],[2,3],[3,3],[4,3],[4,4],[3,4],[2,4],[1,4],[0,4],[4,5],[4,6],[4,7],[3,5],[3,6],[3,7],[2,5],[2,6],[2,7],[1,5],[1,6],[1,7],[0,5],[0,6],[0,7]]];


// menus
const menu_inicial = document.querySelector('.menu_inicial');
const menu_regras = document.querySelector('.regras');
const menu_config = document.querySelector('.configuracoes');
const menu_jogo = document.querySelector('.jogo');
const overlayInfo = document.querySelector(".overlay-title");///


// botoes
const button_menu_inicial = document.querySelectorAll('.go_menu_inicial');
const button_menu_config = document.querySelectorAll('.go_configuracoes');
const button_menu_regras = document.querySelectorAll('.go_regras');
const button_start_local_game = document.getElementById('inicar_jogo');
const button_start_online_game = document.getElementById('join_game');