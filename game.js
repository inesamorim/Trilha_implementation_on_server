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

//HELLP   
function showSingleStats(){
    var nGames = (localStorage.getItem("nGames") || 0);  //meaning of const
    var GamesWon = (localStorage.getItem("GamesWon") || 0);
    var SingleScore = (localStorage.getItem("SingleScore") || 0);

    console.log("Games Played:", nGames); 
    console.log("Games Won:", GamesWon);
    console.log("Overall Score:", SingleScore);

    /* 
    // You can also update HTML elements if you're displaying stats on the page
    document.getElementById("nGames").innerText = nGames;
    document.getElementById("GamesWon").innerText = GamesWon;
    document.getElementById("SingleScore").innerText = SingleScore;
    */

    ///////////////////////////////////////////////////////////////
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


/--------------------------------------TESTE---------------------------------------------/
// ran AIdiff(num of moves it can see?)  (4, 6, 8, 10, 12)
// 10, 20, 30, 40, 50   

// numa faze inicial é apenas necessário salvar um scor
//start with 0 points
//localStorage.setItem("Player", 0);

 /*
 function getScore(){
    return localStorage.getItem("Player");
}

function increaseScore(value){
    let scor = getScore();
    scor += value;
    //using same key overwrites previous value
    localStorage.setItem("Player", scor);
}

function decreaseScore(value){
    //usar valores negativos?  assumir q não
    //método de dívidas
    let scor = getScore();
    scor = Math.max(scor-value, 0);
    localStorage.setItem("Player", scor);
}
 */



//-------------------------DEPOIS------------------------------//usar servido
//P1 -> Player 
//P2 -> Oponent


// Save score to the server

/*

function saveScore(playerName, score) {
    fetch("https://yourserver.com/api/saveScore", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ playerName, score })
    })
    .then(response => response.json())
    .then(data => console.log("Score saved:", data))
    .catch(error => console.error("Error:", error));
}

// Retrieve score from the server
function getScore(playerName) {
    fetch(`https://yourserver.com/api/getScore?playerName=${playerName}`)
        .then(response => response.json())
        .then(data => console.log("Player score:", data.score))
        .catch(error => console.error("Error:", error));
}


/--------------/

// Assuming Firebase is set up and initialized in your project
function saveScore(playerName, score) {
    firebase.firestore().collection("scores").doc(playerName).set({
        score: score
    })
    .then(() => console.log("Score saved!"))
    .catch(error => console.error("Error saving score:", error));
}

function getScore(playerName) {
    firebase.firestore().collection("scores").doc(playerName).get()
        .then(doc => {
            if (doc.exists) {
                console.log("Player score:", doc.data().score);
            } else {
                console.log("No such player!");
            }
        })
        .catch(error => console.error("Error getting score:", error));
}
*/
