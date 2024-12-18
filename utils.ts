import * as fs from "fs";

export function getInputLines(inputFile: string): string [] {
    const input = fs.readFileSync(inputFile, "utf8");
    return input.split("\n");
}

export function getExampleInput(day: string, part?: number): string [] {
    return getInputLines(`./${day}/${day}-example${part ? `-${part}` : ''}.txt`);
}

export function getDayInput(day: string, part?: number): string [] {
    return getInputLines(`./${day}/${day}-input${part ? `-${part}` : ''}.txt`);
}

export function removeEmptyLines(lines: string[]): string[] {
    return lines.filter((line) => line.trim().length > 0);
}

export function debug(message: string, day: string, append: boolean = true) {
    if(append) {
        fs.appendFileSync(`${day}/${day}.debug`, message+'\n');
    } else {
        fs.writeFileSync(`${day}/${day}.debug`, message);
    }
}


export type HeapItem = {
    size: number;
}

export class MinHeap<T extends HeapItem> {

    private heap: T[] = [];
    
    constructor() {
        this.heap = [];
    }

    insert(item: T) {
        this.heap.push(item);
        this.bubbleUp(this.heap.length -1);
    }

    extractMin(): T {
        const min = this.heap[0];
        const last = this.heap.pop()!;
        if(this.heap.length > 0) {
            this.heap[0] = last;
            this.bubbleDown(0);
        }
        return min;
    }

    bubbleUp(i: number) {
        const parent = Math.floor((i - 1) / 2);
        if( i > 0 && this.heap[i].size < this.heap[parent].size) {
            this.swap(i, parent);
            this.bubbleUp(parent);
        }
    }

    bubbleDown(i: number) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let min = i;
        if(left < this.heap.length && this.heap[left].size < this.heap[min].size) {
            min = left;
        }
        if(right < this.heap.length && this.heap[right].size < this.heap[min].size) {
            min = right;
        }
        if(min !== i) {
            this.swap(i, min);
            this.bubbleDown(min);
        }
    }

    swap(i: number, j: number) {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }

    size(): number {
        return this.heap.length;
    }

}