import { getInputLines, getDayExampleInputFile, getDayInputFile } from "../utils";

const day = "day01";

function partOne(input: string[]) {
    // map input to 2 lists
    // sort lists
    // calculate distance
    // total distances
    const listA: number [] = [];
    const listB: number [] = [];
    input.map(line => {
        const ab: string [] = line.split(' ')
            .filter(i => i.length > 0)
            .map(i => i.trim());
        listA.push(Number.parseInt(ab[0]));
        listB.push(Number.parseInt(ab[1]));
    });

    listA.sort((a, b) => a - b);
    listB.sort((a, b) => a - b);

    return listA.reduce((acc, val, idx) => {
        return acc + Math.abs(val - listB[idx]);
    }, 0);
}

test(day, () => { 
    expect(partOne(getDayExampleInputFile(day, 1))).toBe(11);
    expect(partOne(getDayInputFile(day))).toBe(2031679);
});