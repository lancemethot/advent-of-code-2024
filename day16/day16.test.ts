import { debug, getDayInput, getExampleInput } from '../utils';
import { HeapItem, MinHeap } from './minheap.test';

const day = 'day16';

type Coord = {
    x: number;
    y: number;
}

type Vector = Coord & {
    direction: string;
}

type Tile = Coord & {
    type: string;
    visitors: Path[];
}

type Path = HeapItem & {
    steps: Vector[];
}

function parseInput(input: string[]): Tile[][] {
    return input.reduce((acc, line, x) => {
        acc.push(line.split('').map((type, y) => {
            return { x, y, type, visitors: [] } as Tile;
        }));
        return acc;
    }, [] as Tile[][]);
}

function findStart(tiles: Tile[][]): Coord {
    for(let x = 0; x < tiles.length; x++) {
        for(let y = 0; y < tiles[x].length; y++) {
            if(tiles[x][y].type === 'S') {
                return { x, y };
            }
        }
    }
    return { x: -1, y: -1 };
}

function findExit(tiles: Tile[][]): Coord {
    for(let x = 0; x < tiles.length; x++) {
        for(let y = 0; y < tiles[x].length; y++) {
            if(tiles[x][y].type === 'E') {
                return { x, y };
            }
        }
    }
    return { x: -1, y: -1 };
}

function nextTile(position: Vector): Vector {
    switch(position.direction) {
        case '^': return { x: position.x - 1, y: position.y    , direction: position.direction };
        case '>': return { x: position.x,     y: position.y + 1, direction: position.direction };
        case '<': return { x: position.x,     y: position.y - 1, direction: position.direction };
        case 'v': return { x: position.x + 1, y: position.y    , direction: position.direction };
        default: return { x: -1, y: -1, direction: '>' };
    }
}

function nextTiles(tiles: Tile[][], position: Vector): Vector[] {
    const next: Vector[] = [ nextTile(position) ];
    switch(position.direction) {
        case '^':
        case 'v':
            next.push(nextTile({ x: position.x, y: position.y, direction: '>' }));
            next.push(nextTile({ x: position.x, y: position.y, direction: '<' }));
            break;
        case '>':
        case '<':
            next.push(nextTile({ x: position.x, y: position.y, direction: '^' }));
            next.push(nextTile({ x: position.x, y: position.y, direction: 'v' }));
            break;
    }
    return next.filter(vector => tiles[vector.x][vector.y].type !== '#');
}

function findPathsToExit(tiles: Tile[][]): Path[] {
    const start: Coord = findStart(tiles);
    const exit: Coord = findExit(tiles);
    const heap: MinHeap<Path> = new MinHeap<Path>();

    let visited: Tile[][] = tiles.map(line => line.map(tile => { tile.visitors = []; return tile; }));
    let startPath: Path = { steps: [ { x: start.x, y: start.y, direction: '>'} ], size: 0 }

    visited[start.x][start.y].visitors?.push(startPath);
    heap.insert(startPath);

    while(heap.size() > 0) {
        let path: Path = heap.extractMin() as Path;
        let position: Vector = path.steps[path.steps.length - 1];
        nextTiles(tiles, position).forEach(vector => {
            let steps: Vector[] = [ ...path.steps, vector ];
            let size: number = path.size + (vector.direction === position.direction ? 1 : 1001);
            let smallest: number = visited[vector.x][vector.y].visitors.reduce((acc, visitor) => {
                return acc < visitor.size ? acc : visitor.size;
            }, Number.MAX_VALUE);
            if(size <= smallest) {
                visited[vector.x][vector.y].visitors.push({ steps, size })
                heap.insert({ steps, size });
            }
        });
    }

    return visited[exit.x][exit.y].visitors;
}

function partOne(input: string[]): number {
    const grid: Tile[][] = parseInput(input);
    const paths: Path[] = findPathsToExit(grid);
    return Math.min(... paths.map(path => path.size));
}

test(day, () => {
    debug(`${day}: ${new Date()}\n`, day, false);
    expect(partOne(getExampleInput(day, 1))).toBe(7036);
    expect(partOne(getExampleInput(day, 2))).toBe(11048);
    expect(partOne(getExampleInput(day, 3))).toBe(21148);
    expect(partOne(getExampleInput(day, 4))).toBe(5078);
    expect(partOne(getExampleInput(day, 5))).toBe(21110);
    expect(partOne(getExampleInput(day, 6))).toBe(41210);
    expect(partOne(getDayInput(day))).not.toBe(88472);

    // expect(partTwo(getExampleInput(day, 1))).toBe(0);
    // expect(partTwo(getExampleInput(day, 2))).toBe(0);
    // expect(partTwo(getExampleInput(day, 3))).toBe(149);
    // expect(partTwo(getExampleInput(day, 4))).toBe(413);
    // expect(partTwo(getExampleInput(day, 5))).toBe(264);
    // expect(partTwo(getExampleInput(day, 6))).toBe(514);

});