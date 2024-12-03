import { getDayInput, getExampleInput } from "../utils";

const day = "day03";

type Instruction = {
    operands: number [];
}

function parseInput(input: string[]): Instruction[] {
    return input.reduce((acc, val) => {
        const match = val.match(/mul\(\d+,\d+\)/g);
        match?.forEach(m => {
            const operands = m.match(/\d+/g);
            acc.push({
                operands: operands?.map(o => Number.parseInt(o)) || []
            })
        });
        return acc;
    }, [] as Instruction[]);
}

function partOne(input: string[]): number {
    return parseInput(input).reduce((acc, val) => {
        return acc += val.operands[0] * val.operands[1];
    }, 0);
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(161);
    expect(partOne(getDayInput(day))).toBe(189527826);
});