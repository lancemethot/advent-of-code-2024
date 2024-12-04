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
        if(x >= grid.length || x < 0) return false; // out of bounds
        if(y >= grid[0].length || y < 0) return false; // out of bounds
        if(grid[x][y] !== searchFor[index]) return false; // invalid next letter
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
            // look for x's
            if(grid[x][y] === 'X') {
                // search 8 directions for m-a-s
                // if found, track location of x and direction
                count += search(grid, { x, y }, Direction.N) ? 1 : 0;
                count += search(grid, { x, y }, Direction.NE) ? 1 : 0;
                count += search(grid, { x, y }, Direction.E) ? 1 : 0;
                count += search(grid, { x, y }, Direction.SE) ? 1 : 0;
                count += search(grid, { x, y }, Direction.S) ? 1 : 0;
                count += search(grid, { x, y }, Direction.SW) ? 1 : 0;
                count += search(grid, { x, y }, Direction.W) ? 1 : 0;
                count += search(grid, { x, y }, Direction.NW) ? 1 : 0;
            }
        }
    }
    return count;
}

function search2(grid: string[][], start: Coord, direction: Direction): boolean {
    // get 3 letters
    // do they spell MAS
    let m: Coord = {
        x: start.x,
        y: start.y
    }

    let s: Coord = {
        x: start.x,
        y: start.y
    }

    if(direction === Direction.N || direction === Direction.NW || direction === Direction.NE) {
        m.x--;
        s.x++;
    }
    if(direction === Direction.S || direction === Direction.SW || direction === Direction.SE) {
        m.x++;
        s.x--;
    }
    if(direction === Direction.E || direction === Direction.NE || direction === Direction.SE) {
        m.y++;
        s.y--;
    }
    if(direction === Direction.W || direction === Direction.NW || direction === Direction.SW) {
        m.y--;
        s.y++;
    }
    
    if(m.x >= grid.length || s.x >= grid.length || m.x < 0 || s.x < 0) return false;
    if(m.y >= grid[0].length || s.y >= grid[0].length || m.y < 0 || s.y < 0) return false;
    return grid[m.x][m.y] === 'M' && grid[s.x][s.y] === 'S';
}

function partTwo(input: string[]): number {
    // convert input to grid
    const grid = parseInput(input);
    let count = 0;

    // skip edge pieces
    for(let x = 1; x < input.length - 1; x++) {
        for(let y = 1; y < input[x].length - 1; y++) {
            // look for a's
            if(grid[x][y] === 'A') {
                // search 8 directions for m-a-s crosses
                // if found, count the A
                let check = (search2(grid, { x, y }, Direction.NE) || search2(grid, { x, y }, Direction.SW)) &&
                             (search2(grid, { x, y }, Direction.NW) || search2(grid, { x, y }, Direction.SE));
                count += check ? 1 : 0;
            }
        }
    }

    return count;
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(18);
    expect(partOne(getDayInput(day))).toBe(2504);

    expect(partTwo(getExampleInput(day))).toBe(9);
    expect(partTwo(getDayInput(day))).toBe(1923);
});