import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day17';

type Instruction = {
    opcode: number;
    operand: number;
}

type Registers = {
    a: number;
    b: number;
    c: number;
}

type Program = Registers & {
    input: number[];
}

type Execution = Program & {
    input: number[];
    pointer: number;
    output: string;
}

function parseInput(input: string[]): Program {
    return input.reduce((acc, line, index) => {
        if(line.startsWith('Register A:')) {
            acc.push({
                a: Number.parseInt(line.split(':')[1].trim()),
                b: Number.parseInt(input[index+1].split(':')[1].trim()),
                c: Number.parseInt(input[index+2].split(':')[1].trim()),
                input: []
            });
        } else if(line.startsWith('Program:')) {
            acc[acc.length - 1].input = line.split(':')[1].trim().split(',').map(i => Number.parseInt(i));
        }
        return acc;
    }, [] as Program[])[0];
}

function comboOperand(program: Execution, operand: number): number {
    switch(operand) {
        case 0:
        case 1:
        case 2:
        case 3: return operand;
        case 4: return program.a;
        case 5: return program.b;
        case 6: return program.c;
        default: return 0;
    }
}

function adv(program: Execution, operand: number): Execution {
    program.a = Math.trunc(program.a / (2 ** comboOperand(program, operand)));
    return program;
}

function bxl(program: Execution, operand: number): Execution {
    program.b = program.b ^ operand;
    return program;
}

function bst(program: Execution, operand: number): Execution {
    let combo = comboOperand(program, operand);
    program.b = combo % 8;
    return program;
}

function jnz(program: Execution, operand: number): Execution {
    if(program.a !== 0) {
        program.pointer = operand;
    }
    return program;
}

function bxc(program: Execution, operand: number): Execution {
    program.b = program.b ^ program.c;
    return program;
}

function out(program: Execution, operand: number): Execution {
    let combo = comboOperand(program, operand) & 7;
    if(program.output.length > 0) program.output += ',';
    program.output += String(combo);
    return program;
}

function bdv(program: Execution, operand: number): Execution {
    program.b = Math.trunc(program.a / (2 ** comboOperand(program, operand)));
    return program;
}

function cdv(program: Execution, operand: number): Execution {
    program.c = Math.trunc(program.a / (2 ** comboOperand(program, operand)));
    return program;
}

function executeInstruction(program: Execution): Execution {
    let opcode = program.input[program.pointer];
    let operand = program.input[program.pointer + 1];
    program.pointer = program.pointer + 2;
    switch(opcode) {
        case 0: return adv(program, operand);
        case 1: return bxl(program, operand);
        case 2: return bst(program, operand);
        case 3: return jnz(program, operand);
        case 4: return bxc(program, operand);
        case 5: return out(program, operand);
        case 6: return bdv(program, operand);
        case 7: return cdv(program, operand);
        default: return program;
    }
}

function executeProgram(program: Program): Execution {
    let execution: Execution = { ...program, pointer: 0, output: '' };
    let pointer = execution.pointer;
    while(pointer < execution.input.length - 1) {
        execution = executeInstruction(execution);
        pointer = execution.pointer;
    }
    return execution;
}

function findA(program: Program, a: number = 0, depth: number = 0) {
    if(depth === program.input.length) return a;
    for(let i = 0; i < 8; i++) {
        let output: number = executeProgram({ ... program, a: (a * 8) + i })
            .output.split(',')
            .map(n => Number.parseInt(n))[0];
        if(output < 0) debug(`HUH? a:${(a * 8) + i}`, day);
        if(output === program.input[program.input.length - 1 - depth]) {
            let result = findA(program, (a * 8) + i, depth + 1);
            if(result !== 0) return result;
        }
    } 
    return 0;
}

function partOne(input: string[]): string {
    return executeProgram(parseInput(input)).output;
}

function partTwo(input: string[]): number {
    return findA(parseInput(input));
}

test(day, () => {
    debug(`${day} ${new Date()}\n`, day, false);

    expect(executeProgram({ a: 0,    b: 0,    c: 9,     input: [ 2, 6 ],            }).b).toBe(1);
    expect(executeProgram({ a: 10,   b: 0,    c: 0,     input: [ 5, 0, 5, 1, 5, 4 ] }).output).toBe('0,1,2');
    expect(executeProgram({ a: 2024, b: 0,    c: 0,     input: [ 0, 1, 5, 4, 3, 0 ] }).output).toBe('4,2,5,6,7,7,7,7,3,1,0');
    expect(executeProgram({ a: 2024, b: 0,    c: 0,     input: [ 0, 1, 5, 4, 3, 0 ] }).a).toBe(0);
    expect(executeProgram({ a: 0,    b: 29,   c: 0,     input: [ 1, 7 ],            }).b).toBe(26);
    expect(executeProgram({ a: 0,    b: 2024, c: 43690, input: [ 4, 0 ],            }).b).toBe(44354);

    expect(partOne(getExampleInput(day, 1))).toBe('4,6,3,5,6,3,5,2,1,0');
    expect(partOne(getDayInput(day))).toBe('7,1,3,7,5,1,0,3,4');

    expect(executeProgram({ a: 117440, b: 0, c: 0, input: [ 0, 3, 5, 4, 3, 0 ] }).output).toBe('0,3,5,4,3,0');

    expect(partTwo(getExampleInput(day, 2))).toBe(117440);
    expect(partTwo(getDayInput(day))).toBe(190384113204239);
});