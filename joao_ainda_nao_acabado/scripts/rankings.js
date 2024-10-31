// Obtém o modal e o botão de abrir/fechar
var rankingModal = document.getElementById("ranking_page");
var openRankingBtn = document.querySelectorAll('.menu');
var closeRankingBtn = document.getElementsByClassName("close_ranking")[0];

// Abre a tabela classificativa quando o botão é clicado
openRankingBtn.forEach(button => {
    button.addEventListener('click', function() { // mostrar menu inicial
    rankingModal.style.display = "block";
    loadRanking();  // Carrega a classificação
})});

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
