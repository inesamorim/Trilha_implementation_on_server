/**
 * @param {string} nick - Nome do jogador.
 * @param {string} password - Senha escolhida pelo jogador.
 */
 

async function register(nick, password) {
    const url = "http://twserver.alunos.dcc.fc.up.pt:8008/register";

    // Corpo do pedido
    const body = {
        nick: nick,
        password: password
    };

    try {
        // Enviar o pedido ao servidor
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        // Processar a resposta como JSON
        const data = await response.json();

        // Verificar resposta do servidor
        if (data.error) {
            console.error("Erro no registro:", data.error);
        } else {
            console.log("Registro bem-sucedido para o jogador:", nick);
        }
    } catch (error) {
        console.error("Erro na comunicação com o servidor:", error);
    }
}

