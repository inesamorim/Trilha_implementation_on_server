/*
Qando o jogo acaba aparece um quadrado a dizer quem ganhou, 
crux para fechar o quadrado 
ou
2 botões, um para o menu outro para config
*/

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameOver = false;
let winner = null; // Could be "Player 1", "Player 2", or "Draw"

// Rectangle properties
const rectWidth = 300;
const rectHeight = 150;
const rectX = (canvas.width - rectWidth) / 2;
const rectY = (canvas.height - rectHeight) / 2;
const closeButtonSize = 30;


// Draw the game board (placeholder for your actual game logic)
function drawGameBoard() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Add your board drawing logic here
}

// Draw the game-over rectangle
function drawGameOverMessage() {
    if (gameOver) {
        // Draw rectangle
        ctx.fillStyle = '#CCCCCC';
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

        // Draw close button
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(rectX + rectWidth - closeButtonSize, rectY, closeButtonSize, closeButtonSize);

        // Draw "X" on the close button
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('X', rectX + rectWidth - closeButtonSize / 2, rectY + closeButtonSize / 2);

        // Draw the winner message
        ctx.fillStyle = '#000000';
        ctx.font = '24px Arial';
        const message = winner ? `${winner} Wins!` : 'Draw!';
        ctx.fillText(message, canvas.width / 2, rectY + rectHeight / 2);
    }
}

// Check if the close button is clicked
canvas.addEventListener('click', (event) => {
    if (gameOver) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (
            mouseX >= rectX + rectWidth - closeButtonSize &&
            mouseX <= rectX + rectWidth &&
            mouseY >= rectY &&
            mouseY <= rectY + closeButtonSize
        ) {
            gameOver = false; // Close the message box
            draw();
        }
    }
});

// Simulate game-over (replace this logic with your actual game logic)
setTimeout(() => {
    gameOver = true;
    winner = 'Player 1'; // Example winner
    draw();
}, 2000);

// Main draw function
function draw() {
    drawGameBoard();
    drawGameOverMessage();
}
