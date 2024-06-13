import { GRAVITY, SPEED } from "../constants";
import rightDoodler from "../assets/sprites/blueR.png";
import leftDoodler from "../assets/sprites/blueL.png";

// Player class definition
class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  grounded: boolean;
  dead: boolean;
  img: HTMLImageElement;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    ctx: CanvasRenderingContext2D
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ctx = ctx;

    this.grounded = false;
    this.dead = false;

    this.img = new Image();
    this.img.src = leftDoodler;
  }

  draw(): void {
    this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  moveLeft(canvas: HTMLCanvasElement): void {
    // Move left with wrap-around
    this.x -= SPEED;
    if (this.x + this.width < 0) {
      this.x = canvas.width;
    }
    this.img.src = leftDoodler;
  }

  moveRight(canvas: HTMLCanvasElement): void {
    // Move right with wrap-around
    this.x += SPEED;
    if (this.x > canvas.width) {
      this.x = -this.width;
    }
    this.img.src = rightDoodler;
  }

  jump(): void {
    // Adjust the y position for jumping
    this.y -= GRAVITY;
  }

  fall(): void {
    // Adjust the y position for falling
    this.y += SPEED;
  }

  die(): void {
    this.dead = true;
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export default Player;
