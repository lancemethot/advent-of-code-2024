import { debug, getDayInput, getExampleInput, HeapItem, MinHeap } from '../utils';

const day = 'day21';

type Coord = {
    x: number;
    y: number;
}

type Vector = Coord & {
    direction: string;
}

type Walk = Button & {
    paths: Path[];
};

type Path = Vector & HeapItem & {
    trail: string;
    directionChanges: number;
}

type Presses = HeapItem & {
    code: string;
    sequence: string;
}

type Button = Coord & {
    label: string;
}

function getKeypad(layout: string[]): Button [][] {
    return layout.reduce((acc, line, x) => {
        acc.push(line.split('').map((label, y) => { return { x, y, label } as Button}));
        return acc;
    }, [] as Button[][]);
}

function findButton(keypad: Button[][], label: string): Button {
    return keypad.reduce((acc, row, x) => {
        return row.reduce((acc, col, y) => { return col.label === label ? col : acc; }, acc);
    }, { x: 0, y: 0, label: "A" } as Button);
}

function isInBounds(keypad: Button[][], position: Coord): boolean {
    return position.x >= 0 && position.y >= 0 && position.x < keypad.length && position.y < keypad[0].length;
}

function moves(keypad: Button[][], position: Coord): Vector[] {
    return [
        { x: position.x, y: position.y - 1, direction: '<' },
        { x: position.x - 1, y: position.y, direction: '^' },
        { x: position.x + 1, y: position.y, direction: 'v' },
        { x: position.x, y: position.y + 1, direction: '>' }
    ].filter(coord => isInBounds(keypad, coord))
     .filter(coord => keypad[coord.x][coord.y].label !== ' ');
}

function dijkstra(keypad: Button[][], start: Button, end: Button, memo: Map<string, string[]>): string [] {
    let key: string = `${start.label} ${end.label}`;

    if(memo.has(key)) return memo.get(key)!;
    if(start.label === end.label) { memo.set(key, [ "A" ]); return memo.get(key)!; }

    let visited: Walk[][] = keypad.map(row => row.map(button => { return { ...button, paths: [] } as Walk }));

    let heap: MinHeap<Path> = new MinHeap();
    moves(keypad, start).forEach(move => {
        heap.insert({ ... start, direction: move.direction, trail: '', size: 0, directionChanges: 0 });
    });

    while(heap.size() > 0) {
        let path = heap.extractMin();
        let distance = path.size + 1;
        moves(keypad, path).forEach(move => {
            let shortestPath: number = visited[move.x][move.y].paths.reduce((acc, path) => {
                return Math.min(acc, path.size);
            }, Number.MAX_VALUE);
            if(distance <= shortestPath) {
                let previousDirection = path.trail.length === 0 ? move.direction : path.trail[path.trail.length - 1];
                let directionChanges = path.directionChanges + (previousDirection !== move.direction ? 1 : 0);
                if(directionChanges < 2) {
                    let p: Path = { ...move, size: distance, trail: path.trail + move.direction, directionChanges };
                    visited[move.x][move.y].paths.push(p);
                    heap.insert(p);
                }
            }
        });
    }

    let shortest: number = visited[end.x][end.y].paths.reduce((acc, path) => Math.min(acc, path.size), Number.MAX_VALUE);
    let sequences: string[] = visited[end.x][end.y].paths.filter(path => path.size === shortest).map(path => path.trail + 'A');
    memo.set(key, Array.from(new Set(sequences)));
    return memo.get(key)!;
}

function determineSequences(code: string, keypad: Button[][], memo: Map<string, string[]>): string [] {
    if(memo.has(code)) return memo.get(code)!;
    let sequences: string[] = [];
    let heap: MinHeap<Presses> = new MinHeap<Presses>();
    heap.insert({ code: 'A'+code, size: 0, sequence: '' });
    while(heap.size() > 0) {
        let presses: Presses = heap.extractMin();
        if(presses.size === presses.code.length - 1) { sequences.push(presses.sequence); continue; }
        let current: Button = findButton(keypad, presses.code.charAt(presses.size));
        let next: Button = findButton(keypad, presses.code.charAt(presses.size + 1));
        dijkstra(keypad, current, next, memo).forEach(sequence => {
            heap.insert({ code: presses.code, size: presses.size + 1, sequence: presses.sequence + sequence });
        });
    }
    let shortest: number = sequences.reduce((acc, sequence) => Math.min(acc, sequence.length), Number.MAX_VALUE);
    memo.set(code, sequences.filter(sequence => sequence.length === shortest));
    return memo.get(code)!;
}

function operateRobot(codes: string[], keypad: Button[][], memo: Map<string, string[]>): string[] {
    return codes.reduce((acc, code) => {
        let parts: string[] = code.split('A');
        parts.pop();
        let sequences: string[] = [];
        parts.forEach(part => {
            let seqs: string[] = determineSequences(part + 'A', keypad, memo);
            if(sequences.length === 0) sequences.push(... seqs);
            else {
                let old: string[] = [ ... sequences ];
                sequences = seqs.reduce((acc, seq) => {
                    acc.push(... old.map(o => `${o}${seq}`));
                    return acc;
                }, [] as string[]);
            }
        });
        acc.push(... sequences);
        return acc;
    }, [] as string[]);
}

function enterCode(code: string, numericKeypad: Button[][], directionKeypad: Button[][], memo: Map<string, string[]>): string {
    let sequencesForDoor: string[] = determineSequences(code, numericKeypad, memo);
    let sequencesForDoorRobot: string[] = operateRobot(sequencesForDoor, directionKeypad, memo);
    let sequencesForProxyRobot: string[] = operateRobot(sequencesForDoorRobot, directionKeypad, memo);
    return sequencesForProxyRobot.sort((a, b) => a.length - b.length)[0];
}

function partOne(input: string[]): number {
    const numericKeypad: Button[][] = getKeypad([ "789", "456", "123", " 0A"]);
    const directionKeypad: Button[][] = getKeypad([" ^A", "<v>"]);
    const memo: Map<string, string[]> = new Map<string, string[]>();
    return input.reduce((acc, code) => {
        let sequence = enterCode(code, numericKeypad, directionKeypad, memo);
        return acc + (sequence.length * Number.parseInt(code.substring(0, code.length - 1)));
    }, 0);
}

test(day, () => {
    debug(`[**${day}**] - ${new Date()}\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(126384);
    expect(partOne(getDayInput(day))).toBe(0);
});