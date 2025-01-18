import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';
import { HeapItem, MinHeap } from 'advent-of-code-utils';

const day = 'day20';

const START = 'S';
const EXIT = 'E';
const WALL = '#';

type Coord = {
    x: number;
    y: number;
}

type Tile = Coord & {
    symbol: string;
}

type Walk = Tile & HeapItem & {
    trail: Coord[];
};

function parseInput(input: string[]): Tile[][] {
    return input.reduce((acc, line, x) => {
        acc.push(line.split('').map((tile, y) => { return { x, y, symbol: tile } as Tile}));
        return acc;
    }, [] as Tile[][]);
}

function findStart(grid: Tile[][]): Coord {
    return grid.reduce((acc, row, x) => {
        return row.reduce((acc, col, y) => { return col.symbol === START ? { x, y } : acc; }, acc);
    }, { x: 0, y: 0 } as Coord);
}

function findExit(grid: Tile[][]): Coord {
    return grid.reduce((acc, row, x) => {
        return row.reduce((acc, col, y) => { return col.symbol === EXIT ? { x, y } : acc; }, acc);
    }, { x: 0, y: 0 } as Coord);
}

function isInBounds(grid: Tile[][], position: Coord): boolean {
    return position.x >= 0 && position.y >= 0 && position.x < grid.length && position.y < grid[0].length;
}

function moves(grid: Tile[][], position: Coord): Coord[] {
    return [
        { x: position.x + 1, y: position.y },
        { x: position.x - 1, y: position.y },
        { x: position.x, y: position.y + 1 },
        { x: position.x, y: position.y - 1 }
    ].filter(move => isInBounds(grid, move))
     .filter(move => grid[move.x][move.y].symbol !== WALL);
}

function manhatten(a: Coord, b: Coord): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function dijkstra(grid: Tile[][], start: Coord): Walk[][] {

    let visited: Walk[][] = grid.map(row => row.map(col => { return { ... col, size: Number.MAX_VALUE, trail: [] } as Walk }));
    let heap: MinHeap<Walk> = new MinHeap();

    visited[start.x][start.y].size = 0;
    heap.insert(visited[start.x][start.y]);

    while(heap.size() > 0) {
        let position: Walk = heap.extractMin();
        let distance: number = position.size + 1;
        moves(visited, position).forEach(move => {
            if(distance < visited[move.x][move.y].size) {
                visited[move.x][move.y].size = distance;
                visited[move.x][move.y].trail = [ ... position.trail, position ];
                heap.insert(visited[move.x][move.y]);
            }
        });
    }
    return visited;
}

function countWinners(grid: Walk[][], exit: Coord, max: number, threshold: number): number {

    let count: number = 0;
    let path: Coord[] = [ ... grid[exit.x][exit.y].trail.map(t => { return { ...t } as Coord }), exit ];

    for(let index = 0; index < path.length - threshold; index++) {
        for(let jump = index + threshold; jump < path.length; jump++) {
            let distance = manhatten(path[index], path[jump]);
            if(distance < 2 || distance > max) continue;
            let gain = jump - index - distance;
            if(gain < threshold) continue;
            if(distance <= max) {
                count++;
            }
        }
    }

    return count;
}

function partOne(input: string[], threshold: number): number {
    const grid: Tile[][] = parseInput(input);
    const start: Coord = findStart(grid);
    const exit: Coord = findExit(grid);
    const walked: Walk[][] = dijkstra(grid, start);
    return countWinners(walked, exit, 2, threshold);
}

function partTwo(input: string[], threshold: number): number {
    const grid: Tile[][] = parseInput(input);
    const start: Coord = findStart(grid);
    const exit: Coord = findExit(grid);
    const walked: Walk[][] = dijkstra(grid, start);
    return countWinners(walked, exit, 20, threshold);
}

test(day, () => {
    debug(`${day}\t${new Date()}\n`, day, false);

    const grid: Tile[][] = parseInput(getExampleInput(day));
    const start: Coord = findStart(grid);
    const exit: Coord = findExit(grid);
    // determine baseline score
    const walked: Walk[][] = dijkstra(grid, start);
    const baseline: number = walked[exit.x][exit.y].size;

    expect(baseline).toBe(84);

    expect(partOne(getExampleInput(day), 1)).toBe(44);
    expect(partOne(getExampleInput(day), 10)).toBe(10);
    expect(partOne(getDayInput(day), 100)).toBe(1518);
    expect(partTwo(getDayInput(day), 100)).toBe(1032257);
});