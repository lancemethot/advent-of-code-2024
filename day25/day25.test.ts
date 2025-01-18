import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day25';

type Lock = { height: number, columns: number [] };
type Key = { height: number, columns: number[] };

function parseLock(input: string[]): Lock {
    let lock: Lock = { height: input.length - 1, columns: Array(5).fill(-1) };
    input.forEach(line => {
        line.split('').forEach((c, i) => lock.columns[i] = (c === '#') ? lock.columns[i] + 1 : lock.columns[i]);
    });
    return lock;
}

function parseKey(input: string[]): Key {
    let key: Key = { height: input.length - 1, columns: Array(5).fill(input.length - 1) };
    input.forEach(line => {
        line.split('').forEach((c, i) => key.columns[i] = (c === '.') ? key.columns[i] - 1 : key.columns[i]);
    });
    return key;
}

function parseInput(input: string[]): { locks: Lock[], keys: Key[] } {
    return input.reduce((acc, line) => {
        if(line.trim().length === 0) acc.push([]);
        else acc[acc.length - 1].push(line);
        return acc;
    }, [[]] as string[][])
    .reduce((acc, item) => {
        if(item[0] === '.....' && item[item.length - 1] === '#####') {
            acc.keys.push(parseKey(item));
        } else {
            acc.locks.push(parseLock(item));
        }
        return acc;
    }, { locks: [] as Lock[], keys: [] as Key[] });
}

function fits(lock: Lock, key: Key): boolean {
    return lock.columns.reduce((acc, tumbler, index) => {
        return acc && (key.columns[index] + tumbler) < lock.height;
    }, true);
}

function partOne(input: string[]): number {
    const { locks, keys } = parseInput(input);
    return locks.reduce((acc, lock) => {
        return acc + keys.reduce((acc, key) => acc + (fits(lock, key) ? 1 : 0), 0);
    }, 0);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(3);
    expect(partOne(getDayInput(day))).toBe(2885);
});