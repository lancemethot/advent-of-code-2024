import { getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day19';

function parseInput(input: string[]): { patterns: Set<string>, designs: string[] } {
    return input.reduce((acc, line) => {
        if(line.indexOf(',') >= 0) acc.patterns = new Set(line.split(',').map(x => x.trim()));
        else if(line.trim().length > 0) acc.designs.push(line.trim());
        return acc;
    }, { patterns: new Set<string>(), designs: [] as string[] });
}

function updateMemo(memo: Map<string, number>, design: string, arrangements: number): Map<string, number> {
    if(memo.has(design)) {
        memo.set(design, memo.get(design) as number + arrangements);
    } else {
        memo.set(design, arrangements);
    }
    return memo;
}

function arrangements(patterns: Set<string>, design: string, max: number, memo: Map<string, number>): number {

    if(memo.has(design)) return memo.get(design) as number; // already determined
    if(design.length === 0) return 0; // no possible match

    let limit = Math.min(design.length, max) + 1;
    for(let i = 0; i < limit; i++) {
        let check = design.substring(0, i);
        if(patterns.has(check)) {
            if(design.length === i) {
                memo = updateMemo(memo, design, 1);
            } else {
                let possible = arrangements(patterns, design.substring(i), max, memo);
                memo = updateMemo(memo, design, possible);
            }
        }
    }

    if(!memo.has(design)) memo.set(design, 0);

    return memo.get(design) as number;
}

function partOne(input: string[]): number {
    const { patterns, designs } = parseInput(input);
    let max: number = Array.from(patterns.keys()).reduce((acc, p) => Math.max(acc, p.length), 0);
    return designs.reduce((acc, design) => {
        return acc + (arrangements(patterns, design, max, new Map<string, number>()) > 0 ? 1 : 0);
    }, 0);
}

function partTwo(input: string[]): number {
    const { patterns, designs } = parseInput(input);
    let max: number = Array.from(patterns.keys()).reduce((acc, p) => Math.max(acc, p.length), 0);
    return designs.reduce((acc, design) => {
        return acc + arrangements(patterns, design, max, new Map<string, number>());
    }, 0);
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(6);
    expect(partOne(getDayInput(day))).toBe(226);

    expect(partTwo(getExampleInput(day))).toBe(16);
    expect(partTwo(getDayInput(day))).toBe(601201576113503);
})