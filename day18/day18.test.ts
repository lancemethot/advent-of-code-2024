import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';
import { HeapItem, MinHeap } from 'advent-of-code-utils';

const day = 'day18';

type Coord = {
    x: number;
    y: number;
}

type Tile = Coord & {
    corrupted: boolean;
}

type Walk = Tile & HeapItem;

function parseInput(input: string[]): Coord[] {
    return input.reduce((acc, line) => {
        acc.push({
            x: Number.parseInt(line.split(',')[0]),
            y: Number.parseInt(line.split(',')[1])
        });
        return acc;
    }, [] as Coord[]);
}

function createGrid(bytes: Coord[]): Tile[][] {
    const gridSize: number = bytes.reduce((acc, coord) => Math.max(acc, coord.x, coord.y), 0);
    const grid: Tile[][] = [];
    for(let x = 0; x <= gridSize; x++) {
        grid.push([]);
        for(let y = 0; y <= gridSize; y++) {
            grid[x].push({ x, y, corrupted: false });
        }
    }
    return grid;
}

function dropBytes(grid: Tile[][], bytes: Coord[], numToDrop: number): Tile[][] {
    const dropped: Tile[][] = grid.map(row => row.map(tile => { return { ...tile, corrupted: false }}));
    bytes.slice(0, numToDrop).forEach(b => {
        dropped[b.x][b.y].corrupted = true;
    });
    return dropped;
}

function isInBounds(gridSize: number, coord: Coord): boolean {
    return coord.x >= 0 && coord.y >= 0 && coord.x < gridSize && coord.y < gridSize;
}

function moves(grid: Tile[][], coord: Coord): Coord[] {
    return [
        { x: coord.x + 1, y: coord.y     },
        { x: coord.x - 1, y: coord.y     },
        { x: coord.x,     y: coord.y + 1 },
        { x: coord.x,     y: coord.y - 1 },
    ].filter(move => isInBounds(grid.length, move))
     .filter(move => !grid[move.x][move.y].corrupted);
}

function dijkstra(grid: Tile[][], start: Coord): Walk[][] {
    let visited: Walk[][] = grid.map(row => row.map(tile => { return { ...tile, size: Number.MAX_VALUE } as Walk}));
    let heap: MinHeap<Walk> = new MinHeap();
    visited[start.x][start.y].size = 0;
    heap.insert(visited[start.x][start.y]);
    while(heap.size() > 0) {
        let position: Walk = heap.extractMin();
        let distance = position.size + 1;
        moves(grid, position).forEach(move => {
            if(distance < visited[move.x][move.y].size) {
                visited[move.x][move.y].size = distance;
                heap.insert(visited[move.x][move.y]);
            }
        });
    }
    return visited;
}

function reachable(grid: Tile[][]): boolean {
    let walked: Walk[][] = dijkstra(grid, { x: 0, y: 0 });
    return walked[grid.length-1][grid.length-1].size < Number.MAX_VALUE;
}

function partOne(input: string[], numBytesToDrop: number): number {
    let bytes: Coord[] = parseInput(input);
    let grid: Tile[][] = createGrid(bytes);
    let dropped: Tile[][] = dropBytes(grid, bytes, numBytesToDrop);
    let walked: Walk[][] = dijkstra(dropped, { x: 0, y: 0 });
    return walked[grid.length - 1][grid.length - 1].size;
}

function partTwo(input: string[]): string {
    let bytes: Coord[] = parseInput(input);
    let grid: Tile[][] = createGrid(bytes);
    let index: number = 1;
    for(index = 1; index < bytes.length; index++) {
        let dropped: Tile[][] = dropBytes(grid, bytes, index);
        if(!reachable(dropped)) {
            break;
        }
    }
    return `${bytes[index - 1].x},${bytes[index - 1].y}`;
}

test(day, () => {
    debug(`${day} ${new Date()}\n`, day, false);

    expect(partOne(getExampleInput(day), 12)).toBe(22);
    expect(partOne(getDayInput(day), 1024)).toBe(246);

    expect(partTwo(getExampleInput(day))).toBe('6,1');
    expect(partTwo(getDayInput(day))).toBe('22,50');
});