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

test('MinHeap', () => {

    const testPaths: HeapItem[] = [
        { size: 5 },
        { size: 3 },
        { size: 1 },
        { size: 4 },
        { size: 2 }
    ];

    const heap = new MinHeap();
    testPaths.forEach(path => heap.insert(path));

    expect(heap.extractMin()).toEqual({ size: 1 });
    expect(heap.extractMin()).toEqual({ size: 2 });
    expect(heap.extractMin()).toEqual({ size: 3 });
    expect(heap.extractMin()).toEqual({ size: 4 });
    expect(heap.extractMin()).toEqual({ size: 5 });
    
})