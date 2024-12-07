import { debug, getDayInput, getExampleInput } from '../utils';

const day = "day06";

const directions = "^>v<";

type Tile = {
    symbol: string;
    visited: number;
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
                exit: false,
            }
        }));
        return acc;
    }, [] as Tile[][]);
}

function findStart(tiles: Tile[][]): Coord {
    for(let x = 0; x < tiles.length; x++) {
        for(let y = 0; y < tiles[x].length; y++) {
            let symbol = tiles[x][y].symbol;
            if(directions.indexOf(symbol) !== -1) {
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
        location.x = next.x;
        location.y = next.y;
    }
    return tiles;
}

function reachedExit(tiles: Tile[][]): boolean {
    return tiles.reduce((acc, row, rowIndex) => {
        let rowcheck = false;
        if(rowIndex === 0 || rowIndex === tiles.length - 1) {
            // anything in first or last rows
            rowcheck = row.filter(col => col.exit).length > 0;
        } else {
            // anything in first or last column
            rowcheck = row[0].exit || row[row.length - 1].exit;
        }
        return acc || rowcheck;
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
    const potentialObstacles: Coord[] = traverse(tiles, start).reduce((acc, row, x) => {
        row.forEach((col, y) => {
            if(col.visited > 0) acc.push({ x, y });
        });
        return acc;
    }, [] as Coord[]);

    return potentialObstacles.filter(obstacle => {
        const freshTiles = parseInput(input);
        const newStart = findStart(freshTiles);
        freshTiles[obstacle.x][obstacle.y].symbol = '#';
        const newPath = traverse(freshTiles, newStart);
        let exited = reachedExit(newPath);
        return !exited;
    }).length;
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(41);
    expect(partOne(getDayInput(day))).toBe(4454);

    expect(partTwo(getExampleInput(day))).toBe(6);
    expect(partTwo(getDayInput(day))).toBe(1503);
});