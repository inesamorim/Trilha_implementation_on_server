
async function request(comand,args) {
    let response = await fetch(`${BASE_URL}/${comand}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(args)
    });
    if (!response.ok) {
        console.log(response.json());
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let body_resp = await response.json()
    // logica para cada tipo de comand
    switch (comand){
        case "register":
            console.log("request:", comand,"| response:", body_resp);
            return true;
        case "join":
            GAMEID = body_resp.game; // guardar o id do jogo
            console.log("request:", comand,"| response:", body_resp);
            return true;
        case "leave":
            console.log("request:", comand,"| response:", body_resp);
            break;
        case "notify":
            console.log("request:", comand,"| response:", body_resp);
            break;
        case "ranking":
            console.log("request:", comand,"| response:", body_resp);
            return body_resp.ranking;
    }



}





// async function listenForUpdates() {

//     const eventSource = new EventSource(`${BASE_URL}/update?group=2&game=${GAMEID}`);
//     eventSource.onmessage = (event) => {
//         console.log("Game Update:", event.data);
//         alert("Game Update: " + event.data);
//     };  
//     eventSource.onerror = (err) => {
//         console.error("Error in SSE:", err);
//         eventSource.close();
//     };
//     // eventSource.close()
// }



// funcoes para testar

let i = 0;
let j = 0;

function makereg(){
    request("register", {'nick': "utilizador", 'password': "123456"});
}

function makejoin(){
    request("join", {"group": "2", "nick": USERNAME, "password": PASSWORD, "size": "3"});
}

function makeleave(){
    request("leave", {"nick": USERNAME, "password": PASSWORD, "game": GAMEID});
}

function makenotify(){
    request("notify", {"nick": USERNAME, "password": PASSWORD, "game": GAMEID, "cell": {"square": i, "position": j}});
}

function makeranking(){
    request("ranking", {"group": "2", "size": "3"});
}


//codigo com uso final
// Register
document.getElementById("login_form").addEventListener("submit", async (e) => {
    e.preventDefault();
    USERNAME = document.getElementById("username").value;
    PASSWORD = document.getElementById("password").value;

    let state = await request("register",{'nick': USERNAME, 'password': PASSWORD});
    if (state){ // register|login concretizado
        LOGGED = true;
        let player_name_loggin = document.querySelector(".kurby_capt");
        player_name_loggin.textContent = USERNAME.toUpperCase();
        document.getElementById("login").style.display = "none";
    }
});

// JOIN 
button_start_online_game.onclick = async function(){

    if (!LOGGED){ // indicar que precisa de fazer login
        alert('Necessário fazer login');
    }else{ // trocar para o menu do tabuleiro e iniciar jogo
        let game_size = document.querySelector('select[name="size"]').value;
        
        let state = await request("join", {"group": "2", "nick": USERNAME, "password": PASSWORD, "size": game_size})
        if (state){ 
            jogo_online = true;
            esperar_adversario();
            menu_config.style.display = 'none';
            menu_jogo.style.display = 'flex';
        }
    }
}

// LEAVE
// feito - esta em mudar_menu quando o utilizador tenta retornar ao menu principal durante o jogo

// NOTIFY

// UPDATE -> obtem o estado atual do jogo {board,turn,...} || quando o jogo acaba recebe {"winner": nick} || quando um jogador faz um move recebe 
function update(){
    eventSource = new EventSource(BASE_URL+"/update?nick="+USERNAME+"&game="+GAMEID);

    eventSource.onerror = (err) => {
        console.error("Error in SSE:", err);
        eventSource.close();
    };
}

function esperar_adversario(){
    wait_game_text();
    const update_mensagem_espera = setInterval(wait_game_text, 500);

    let eventSource2 = new EventSource(BASE_URL+"/update?nick="+USERNAME+"&game="+GAMEID);
    eventSource2.onmessage = function(event) {
        const data = JSON.parse(event.data);
        console.log("update:", event.data);
        eventSource2.close();
        clearInterval(update_mensagem_espera);
        if (data.board){ // jogo emparelhado
            update();
            main_online_game(data);
        }
    }
    eventSource2.onerror = (err) => {
        console.error("Error in SSE:", err);
        eventSource2.close();
    };
}


// RANKING
