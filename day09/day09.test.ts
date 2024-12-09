import { debug, getDayInput, getExampleInput } from '../utils';

const day = "day09";

type DiskItem = {
    id: number;
}

function parseInput(input: string[]): DiskItem[] {
    let id = 0;
    return input[0].split('').reduce((acc, chr, idx) => {
        let length = Number.parseInt(chr);
        if(idx % 2 === 0) {
            for(let i = 0; i < length; i++) {
                acc.push({ id })
            }
            id++;
            // add id x length for files
            // increment id
        } else {
            // add -1 x length for spaces
            for(let i = 0; i < length; i++) {
                acc.push({ id: -1});
            }
        }
        return acc;
    }, [] as DiskItem[]);
}

function compress(disk: DiskItem[]): DiskItem[] {
    let forward = 0;
    let backward = disk.length - 1;
    while(forward < backward) {
        while(disk[forward].id !== -1) forward++;
        while(disk[backward].id === -1) backward--;
        if(forward < backward) {
            disk[forward].id = disk[backward].id;
            disk[backward].id = -1;
        }
    }
    return disk;
}

function partOne(input: string[]): number {
    return compress(parseInput(input)).reduce((acc, item, index) => {
        return acc += item.id < 0 ? 0 : item.id * index;
    }, 0);
}

test(day, () => {
    debug(`Date: ${new Date()}`, day, false);
    expect(partOne(getExampleInput(day))).toBe(1928);
    expect(partOne(getDayInput(day))).toBe(6370402949053);
})