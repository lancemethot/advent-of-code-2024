import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day24';

type Wires = Map<string, number | null>;

type Gate = {
    inputs: string[];
    operation: string;
    output: string;
}

function parseInput(input: string[]): { wires: Wires, gates: Gate[] } {
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
    }, { wires: new Map(), gates: [] as Gate[]});
}

function isDirect(gate: Gate): boolean {
    return gate.inputs[0].startsWith('x') || gate.inputs[1].startsWith('x');
}

function isOutput(gate: Gate): boolean {
    return gate.output.startsWith('z');
}

function isGate(type: string) {
    return (gate: Gate) => gate.operation === type;
}

function hasOutput(output: string) {
    return (gate: Gate) => gate.output === output;
}

function hasInput(input: string) {
    return (gate: Gate) => gate.inputs[0] === input || gate.inputs[1] === input;
}

function simulate(wires: Wires, gates: Gate[]): Wires {
    let simulated: Wires = new Map(wires);
    for(let g = 0; g < gates.length; g++) {
        let gate: Gate = gates[g];
        let output: number | null = simulated.get(gate.output)!;
        if(output === null) {
            let first: number | null = simulated.get(gate.inputs[0])!;
            let second: number | null = simulated.get(gate.inputs[1])!;
            if(first !== null && second !== null) {
                let result: number;
                switch(gate.operation) {
                    case "AND": result = first && second ? 1 : 0; break;
                    case "OR": result = first || second ? 1 : 0; break;
                    case "XOR": result = first !== second ? 1 : 0; break;
                    default: result = -1;
                }
                simulated.set(gate.output, result);
                g = -1; // restart gate loop
            }
        }
    }
    return simulated;
}

function partOne(input: string[]): number {
    const { wires, gates } = parseInput(input);
    const output: Wires = simulate(wires, gates);
    let zout: string = Array.from(output.keys())
        .filter(wire => wire.startsWith('z'))
        .sort((a,b) => b.localeCompare(a))
        .map(wire => `${output.get(wire)!}`)
        .join('');
    return Number.parseInt(zout, 2);
}

// Add comments
// full adder
function partTwo(input: string[]): string {
    const { wires, gates } = parseInput(input);
    const badGates: Set<string> = new Set<string>();
    const bitCount = Array.from(wires.keys()).filter(wire => wire.startsWith('x')).length;

    // Bad gate check #1
    // Check XOR gates with 'x' inputs for 'z' outputs
    // The only allowable one is x00 can go to z00.
    const xorXs = gates.filter(isDirect).filter(isGate("XOR"));
    xorXs.forEach(gate => {
        if(gate.inputs[0] === 'x00' || gate.inputs[1] === 'x00') {
            if(gate.output !== 'z00') badGates.add(gate.output);
            return;
        } else if(gate.output === 'z00') {
            badGates.add(gate.output);
        }
        if(isOutput(gate)) badGates.add(gate.output);
    });

    // Bad gate check #2
    // XOR gates without 'x' inputs
    // These should output to 'z'
    const xorOthers = gates.filter(isGate("XOR")).filter((gate) => !isDirect(gate));
    xorOthers.forEach(gate => {
        if(!isOutput(gate)) badGates.add(gate.output);
    });

    // Bad gate check #3
    // Check all 'z' output gates
    // If the output is the last 'z' (e.g. z45), then it must be an OR gate
    // Otherwise 'z' output gates should be XOR operations
    const outputGates = gates.filter(isOutput);
    outputGates.forEach(gate => {
        const isLast = gate.output === `z${bitCount}`.padStart(3, "0");
        if(isLast) {
            if (gate.operation !== "OR") badGates.add(gate.output);
        } else if(gate.operation !== "XOR") {
            badGates.add(gate.output);
        }
    });

    // Bad gate check #4
    // all XOR 'x' gates MUST output to a XOR 'other' gate
    // except for z00
    let checkNext: Gate[] = [];
    xorXs.forEach(gate => {
        //if we've already flagged this, skip
        if (badGates.has(gate.output)) return;
        //if the output is z00, skip
        if (gate.output === "z00") return;

        const matches = xorOthers.filter(hasInput(gate.output));
        if (matches.length === 0) {
            checkNext.push(gate);
            badGates.add(gate.output);
        }
    });

    // Bad gate check #5
    // check what the flagged gates should be
    checkNext.forEach(gate => {
        //the inputs should be An and Bn, so the output of this gate *should* go to an xorOther that outputs Zn
        const intendedResult = `z${gate.inputs[0].slice(1)}`;
        const matches = xorOthers.filter(hasOutput(intendedResult));
        const match: Gate = matches[0];

        const toCheck = [match.inputs[0], match.inputs[1]];

        //one of these should come from an OR gate
        const orMatches = gates
            .filter(isGate("OR"))
            .filter((gate) => toCheck.includes(gate.output));

        const orMatchOutput = orMatches[0].output;

        //the correct output is the one that isn't OrMatchOutput
        const correctOutput = toCheck.find((output) => output !== orMatchOutput) as string;
        badGates.add(correctOutput);
    });

    return Array.from(badGates).sort((a, b) => a.localeCompare(b)).join(',');
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n`, day, false);

    expect(partOne(getExampleInput(day, 1))).toBe(4);
    expect(partOne(getExampleInput(day, 2))).toBe(2024);
    expect(partOne(getDayInput(day))).toBe(36902370467952);

    expect(partTwo(getDayInput(day))).toBe('cvp,mkk,qbw,wcb,wjb,z10,z14,z34');
})
