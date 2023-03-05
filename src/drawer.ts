import { TMap } from './algorithms/a_star';
import Cell from './algorithms/a_star/cell';
import AStarAlgorithm from './algorithms/a_star/a_star';

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

  private readonly map: TMap;

  private readonly MAP_WIDTH: number;

  private readonly MAP_HEIGHT: number;

  private readonly CELL_WIDTH: number;

  private readonly CELL_HEIGHT: number;

  private path: Array<Cell> = [];

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

  private update() {
    // ...
  }

  private render() {
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

        const text = `[${x}, ${y}]`;
        const textWidth = this.context.measureText(text).width;
        const textHeight = 20;

        this.context.fillStyle = '#000';
        this.context.fillText(
          text,
          cellX + (this.CELL_WIDTH - textWidth) / 2,
          cellY + (this.CELL_HEIGHT - textHeight) / 2
        );

        const weightText = `${cell}`;
        const weightTextWidth = this.context.measureText(weightText).width;
        const weightTextHeight = 20;

        this.context.fillStyle = '#000';
        this.context.fillText(
          weightText,
          cellX + (this.CELL_WIDTH - weightTextWidth) / 2,
          cellY + (this.CELL_HEIGHT - weightTextHeight) / 2 + 10
        );

        const isInPath = this.path.some(
          (pathCell) => pathCell.X === y && pathCell.Y === x
        );

        if (isInPath) {
          this.context.fillStyle = 'rgba(0, 255, 0, 0.5)';
          this.context.fillRect(
            cellX,
            cellY,
            this.CELL_WIDTH,
            this.CELL_HEIGHT
          );
        }
      });
    });
  }

  private tick() {
    this.update();
    this.render();

    requestAnimationFrame(this.tick.bind(this));
  }

  public start() {
    requestAnimationFrame(this.tick.bind(this));
  }

  public findPath(start: Cell, end: Cell) {
    const aStar = new AStarAlgorithm(this.map, start, end);
    const path = aStar.findPath();

    console.log('Path:');
    console.log(path.map(({ X, Y }) => `[${Y} ${X}]`).join(' -> '));
    console.log('Table of neighbours:');
    console.log(aStar.neighboursList);

    this.path = path;
  }
}
