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


//start with 0 points



//to create data
if(!localStorage.getItem("SinglePlayer")){
    localStorage.setItem("nGames", 0);
    localStorage.setItem("GamesWon", 0);
    localStorage.setItem("SingleScore", 0);
}

function updatenGames(){
    let nG = parseInt(localStorage.getItem("nGames"))||0;
    nG +=1;
    localStorage.setItem("nGames", nG);
}

//PROXIMAS 2 SÓ CHAMADAs SE VITÓRIA
function updateGamesWon(){
    let W = parseInt(localStorage.getItem("GamesWon")) || 0;
    W += 1;
    localStorage.setItem("GamesWon", W);
}

function updateScore(addScore){
    let score = parseInt(localStorage.getItem("SingleSocre"))||0;
    score +=addScore;
    localStorage.setItem("SingleScore", score);
}


//RESET IF WANTED
function reSetStats(){
    localStorage.setItem("nGames", 0);
    localStorage.setItem("GamesWon", 0);
    localStorage.setItem("SingleScore", 0);
}

  
function showSingleStats(){
    var nGames = (localStorage.getItem("nGames") || 0);  
    var GamesWon = (localStorage.getItem("GamesWon") || 0);
    var SingleScore = (localStorage.getItem("SingleScore") || 0);

    console.log("Games Played:", nGames); 
    console.log("Games Won:", GamesWon);
    console.log("Overall Score:", SingleScore);


    var rankingScores = [
        { T: "nº of matches", G: nGames},
        { T: "nº of victories" , G: GamesWon},
        { T: "total points" , G: SingleScore}
    ];

    var tableBodyScore = document.getElementById("table_scores");
    tableBodyScore.innerHTML = "";  // Limpa a tabela antes de carregar os dados

    // Itera pelos dados de ranking e insere na tabela
    rankingScores.forEach(function(entry) {
        var row = document.createElement("tr");
        row.innerHTML = `<td>${entry.T}</td><td>${entry.G}</td>`;
        tableBodyScore.appendChild(row);
    });

}




// Call displayStats when the page loads
window.onload = function() {
    showSingleStats();
};

// Function to display the specified slide
function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    // Wrap the index to stay within bounds
    if (index >= slides.length) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = slides.length - 1;

    // Hide all slides and remove active class from dots
    slides.forEach(slide => slide.classList.remove('active-slide'));
    dots.forEach(dot => dot.classList.remove('active-dot'));

    // Show the selected slide and highlight the corresponding dot
    slides[currentSlideIndex].classList.add('active-slide');
    dots[currentSlideIndex].classList.add('active-dot');
}

//arranjar outro file?
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}

