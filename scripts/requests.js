var USERNAME = "utilizador";
var PASSWORD = "123456";
const BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8008";
var GAMEID;
var LOGGED = false;


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
            return true;
        case "join":
            GAMEID = body_resp.game; // guardar o id do jogo
            break;
    }



    console.log("request:", comand,"| response:", body_resp);
}



// funcao para fazer update do estado do jogo
function update(){
    const eventSource = new EventSource(BASE_URL+"/update?nick="+USERNAME+"&game="+GAMEID);
    eventSource.onmessage = function(event) {
       const data = JSON.parse(event.data);
       console.log("update:", event.data);
    }
    // eventSource.close()
}


async function listenForUpdates() {

    const eventSource = new EventSource(`${BASE_URL}/update?group="2"&game=${GAMEID}`);
    eventSource.onmessage = (event) => {
        console.log("Game Update:", event.data);
        alert("Game Update: " + event.data);
    };  
    eventSource.onerror = (err) => {
        console.error("Error in SSE:", err);
        eventSource.close();
    };
    eventSource.close()
}



// funcoes para testar

function makereg(){
    request("register", {'nick': "utilizador", 'password': "123456"});
}

function makejoin(){
    request("join", {"group": "2", "nick": USERNAME, "password": PASSWORD, "size": "3"})
}

function makeleave(){
    request("leave", {"nick": USERNAME, "password": PASSWORD, "game": GAMEID});
}

function makenotify(){
    request("notify", {"nick": USERNAME, "password": PASSWORD, "game": GAMEID, "cell": {"square": 0, "position": 0}});
}

function makeupdate(){
    request("update", {"nick": USERNAME, "game": GAMEID})
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

// LEAVE

// NOTIFY

// UPDATE

// RANKING
