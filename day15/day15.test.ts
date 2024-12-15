import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day15';

const BOX = 'O';
const LBOX = '[';
const RBOX = ']';
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
            if(col.type === BOX || col.type === LBOX) {
                colacc.push({ x, y });
            }
            return colacc
        }, acc);
    }, [] as Coord[]);
}

function isInBounds(grid: Tile[][], coord: Coord): boolean {
    return coord.x >= 0 && coord.y >= 0 && coord.x < grid.length && coord.y < grid[0].length;
}

function move(from: Coord, direction: string): Coord {
    switch(direction) {
        case '^': return { x: from.x - 1, y: from.y     };
        case 'v': return { x: from.x + 1, y: from.y     };
        case '>': return { x: from.x,     y: from.y + 1 };
        default:  return { x: from.x,     y: from.y - 1 };
    }
}

function moveSet(grid: Tile[][], position: Coord, direction: string): Coord[] {
    const movables: Coord[] = [ position ];
    let next: Coord = movables[0];
    while(true) {
        next = move(next, direction);
        if(!isInBounds(grid, next)) break;
        if(grid[next.x][next.y].type === WALL) break;
        if(grid[next.x][next.y].type === EMPTY) {
            movables.push({ x: next.x, y: next.y });
            break;
        } else {
            movables.push({ x: next.x, y: next.y });
        }
    };

    while(movables.length > 1 && grid[movables[movables.length - 1].x][movables[movables.length - 1].y].type !== EMPTY) {
        // Backtrack to an empty spot or beginning
        movables.pop();
    }

    return movables;

}

function determineMoveSets(grid: Tile[][], position: Coord, direction: string): Coord[][] {
    const moves: Coord[][] = [];
    const check: Coord[][] = [ moveSet(grid, position, direction) ];

    while(check.length > 0) {
        const branch: Coord[] | undefined = check.pop();
        if(branch === undefined || branch.length < 2) {
            // One or more branches cannot be moved, so moveset is empty.
            return [];
        }

        if(direction === '^' || direction === 'v') {
            // Check for side branches when encountering left/right boxes
            branch.slice(1).forEach(tile => {
                if(grid[tile.x][tile.y].type === LBOX) {
                    check.push(moveSet(grid, { x: tile.x, y: tile.y + 1 }, direction));
                } else if(grid[tile.x][tile.y].type === RBOX) {
                    check.push(moveSet(grid, { x: tile.x, y: tile.y - 1 }, direction));
                }
            });
        }

        // if moves already includes these coords, add on to existing moveset
        let added: boolean = moves.reduce((acc, moveset) => {
            let index = branch.reduce((acc, coord) => {
                return acc >= 0 ? acc : moveset.findIndex(move => coord.x === move.x && coord.y === move.y);
            }, -1);
            if(index >= 0) {
                moveset.splice(index, moveset.length - index, ... branch);
                return true;
            }
            return acc;
        }, false);

        // if not added, push a new branch
        if(!added) moves.push(branch);

    }

    return moves;
}

function push(grid: Tile[][], tiles: Coord[]): Tile[][] {
    while(tiles.length > 1) {
        let next = tiles.pop() as Coord;
        let previous = tiles[tiles.length - 1];
        let nextType = grid[next.x][next.y].type;
        grid[next.x][next.y].type = grid[previous.x][previous.y].type;
        grid[previous.x][previous.y].type = nextType;
    }
    return grid;
}

function executeSequence(grid: Tile[][], sequence: string): Tile[][] {
    let position = getFish(grid);

    for(let i = 0; i < sequence.length; i++) {
        let moveSets = determineMoveSets(grid, position, sequence[i]);
        let moved = false;
        while(moveSets.length > 0) {
            let moveSet: Coord[] = moveSets.pop() as Coord[];
            if(moveSet.length > 1) {
                grid = push(grid, moveSet);
                moved = true;
            }
        }
        if(moved) position = move(position, sequence[i]);
    }
    return grid;
}

function expand(grid: Tile[][]): Tile[][] {
    return grid.reduce((newgrid, row, x) => {
        newgrid.push(row.reduce((newrow, col, y) => {
            newrow.push(
                { x: x, y: y * 2, type: col.type === BOX ? LBOX : col.type },
                { x: x, y: (y * 2) + 1, type: col.type === BOX ? RBOX : col.type === FISH ? EMPTY : col.type }
            );
            return newrow;
        }, [] as Tile[]));
        return newgrid;
    }, [] as Tile[][]);
}

function partOne(input: string[]): number {
    const { grid, sequence } = parseInput(input);
    return getBoxes(executeSequence(grid, sequence))
            .reduce((acc, box) => acc += (100 * box.x) + box.y, 0);
}

function partTwo(input: string[]): number {
    const { grid, sequence } = parseInput(input);
    return getBoxes(executeSequence(expand(grid), sequence))
            .reduce((acc, box) => acc += (100 * box.x) + box.y, 0);
}

test(day, () => {
    debug(`${day} - ${new Date()}\n`, day, false);
    expect(partOne(getExampleInput(day, 1))).toBe(2028);
    expect(partOne(getExampleInput(day, 2))).toBe(10092);
    expect(partOne(getDayInput(day))).toBe(1406392);

    expect(partTwo(getExampleInput(day, 2))).toBe(9021);
    expect(partTwo(getDayInput(day))).toBe(1429013);
});