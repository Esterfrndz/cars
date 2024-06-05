const canvas = document.getElementById('gameCanvas'); //elemento canvas
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth; //que ocupe toda la pantalla
canvas.height = window.innerHeight;

const backgroundImg = new Image(); //objeto imágen
backgroundImg.src = './img/background.png';

const dinoImg = new Image(); //objeto dino
dinoImg.src = './img/car.png';

const cactusImg = new Image(); // imagen para el obstáculo "cactus"
cactusImg.src = './img/cactus.png';

const otroObstaculoImg = new Image(); // imagen para el obstáculo "otro_obstaculo"
otroObstaculoImg.src = './img/boots.png';

const backgroundMusic = document.getElementById('backgroundMusic');
backgroundMusic.volume = 0.2;
const startButton = document.getElementById('startButton');
const collisionSound = document.getElementById('collisionSound');
collisionSound.volume = 1; // Establecer el volumen al máximo (1)


let dino = {
    x: 50,
    y: canvas.height - 100,
    width: 120,
    height: 120,
    dy: 0,
    gravity: 0.6,
    jumpPower: -15,
    grounded: false
};

let obstacles = [];
let frameCount = 0;

let boots = {
    x: canvas.width + 200, // Empieza fuera de la pantalla
    y: canvas.height - 100, // Altura similar a la del dino
    width: 40,
    height: 40,
    duration: 5000, // Duración en milisegundos (5 segundos)
    speedBoost: 2, // Incremento en la velocidad
    active: false, // Indica si los "boots" están activos o no
    activationTime: 0 // Tiempo de activación
};

let speed = 15; // Velocidad inicial del juego



function update() {
    frameCount++; // El aumento de frames

    if (frameCount % 100 === 0) { // Genera un nuevo obstáculo en una posición aleatoria
        let obstacleHeight = 50 + Math.random() * 50;
        let obstacleType = Math.random() < 0.5 ? "cactus" : "otro_obstaculo"; // Elige aleatoriamente entre los dos tipos de obstáculos
        obstacles.push({
            x: canvas.width,
            y: canvas.height - obstacleHeight - 30, // Move obstacles higher by 100 pixels
            width: 80,
            height: 80,
            type: obstacleType // Asigna el tipo al nuevo obstáculo
        });
    }

    // Mover los obstáculos
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= speed;
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }

        // Verificar colisión con el dino
        if (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y
        ) {
            if (obstacle.type === "cactus") { // Si el tipo de obstáculo es "cactus"
                alert('No pudiste ser un verdadero Rayo Mcqueen ¡kachau!');
                document.location.reload();
            } else if (obstacle.type === "otro_obstaculo") { // Si el tipo de obstáculo es "otro_obstaculo"
                if (!boots.active) { // Si los "boots" no están activos
                    speed *= boots.speedBoost; // Aumentar la velocidad del juego
                    boots.active = true; // Activar los "boots"
                    setTimeout(() => {
                        speed /= boots.speedBoost; // Restablecer la velocidad del juego después de 5 segundos
                        boots.active = false; // Desactivar los "boots"
                    }, boots.duration);
                    collisionSound.play(); // Reproduce el sonido de colisión 
                }
            }
        }
    });

    dino.dy += dino.gravity;
    dino.y += dino.dy;

    if (dino.y + dino.height >= canvas.height) {
        dino.y = canvas.height - dino.height;
        dino.dy = 0;
        dino.grounded = true;
    } else {
        dino.grounded = false;
    }
}

function draw() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    obstacles.forEach(obstacle => {
        if (obstacle.type === "cactus") {
            ctx.drawImage(cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height); // Dibuja el obstáculo "cactus"
        } else if (obstacle.type === "otro_obstaculo") {
            ctx.drawImage(otroObstaculoImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height); // Dibuja
        }
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    backgroundMusic.play();
    gameLoop();
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && dino.grounded) {
        dino.dy = dino.jumpPower;
    }
});

startButton.addEventListener('click', () => {
    startButton.style.display = 'none'; // Hide the start button when the game starts
    startGame();
});

backgroundImg.onload = () => {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
};
