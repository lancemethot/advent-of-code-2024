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
    visited: Path[];
}

type Path = HeapItem & {
    position: Vector;
}

function parseInput(input: string[]): Tile[][] {
    return input.reduce((acc, line, x) => {
        acc.push(line.split('').map((type, y) => {
            return { x, y, type, visited: [] } as Tile;
        }));
        return acc;
    }, [] as Tile[][]);
}

function findStart(tiles: Tile[][]): Coord {
    return tiles.reduce((acc, row, x) => {
        return row.reduce((acc, tile, y) => {
            return (tile.type === 'S') ? { x, y } : acc;
        }, acc);
    }, { x: 0, y: 0 });
}

function findExit(tiles: Tile[][]): Coord {
    return tiles.reduce((acc, row, x) => {
        return row.reduce((acc, tile, y) => {
            return (tile.type === 'E') ? { x, y } : acc;
        }, acc);
    }, { x: 0, y: 0 });
}

function moves(tiles: Tile[][], position: Vector): Vector[] {
    return [
        { x: position.x - 1, y: position.y, direction: '^' },
        { x: position.x + 1, y: position.y, direction: 'v' },
        { x: position.x, y: position.y - 1, direction: '<' },
        { x: position.x, y: position.y + 1, direction: '>' }
    ].filter(vector => tiles[vector.x][vector.y].type !== '#');
}

function dijkstra(tiles: Tile[][], start: Coord): Tile[][] {
    let visited: Tile[][] = tiles.map(line => line.map(tile => { tile.visited = []; return tile; }));
    let heap: MinHeap<Path> = new MinHeap();
    
    heap.insert({ size: 0, position: { ... start, direction: '>' } });
    while(heap.size() > 0) {
        let path = heap.extractMin();
        moves(tiles, path.position).forEach(vector => {
            let distance = path.position.direction === vector.direction ? path.size + 1 : path.size + 1001;
            let shortestDistance = visited[vector.x][vector.y].visited.reduce((acc, visit) => {
                return (visit.position.direction === vector.direction) ? Math.min(acc, visit.size) : acc;
            }, Number.MAX_VALUE);
            if(distance <= shortestDistance) {
                visited[vector.x][vector.y].visited.push({ size: distance, position: vector });
                heap.insert({ size: distance, position: vector });
            }
        });
    }

    return visited;
}

function partOne(input: string[]): number {
    const tiles: Tile[][] = parseInput(input);
    const start: Coord = findStart(tiles);
    const traversed = dijkstra(parseInput(input), start);
    const exit: Coord = findExit(tiles);
    return Math.min(... traversed[exit.x][exit.y].visited.map(visit => visit.size));
}

test(day, () => {
    debug(`${day}: ${new Date()}\n`, day, false);
    expect(partOne(getExampleInput(day, 1))).toBe(7036);
    expect(partOne(getExampleInput(day, 2))).toBe(11048);
    expect(partOne(getExampleInput(day, 3))).toBe(21148);
    //expect(partOne(getExampleInput(day, 4))).toBe(5078);
    //expect(partOne(getExampleInput(day, 5))).toBe(21110);
    //expect(partOne(getExampleInput(day, 6))).toBe(41210);
    expect(partOne(getDayInput(day))).toBe(88468);

    // expect(partTwo(getExampleInput(day, 1))).toBe(0);
    // expect(partTwo(getExampleInput(day, 2))).toBe(0);
    // expect(partTwo(getExampleInput(day, 3))).toBe(149);
    // expect(partTwo(getExampleInput(day, 4))).toBe(413);
    // expect(partTwo(getExampleInput(day, 5))).toBe(264);
    // expect(partTwo(getExampleInput(day, 6))).toBe(514);

});