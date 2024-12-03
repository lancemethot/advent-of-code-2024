import { getDayInput, getExampleInput } from "../utils";

const day = "day03";

type Instruction = {
    operands: number [];
}

function findInstructions(input: string): Instruction[] {
    const instructions: Instruction[] = [];
    const match = input.match(/mul\(\d+,\d+\)/g);
    match?.forEach(m => {
        const operands = m.match(/\d+/g);
        instructions.push({
            operands: operands?.map(o => Number.parseInt(o)) || []
        })
    });
    return instructions;
}

function partOne(input: string[]): number {
    return findInstructions(input.join('')).reduce((acc, val) => {
        return acc += val.operands[0] * val.operands[1];
    }, 0);
}

function partTwo(input: string[]): number {
    let check = input.join('');
    let index = 0;
    let isEnabled = true;
    let total = 0;

    // if enabled, find up to the next don't()
    // if disabled, find up to the next do()
    // only add when enabled, ignore when disabled

    while(true) {
        if(isEnabled) {
            index = check.indexOf('don\'t()');
            total = findInstructions(check.substring(0, index < 0 ? check.length : index)).reduce((acc, val) => {
                return acc += val.operands[0] * val.operands[1];
            }, total);
            isEnabled = false;
            if(index < 0) break;
            check = check.substring(index);
        } else {
            index = check.indexOf('do()');
            if(index < 0) break;
            isEnabled = true;
            check = check.substring(index);
        }
    }

    return total;
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(161);
    expect(partOne(getDayInput(day))).toBe(189527826);

    expect(partTwo(getExampleInput(day, 2))).toBe(48);
    expect(partTwo(getDayInput(day))).toBe(63013756);
});