import { getDayInput, getExampleInput } from 'advent-of-code-utils';
import { HeapItem, MinHeap } from 'advent-of-code-utils';

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
    trail: string;
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
    heap.insert({ size: 0, position: { ... start, direction: '>' }, trail: `${start.x},${start.y}` });
    while(heap.size() > 0) {
        let path = heap.extractMin();
        moves(tiles, path.position).forEach(vector => {
            let distance = path.position.direction === vector.direction ? path.size + 1 : path.size + 1001;
            let shortestDistance = visited[vector.x][vector.y].visited.reduce((acc, visit) => {
                return (visit.position.direction === vector.direction) ? Math.min(acc, visit.size) : acc;
            }, Number.MAX_VALUE);
            if(distance <= shortestDistance) {
                let newPath: Path = {
                    size: distance,
                    position: vector,
                    trail: path.trail + `|${vector.x},${vector.y}`
                };
                visited[vector.x][vector.y].visited.push(newPath);
                heap.insert(newPath);
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

function partTwo(input: string[]): number {
    const tiles: Tile[][] = parseInput(input);
    const start: Coord = findStart(tiles);
    const traversed: Tile[][] = dijkstra(parseInput(input), start);
    const exit: Coord = findExit(tiles);
    const shortestPath: number = Math.min(... traversed[exit.x][exit.y].visited.map(visit => visit.size));
    const uniqueTiles: Set<string> = traversed[exit.x][exit.y].visited.reduce((acc, path) => {
        if(path.size === shortestPath) {
            path.trail.split('|').forEach(vector => acc.add(vector));
        }
        return acc;
    }, new Set<string>());
    return uniqueTiles.size;
}

test(day, () => {
    expect(partOne(getExampleInput(day, 1))).toBe(7036);
    expect(partOne(getExampleInput(day, 2))).toBe(11048);
    expect(partOne(getDayInput(day))).toBe(88468);

    expect(partTwo(getExampleInput(day, 1))).toBe(45);
    expect(partTwo(getExampleInput(day, 2))).toBe(64);
    expect(partTwo(getDayInput(day))).toBe(616);
});