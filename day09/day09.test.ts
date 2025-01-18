import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = "day09";

type DiskItem = {
    id: number;
    length: number;
}

function parseInput(input: string[]): DiskItem[] {
    let id = 0;
    return input[0].split('').reduce((acc, chr, idx) => {
        let length = Number.parseInt(chr);
        if(idx % 2 === 0) {
            acc.push({ id, length});
            id++;
        } else {
            acc.push({ id: -1, length});
        }
        return acc;
    }, [] as DiskItem[]);
}

function explode(disk: DiskItem[]): DiskItem[] {
    return disk.reduce((acc, item) => {
        for(let i = 0; i < item.length; i++) {
            acc.push({ id: item.id, length: item.length });
        }
        return acc;
    }, [] as DiskItem[]);
}

function compress(disk: DiskItem[]): DiskItem[] {
    const compressed = explode(disk);
    let forward = 0;
    let backward = compressed.length - 1;
    while(forward < backward) {
        while(compressed[forward].id !== -1) forward++;
        while(compressed[backward].id === -1) backward--;
        if(forward < backward) {
            compressed[forward].id = compressed[backward].id;
            compressed[backward].id = -1;
        }
    }
    return compressed;
}

function compress2(disk: DiskItem[]): DiskItem[] {
    let backward = disk.length - 1;
    while(backward > 0) {
        while(disk[backward].id === -1) backward--;

        let forward = 0;

        // find an open spot
        while(forward < backward && (disk[forward].id !== -1 || disk[forward].length < disk[backward].length)) forward++;

        // if found, swap
        if(forward < backward) {
            let leftover = disk[forward].length - disk[backward].length;
            disk[forward].id = disk[backward].id;
            disk[forward].length = disk[backward].length;
            disk[backward].id = -1;
            // add back any leftover spaces
            if(leftover > 0) {
                if(disk[forward+1].id === -1) {
                    disk[forward+1].length += leftover;
                } else {
                    disk.splice(forward + 1, 0, {
                        id: -1,
                        length: leftover,
                    });
                }
            }
        } else {
            // no room found, so don't swap
            backward--;
        }
    }
    return explode(disk);
}

function partOne(input: string[]): number {
    return compress(parseInput(input)).reduce((acc, item, index) => {
        return acc += item.id < 0 ? 0 : item.id * index;
    }, 0);
}

function partTwo(input: string[]): number {
    return compress2(parseInput(input)).reduce((acc, item, index) => {
        return acc += item.id < 0 ? 0 : item.id * index;
    }, 0);
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(1928);
    expect(partOne(getDayInput(day))).toBe(6370402949053);

    expect(partTwo(getExampleInput(day))).toBe(2858);
    expect(partTwo(getDayInput(day))).toBe(6398096697992);
})