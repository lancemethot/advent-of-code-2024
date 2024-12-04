import { getDayInput, getExampleInput } from '../utils';

const day = "day04";

enum Direction {
    N,
    S,
    E,
    W,
    NE,
    SE,
    NW,
    SW
}

type Coord = {
    x: number;
    y: number;
}

function parseInput(input: string[]): string[][] {
    return input.reduce((acc, val) => {
        acc.push(val.split(''));
        return acc;
    }, [] as string[][]);
}

function search(grid: string[][], start: Coord, direction: Direction): boolean {
    const searchFor = 'XMAS';
    let x = start.x;
    let y = start.y;
    for(let index = 0; index < searchFor.length; index++) {
        if(x >= grid.length || x < 0) return false;
        if(y >= grid[0].length || y < 0) return false;
        if(grid[x][y] !== searchFor[index]) return false;
        if(direction === Direction.N || direction === Direction.NE || direction === Direction.NW) {
            y = y - 1;
        }
        if(direction === Direction.S || direction === Direction.SE || direction === Direction.SW) {
            y = y + 1;
        }
        if(direction === Direction.E || direction === Direction.NE || direction === Direction.SE) {
            x = x + 1;
        }
        if(direction === Direction.W || direction === Direction.NW || direction === Direction.SW) {
            x = x - 1;
        }
    }
    return true;
}

function partOne(input: string[]): number {
    // convert input to grid
    const grid = parseInput(input);

    let count = 0;
    for(let x = 0; x < input.length; x++) {
        for(let y = 0; y < input[x].length; y++) {
            if(grid[x][y] === 'X') {
                count += search(grid, { x, y }, Direction.N) ? 1 : 0;
                count += search(grid, { x, y }, Direction.NE)? 1 : 0;
                count += search(grid, { x, y }, Direction.E)? 1 : 0;
                count += search(grid, { x, y }, Direction.SE)? 1 : 0;
                count += search(grid, { x, y }, Direction.S)? 1 : 0;
                count += search(grid, { x, y }, Direction.SW)? 1 : 0;
                count += search(grid, { x, y }, Direction.W)? 1 : 0;
                count += search(grid, { x, y }, Direction.NW)? 1 : 0;
            }
        }
    }
    // look for x's
    // search 8 directions for m-a-s
    // if found, track location of x and direction
    return count;
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(18);
    expect(partOne(getDayInput(day))).toBe(2504);
});