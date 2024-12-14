import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day14';

type Coord = {
    x: number;
    y: number;
}

type Robot = Coord & {
    position: Coord;
    velocity: Coord;
}

function parseCoord(input: string): Coord {
    const coord = input.split('=')[1];
    return {
        x: Number.parseInt(coord.split(',')[0]),
        y: Number.parseInt(coord.split(',')[1])
    };
}

function parseInput(input: string[]): Robot[] {
    return input.map(line => {
        return {
            position: parseCoord(line.split(' ')[0]),
            velocity: parseCoord(line.split(' ')[1])
        } as Robot;
    });
}

function step(from: Coord, velocity: Coord, steps: number, maxX: number, maxY: number): Coord {
    let x = from.x + (velocity.x * steps);
    let y = from.y + (velocity.y * steps);
    const coord: Coord = {
        x: x < 0 ? (maxX - (Math.abs(x) % maxX)) % maxX : x % maxX,
        y: y < 0 ? (maxY - (Math.abs(y) % maxY)) % maxY : y % maxY,
    };
    return coord;
}

function stepForward(robots: Robot[], steps: number, maxX: number, maxY: number): Robot[] {
    return robots.map(robot => {
        return {
            position: step(robot.position, robot.velocity, steps, maxX, maxY),
            velocity: robot.velocity
        } as Robot;
    });
}

function splitIntoQuadrants(robots: Robot[], maxX: number, maxY: number): Robot[][] {
    let width = Math.floor(maxX / 2);
    let height = Math.floor(maxY / 2);
    return robots.reduce((acc, robot, index) => {
        if(robot.position.x < width && robot.position.y < height) acc[0].push(robot);
        if(robot.position.x > width && robot.position.y < height) acc[1].push(robot);
        if(robot.position.x < width && robot.position.y > height) acc[2].push(robot);
        if(robot.position.x > width && robot.position.y > height) acc[3].push(robot);
        return acc;
    }, [[],[],[],[]] as Robot[][]);
}

function calculateSafetyFactory(robots: Robot[], steps: number): number {
    const maxX = robots.reduce((acc, robot) => Math.max(robot.position.x, acc), 0) + 1;
    const maxY = robots.reduce((acc, robot) => Math.max(robot.position.y, acc), 0) + 1;
    return splitIntoQuadrants(stepForward(robots, steps, maxX, maxY), maxX, maxY).reduce((acc, quadrant) => {
        return acc *= quadrant.length;
    }, 1);
}

function partOne(input: string[]): number {
    return calculateSafetyFactory(parseInput(input), 100);
}

test(day, () => {
    debug(`Run: ${new Date()}\n`, day, false);
    expect(step({ x: 2, y: 4 }, { x: 2, y: -3 }, 1, 11, 7)).toStrictEqual({ x: 4, y: 1});
    expect(step({ x: 2, y: 4 }, { x: 2, y: -3 }, 2, 11, 7)).toStrictEqual({ x: 6, y: 5});
    expect(step({ x: 2, y: 4 }, { x: 2, y: -3 }, 3, 11, 7)).toStrictEqual({ x: 8, y: 2});
    expect(step({ x: 2, y: 4 }, { x: 2, y: -3 }, 4, 11, 7)).toStrictEqual({ x: 10, y: 6});
    expect(step({ x: 2, y: 4 }, { x: 2, y: -3 }, 5, 11, 7)).toStrictEqual({ x: 1, y: 3 });
    expect(step({ x: 7, y: 6 }, { x: -1, y: -3 }, 100, 11, 7)).toStrictEqual({ x: 6, y: 0 });
    expect(partOne(getExampleInput(day))).toBe(12);
    expect(partOne(getDayInput(day))).toBe(230436441);


});