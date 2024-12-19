import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day19';

function parseInput(input: string[]): { patterns: Set<string>, designs: string[] } {
    return input.reduce((acc, line) => {
        if(line.indexOf(',') >= 0) acc.patterns = new Set(line.split(',').map(x => x.trim()));
        else if(line.trim().length > 0) acc.designs.push(line.trim());
        return acc;
    }, { patterns: new Set<string>(), designs: [] as string[] });
}

function combinations(patterns: Set<string>, design: string, acc: string[], memo: Map<string, string[]> = new Map()): string[] {
    if(design.length === 0) return acc;
    if(memo.has(design)) return memo.get(design) as string[];
    for(const pattern of patterns) {
        if(design.startsWith(pattern)) {
            const newDesign = design.slice(pattern.length);
            const newAcc = acc.concat(pattern);
            const result = combinations(patterns, newDesign, newAcc, memo);
            if(result.length > 0) {
                memo.set(design, result);
                return result;
            }
        }
    }
    memo.set(design, []);
    return [];
}

function partOne(input: string[]): number {
    const { patterns, designs } = parseInput(input);
    return designs.reduce((acc, design) => {
        return acc + (combinations(patterns, design, []).length > 0 ? 1 : 0);
    }, 0);
}

test(day, () => {
    debug(`${day} ${new Date()}\n\n`, day, false);
    expect(partOne(getExampleInput(day))).toBe(6);
    expect(partOne(getDayInput(day))).toBe(226);
})