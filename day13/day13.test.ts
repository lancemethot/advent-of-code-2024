import { getExampleInput, getDayInput } from '../utils';

const day = 'day13';

type Coord = {
    x: number;
    y: number;
}

type ClawMachine = {
    a: Coord;
    b: Coord;
    prize: Coord;
}

function parseCoords(line: string): Coord {
    return line.split(':')[1].split(',').reduce((acc, coord, index) => {
        acc.x = index === 0 ? Number.parseInt(coord.trim().substring(2)) : acc.x;
        acc.y = index === 1 ? Number.parseInt(coord.trim().substring(2)) : acc.y;
        return acc;
    }, { x: 0, y: 0 } as Coord);
}

function parseInput(input: string[]): ClawMachine[] {
    return input.reduce((acc, line, lineIndex) => {
        if(line.startsWith("Button A:")) {
            acc.push({
                a: parseCoords(line),
                b: parseCoords(input[lineIndex + 1]),
                prize: parseCoords(input[lineIndex + 2])
            });
        }
        return acc;
    }, [] as ClawMachine[]);
}

function calculateFewestTokens(machine: ClawMachine): number {
    // Solve with linear algebra
    // Get wholly-divisible button presses for a and b
    let ap = ((machine.prize.x * machine.b.y) - (machine.prize.y * machine.b.x)) / ((machine.a.x * machine.b.y) - (machine.a.y * machine.b.x));
    let bp = ((machine.prize.y * machine.a.x) - (machine.prize.x * machine.a.y)) / ((machine.a.x * machine.b.y) - (machine.a.y * machine.b.x));
    if(Number.isInteger(ap) && Number.isInteger(bp)) {
        // If evenly divisble, return cost
        return (ap * 3) + bp;
    }
    // Not winnable, don't play
    return 0;
}

function partOne(input: string[]): number {
    return parseInput(input).reduce((acc, machine) => {
        return acc += calculateFewestTokens(machine);
    }, 0);
}

function partTwo(input: string[]): number {
    return parseInput(input).reduce((acc, machine) => {
        return acc += calculateFewestTokens({
            a: machine.a,
            b: machine.b,
            prize: {
                x: machine.prize.x + 10000000000000,
                y: machine.prize.y + 10000000000000,
            }
        });
    }, 0);
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(480);
    expect(partOne(getDayInput(day))).toBe(26299);

    expect(partTwo(getExampleInput(day))).toBe(875318608908);
    expect(partTwo(getDayInput(day))).toBe(107824497933339);
})