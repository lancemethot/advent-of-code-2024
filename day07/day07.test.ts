import { getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = "day07";

type Equation = {
    numbers: number[];
    expect: number;
}

function parseInput(input: string[]): Equation[] {
    return input.reduce((acc, line) => {
        let expect = Number.parseInt(line.split(':')[0]);
        let numbers = line.split(':')[1].trim().split(' ').map(n => Number.parseInt(n));
        acc.push({
            numbers,
            expect,
        });
        return acc;
    }, [] as Equation []);
}

function isSolvable(equation: Equation): boolean {
    // create a list of combinations to check
    let check: string[] = ['+', '*'];
    for(let i = 2; i < equation.numbers.length; i++) {
        let additional: string[] = check.reduce((acc, c) => {
            acc.push(`${c}+`,`${c}*`);
            return acc;
        }, [] as string[]);
        // replace checklist
        check = additional;
    }

    // attempt each combo
    return check.filter(combination => {
        let operators = combination.split('');
        let sumOrProduct = equation.numbers[0];
        for(let i = 0; i < operators.length; i++) {
            if(operators[i] === '+') {
                sumOrProduct += equation.numbers[i + 1];
            } else if(operators[i] === '*') {
                sumOrProduct *= equation.numbers[i + 1]; 
            }
        }
        return sumOrProduct === equation.expect;
    }).length > 0;
}

function isSolvableWithConcat(equation: Equation): boolean {
    // create a list of combinations to check
    let check: string[] = ['+', '*', '|'];
    for(let i = 2; i < equation.numbers.length; i++) {
        let additional: string[] = check.reduce((acc, c) => {
            acc.push(`${c}+`,`${c}*`, `${c}|`);
            return acc;
        }, [] as string[]);
        // replace checklist
        check = additional;
    }

    // attempt each combo
    return check.filter(combination => {
        let operators = combination.split('');
        let sumOrProduct = equation.numbers[0];
        for(let i = 0; i < operators.length; i++) {
            if(operators[i] === '+') {
                sumOrProduct += equation.numbers[i + 1];
            } else if(operators[i] === '*') {
                sumOrProduct *= equation.numbers[i + 1]; 
            } else {
                sumOrProduct = Number.parseInt(`${sumOrProduct}${equation.numbers[i + 1]}`);
            }
            if(sumOrProduct > equation.expect) break;
        }
        return sumOrProduct === equation.expect;
    }).length > 0;
}

function partOne(input: string[]): number {
    return parseInput(input)
        .filter(equation => isSolvable(equation))
        .reduce((acc, equation) => {
            return acc += equation.expect;
        }, 0);
}

function partTwo(input: string[]): number {
    return parseInput(input)
        .filter(equation => isSolvableWithConcat(equation))
        .reduce((acc, equation) => {
            return acc += equation.expect;
        }, 0);
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(3749);
    expect(partOne(getDayInput(day))).toBe(7579994664753);

    expect(partTwo(getExampleInput(day))).toBe(11387);
    expect(partTwo(getDayInput(day))).toBe(438027111276610);
});