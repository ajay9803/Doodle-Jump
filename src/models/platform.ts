import platform from "../assets/sprites/platform-1.png";

// Define an interface for canvas context to ensure it has the correct type
interface CanvasContext {
  drawImage(
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number
  ): void;
}

class Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  ctx: CanvasContext;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    ctx: CanvasContext
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
  }

  draw(): void {
    const img = new Image();
    img.src = platform;
    this.ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }
}

export default Platform;
