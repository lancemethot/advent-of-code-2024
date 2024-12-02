import { getDayInput, getExampleInput } from "../utils";

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

function isSafe(report: Report): boolean {
    let direction: 'ASC' | 'DESC' = 'ASC';
    for(let i = 0; i < report.levels.length - 1; i++) {
        const curr = report.levels[i];
        const next = report.levels[i + 1];
        const distance = Math.abs(curr - next);
        if(distance < 0 || distance > 3) {
            return false;
        }
        if(i === 0) {
            direction = next < curr ? 'DESC' : 'ASC';
        }
        if(direction === 'ASC' && next <= curr) return false;
        if(direction === 'DESC' && next >= curr) return false;
    }
    return true;
}

function partOne(input: string[]): number {
    return parseInput(input).reduce((acc, report) => {
        return acc += isSafe(report) ? 1 : 0;
    }, 0);
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(2);
    expect(partOne(getDayInput(day))).toBe(606);
});