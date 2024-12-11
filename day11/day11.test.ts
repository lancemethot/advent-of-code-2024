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

function blink(stones: Stone[]): Stone[] {
    const newStones: Stone[] = [];
    for(let i = 0; i < stones.length; i++) {
        if(stones[i].engraving === '0') {
            newStones.push({
                engraving: '1'
            });
        } else if((stones[i].engraving.length % 2) === 0) {
            newStones.push({
                engraving: stones[i].engraving.substring(0, stones[i].engraving.length / 2)
            });
            newStones.push({
                engraving: stones[i].engraving.substring(stones[i].engraving.length / 2)
            })
            let last = newStones.length - 1;
            while(newStones[last].engraving.startsWith('0') && newStones[last].engraving !== '0') {
                newStones[last].engraving = newStones[last].engraving.substring(1);
            }
        } else {
            newStones.push({
                engraving: String(Number.parseInt(stones[i].engraving) * 2024)
            });
        }
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

test(day, ()=> {
    debug(`Day ${day}: ${new Date()}\n`, day, false);
    expect(partOne(getExampleInput(day))).toBe(55312);
    expect(partOne(getDayInput(day))).toBe(191690);
});