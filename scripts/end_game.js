/*
Qando o jogo acaba aparece um quadrado a dizer quem ganhou, 
crux para fechar o quadrado 
ou
2 botões, um para o menu outro para config
*/


function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');

    // Resize the canvas to fill the screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiParticles = [];

    // Generate confetti particles
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 3 + 2,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 5 + 1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confettiParticles.forEach((p, index) => {
            // Update particle position
            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;

            // Recycle confetti if it falls off-screen
            if (p.y > canvas.height) {
                confettiParticles[index] = {
                    ...p,
                    x: Math.random() * canvas.width,
                    y: -10,
                };
            }

            // Draw confetti
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });

        requestAnimationFrame(draw);
    }

    draw();
}




////////////////////////////////////////////////////////////




