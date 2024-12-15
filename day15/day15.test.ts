import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day15';

const BOX = 'O';
const WALL = '#';
const EMPTY = '.';
const FISH = '@';

type Coord = {
    x: number;
    y: number;
};

type Tile = Coord & {
    type: string;
}

function parseInput(input: string[]): { grid: Tile[][], sequence: string } {
    let finishedGrid = false;
    return input.reduce((acc, line, x) => {
        if(line.trim().length === 0) {
            finishedGrid = true;
        } else {
            if(finishedGrid) {
                acc.sequence += line;
            } else {
                acc.grid.push(line.split('').map((type, y) => {
                    return { x, y, type };
                }));
            }
        }
        return acc;
    }, { grid: [] as Tile[][], sequence: ''});
}

function getFish(grid: Tile[][]): Coord {
    return grid.reduce((acc, row, x) => {
        return row.reduce((colacc, col, y) => {
            return (col.type === FISH) ? { x, y } : colacc;
        }, acc);
    }, { x: -1, y: -1 });
}

function getBoxes(grid: Tile[][]): Coord[] {
    return grid.reduce((acc, row, x) => {
        return row.reduce((colacc, col, y) => {
            if(col.type === BOX) {
                colacc.push({ x, y });
            }
            return colacc
        }, acc);
    }, [] as Coord[]);
}

function isInBounds(grid: Tile[][], coord: Coord): boolean {
    return coord.x >= 0 && coord.y >= 0 && coord.x < grid.length && coord.y < grid[0].length;
}

function nextMoves(grid: Tile[][], position: Coord, direction: string): Coord[] {
    const moves: Coord[] = [];
    let x = position.x;
    let y = position.y;
    let move = (from: Coord): Coord | undefined => {
        switch(direction) {
            case '^': return { x: from.x - 1, y: from.y };
            case 'v': return { x: from.x + 1, y: from.y };
            case '>': return { x: from.x, y: from.y + 1 };
            case '<': return { x: from.x, y: from.y - 1 };
        }
    }

    let next: Coord | undefined = position;
    while((next = move(next)) !== undefined) {
        if(!isInBounds(grid, next)) break;
        if(grid[next.x][next.y].type === WALL) break;
        if(grid[next.x][next.y].type === EMPTY) {
            moves.push({
                x: next.x,
                y: next.y
            });
            break;
        }

        if(grid[next.x][next.y].type === BOX) {
            moves.push({
                x: next.x,
                y: next.y
            });
        }
    };

    while(moves.length > 0 && grid[moves[moves.length - 1].x][moves[moves.length - 1].y].type !== EMPTY) {
        // Backtrack to an empty spot
        moves.pop();
    }

    return moves;

}

function executeSequence(grid: Tile[][], sequence: string): Tile[][] {
    let position = getFish(grid);
    for(let i = 0; i < sequence.length; i++) {
        let moves = nextMoves(grid, position, sequence[i]);
        while(moves.length > 1) {
            let move = moves.pop() as Coord;
            let before = moves[moves.length - 1];
            grid[move.x][move.y].type = grid[before.x][before.y].type;
            grid[before.x][before.y].type = EMPTY;
        }
        if(moves.length > 0) {
            let move = moves.pop() as Coord;
            if(grid[move.x][move.y].type === EMPTY) {
                grid[move.x][move.y].type = FISH;
                grid[position.x][position.y].type = EMPTY;
                position.x = move.x;
                position.y = move.y;
            }
        }
    }
    return grid;
}

function partOne(input: string[]): number {
    const { grid, sequence } = parseInput(input);
    const result = executeSequence(grid, sequence);
    const boxes = getBoxes(result);
    return boxes.reduce((acc, box) => acc += (100 * box.x) + box.y, 0);
}

test(day, () => {
    debug(`${day} - ${new Date()}\n`, day, false);
    expect(partOne(getExampleInput(day, 1))).toBe(2028);
    expect(partOne(getExampleInput(day, 2))).toBe(10092);
    expect(partOne(getDayInput(day))).toBe(1406392);
});