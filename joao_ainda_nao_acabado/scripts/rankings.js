// // Obtém o modal e o botão de abrir/fechar
// var rankingModal = document.getElementById("ranking_page");
// var openRankingBtn = document.querySelectorAll('.menu');
// var closeRankingBtn = document.getElementsByClassName("close_ranking")[0];

// // Abre a tabela classificativa quando o botão é clicado
// openRankingBtn.forEach(button => {
//     button.addEventListener('click', function() { // mostrar menu inicial
//     rankingModal.style.display = "block";
//     loadRanking();  // Carrega a classificação
// })});

// // Fecha a tabela classificativa ao clicar no "X"
// closeRankingBtn.onclick = function() {
//     rankingModal.style.display = "none";
// }

// // Fecha o modal ao clicar fora dele
// window.onclick = function(event) { // nao funciona
//     if (event.target == rankingModal) {
//         rankingModal.style.display = "none";
//     }
// }


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
    localStorage.setItem("SingleScore", 500);
    localStorage.setItem("SinglePlayer", "Exists");
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

function updateScorewinner(){
    let score = parseInt(localStorage.getItem("SingleScore"))||0;
    score += 25;
    localStorage.setItem("SingleScore", score);
}

function updateScoreloser(){
  let score = parseInt(localStorage.getItem("SingleScore"))||0;
  score -= 10;
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

    // console.log("Games Played:", nGames); 
    // console.log("Games Won:", GamesWon);
    // console.log("Overall Score:", SingleScore);


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


/////////////////////////////////////////////////////////////////////////////////////////////


// Call displayStats when the page loads
window.onload = function() {
    showSingleStats();
};

// Function to display the specified slide
function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlideIndex;
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




///////////////////////////////////////////CONFIF/////////////////////////////////////////////////////



document.addEventListener("DOMContentLoaded", function() {
  const options = [["Easy",1], ["Medium",3],["Hard",6]];
  const p1Select = document.querySelector("select[name='p1']");
  const configContainer = document.querySelector(".content_config");
  let difficultySelect; // Variable to hold the difficulty select element

  function positionDifficultySelect() {
      if (difficultySelect) {
          // Update the position of difficultySelect relative to p1Select
          difficultySelect.style.top = `${p1Select.offsetTop}px`;
          difficultySelect.style.right = `${2.7 * p1Select.offsetWidth}px`; 
          difficultySelect.style.width = `${0.8 * p1Select.offsetWidth}px`;
      }
  }

  p1Select.addEventListener("change", function() {
      if (p1Select.value === "AI") {
          if (!difficultySelect) {
              // Create and style the difficulty select element
              difficultySelect = document.createElement("select");
              difficultySelect.name = "difficulty";
              difficultySelect.size = 3;

              // Set initial position
              difficultySelect.style.position = "absolute";
              difficultySelect.style.zIndex = "10";

              // Add options for difficulty levels
              options.forEach(optionText => {
                  const option = document.createElement("option");
                  option.value = optionText[1];
                  if(optionText[0] == "Medium"){ // inicia com dificuldade media selecionada
                    option.selected = true;
                  }
                  option.textContent = optionText[0];
                  difficultySelect.appendChild(option);
              });

              // Append the new select to the configuration container
              configContainer.appendChild(difficultySelect);

              // Position it initially
              positionDifficultySelect();

              // Handle "Back" selection
              difficultySelect.addEventListener("change", function() {
                  if (difficultySelect.value === "back") {
                      configContainer.removeChild(difficultySelect);
                      difficultySelect = null;
                  }
              });
          }
      } else {
          // Remove difficultySelect if it exists when another option is selected
          if (difficultySelect) {
              configContainer.removeChild(difficultySelect);
              difficultySelect = null;
          }
      }
  });

  // Update difficultySelect position on window resize
  window.addEventListener("resize", positionDifficultySelect);
});

//////////////////////////////////////////////



document.addEventListener("DOMContentLoaded", function() {
    const options = [["Easy",1], ["Medium",3],["Hard",6]];
    const p2Select = document.querySelector("select[name='p2']");
    const configContainer = document.querySelector(".content_config");
    let difficultySelect2; // Variable to hold the difficulty select element

  
    function positionDifficultySelect2(){
      if (difficultySelect2){
        // Update the position of difficultySelect relative to p1Select
        difficultySelect2.style.top = `${p2Select.offsetTop}px`;
        difficultySelect2.style.right = `${1.7*p2Select.offsetWidth}px`;
        difficultySelect2.style.width = `${0.8*p2Select.offsetWidth}px`;
      }

    }

    p2Select.addEventListener("change", function(){
      if (p2Select.value === "AI"){
        difficultySelect2 = document.createElement("select");
        difficultySelect2.name = "difficulty2";
        difficultySelect2.size = 3;

        difficultySelect2.style.position = "absolute";
        difficultySelect2.style.zIndex = "10";

        options.forEach(optionText => {
          const option2 = document.createElement("option");
          option2.value = optionText[1];
          if(optionText[0] == "Medium"){ // inicia com dificuldade media selecionada
            option2.selected = true;
          }
          option2.textContent = optionText[0];
          difficultySelect2.appendChild(option2); 
        });

        configContainer.appendChild(difficultySelect2);

        positionDifficultySelect2();

        difficultySelect2.addEventListener("change", function() {
          if (difficultySelect2.value === "back") {
            configContainer.removeChild(difficultySelect2);
            difficultySelect2 = null;
          }
        });
      } else {
        if (difficultySelect2) {
          configContainer.removeChild(difficultySelect2);
          difficultySelect2 = null;
        }
      }
    });

    window.addEventListener("resize", positionDifficultySelect2);
    
  });
  
 //["Easy", "Medium", "Hard", "Back"]

// Call displayStats when the page loads
    window.onload = function() {
        showSingleStats();
};
