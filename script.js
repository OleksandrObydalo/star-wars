let playerX = window.innerWidth / 2;
const playerY = window.innerHeight - 100;
const playerSpeed = 10;
let score = 0;
let playerRotation = 0;

// Track which keys are currently pressed
const keysPressed = {
  ArrowLeft: false,
  ArrowRight: false,
  ' ': false
};

document.documentElement.style.setProperty('--star-x', Math.random() * 100 + '%');
document.documentElement.style.setProperty('--star-y', Math.random() * 100 + '%');
document.documentElement.style.setProperty('--star2-x', Math.random() * 100 + '%');
document.documentElement.style.setProperty('--star2-y', Math.random() * 100 + '%');
document.documentElement.style.setProperty('--star3-x', Math.random() * 100 + '%');
document.documentElement.style.setProperty('--star3-y', Math.random() * 100 + '%');

const player = document.querySelector('.player-ship');
const gameContainer = document.querySelector('.game-container');
const scoreElement = document.getElementById('score');

let lasers = [];
let enemies = [];
let gameLoop;

function handleKeyDown(e) {
  keysPressed[e.key] = true;
}

function handleKeyUp(e) {
  keysPressed[e.key] = false;
  // Reset rotation when no key is pressed
  if (!keysPressed.ArrowLeft && !keysPressed.ArrowRight) {
    playerRotation = 0;
    player.style.transform = `translateX(-50%) rotate(${playerRotation}deg)`;
  }
}

function processPlayerMovement() {
  if (keysPressed.ArrowLeft && playerX > 30) {
    playerX -= playerSpeed;
    playerRotation = -15; // Rotate left
  }
  if (keysPressed.ArrowRight && playerX < window.innerWidth - 30) {
    playerX += playerSpeed;
    playerRotation = 15; // Rotate right
  }
  
  player.style.left = playerX + 'px';
  player.style.transform = `translateX(-50%) rotate(${playerRotation}deg)`;
}

function processPlayerShooting() {
  if (keysPressed[' ']) {
    shoot();
    // Prevent continuous shooting by briefly disabling the spacebar
    keysPressed[' '] = false;
  }
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
  const x = Math.random() * (window.innerWidth - 80);
  enemy.style.left = x + 'px';
  enemy.style.top = '0px';
  gameContainer.appendChild(enemy);
  
  // Add rocket fire to enemy
  const enemyRocketFire = document.createElement('div');
  enemyRocketFire.className = 'enemy-rocket-fire';
  enemy.appendChild(enemyRocketFire);
  
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
    
    // Rotate enemy towards player
    const angle = Math.atan2(playerY - enemy.y, playerX - enemy.x) * 180 / Math.PI;
    enemy.element.style.transform = `rotate(${angle + 90}deg)`;
    
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
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
  // Create rocket fire element
  const rocketFire = document.createElement('div');
  rocketFire.className = 'rocket-fire';
  player.appendChild(rocketFire);

  gameLoop = setInterval(() => {
    processPlayerMovement();
    processPlayerShooting();
    updateGame();
    if (Math.random() < 0.02) {
      spawnEnemy();
    }
  }, 1000/60);
}

startGame();