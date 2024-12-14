import { debug, getExampleInput, getDayInput } from '../utils';

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

type Game = {
    buttonAPresses: number;
    buttonBPresses: number;
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

function slope(from: Coord, to: Coord): number {
    const rise: number = to.y - from.y;
    const run: number = to.x - from.x;
    return rise / run;
}

function distance(from: Coord, to: Coord): number {
    const rise: number = to.y - from.y;
    const run: number = to.x - from.x;
    return Math.sqrt((rise * rise) + (run * run))
}

function getCoordsOnLine(from: Coord, to: Coord, times: number): Coord [] {
    const rise: number = to.y - from.y;
    const run: number = to.x - from.x;
    const slope: number = rise / run;
    const angle = Math.atan(slope);
    const coordsOnLine: Coord[] = [ from, to ];
    let distance = Math.sqrt((rise * rise) + (run * run));
    let offset = 0;

    while(times-- > 0) {
        // increase distance by 1 until out of bounds
        offset += distance;

        const distanceX = offset * Math.cos(angle);
        const distanceY = offset * Math.sin(angle);

        coordsOnLine.push({
            x: Math.round(to.x + distanceX) + 0,
            y: Math.round(to.y + distanceY) + 0
        });
    }

    return coordsOnLine;
}

function determinePresses(firstButton: Coord, secondButton: Coord, prize: Coord, maxPresses: number): [ number, number ] {
    let firstPresses = 0;
    let secondPresses = 0;

    let firstButtonLine: Coord[] = getCoordsOnLine({ x: 0, y: 0 }, firstButton, maxPresses)
        .filter(coord => coord.x <= prize.x && coord.y <= prize.y );

    if(firstButtonLine.filter(coord => coord.x === prize.x && coord.y === prize.y).length > 0) {
        debug(`First button winner: ${firstButtonLine.indexOf(prize)}`, day);
        return [ firstButtonLine.length, 0 ];
    }

    while(firstButtonLine.length > 0) {
        let check = firstButtonLine.pop() as Coord;
        let remainingPresses = maxPresses - firstButtonLine.length + 1;
        let secondButtonLine: Coord[] = getCoordsOnLine(check, { x: check.x + secondButton.x, y: check.y + secondButton.y }, remainingPresses)
            .filter(coord => coord.x <= prize.x && coord.y <= prize.y);
        debug(`First Presses: ${firstButtonLine.length + 1}\tSecond Presses: ${secondButtonLine.length}\t:Last Coord: ${secondButtonLine[secondButtonLine.length-1].x},${secondButtonLine[secondButtonLine.length-1].y}`, day);
        if(secondButtonLine.filter(coord => coord.x === prize.x && coord.y === prize.y).length > 0) {
            debug(`Second button winner: ${secondButtonLine.indexOf(prize)}`, day);
            return [ firstButtonLine.length + 1, secondButtonLine.length ];
        }
    }

    return [ firstPresses, secondPresses ];
}

function playGame(machine: ClawMachine, maxPresses: number): Game {
    const aDistance = distance({ x: 0, y: 0 }, machine.a);
    const bDistance = distance({ x: 0, y: 0 }, machine.b);

    determinePresses(machine.a, machine.b, machine.prize, maxPresses);
    determinePresses(machine.b, machine.a, machine.prize, maxPresses);
    
    let presses: [number, number] = [0,0];
    if((aDistance / 3) > bDistance) {
        // Button A gives more distance per token
        presses = determinePresses(machine.a, machine.b, machine.prize, maxPresses);
        return {
            buttonAPresses: presses[0],
            buttonBPresses: presses[1]
        };
    } else {
        // Start with Button B
        presses = determinePresses(machine.b, machine.a, machine.prize, maxPresses);
        return {
            buttonAPresses: presses[1],
            buttonBPresses: presses[0]
        };
    }
}

function findWinners(machine: ClawMachine, maxPresses: number): Game[] {
    let winners: Game[] = [];

    for(let ap = 0; ap < maxPresses; ap++) {
        for(let bp = 0; bp < maxPresses; bp++) {
            if((((machine.a.x * ap) + (machine.b.x * bp)) === machine.prize.x) &&
               (((machine.a.y * ap) + (machine.b.y * bp)) === machine.prize.y)) {
                winners.push({
                    buttonAPresses: ap,
                    buttonBPresses: bp
                })
            }
        }
    }
    return winners;
}

function calculateFewestTokens(machine: ClawMachine, maxPresses: number): number {
    const winners: Game[] = findWinners(machine, maxPresses);
    if(winners.length === 0) return 0;
    return winners.reduce((acc, winner) => {
        return Math.min(acc, ((winner.buttonAPresses * 3) + winner.buttonBPresses));
    }, Number.MAX_VALUE);
}

function partOne(input: string[]): number {
    return parseInput(input).reduce((acc, machine) => {
        return acc += calculateFewestTokens(machine, 100);
    }, 0);
}

test(day, () => {
    debug(`Date: ${new Date()}\n`, day, false);
    expect(partOne(getExampleInput(day))).toBe(480);
    expect(partOne(getDayInput(day))).toBe(26299);
})