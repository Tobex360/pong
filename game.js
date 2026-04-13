const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 12;
const PLAYER_X = 10;
const AI_X = canvas.width - PADDLE_WIDTH - 10;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;

// Game state
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
    dy: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1)
};
let playerScore = 0;
let aiScore = 0;

// Player paddle follows mouse Y
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    // Calculate mouse Y relative to canvas
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;

    // Clamp paddle within canvas
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Basic AI Paddle Movement
function moveAIPaddle() {
    const aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (ball.y < aiCenter - 20) {
        aiY -= PADDLE_SPEED;
    } else if (ball.y > aiCenter + 20) {
        aiY += PADDLE_SPEED;
    }
    // Clamp AI paddle within canvas
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Ball movement and collision
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and Bottom wall collision
    if (ball.y - BALL_RADIUS < 0 || ball.y + BALL_RADIUS > canvas.height) {
        ball.dy = -ball.dy;
    }

    // Left paddle collision
    if (
        ball.x - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ball.y > playerY &&
        ball.y < playerY + PADDLE_HEIGHT
    ) {
        ball.dx = Math.abs(ball.dx);
        // Add spin based on where the ball hits the paddle
        let hitPos = (ball.y - playerY - PADDLE_HEIGHT / 2) / (PADDLE_HEIGHT / 2);
        ball.dy += hitPos;
    }

    // Right paddle collision
    if (
        ball.x + BALL_RADIUS > AI_X &&
        ball.y > aiY &&
        ball.y < aiY + PADDLE_HEIGHT
    ) {
        ball.dx = -Math.abs(ball.dx);
        // Add spin
        let hitPos = (ball.y - aiY - PADDLE_HEIGHT / 2) / (PADDLE_HEIGHT / 2);
        ball.dy += hitPos;
    }

    // Left (player) misses
    if (ball.x - BALL_RADIUS < 0) {
        aiScore++;
        resetBall();
    }
    // Right (AI) misses
    if (ball.x + BALL_RADIUS > canvas.width) {
        playerScore++;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
    ball.dy = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw middle dashed line
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0';
    ctx.fill();

    // Draw scores
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, canvas.width / 2 - 50, 40);
    ctx.fillText(aiScore, canvas.width / 2 + 30, 40);
}

// Main game loop
function gameLoop() {
    moveBall();
    moveAIPaddle();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();