import { chunk, cloneDeep, find, map, some } from 'lodash';
import { TEdge, TMap } from './types';
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
  private _openList: Array<TEdge> = [];

  private _closedList: Array<TEdge> = [];

  private neighbours: Array<Cell> = [];

  private path: Array<Cell> = [];

  constructor(
    private readonly map: TMap,
    private readonly start: Cell,
    private readonly end: Cell
  ) {
    this.validateInput();

    this._openList.push([this.start, null]);
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
        if (x >= this.map.length || y >= this.map[0].length) continue;

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

  private listLatexString(list: 'OPEN' | 'CLOSED') {
    const listArray = list === 'OPEN' ? this._openList : this._closedList;

    const listString = map(chunk(listArray, 5), (chunk) => {
      const trailingAmpersands = chunk.length === 5 ? 0 : 5 - chunk.length - 1;
      const chunkString = map(
        chunk,
        ([{ X: toX, Y: toY, F }, cellFrom], index) => {
          const fromX = cellFrom?.X;
          const fromY = cellFrom?.Y;

          const toString = `[${toY}, ${toX}]`;
          const FValue = F.toFixed(2);
          const fromString = cellFrom ? `[${fromY}, ${fromX}]` : '[null]';

          return `(${toString}, ${FValue}, ${fromString}) ${
            index % 5 !== 4 ? '&' : ''
          }`;
        }
      );

      return `${chunkString.join(' ')} ${'& '.repeat(trailingAmpersands)}\\\\`;
    }).join('\n');

    return `${list}:\n\n\\begin{tabular}{ c c c c c }\n${listString}\n\\end{tabular}\n`;
  }

  public findPath(): Array<Cell> {
    let i = 0;
    while (this._openList.length > 0 && i < 1000) {
      let endFound = false;
      const q = find(
        this._openList,
        ([cell]) =>
          cell.F === Math.min(...this._openList.map(([cell]) => cell.F))
      );
      this._openList = this._openList.filter(
        ([cell]) => cell.X !== q[0].X || cell.Y !== q[0].Y
      );

      const neighbours = this.getNeighbours(q[0]);

      for (let i = 0; i < neighbours.length; i++) {
        const neighbour = neighbours[i];
        const { X, Y } = neighbour;

        const g = q[0].G + this.map[X][Y];
        const h = Math.sqrt((X - this.end.X) ** 2 + (Y - this.end.Y) ** 2);
        const f = g + h;

        if (X === this.end.X && Y === this.end.Y) {
          this._closedList.push(q);
          this._closedList.push([new Cell(X, Y, f, g, h), q[0]]);
          endFound = true;
          break;
        }

        const isCellWithLowerFInOpenList = some(
          this._openList,
          ([cell]) => cell.X === X && cell.Y === Y && cell.F < f
        );

        if (isCellWithLowerFInOpenList) continue;

        const isCellWithLowerFInClosedList = some(
          this._closedList,
          ([cell]) => cell.X === X && cell.Y === Y && cell.F < f
        );

        if (isCellWithLowerFInClosedList) continue;

        const newCell = new Cell(X, Y, f, g, h);

        this.neighbours.push(newCell);
        this._openList.push([newCell, q[0]]);
      }

      if (!endFound) this._closedList.push(q);

      console.groupCollapsed(`Iteration ${i}. Cell: ${q[0].X}, ${q[0].Y}`);
      console.groupCollapsed('Tables');
      console.group('Open list TO');
      console.table(cloneDeep(this._openList).map(([cell]) => cell));
      console.groupEnd();
      console.group('Open list FROM');
      console.table(cloneDeep(this._openList).map(([, cell]) => cell));
      console.groupEnd();
      console.group('Closed list TO');
      console.table(cloneDeep(this._closedList).map(([cell]) => cell));
      console.groupEnd();
      console.group('Closed list FROM');
      console.table(cloneDeep(this._closedList).map(([, cell]) => cell));
      console.groupEnd();
      console.groupEnd();
      console.groupCollapsed('Latex Output');
      const iterationLatexOutput = `\\textbf{${
        i + 1
      }. iterace}\n\n${this.listLatexString('OPEN')}\n${this.listLatexString(
        'CLOSED'
      )}\n\\hline\n
      `;
      console.log(iterationLatexOutput);
      console.groupEnd();
      console.groupEnd();

      if (endFound) break;

      i++;
    }

    let currentCell = this._closedList[this._closedList.length - 1][0];
    while (currentCell.X !== this.start.X || currentCell.Y !== this.start.Y) {
      this.path.unshift(currentCell);
      const [, fromCell] = this._closedList.find(
        ([cell]) => cell.X === currentCell.X && cell.Y === currentCell.Y
      );
      currentCell = fromCell;
    }
    this.path.unshift(this.start);
    this.path.push(this.end);

    return this.path;
  }

  public get neighboursList() {
    return this.neighbours
      .map(
        ({ X, Y, F, G, H }, i) =>
          `${(i + 1).toString().padStart(2, '0')}. & [${Y}, ${X}] & ${G.toFixed(
            2
          )} & ${H.toFixed(2)} & ${F.toFixed(2)} \\\\`
      )
      .join('\n');
  }
}
