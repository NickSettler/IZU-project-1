import Drawer from './drawer';
import { TMap } from './algorithms/a_star';
import AStarAlgorithm from './algorithms/a_star/a_star';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const map: TMap = [
  [1, 2, 2],
  [2, 1, 2],
  [2, 2, 1],
];

const drawer = new Drawer({
  canvas,
  map,
  cellOptions: {
    width: 100,
    height: 100,
  },
});

drawer.start();

const aStar = new AStarAlgorithm(map, [0, 0], [2, 2]);
aStar.findPath();
