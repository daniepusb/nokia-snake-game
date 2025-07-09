// --- Configuración inicial ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const boardSize = 20; // 20x20 celdas
const cellSize = canvas.width / boardSize;
const snakeColor = '#43a047'; // Verde
const appleColor = '#e53935'; // Rojo
const bgColor = '#f5f5f5'; // Gris claro
const borderColor = '#1976d2'; // Azul
const obstacleColor = '#111'; // Negro

// --- Estado del juego ---
let snake = [{x: 10, y: 10}];
let direction = {x: 0, y: -1}; // Empieza hacia arriba
let nextDirection = direction;
let apple = {x: 5, y: 5};
let obstacles = [
    {x: 7, y: 7}, {x: 12, y: 12}, {x: 7, y: 12}, {x: 12, y: 7}
];
let score = 0;
let gameInterval;
let timerInterval;
let seconds = 0;
let gameOver = false;

// --- Función para dibujar el tablero ---
function drawBoard() {
    // Fondo
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bordes
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Obstáculos
    for (const obs of obstacles) {
        ctx.fillStyle = obstacleColor;
        ctx.fillRect(obs.x * cellSize, obs.y * cellSize, cellSize, cellSize);
    }
}

// --- Función para dibujar la serpiente ---
function drawSnake() {
    for (const part of snake) {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(part.x * cellSize, part.y * cellSize, cellSize, cellSize);
    }
}

// --- Función para dibujar la manzana ---
function drawApple() {
    ctx.fillStyle = appleColor;
    ctx.beginPath();
    ctx.arc(
        apple.x * cellSize + cellSize / 2,
        apple.y * cellSize + cellSize / 2,
        cellSize / 2.2,
        0, Math.PI * 2
    );
    ctx.fill();
}

// --- Actualiza el marcador y el tiempo ---
function updateInfo() {
    document.getElementById('score').textContent = `Manzanas: ${score}`;
    document.getElementById('timer').textContent = `Tiempo: ${seconds}s`;
}

// --- Genera una nueva manzana en una celda libre ---
function placeApple() {
    let valid = false;
    while (!valid) {
        apple.x = Math.floor(Math.random() * boardSize);
        apple.y = Math.floor(Math.random() * boardSize);
        valid = !snake.some(p => p.x === apple.x && p.y === apple.y) &&
                !obstacles.some(o => o.x === apple.x && o.y === apple.y);
    }
}

// --- Detecta colisiones ---
function checkCollision(pos) {
    // Contra paredes
    if (pos.x < 0 || pos.x >= boardSize || pos.y < 0 || pos.y >= boardSize) return true;
    // Contra sí mismo
    if (snake.some(p => p.x === pos.x && p.y === pos.y)) return true;
    // Contra obstáculos
    if (obstacles.some(o => o.x === pos.x && o.y === pos.y)) return true;
    return false;
}

// --- Lógica principal del juego ---
function gameLoop() {
    if (gameOver) return;

    // Actualiza dirección
    direction = nextDirection;

    // Calcula nueva cabeza
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Colisión
    if (checkCollision(newHead)) {
        gameOver = true;
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        alert(`¡Game Over! Manzanas comidas: ${score} | Tiempo: ${seconds}s`);
        return;
    }

    // Añade nueva cabeza
    snake.unshift(newHead);

    // Comer manzana
    if (newHead.x === apple.x && newHead.y === apple.y) {
        score++;
        placeApple();
    } else {
        // Quita la cola si no comió
        snake.pop();
    }

    // Dibuja todo
    drawBoard();
    drawApple();
    drawSnake();
    updateInfo();
}

// --- Control de teclado ---
document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            if (direction.y !== 1) nextDirection = {x: 0, y: -1};
            break;
        case 'ArrowDown':
        case 's':
            if (direction.y !== -1) nextDirection = {x: 0, y: 1};
            break;
        case 'ArrowLeft':
        case 'a':
            if (direction.x !== 1) nextDirection = {x: -1, y: 0};
            break;
        case 'ArrowRight':
        case 'd':
            if (direction.x !== -1) nextDirection = {x: 1, y: 0};
            break;
    }
});

// --- Inicia el juego ---
function startGame() {
    snake = [{x: 10, y: 10}];
    direction = {x: 0, y: -1};
    nextDirection = direction;
    score = 0;
    seconds = 0;
    gameOver = false;
    placeApple();
    updateInfo();
    drawBoard();
    drawApple();
    drawSnake();
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    gameInterval = setInterval(gameLoop, 120); // velocidad
    timerInterval = setInterval(() => {
        seconds++;
        updateInfo();
    }, 1000);
}

// --- Inicia automáticamente ---
startGame();