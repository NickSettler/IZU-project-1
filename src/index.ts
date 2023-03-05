import Drawer from './drawer';
import { TMap } from './algorithms/a_star';
import Cell from './algorithms/a_star/cell';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const bigMap: TMap = [
  // 0   1    2    3    4    5    6    7    8    9
  [9, 9, 7, 6, 3, 7, 9, 8, 9, 9], // 0
  [8, 9, 9, 9, 9, 3, 9, 6, 7, 8], // 1
  [8, 9, -1, -1, -1, 3, 9, 6, 7, 8], // 2
  [6, 9, -1, 2, 5, 3, 8, 5, 7, 8], // 3
  [7, 9, -1, 6, 4, 3, 8, 7, 5, 8], // 4
  [-1, -1, -1, -1, -1, 3, -1, -1, -1, -1], // 5
  [9, 9, -1, 8, 3, 9, 9, -1, 8, 9], // 6
  [9, 9, -1, 9, 3, 4, 2, -1, 7, 7], // 7
  [9, 9, -1, 9, 3, 7, 8, -1, 8, 7], // 8
  [9, 9, 9, 9, 3, 9, 8, 7, 7, 8], // 9
];

const drawer = new Drawer({
  canvas,
  map: bigMap,
  cellOptions: {
    width: 50,
    height: 50,
  },
});

drawer.start();
drawer.findPath(new Cell(3, 3, 5, 0, 5), new Cell(7, 6, 0, 0, 0));
