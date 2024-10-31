
const button_1 = document.querySelectorAll('.go_menu_inicial');
const button_2 = document.querySelectorAll('.go_configuracoes');
const button_3 = document.querySelectorAll('.go_regras');

const menu_inicial = document.querySelector('.menu_inicial');
const menu_regras = document.querySelector('.regras');
const menu_config = document.querySelector('.configuracoes');

button_1.forEach(button => {
    button.addEventListener('click', function() { // mostrar menu inicial
    menu_regras.style.display = 'none';
    menu_config.style.display = 'none';
    menu_inicial.style.display = 'block';
})});


button_2.forEach(button => {
    button.addEventListener('click', function() { // mostrar menu de config
    menu_inicial.style.display = 'none';
    menu_regras.style.display = 'none';
    menu_config.style.display = 'flex';
})});

button_3.forEach(button => {
    button.addEventListener('click', function() { // mostrar menu de regras
    menu_inicial.style.display = 'none';
    menu_config.style.display = 'none';
    menu_regras.style.display = 'block';
})});

//--------------------------- Login Buttons -----------------------------------------------//
 
    var login_box = document.getElementById("login");
    var loginButton = document.getElementById("loginButton");
    var closeBtn = document.getElementsByClassName("close")[0];

    loginButton.onclick = function() {
        login_box.style.display = "block";
    }

    closeBtn.onclick = function() {
        login_box.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == login_box) {
            login_box.style.display = none;
        }
    }

//--------------------------- Ranking ---------------------------------------------------------//

// Obtém o modal e o botão de abrir/fechar
var rankingModal = document.getElementById("ranking_page");
var openRankingBtn = document.getElementById("rankingBtn");
var closeRankingBtn = document.getElementsByClassName("close_ranking")[0];

// Abre a tabela classificativa quando o botão é clicado
openRankingBtn.onclick = function() {
    rankingModal.style.display = "block";
    loadRanking();  // Carrega a classificação
}

// Fecha a tabela classificativa ao clicar no "X"
closeRankingBtn.onclick = function() {
    rankingModal.style.display = "none";
}

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {
    if (event.target == rankingModal) {
        rankingModal.style.display = "none";
    }
}

// Função para carregar a classificação (simulação de dados nesta fase)
function loadRanking() {
    //teste
    var rankingData = [
        { posicao: 1, jogador: "Jogador A", pontuacao: 1500 },
        { posicao: 2, jogador: "Jogador B", pontuacao: 1200 },
        { posicao: 3, jogador: "Jogador C", pontuacao: 900 }
    ];

    var tableBody = document.getElementById("ranking_table");
    tableBody.innerHTML = "";  // Limpa a tabela antes de carregar os dados

    // Itera pelos dados de ranking e insere na tabela
    rankingData.forEach(function(entry) {
        var row = document.createElement("tr");
        row.innerHTML = `<td>${entry.posicao}</td><td>${entry.jogador}</td><td>${entry.pontuacao}</td>`;
        tableBody.appendChild(row);
    });
}


//
//var regrasPage = document.getElementById("regras");
//var initialPage = document.getElementById("inicial");//
// openInitialBtn = document.getElementById("initialBtn")
//var openRegrasBtn = document.getElementById("regrasBtn");
//var configPage = document.getElementById("config");
//var openConfigBtn = document.getElementById("configBtn");

/*openRegrasBtn.onclick = function() {
    initialPage.style.display = "none";
    regrasPage.style.display = "flex";
}

openConfigBtn.onclick = function() {
    initialPage.style.display = "none";
    configPage.style.display = "flex";
}

openInitialBtn.onclick = function() {
    configPage.style.display = "none";
    regrasPage.style.display = "none";
    initialPage.style.display = "block";
}
    */


