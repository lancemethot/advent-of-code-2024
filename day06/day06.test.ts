import { getDayInput, getExampleInput } from '../utils';

const day = "day06";

const directions = "^>v<";

type Tile = {
    symbol: string;
}

type Coord = {
    x: number;
    y: number;
}

function parseInput(input: string[]): Tile[][] {
    return input.reduce((acc, val) => {
        acc.push(val.split('').map(t => {
            return {
                symbol: t
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
    let location: Coord = {
        x: start.x,
        y: start.y
    };

    while(isInBounds(tiles, location)) {
        // mark visited
        let symbol = tiles[location.x][location.y].symbol;
        tiles[location.x][location.y].symbol = 'X';

        let next = nextTile(location, symbol);
        if(!isInBounds(tiles, next)) break;

        if(tiles[next.x][next.y].symbol === '#') {
            // turn
            tiles[location.x][location.y].symbol = turnDirection(symbol);
            continue;
        }

        // move forward
        location.x = next.x;
        location.y = next.y;
        tiles[location.x][location.y].symbol = symbol;
    }
    return tiles;
}

function partOne(input: string[]): number {
    const tiles = parseInput(input);
    const start = findStart(tiles);
    return traverse(tiles, start).reduce((acc, val) => {
        return acc += val.filter(t => t.symbol === 'X').length;
    }, 0);
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(41);
    expect(partOne(getDayInput(day))).toBe(4454);

    //expect(partTwo(getExampleInput(day))).toBe(6);
});