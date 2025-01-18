import { getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = "day11";

function parseInput(input: string[]): string[] {
    return input.reduce((acc, line) => {
        acc.push(... line.split(' ').filter(part => part.trim().length > 0));
        return acc;
    }, [] as string[]);
}

function removeLeadingZeroes(engraving: string): string {
    while(engraving.startsWith('0') && engraving !== '0') {
        engraving = engraving.substring(1);
    }
    return engraving;
}

const mutations: Map<string, string[]> = new Map<string, string[]>();
function transmute(engraving: string): string[] {
    if(!mutations.has(engraving)) {
        const transmuted: string[] = [];
        if(engraving === '0') {
            transmuted.push('1');
        } else if((engraving.length % 2) === 0) {
            transmuted.push(engraving.substring(0, engraving.length / 2));
            transmuted.push(engraving.substring( engraving.length / 2));
        } else {
            transmuted.push(String(Number.parseInt(engraving) * 2024));
        }
        mutations.set(engraving, transmuted.map(stone => removeLeadingZeroes(stone)));
    }
    return mutations.get(engraving)!;
}

function blink(stones: Map<string, number>): Map<string,number> {
    // Count the # of times each engraving appears
    const occurrences: Map<string, number> = new Map();
    stones.forEach((count, engraving) => {
        transmute(engraving).forEach(stone => {
            occurrences.set(stone, (occurrences.get(stone) || 0) + count)
        });
    })
    return occurrences;
}

function rapidBlink(stones: string[], times: number): number {
    let occurrences: Map<string, number> = new Map();
    stones.forEach(stone => occurrences.set(stone, 1));
    for(let i = 0; i < times; i++) {
        occurrences = blink(occurrences);
    }
    // Sum up all the counts of each engraving
    return Array.from(occurrences.values()).reduce((acc, count) => {
        return acc += count;
    }, 0);
}

function partOne(input: string[]): number {
    return rapidBlink(parseInput(input), 25);
}

function partTwo(input: string[]): number {
    return rapidBlink(parseInput(input), 75);
}

test(day, ()=> {
    expect(partOne(getExampleInput(day))).toBe(55312);
    expect(partOne(getDayInput(day))).toBe(191690);

    expect(partTwo(getExampleInput(day))).toBe(65601038650482);
    expect(partTwo(getDayInput(day))).toBe(228651922369703);
});