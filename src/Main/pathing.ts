import { PriorityQueue } from './PriorityQueue';
import { GRID_SIZE } from './Game';

const heuristic = (a: number[], b: number[]) => {
   return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}

const getNeighbours = (point: number[]) => {
  const neighbours = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue
      }
      let newPoint = [point[0] + i, point[1] + j];
      if ((newPoint[0] >= 0 && newPoint[0] < GRID_SIZE) && (newPoint[1] >= 0 && newPoint[1] < GRID_SIZE)) {
        neighbours.push(newPoint)
      }
    }
  }
  return neighbours;
}

const constructPath = (start: number[], end: number[], came_from: any) => {
  let current = end; 
  let path = [];
  while (current.join(',') !== start.join(',')) {
    path.push(current)
    current = came_from[current.join(',')]
  }
  path.push(start)
  return path
}

export const calculatePath = (start: number[], end: number[]) => {
  const frontier = new PriorityQueue()
  frontier.push(start, 0)
  const came_from: any = {};
  const cost_so_far: any = {};
  came_from[start.join(',')] = null;
  cost_so_far[start.join(',')] = 0;

  while (!frontier.isEmpty()) {
    let { data: current } = frontier.pop()!;

    if (current[0] === end[0] && current[1] === end[1]) {
      break;
    }

    const neighbours = getNeighbours(current);
    for (let i = 0; i < neighbours.length; i++) {
      let nbr = neighbours[i];
      let new_cost = cost_so_far[current.join(',')] + 1;
      if (!(nbr.join(',') in cost_so_far) || new_cost < cost_so_far[nbr.join(',')]) {
        cost_so_far[nbr.join(',')] = new_cost
        let priority = new_cost + heuristic(end, nbr)
        frontier.push(nbr, priority)
        came_from[nbr.join(',')] = current
      }
    }
  }

  return constructPath(start, end, came_from)
}