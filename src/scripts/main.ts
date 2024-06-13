import Player from "../models/player";
import Platform from "../models/platform";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  MAXIMUM_JUMP_HEIGHT,
  PLATFORM_GAP,
  PLATFORM_HEIGHT,
  PLATFORM_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  STARTER_PLATFORM_Y,
  START_JUMP_HEIGHT,
  STATES,
} from "../constants";
import { leftPressed, rightPressed } from "./arrow-key";
import { getHighScore, setHighScore } from "../utilities/utility";

// Get the canvas element and its context
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.height = GAME_HEIGHT;
canvas.width = GAME_WIDTH;

let currentState = STATES[0];

let score = 0;

let platforms: Platform[] = [];
let lastlyJumpedPlatform: Platform | null = null;

// Function to generate platforms
function generatePlatforms(totalPlatformsToCreate: number = 1): void {
  const length = platforms.length + totalPlatformsToCreate;

  for (let i = platforms.length; i < length; i++) {
    const platformY = (platforms[i - 1]?.y || GAME_HEIGHT) - PLATFORM_GAP;
    const platformX = Math.random() * (GAME_WIDTH - PLATFORM_WIDTH);

    let platform = new Platform(
      platformX,
      platformY,
      PLATFORM_WIDTH,
      PLATFORM_HEIGHT,
      ctx
    );

    platforms.push(platform);
  }
}

// Function to update platforms
function updatePlatforms(): void {
  for (const platform of platforms) {
    platform.draw();

    if (player.y < GAME_HEIGHT / 2) {
      platform.y += 5;
      score += 2;
    }

    if (platform.y + PLATFORM_HEIGHT > GAME_HEIGHT) {
      // Remove platform from the list
      platforms.shift();

      // Generate new platforms
      generatePlatforms();
    }
  }
}

// Function to check if the player is on a platform
function checkCollision(person: Player, platform: Platform): boolean {
  return (
    person.x < platform.x + platform.width &&
    person.x + person.width > platform.x &&
    person.y + person.height >= platform.y &&
    person.y + person.height <= platform.y + PLATFORM_HEIGHT
  );
}

// Function to restart the game
function restart(): void {
  score = 0;
  platforms = [];
  generatePlatforms(5);

  const playerX = platforms[0].x + (PLATFORM_WIDTH - PLAYER_WIDTH) / 2;
  const playerY = GAME_HEIGHT - PLATFORM_GAP - PLAYER_HEIGHT - 50;
  player.setPosition(playerX, playerY);
}

// Function to handle canvas click events
function handleCanvasClick(event: MouseEvent): void {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  if (isInsideEllipse(mouseX, mouseY, 100, 200, 70, 25)) {
    currentState = STATES[1];
    restart();
  } else if (isInsideEllipse(mouseX, mouseY, 200, 400, 70, 25)) {
    currentState = STATES[0];
    restart();
  }
}

// Function to check if a point is inside an ellipse
function isInsideEllipse(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number
): boolean {
  const deltaX = x - centerX;
  const deltaY = y - centerY;
  return (
    (deltaX * deltaX) / (radiusX * radiusX) +
      (deltaY * deltaY) / (radiusY * radiusY) <=
    1
  );
}

canvas.addEventListener("click", handleCanvasClick);

const startDoodler = new Player(
  (GAME_WIDTH - PLAYER_WIDTH) / 2,
  300,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  ctx
);
const startPlatform = new Platform(
  (GAME_WIDTH - PLATFORM_WIDTH) / 2,
  STARTER_PLATFORM_Y,
  PLATFORM_WIDTH,
  PLATFORM_HEIGHT,
  ctx
);

// Function to handle the start state
function start(): void {
  ctx.font = "bold 40px Tiny5";
  ctx.fillStyle = "#ad0000";
  ctx.fillText("Doodle Jump", 40, 150);

  drawEllipse(100, 200, 70, 25, "#f5e8d4", "#000");
  ctx.font = "20px Tiny5";
  ctx.fillStyle = "#000000";
  ctx.fillText("Play", 83, 207);

  if (
    !startDoodler.grounded &&
    startDoodler.y + startDoodler.height < GAME_HEIGHT
  ) {
    startDoodler.fall();
  }

  if (checkCollision(startDoodler, startPlatform)) {
    startDoodler.grounded = true;
    lastlyJumpedPlatform = startPlatform;
  }

  if (startDoodler.grounded) {
    startDoodler.jump();
  }

  if (
    lastlyJumpedPlatform &&
    startDoodler.y + startDoodler.height <
      lastlyJumpedPlatform.y - START_JUMP_HEIGHT
  ) {
    startDoodler.grounded = false;
  }

  startDoodler.draw();
  startPlatform.draw();
}

document.addEventListener("DOMContentLoaded", start);
document.addEventListener("DOMContentLoaded", end);

// Function to handle the play state
function play(): void {
  if (rightPressed) {
    player.moveRight(canvas);
  } else if (leftPressed) {
    player.moveLeft(canvas);
  }

  if (!player.grounded && player.y + player.height < GAME_HEIGHT) {
    player.fall();
  }

  if (player.grounded) {
    player.jump();
  }

  for (const platform of platforms) {
    if (checkCollision(player, platform)) {
      player.grounded = true;
      lastlyJumpedPlatform = platform;
      break;
    }
  }

  if (
    lastlyJumpedPlatform &&
    player.y + player.height < lastlyJumpedPlatform.y - MAXIMUM_JUMP_HEIGHT
  ) {
    player.grounded = false;
  }

  if (player.y + player.height >= GAME_HEIGHT) {
    player.die();
    const highScore = getHighScore("HIGHSCORE") ?? 0;
    if (highScore < score) {
      setHighScore("HIGHSCORE", score);
    }
    currentState = STATES[2];
  }

  ctx.font = "15px Tiny 5";
  ctx.fillText(`Score: ${score}`, 5, 20);

  ctx.font = "15px Tiny 5";
  ctx.fillText(`High Score: ${getHighScore("HIGHSCORE") ?? 0}`, 5, 40);

  player.draw();
  updatePlatforms();
}

// Function to handle the end state
function end(): void {
  ctx.font = "bold 40px Tiny5";
  ctx.fillStyle = "#ad0000";
  ctx.fillText("Game Over !", 40, 150);

  ctx.font = "20px Tiny5";
  ctx.fillStyle = "#000";
  ctx.fillText(`Your Score: ${score}`, 40, 280);

  ctx.font = "20px Tiny5";
  ctx.fillStyle = "#000";
  ctx.fillText(`Your High Score: ${getHighScore("HIGHSCORE") ?? 0}`, 40, 330);

  drawEllipse(100, 200, 70, 25, "#f5e8d4", "#000");
  ctx.font = "20px Tiny5";
  ctx.fillStyle = "#000000";
  ctx.fillText("Restart", 70, 207);

  drawEllipse(200, 400, 70, 25, "#f5e8d4", "#000");
  ctx.font = "20px Tiny5";
  ctx.fillStyle = "#000000";
  ctx.fillText("Menu", 178, 405);
}

// Function to draw an ellipse on the canvas
function drawEllipse(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  fillStyle: string,
  strokeStyle: string
): void {
  ctx.beginPath();
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 2;
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

const player = new Player(0, 0, PLAYER_WIDTH, PLAYER_HEIGHT, ctx);

// Function to animate the game
function animate(): void {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  switch (currentState) {
    case STATES[0]:
      start();
      break;
    case STATES[1]:
      play();
      break;
    case STATES[2]:
      end();
      break;
    default:
      break;
  }

  requestAnimationFrame(animate);
}

animate();
