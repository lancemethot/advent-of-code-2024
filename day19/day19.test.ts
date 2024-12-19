import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day19';

type Combination = {
    index: number;
    design: string[];
}

function parseInput(input: string[]): { patterns: Set<string>, designs: string[] } {
    return input.reduce((acc, line) => {
        if(line.indexOf(',') >= 0) acc.patterns = new Set(line.split(',').map(x => x.trim()));
        else if(line.trim().length > 0) acc.designs.push(line.trim());
        return acc;
    }, { patterns: new Set<string>(), designs: [] as string[] });
}

/*
def possible_arrangements(towels, design, max_towel_length, memo):
    if design in memo:        
        return memo[design]    
    if len(design) == 0:
        return 0
    for i in range(1, min(len(design), max_towel_length) + 1):
        current = design[:i]
        if current in towels:
            if len(design) == i:
                update_memo(memo, design, 1)
            else:
                rhs_arrangements = possible_arrangements(towels, design[i:], max_towel_length, memo)
                update_memo(memo, design, rhs_arrangements)
    if design not in memo:
        memo[design] = 0
    return memo[design]

def update_memo(memo, design, arrangements):
    if design in memo:
        memo[design] += arrangements
    else:
        memo[design] = arrangements
*/

function updateMemo(memo: Map<string, number>, design: string, arrangements: number): Map<string, number> {
    if(memo.has(design)) {
        memo.set(design, memo.get(design) as number + arrangements);
    } else {
        memo.set(design, arrangements);
    }
    return memo;
}

function arrangements(patterns: Set<string>, design: string, max: number, memo: Map<string, number>): number {
    if(memo.has(design)) return memo.get(design) as number;
    if(design.length === 0) return 0;
    let limit = Math.min(design.length, max) + 1;
    for(let i = 0; i < limit; i++) {
        let current = design.substring(0, i);
        if(patterns.has(current)) {
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

function partTwo(input: string[]): number {
    const { patterns, designs } = parseInput(input);
    let max: number = Array.from(patterns.keys()).reduce((acc, p) => {
        return Math.max(acc, p.length);
    }, 0);
    return designs.reduce((acc, design) => {
        return acc + arrangements(patterns, design, max, new Map<string, number>());
    }, 0);
}

test(day, () => {
    debug(`${day} ${new Date()}\n\n`, day, false);
    expect(partOne(getExampleInput(day))).toBe(6);
    expect(partOne(getDayInput(day))).toBe(226);

    expect(partTwo(getExampleInput(day))).toBe(16);
    expect(partTwo(getDayInput(day))).toBe(601201576113503);
})