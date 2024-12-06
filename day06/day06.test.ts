import { debug, getDayInput, getExampleInput } from '../utils';

const day = "day06";

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
            if(symbol === '^' || symbol === 'v' || symbol === '>' || symbol === '<') {
                return {
                    x,
                    y
                };
            }
        }
    }
    return {
        x: -1,
        y: -1
    };
}

function printTiles(tiles: Tile[][]) {
    let map = tiles.reduce((acc, val) => {
        return acc + val.map(t => t.symbol).join('') + '\n';
    }, '');
    debug(map, 'day6.txt', false);
}

function isInBounds(tiles: Tile[][], loc: Coord): boolean {
    return loc.x >= 0 && loc.y >= 0 && loc.x < tiles.length && loc.y < tiles[0].length;
}

function nextTile(tiles: Tile[][], loc: Coord): Coord {
    let symbol = tiles[loc.x][loc.y].symbol;
    let x = loc.x;
    let y = loc.y;
    switch(symbol) {
        case '^': x--;
        break;
        case '>': y++;
        break;
        case '<': y--;
        break;
        case 'v': x++;
        break;
    }
    return {
        x, y
    }
}

function traverse(tiles: Tile[][], start: Coord): Tile[][] {
    let location: Coord = {
        x: start.x,
        y: start.y
    };

    while(isInBounds(tiles, location)) {
        let symbol = tiles[location.x][location.y].symbol;
        let next = nextTile(tiles, location);
        // mark visited
        tiles[location.x][location.y].symbol = 'X';

        if(!isInBounds(tiles, next)) break;

        if(tiles[next.x][next.y].symbol === '#') {
            // turn
            switch(symbol) {
                case '^':
                    symbol = '>';
                    break;
                case '>':
                    symbol = 'v';
                    break;
                case 'v':
                    symbol = '<';
                    break;
                case '<':
                    symbol = '^';
                    break;
            }
            tiles[location.x][location.y].symbol = symbol;
            continue;
        }

        // move forward
        location.x = next.x;
        location.y = next.y;
        if(isInBounds(tiles, location)) {
            tiles[location.x][location.y].symbol = symbol;
        }
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
});