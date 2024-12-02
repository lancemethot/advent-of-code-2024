import { getExampleInput, getDayInput } from "../utils";

const day = "day01";

function parseInput(input: string[]): { listA: number[], listB: number[] } {
    // map input to 2 lists
    // sort lists
    const listA: number [] = [];
    const listB: number [] = [];
    input.map(line => {
        const match =  /(\d+)\s*(\d+)/.exec(line);
        if(match) {
            listA.push(Number.parseInt(match[1]));
            listB.push(Number.parseInt(match[2]));
        }
    });

    listA.sort((a, b) => a - b);
    listB.sort((a, b) => a - b);

    return {
        listA,
        listB
    }
}

function partOne(input: string[]): number {
    const { listA, listB } = parseInput(input);
    // calculate distance
    // total distances
    return listA.reduce((acc, val, idx) => {
        return acc + Math.abs(val - listB[idx]);
    }, 0);
}

const scoreCache: Map<number, number> = new Map();
function calculateScore(find: number, list: number[]): number {
    if(!scoreCache.has(find)) {
        const score = list.reduce((acc, val) => {
            if(val === find) {
                return acc += find;
            } else {
                return acc;
            }
        }, 0);
        scoreCache.set(find, score);
    }
    return scoreCache.get(find) as number;
}

function partTwo(input: string[]): number {
    const { listA, listB } = parseInput(input);
    // calculate similarity scores
    // total distances
    return listA.reduce((acc, val) => {
        return acc + calculateScore(val, listB);
    }, 0);
}

test(day, () => { 
    expect(partOne(getExampleInput(day))).toBe(11);
    expect(partOne(getDayInput(day))).toBe(2031679);

    expect(partTwo(getExampleInput(day))).toBe(31);
    expect(partTwo(getDayInput(day))).toBe(19678534);
});