import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day12';

type Coord = {
    x: number;
    y: number;
}

type Plot = Coord & {
    crop: string;
    region: number;
    fences: number;
}

function parseInput(input: string[]): Plot[][] {
    return input.reduce((acc, line, x) => {
        acc.push(line.split('').map((crop, y) => {
            return { crop, x, y, region: Number.MAX_VALUE, fences: 4 };
        }));
        return acc;
    }, [] as Plot[][]);
}

function getNeighbors(garden: Plot[][], plot: Plot): Plot[] {
    let x = plot.x;
    let y = plot.y;
    return [
        { x: x + 1, y: y,    },
        { x: x - 1, y: y,    },
        { x: x,     y: y + 1 },
        { x: x,     y: y - 1 },
    ].filter(neighbor => isInBounds(garden, neighbor))
     .map(neighbor => garden[neighbor.x][neighbor.y])
     .filter(neighbor => neighbor.crop === plot.crop) as Plot[];
}

function isInBounds(garden: Plot[][], plot: Coord): boolean {
    return plot.x >= 0 && plot.y >= 0 && plot.x < garden.length && plot.y < garden[0].length;
}

function getPlotsForRegion(garden: Plot[][], region: number): Plot[] {
    return garden.reduce((acc, row) => {
        acc.push(...row.reduce((acc, plot) => {
            if(plot.region === region) {
                acc.push(plot);
            }
            return acc;
        }, [] as Plot[]));
        return acc;
    }, [] as Plot[]);
}

function walkGarden(garden: Plot[][], start: Plot, region: number): Plot[][] {
    const check: Plot[] = [ start ];
    while(check.length > 0) {
        const current = check.pop() as Plot;
        if(current.region !== Number.MAX_VALUE) continue;
        const neighbors = getNeighbors(garden, current);
        garden[current.x][current.y].region = region;
        garden[current.x][current.y].fences = 4 - neighbors.length;
        check.push(...neighbors);
    }
    return garden;
}

function markRegions(garden: Plot[][]): Plot[][] {
    let region = 0;
    for(let x = 0; x < garden.length; x++) {
        for(let y = 0; y < garden[x].length; y++) {
            const plot = garden[x][y];
            if(plot.region === Number.MAX_VALUE) {
                garden = walkGarden(garden, plot, region++);
            }
        }
    }   
    return garden; 
}

function partOne(input: string[]): number {
    const garden: Plot[][] = markRegions(parseInput(input));
    let region = 0;
    let total = 0;
    while(true) {
        const plots: Plot[] = getPlotsForRegion(garden, region);
        if(plots.length < 1) break;
        total += plots.length * plots.reduce((acc, plot) => acc + plot.fences, 0);
        region++;
    }
    return total;
}

test(day, () => {
    debug(`Date: ${new Date()}\n`, day, false);
    expect(partOne(getExampleInput(day, 1))).toBe(140);
    expect(partOne(getExampleInput(day, 2))).toBe(772);
    expect(partOne(getExampleInput(day, 3))).toBe(1930);
    expect(partOne(getDayInput(day))).toBe(1375476);
});
