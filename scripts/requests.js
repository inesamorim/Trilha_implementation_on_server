var USERNAME = "utilizador";
var PASSWORD = "123456";
const BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8008";
var GAMEID;


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
            break;
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




// funcoes para testar

function makereg(){
    request("register",{'nick': "utilizador", 'password': "123456"});
}

function makejoin(){
    request("join",{"group": "2", "nick": USERNAME, "password": PASSWORD, "size": "3"})
}

function makeleave(){
    request({"nick": USERNAME, "password": PASSWORD, "game": GAMEID});
}

function makenotify(){
    request({"nick": USERNAME, "password": PASSWORD, "game": GAMEID, "cell": {"square": 0, "position": 0}});
}






//codigo com uso final
// Register
document.getElementById("login_form").addEventListener("submit", async (e) => {
    e.preventDefault();
    USERNAME = document.getElementById("username").value;
    PASSWORD = document.getElementById("password").value;

    request("register",{'nick': USERNAME, 'password': PASSWORD});
});

// JOIN

// LEAVE

// NOTIFY

// UPDATE

// RANKING