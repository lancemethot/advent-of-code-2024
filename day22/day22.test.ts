import { getDayInput, getExampleInput } from '../utils';

const day = 'day22';

type Buyer = {
    generations: Generation[];
}

type Generation = {
    secret: bigint;
    price: number;
    change: number;
}

function mix(secret: bigint, value: bigint): bigint {
    return secret ^ value;
}

function prune(secret: bigint): bigint {
    return secret % 16777216n;
}

function step(secret: bigint): bigint {
    let acc: bigint = secret;
    acc = prune(mix(acc, acc * 64n));
    acc = prune(mix(acc, acc / 32n));
    return prune(mix(acc, acc * 2048n));
}

function stepTo(secret: bigint, steps: number): bigint {
    let acc: bigint = secret;
    for(let i = 0; i < steps; i++) {
        acc = step(acc);
    }
    return acc;
}

function price(secret: bigint): number {
    let str: string = String(secret);
    return Number.parseInt(str.charAt(str.length - 1));
}

function next(secret: bigint): Generation {
    let currentPrice: number = price(secret);
    let nextSecret: bigint = stepTo(secret, 1);
    let nextPrice: number = price(nextSecret);
    return {
        secret: nextSecret,
        price: nextPrice,
        change: nextPrice - currentPrice
    };
}

function getBuyerPatterns(buyer: Buyer, memo: Map<string, number[]>): void {
    const patterns: Set<string> = new Set();
    for(let i = 5; i < buyer.generations.length; i++) {
        let key: string = buyer.generations.slice(i - 4, i).map(gen => gen.change).join(',');

        if(patterns.has(key)) continue;
        patterns.add(key);

        if(memo.has(key)) {
            memo.get(key)?.push(buyer.generations[i-1].price);
        } else {
            memo.set(key, [ buyer.generations[i-1].price ]);
        }
    }
}

function partOne(input: string[]): bigint {
    const buyers: bigint[] = input.map(line => BigInt(line));
    return buyers.reduce((acc, buyer) => {
        return acc + stepTo(buyer, 2000);
    }, 0n);
}

function partTwo(input: string[]): number {

    const buyers: Buyer[] = input.map(line => {
        let secret: bigint = BigInt(line);
        let p: number = price(secret);
        let c: number = 0;
        return {
            generations: [ { secret, price: p, change: c }]
        } as Buyer;
    });

    const memo: Map<string, number[]> = new Map();
    buyers.forEach(buyer => {
        for(let i = 0; i <= 2000; i++) {
            buyer.generations.push(next(buyer.generations[i].secret));
        }
        getBuyerPatterns(buyer, memo);
    });

    return Array.from(memo.values()).reduce((acc, sequence) => {
        return Math.max(acc, sequence.reduce((acc, val) => acc + val, 0));
    }, 0);

}

test(day, () => {
    expect(mix(42n, 15n)).toBe(37n);
    expect(prune(100000000n)).toBe(16113920n);

    expect(stepTo(123n, 1)).toBe(15887950n);
    expect(stepTo(123n, 2)).toBe(16495136n);
    expect(stepTo(123n, 3)).toBe(527345n);
    expect(stepTo(123n, 4)).toBe(704524n);
    expect(stepTo(123n, 5)).toBe(1553684n);
    expect(stepTo(123n, 6)).toBe(12683156n);
    expect(stepTo(123n, 7)).toBe(11100544n);
    expect(stepTo(123n, 8)).toBe(12249484n);
    expect(stepTo(123n, 9)).toBe(7753432n);
    expect(stepTo(123n, 10)).toBe(5908254n);

    expect(partOne(getExampleInput(day))).toBe(37327623n);
    expect(partOne(getDayInput(day))).toBe(19458130434n);

    expect(partTwo(getExampleInput(day, 2))).toBe(23);
    expect(partTwo(getDayInput(day))).toBe(2130);
});