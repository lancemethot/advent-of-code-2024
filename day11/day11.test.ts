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

function transmute(stone: Stone): Stone[] {
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
    return transmuted.map(stone => removeLeadingZeroes(stone));
}

function blink(stones: Stone[]): Stone[] {
    const newStones: Stone[] = [];
    for(let i = 0; i < stones.length; i++) {
        newStones.push( ...transmute(stones[i]));
    }
    return newStones;
}

function partOne(input: string[]): number {
    let stones: Stone[] = parseInput(input);
    for(let i = 0; i < 25; i++) {
        stones = blink(stones);
    }
    return stones.length;
}

function partTwo(input: string[]): number {
    let stones: Stone[] = parseInput(input);
    for(let i = 0; i < 75; i++) {
        stones = blink(stones);
        debug(`Blink ${i + 1}: ${stones.length}`, day);
    }
    return stones.length;
}

test(day, ()=> {
    debug(`Day ${day}: ${new Date()}\n`, day, false);
    expect(partOne(getExampleInput(day))).toBe(55312);
    expect(partOne(getDayInput(day))).toBe(191690);

    //expect(partTwo(getDayInput(day))).toBe(0);
});