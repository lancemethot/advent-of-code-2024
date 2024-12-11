import { debug, getDayInput, getExampleInput } from '../utils';

const day = "day11";

type Stone = {
    engraving: string;
}

function parseInput(input: string[]): Stone[] {
    return input.reduce((acc, line) => {
        acc.push(... line.split(' ')
                .filter(part => part.trim().length > 0)
                .map(stone => {
                    return {
                        engraving: stone
                    }
                }));
        return acc;
    }, [] as Stone[]);
}

function removeLeadingZeroes(stone: Stone): Stone {
    while(stone.engraving.startsWith('0') && stone.engraving !== '0') {
        stone.engraving = stone.engraving.substring(1);
    }
    return stone;
}

const mutations: Map<string, Stone[]> = new Map<string, Stone[]>();
function transmute(stone: Stone): Stone[] {
    if(!mutations.has(stone.engraving)) {
        const transmuted: Stone[] = [];
        if(stone.engraving === '0') {
            transmuted.push({
                engraving: '1'
            });
        } else if((stone.engraving.length % 2) === 0) {
            transmuted.push({
                engraving: stone.engraving.substring(0, stone.engraving.length / 2)
            });
            transmuted.push({
                engraving: stone.engraving.substring(stone.engraving.length / 2)
            })
        } else {
            transmuted.push({
                engraving: String(Number.parseInt(stone.engraving) * 2024)
            });
        }
        mutations.set(stone.engraving, transmuted.map(stone => removeLeadingZeroes(stone)));
    }
    return mutations.get(stone.engraving)!;
}

function blink(stones: Stone[]): Stone[] {
    const newStones: Stone[] = [];
    for(let i = 0; i < stones.length; i++) {
        newStones.push( ...transmute(stones[i]));
    }
    return newStones;
}

function rapidBlink(stones: Stone[], times: number) {
    let blinked: Stone[] = stones;
    for(let i = 0; i < times; i++) {
        blinked = blink(blinked);
    }
    return blinked;
}
function partOne(input: string[]): number {
    return rapidBlink(parseInput(input), 25).length;
}

function partTwo(input: string[]): number {
    // write a function to mutate numbers in N generations
    // e.g. mutate(engraving, 5);
    // loop 15 times:
    //    collect all from the latest generation
    //    mutate collection another 5 generations
    //
    // answer is the # within the last collection
    return rapidBlink(parseInput(input), 75).length;
}

test(day, ()=> {
    debug(`Day ${day}: ${new Date()}\n`, day, false);
    expect(partOne(getExampleInput(day))).toBe(55312);
    expect(partOne(getDayInput(day))).toBe(191690);

    // expect(partTwo(getExampleInput(day))).toBe(0);
});