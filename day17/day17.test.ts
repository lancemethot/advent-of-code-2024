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

type Execution = Registers & {
    input: number[];
    pointer: number;
    output: string;
}

function parseInstructions(line: string): Instruction[] {
    return line.trim().split(',').reduce((acc, instruction, index, instructions) => {
        if(index % 2 === 1) {
            acc.push({ 
                opcode: Number.parseInt(instructions[index - 1]),
                operand: Number.parseInt(instruction),
            });
        }
        return acc;
    }, [] as Instruction[] );
}

function parseInput(input: string[]): Execution[] {
    return input.reduce((acc, line, index) => {
        if(line.startsWith('Register A:')) {
            acc.push({
                a: Number.parseInt(line.split(':')[1].trim()),
                b: Number.parseInt(input[index+1].split(':')[1].trim()),
                c: Number.parseInt(input[index+2].split(':')[1].trim()),
                input: [],
                pointer: 0,
                output: '',
            });
        } else if(line.startsWith('Program:')) {
            acc[acc.length - 1].input = line.split(':')[1].trim().split(',').map(i => Number.parseInt(i));
        }
        return acc;
    }, [] as Execution[]);
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
    let combo = comboOperand(program, operand) % 8;
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

function executeProgram(program: Execution): Execution {
    let pointer = program.pointer;
    while(pointer < program.input.length - 1) {
        program = executeInstruction(program);
        pointer = program.pointer;
    }
    return program;
}

function partOne(input: string[]): string {
    const execution: Execution[] = parseInput(input);
    return executeProgram(execution[0]).output;
}

test(day, () => {
    debug(`${day} ${new Date()}\n`, day, false);

    expect(executeProgram({ a: 0, b: 0, c: 9, input: [ 2, 6 ], output: '', pointer: 0 }).b).toBe(1);
    expect(executeProgram({ a: 10, b: 0, c: 0, input: [ 5, 0, 5, 1, 5, 4 ], output: '', pointer: 0 }).output).toBe('0,1,2');
    expect(executeProgram({ a: 2024, b: 0, c: 0, input: [ 0, 1, 5, 4, 3, 0 ], output: '', pointer: 0 }).output).toBe('4,2,5,6,7,7,7,7,3,1,0');
    expect(executeProgram({ a: 2024, b: 0, c: 0, input: [ 0, 1, 5, 4, 3, 0 ], output: '', pointer: 0 }).a).toBe(0);
    expect(executeProgram({ a: 0, b: 29, c: 0, input: [ 1, 7 ], output: '', pointer: 0 }).b).toBe(26);
    expect(executeProgram({ a: 0, b: 2024, c: 43690, input: [ 4, 0 ], output: '', pointer: 0 }).b).toBe(44354);

    expect(partOne(getExampleInput(day))).toBe('4,6,3,5,6,3,5,2,1,0');
    expect(partOne(getDayInput(day))).toBe('7,1,3,7,5,1,0,3,4');
});