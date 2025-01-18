import { getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = "day06";

const directions = "^>v<";

type Tile = {
    symbol: string;
    visited: number;
    start: boolean;
    exit: boolean;
}

type Coord = {
    x: number;
    y: number;
}

function parseInput(input: string[]): Tile[][] {
    return input.reduce((acc, val) => {
        acc.push(val.split('').map(t => {
            return {
                symbol: t,
                visited: 0,
                start: directions.includes(t),
                exit: false,
            }
        }));
        return acc;
    }, [] as Tile[][]);
}

function findStart(tiles: Tile[][]): Coord {
    for(let x = 0; x < tiles.length; x++) {
        for(let y = 0; y < tiles[x].length; y++) {
            if(tiles[x][y].start) {
                return { x, y };
            }
        }
    }
    return { x: -1, y: -1 };
}

function isInBounds(tiles: Tile[][], loc: Coord): boolean {
    return loc.x >= 0 && loc.y >= 0 && loc.x < tiles.length && loc.y < tiles[0].length;
}

function turnDirection(symbol: string): string {
    return directions[(directions.indexOf(symbol) + 1) % directions.length];
}

function nextTile(location: Coord, direction: string): Coord {
    let x = location.x;
    let y = location.y;
    switch(direction) {
        case '^': x--;
        break;
        case '>': y++;
        break;
        case '<': y--;
        break;
        case 'v': x++;
        break;
    }
    return { x, y }
}

function traverse(tiles: Tile[][], start: Coord): Tile[][] {
    let location: Coord = start;
    let direction = tiles[start.x][start.y].symbol;
    while(isInBounds(tiles, location)) {
        tiles[location.x][location.y].visited++;
        // visited too many times (loop)
        if(tiles[location.x][location.y].visited > 4) {
            break;
        }

        let next = nextTile(location, direction);

        // reached exit
        if(!isInBounds(tiles, next)) {
            tiles[location.x][location.y].exit = true;
            break;
        }

        // next is blocked
        if(tiles[next.x][next.y].symbol === '#') {
            // turn
            direction = turnDirection(direction);
            tiles[location.x][location.y].visited--;
            continue;
        }

        // move forward
        location = next;
    }
    return tiles;
}

function reachedExit(tiles: Tile[][]): boolean {
    return tiles.reduce((acc, row, rowIndex) => {
        if(rowIndex === 0 || rowIndex === tiles.length - 1) {
            // anything in first or last rows
            return acc || row.filter(col => col.exit).length > 0;
        } else {
            // anything in first or last column
            return acc || row[0].exit || row[row.length - 1].exit;
        }
    }, false);
}

function partOne(input: string[]): number {
    const tiles = parseInput(input);
    const start = findStart(tiles);
    return traverse(tiles, start).reduce((acc, val) => {
        return acc += val.filter(t => t.visited > 0).length;
    }, 0);
}

function partTwo(input: string[]): number {
    const tiles = parseInput(input);
    const start = findStart(tiles);
    // walk initial path to get list of visited tiles
    const potentialObstacles: Coord[] = traverse(tiles, start).reduce((acc, row, x) => {
        row.forEach((col, y) => {
            if(col.visited > 0) acc.push({ x, y });
        });
        return acc;
    }, [] as Coord[]);
    // swap each visited with an obstacle and see if it loops
    return potentialObstacles.filter(obstacle => {
        const freshTiles = parseInput(input);
        const freshStart = findStart(freshTiles);
        freshTiles[obstacle.x][obstacle.y].symbol = '#';
        return !reachedExit(traverse(freshTiles, freshStart));
    }).length;
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(41);
    expect(partOne(getDayInput(day))).toBe(4454);

    expect(partTwo(getExampleInput(day))).toBe(6);
    expect(partTwo(getDayInput(day))).toBe(1503);
});