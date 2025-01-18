import { getDayInput, getExampleInput } from "advent-of-code-utils";

const day = "day02";

type Report = {
    levels: number [];
}

function parseInput(input: string[]): Report [] {
    const reports: Report [] = input.map(line => {
        return {
            levels: line.split(' ')
                .filter(i => i.trim().length > 0)
                .map(i => Number.parseInt(i))
        }
    });
    return reports;
}

function isAllIncreasing(levels: number[]): boolean {
    for(let i = 0; i < levels.length - 1; i++) {
        if(levels[i] >= levels[i + 1]) return false;
    }
    return true;
}

function isAllDecreasing(levels: number[]): boolean {
    for(let i = 0; i < levels.length - 1; i++) {
        if(levels[i] <= levels[i + 1]) return false;
    }
    return true;
}

function isAllWithinRange(levels: number[]): boolean {
    for(let i = 0; i < levels.length - 1; i++) {
        const distance = Math.abs(levels[i] - levels[i + 1]);
        if(distance < 1 || distance > 3) {
            return false;
        }
    }
    return true;
}

function isSafe(levels: number[]): boolean {
    return isAllWithinRange(levels) && (isAllDecreasing(levels) || isAllIncreasing(levels));
}

function anySafe(levels: number[]): boolean {
    for(let i = 0; i < levels.length; i++) {
        const filtered = levels.filter((v, idx) => i !== idx);
        if(isSafe(filtered)) return true;
    }
    return false;
}

function partOne(input: string[]): number {
    return parseInput(input).reduce((acc, report) => {
        return acc += isSafe(report.levels) ? 1 : 0;
    }, 0);
}

function partTwo(input: string[]): number {
    return parseInput(input).reduce((acc, report) => {
        return acc += isSafe(report.levels) || anySafe(report.levels) ? 1 : 0;
    }, 0);
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(2);
    expect(partOne(getDayInput(day))).toBe(606);

    expect(partTwo(getExampleInput(day))).toBe(4);
    expect(partTwo(getDayInput(day))).toBe(644);
});