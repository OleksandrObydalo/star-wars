let playerX = window.innerWidth / 2;
const playerY = window.innerHeight - 100;
const playerSpeed = 10;
let score = 0;

const player = document.querySelector('.player-ship');
const gameContainer = document.querySelector('.game-container');
const scoreElement = document.getElementById('score');

let lasers = [];
let enemies = [];
let gameLoop;

function movePlayer(e) {
  if (e.key === 'ArrowLeft' && playerX > 30) {
    playerX -= playerSpeed;
  }
  if (e.key === 'ArrowRight' && playerX < window.innerWidth - 30) {
    playerX += playerSpeed;
  }
  if (e.key === ' ') {
    shoot();
  }
  player.style.left = playerX + 'px';
}

function shoot() {
  const laser = document.createElement('div');
  laser.className = 'laser';
  laser.style.left = (playerX + 28) + 'px';
  laser.style.bottom = '100px';
  gameContainer.appendChild(laser);
  lasers.push({
    element: laser,
    x: playerX + 28,
    y: playerY
  });
}

function spawnEnemy() {
  const enemy = document.createElement('div');
  enemy.className = 'enemy-ship';
  const x = Math.random() * (window.innerWidth - 40);
  enemy.style.left = x + 'px';
  enemy.style.top = '0px';
  gameContainer.appendChild(enemy);
  enemies.push({
    element: enemy,
    x: x,
    y: 0
  });
}

function checkCollision(laser, enemy) {
  const laserRect = laser.element.getBoundingClientRect();
  const enemyRect = enemy.element.getBoundingClientRect();
  return !(laserRect.right < enemyRect.left || 
           laserRect.left > enemyRect.right || 
           laserRect.bottom < enemyRect.top || 
           laserRect.top > enemyRect.bottom);
}

function createExplosion(x, y) {
  const explosion = document.createElement('div');
  explosion.className = 'explosion';
  explosion.style.left = x + 'px';
  explosion.style.top = y + 'px';
  explosion.style.background = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23f90'/%3E%3C/svg%3E\") no-repeat center/contain";
  gameContainer.appendChild(explosion);
  setTimeout(() => explosion.remove(), 500);
}

function updateGame() {
  // Update lasers
  lasers.forEach((laser, laserIndex) => {
    laser.y -= 10;
    laser.element.style.bottom = (window.innerHeight - laser.y) + 'px';
    
    if (laser.y < 0) {
      laser.element.remove();
      lasers.splice(laserIndex, 1);
    }
  });

  // Update enemies
  enemies.forEach((enemy, enemyIndex) => {
    enemy.y += 2;
    enemy.element.style.top = enemy.y + 'px';
    
    if (enemy.y > window.innerHeight) {
      enemy.element.remove();
      enemies.splice(enemyIndex, 1);
    }
  });

  // Check collisions
  lasers.forEach((laser, laserIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (checkCollision(laser, enemy)) {
        createExplosion(enemy.x, enemy.y);
        laser.element.remove();
        enemy.element.remove();
        lasers.splice(laserIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += 10;
        scoreElement.textContent = score;
      }
    });
  });
}

function startGame() {
  document.addEventListener('keydown', movePlayer);
  gameLoop = setInterval(() => {
    updateGame();
    if (Math.random() < 0.02) {
      spawnEnemy();
    }
  }, 1000/60);
}

startGame();

