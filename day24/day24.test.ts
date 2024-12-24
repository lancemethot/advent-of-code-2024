import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day24';

type Gate = {
    inputs: string[];
    operation: string;
    output: string;
}

function parseInput(input: string[]): { wires: Map<string, number | null>, gates: Gate[] } {
    let gates: boolean = false;
    return input.reduce((acc, line) => {
        if(line.trim().length === 0) {
            gates = true;
        } else {
            if(gates) {
                let parts: string[] = line.split('->');
                let subparts: string[] = parts[0].split(' ');
                let wires: string[] = [ subparts[0], subparts[2], parts[1] ].map(p => p.trim());
                acc.gates.push({ inputs: [ wires[0], wires[1].trim()], operation: subparts[1].trim(), output: wires[2],
                } as Gate);
                wires.forEach(wire => { if(!acc.wires.has(wire)) acc.wires.set(wire, null); });
            } else {
                acc.wires.set(line.split(':')[0], Number.parseInt(line.split(':')[1]));
            }
        }
        return acc;
    }, { wires: new Map<string, number | null>(), gates: [] as Gate[]});
}

function simulate(wires: Map<string, number | null>, gates: Gate[]): Map<string, number | null> {
    for(let g = 0; g < gates.length; g++) {
        let gate: Gate = gates[g];
        let output: number | null = wires.get(gate.output)!;
        if(output === null) {
            let first: number | null = wires.get(gate.inputs[0])!;
            let second: number | null = wires.get(gate.inputs[1])!;
            if(first !== null && second !== null) {
                let result: number;
                switch(gate.operation) {
                    case "AND": result = first && second ? 1 : 0; break;
                    case "OR": result = first || second ? 1 : 0; break;
                    case "XOR": result = first !== second ? 1 : 0; break;
                    default: result = -1;
                }
                wires.set(gate.output, result);
                g = -1; // restart gate loop
            }
        }
    }
    return wires;
}

function partOne(input: string[]): number {
    const { wires, gates } = parseInput(input);
    const output: Map<string, number | null> = simulate(wires, gates);
    let zout: string = Array.from(output.keys())
        .filter(wire => wire.startsWith('z'))
        .sort((a,b) => b.localeCompare(a))
        .map(wire => `${output.get(wire)!}`)
        .join('');
    return Number.parseInt(zout, 2);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n`, day, false);

    expect(partOne(getExampleInput(day, 1))).toBe(4);
    expect(partOne(getExampleInput(day, 2))).toBe(2024);
    expect(partOne(getDayInput(day))).toBe(36902370467952);
})
