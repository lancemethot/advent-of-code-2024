import { HeapItem, MinHeap } from './utils';

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