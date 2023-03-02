const canvas = document.getElementById('canvas');
canvas.width = 1024;
canvas.height = 728;
const ctx = canvas.getContext('2d');

let playerpoints = document.getElementById('playerp');
let aipoints = document.getElementById('aip');
playerpoints.innerHTML = 0;
aipoints.innerHTML = 0;

let player, ai, ball;
let y = canvas.height / 2;
let vy = 0;

let aiy = canvas.height / 2;
let aivy = 0;

let ballX = canvas.width / 2 - 10;
let ballY = canvas.height / 2;
let bvx = 0;
let bvy = 0;

function getRandomItem(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  const item = arr[randomIndex];
  return item;
}

function collPlayer() {
  return ballX + 20 >= canvas.width - 60 &&
          ballX <= canvas.width - 60 + 20 &&
          ballY + 20 >= y &&
          ballY <= y + 100;
}

function collAI() {
  return ballX + 20 >= 40 &&
          ballX <= 60 &&
          ballY + 20 >= aiy &&
          ballY <= aiy + 100;
} 

function resetGame(){
  ballX = canvas.width / 2 - 10;
  ballY = canvas.height / 2;

  y = canvas.height / 2
  aiy = canvas.height / 2

  ctx.fillStyle = 'white';
  ctx.fillRect(ballX, ballY, 20, 20);
  ball = canvas.getBoundingClientRect();
  bvx = getRandomItem([3,-3])
  bvy = getRandomItem([3,-3])
}

resetGame();

function updateAI(){
  ctx.fillStyle = 'white';
  ctx.fillRect(40, aiy, 20, 100);
  ai = canvas.getBoundingClientRect();

  if (aiy > ballY) {
    aiy -= 2.5;
  }
  else if (aiy + 20 < ballY){
    aiy += 2.5;
  };

  if (aiy < 0) {
    aiy = 0;
  }
  else if (aiy > canvas.height - 120) {
    aiy = canvas.height - 120;
  };
}

function updatePlayer() {
  ctx.fillStyle = 'white';
  ctx.fillRect(canvas.width - 60, y, 20, 100);
  player = canvas.getBoundingClientRect();

  window.addEventListener('keydown', (event) => {
    if (event.key == 'w') {
      vy = -3;
      if (y < 0) {
        vy = 3;
        y = 20;
      };
    }
    else if (event.key == 's') {
      vy = 3;
      if (y > canvas.height - 120) {
        vy = -3;
        y = canvas.height - 120;
      };
    };
  });

  window.addEventListener('keyup', () => {
    vy = 0;
    if (y < 0) {
      vy = 3;
      y = 20;
    }
    else if (y > canvas.height - 120) {
      vy = -3;
      y = canvas.height - 120;
    }
  });
}

function updateBall(){
  ctx.fillStyle = 'white';
  ctx.fillRect(ballX, ballY, 20, 20);
  ball = canvas.getBoundingClientRect();

  ballX += bvx;
  ballY += bvy;

  if (ballY < 0 || ballY > canvas.height - 20) {
    bvy = -bvy;
  };

  if (ballX < 0 || ballX > canvas.width - 20) {
    bvx = -bvx;
  };

  if (collPlayer() && bvx > 0) {
    if (Math.abs((ballX + 20) - (canvas.width - 60)) < 10) {
      bvx = bvx * -1
    }
    else if (Math.abs((ballY + 20) - y) < 10 && bvy > 0) {
      bvy = bvy * -1
    }
    else if (Math.abs(ballY - (y + 100)) < 10 && bvy < 0) {
      bvy = bvy * -1
    };
  }

  if (collAI() && bvx < 0) {
    if (Math.abs((ballX + 20) - 60) < 10) {
      bvx = bvx * -1
    }
    else if (Math.abs((ballY + 20) - aiy) < 10 && bvy > 0) {
      bvy = bvy * -1
    }
    else if (Math.abs(ballY - (aiy + 100)) < 10 && bvy < 0) {
      bvy = bvy * -1
    };
  }

  if (ballX < 20) {
    aipoints.innerHTML = parseInt(aipoints.innerHTML) + 1;
    resetGame();
  }
  else if (ballX > canvas.width - 20) {
    playerpoints.innerHTML = parseInt(playerpoints.innerHTML) + 1;
    resetGame();
  };
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  y += vy;

  ctx.fillStyle = 'white';
  ctx.fillRect(canvas.width / 2, 0, 1, canvas.height);

  updateBall();
  updateAI();
  updatePlayer();
    
  requestAnimationFrame(update);
}

update();