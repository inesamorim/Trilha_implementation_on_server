
// requests
var USERNAME = "utilizador";
var PASSWORD = "123456";
//const BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8008";
const BASE_URL = "http://localhost:8102";
//const BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8104";
var GAMEID;
var LOGGED = false;
var jogo_online = false;
var eventSource;
var dados_jogo;
//const GROUP = "2";
const GROUP = 2;

// jogo
var jogo;
const board_structurs = [[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[0,3],[1,3],[2,3],[2,4],[1,4],[0,4],[2,5],[2,6],[2,7],[1,5],[1,6],[1,7],[0,5],[0,6],[0,7]],
                         [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2],[0,3],[1,3],[2,3],[3,3],[3,4],[2,4],[1,4],[0,4],[3,5],[3,6],[3,7],[2,5],[2,6],[2,7],[1,5],[1,6],[1,7],[0,5],[0,6],[0,7]],
                         [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2],[4,0],[4,1],[4,2],[0,3],[1,3],[2,3],[3,3],[4,3],[4,4],[3,4],[2,4],[1,4],[0,4],[4,5],[4,6],[4,7],[3,5],[3,6],[3,7],[2,5],[2,6],[2,7],[1,5],[1,6],[1,7],[0,5],[0,6],[0,7]]];


// referentes ao jogo online
const textStates = ["A procurar adversário .", "A procurar adversário ..", "A procurar adversário ..."];
let currentIndex = 0;
// este mapeamento devesse pois a ordem das pecas por quadrado esta diferente entre o nosso e o do prof
const map_server_client = [0,1,2,4,7,6,5,3]; // do sv para o cliente
const map_client_server = [0,1,2,7,3,6,5,4]; // do cliente para o sv


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








/* 
from - escolher qual peca mover
to - escolher qual o destino da peca a mover
take - escolher qual peca remover

div_peca_escolhida.classList.remove('old_position');
div_nova_posicao.classList.add('new_position');
div_peca_escolhida.classList.add('old_position');

*/