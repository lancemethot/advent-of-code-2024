import { debug, getDayInput, getExampleInput } from '../utils';

const day = "day10";

type Coord = {
    x: number;
    y: number;
}

type Tile = {
    height: number;
}

function parseInput(input: string[]): Tile[][] {
    return input.reduce((acc, line) => {
        acc.push(line.split('').map(t => {
            return {
                height: Number.parseInt(t)
            } 
        }));
        return acc;
    }, [] as Tile[][]);
}

function findTrailheads(tiles: Tile[][]): Coord[] {
    return tiles.reduce((acc, row, x) => {
        acc.push(... row.reduce((colacc, col, y) => {
            if(col.height === 0) colacc.push({ x, y });
            return colacc;
        }, [] as Coord[]));
        return acc;
    }, [] as Coord[]);
}

function nextTile(tiles: Tile[][], position: Coord, direction: string): Coord {
    let x = position.x;
    let y = position.y;
    switch(direction) {
        case '^': x--; break;
        case 'v': x++; break;
        case '>': y++; break;
        case '<': y--; break; 
    }
    return { x, y };
}

function nextMoves(tiles: Tile[][], position: Coord): Coord[] {
    return [
        nextTile(tiles, position, '^'),
        nextTile(tiles, position, 'v'),
        nextTile(tiles, position, '>'),
        nextTile(tiles, position, '<')
    ].filter(tile => isInBounds(tiles, tile))
     .filter(tile => tiles[tile.x][tile.y].height === tiles[position.x][position.y].height + 1);
}

function isInBounds(tiles: Tile[][], tile: Coord): boolean {
    return tile.x >= 0 && tile.y >= 0 && tile.x < tiles.length && tile.y < tiles[0].length;
}

function findTrails(tiles: Tile[][], trailhead: Coord): Coord[][] {
    const trails: Coord[][] = [];
    const check: Coord[][] = [ [ trailhead ] ];

    while(check.length > 0) {
        let trail = check.shift();
        let next: Coord[] = nextMoves(tiles, trail![trail!.length - 1]);
        next.forEach(move => {
            let newTrail = [ ... trail!, move ];
            if(tiles[move.x][move.y].height === 9) {
                trails.push(newTrail);
            } else {
                check.push(newTrail);
            }
        });
    }
    return trails;
}

function countUnique(trails: Coord[][]): number {
    let found: Set<string> = new Set<string>();
    for(let i = 0; i < trails.length; i++) {
        let exit = trails[i][trails[i].length - 1];
        let key = `${exit.x},${exit.y}`;
        if(!found.has(key)) {
            found.add(key);
        }
    }
    return found.size;
}

function partOne(input: string[]): number {
    const tiles = parseInput(input);
    return findTrailheads(tiles).reduce((acc, trailhead) => {
        return acc += countUnique(findTrails(tiles, trailhead));
    }, 0);
}

function partTwo(input: string[]): number {
    const tiles = parseInput(input);
    return findTrailheads(tiles).reduce((acc, trailhead) => {
        return acc += findTrails(tiles, trailhead).length;
    }, 0);
}

test(day, () => {
    debug(`${new Date()}\n`, day, false);
    expect(partOne(getExampleInput(day, 1))).toBe(1);
    expect(partOne(getExampleInput(day, 2))).toBe(36);
    expect(partOne(getDayInput(day))).toBe(472);

    expect(partTwo(getExampleInput(day, 2))).toBe(81);
    expect(partTwo(getDayInput(day))).toBe(969);
});