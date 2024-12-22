import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day22';

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

function partOne(input: string[]): bigint {
    const buyers: bigint[] = input.map(line => BigInt(line));
    return buyers.reduce((acc, buyer) => {
        return acc + stepTo(buyer, 2000);
    }, 0n);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}`, day, false);

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
});