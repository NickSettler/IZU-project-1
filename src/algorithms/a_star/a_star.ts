import { TCell, TEdge, TMap } from './types';
import Cell from './cell';

function isCellWalkable(map: TMap, cell: Cell): boolean {
  const { X, Y } = cell;

  return map[X][Y] !== -1;
}

function isCellInsideMap(map: TMap, cell: Cell): boolean {
  const { X, Y } = cell;

  return X >= 0 && X < map.length && Y >= 0 && Y < map[0].length;
}

export default class AStarAlgorithm {
  private readonly start: Cell;

  private readonly end: Cell;

  private openList: Array<TEdge> = [];

  private closedList: Array<TEdge> = [];

  private path: Array<TCell> = [];

  constructor(private readonly map: TMap, start: TCell, end: TCell) {
    this.start = new Cell(start[0], start[1], 0, 0, 0);
    this.end = new Cell(end[0], end[1], 0, 0, 0);

    this.validateInput();

    this.openList.push([this.start, null]);
  }

  private validateInput() {
    if (this.map.length === 0 || this.map[0].length === 0) {
      throw new Error('Map is empty');
    }

    if (
      !isCellWalkable(this.map, this.start) ||
      !isCellInsideMap(this.map, this.start)
    ) {
      throw new Error('Start cell is not walkable');
    }

    if (
      !isCellWalkable(this.map, this.end) ||
      !isCellInsideMap(this.map, this.end)
    ) {
      throw new Error('End cell is not walkable');
    }
  }

  private getNeighbours(cell: Cell): Array<Cell> {
    const { X, Y } = cell;
    const neighbours: Array<Cell> = [];

    for (let x = X - 1; x <= X + 1; x += 1) {
      for (let y = Y - 1; y <= Y + 1; y += 1) {
        if (x < 0 || y < 0) continue;

        const neighbour = new Cell(x, y, 0, 0, 0);

        if (
          (x === X && y === Y) ||
          !isCellWalkable(this.map, neighbour) ||
          !isCellInsideMap(this.map, neighbour)
        )
          continue;

        neighbours.push(neighbour);
      }
    }

    return neighbours;
  }

  public findPath(): Array<TCell> {
    while (this.openList.length > 0) {
      const q = this.openList.shift();

      const neighbours = this.getNeighbours(q[0]);

      console.log(neighbours);
    }

    return this.path;
  }
}
