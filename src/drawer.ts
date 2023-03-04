import { TMap } from './algorithms/a_star';

export type TDrawerOptions = {
  canvas: HTMLCanvasElement;
  map: TMap;
  cellOptions?: {
    width: number;
    height: number;
  };
};

export default class Drawer {
  private readonly canvas: HTMLCanvasElement;

  private readonly context: CanvasRenderingContext2D;

  private WIDTH: number;

  private HEIGHT: number;

  private map: TMap;

  private readonly MAP_WIDTH: number;

  private readonly MAP_HEIGHT: number;

  private readonly CELL_WIDTH: number;

  private CELL_HEIGHT: number;

  private _lastTime: number;

  constructor(options: TDrawerOptions) {
    const { canvas, map } = options;

    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.WIDTH = canvas.width;
    this.HEIGHT = canvas.height;

    this.map = map;
    this.MAP_WIDTH = map[0].length;
    this.MAP_HEIGHT = map.length;

    this.CELL_WIDTH = options.cellOptions?.width || 100;
    this.CELL_HEIGHT = options.cellOptions?.height || 100;

    this.handleResize();
    this.initHandlers();
  }

  private handleResize() {
    this.WIDTH = this.canvas.width = window.innerWidth;
    this.HEIGHT = this.canvas.height = window.innerHeight;
  }

  private initHandlers() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private update(dt: number) {}

  private render(dt: number) {
    this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);

    const canvasCenterX = this.WIDTH / 2;
    const canvasCenterY = this.HEIGHT / 2;

    this.map.forEach((row, y) => {
      row.forEach((cell, x) => {
        const cellX =
          canvasCenterX -
          (this.MAP_WIDTH * this.CELL_WIDTH) / 2 +
          x * this.CELL_WIDTH;
        const cellY =
          canvasCenterY -
          (this.MAP_HEIGHT * this.CELL_HEIGHT) / 2 +
          y * this.CELL_HEIGHT;

        this.context.strokeStyle = '#000';
        this.context.strokeRect(
          cellX,
          cellY,
          this.CELL_WIDTH,
          this.CELL_HEIGHT
        );
      });
    });
  }

  private tick() {
    const now = performance.now();
    const dt = now - this._lastTime;

    this.update(dt);
    this.render(dt);

    this._lastTime = now;
    requestAnimationFrame(this.tick.bind(this));
  }

  public start() {
    this._lastTime = performance.now();
    requestAnimationFrame(this.tick.bind(this));
  }
}
