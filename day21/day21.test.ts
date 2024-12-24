import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day21';

const pairMemo: Map<string, string> = new Map();
pairMemo.set('A0', '<A');
pairMemo.set('0A', '>A');
pairMemo.set('A1', '^<<A');
pairMemo.set('1A', '>>vA');
pairMemo.set('A2', '<^A');
pairMemo.set('2A', 'v>A');
pairMemo.set('A3', '^A');
pairMemo.set('3A', 'vA');
pairMemo.set('A4', '^^<<A');
pairMemo.set('4A', '>>vvA');
pairMemo.set('A5', '<^^A');
pairMemo.set('5A', 'vv>A');
pairMemo.set('A6', '^^A');
pairMemo.set('6A', 'vvA');
pairMemo.set('A7', '^^^<<A');
pairMemo.set('7A', '>>vvvA');
pairMemo.set('A8', '<^^^A');
pairMemo.set('8A', 'vvv>A');
pairMemo.set('A9', '^^^A');
pairMemo.set('9A', 'vvvA');
pairMemo.set('01', '^<A');
pairMemo.set('10', '>vA');
pairMemo.set('02', '^A');
pairMemo.set('20', 'vA');
pairMemo.set('03', '^>A');
pairMemo.set('30', '<vA');
pairMemo.set('04', '^<^A');
pairMemo.set('40', '>vvA');
pairMemo.set('05', '^^A');
pairMemo.set('50', 'vvA');
pairMemo.set('06', '^^>A');
pairMemo.set('60', '<vvA');
pairMemo.set('07', '^^^<A');
pairMemo.set('70', '>vvvA');
pairMemo.set('08', '^^^A');
pairMemo.set('80', 'vvvA');
pairMemo.set('09', '^^^>A');
pairMemo.set('90', '<vvvA');
pairMemo.set('12', '>A');
pairMemo.set('21', '<A');
pairMemo.set('13', '>>A');
pairMemo.set('31', '<<A');
pairMemo.set('14', '^A');
pairMemo.set('41', 'vA');
pairMemo.set('15', '^>A');
pairMemo.set('51', '<vA');
pairMemo.set('16', '^>>A');
pairMemo.set('61', '<<vA');
pairMemo.set('17', '^^A');
pairMemo.set('71', 'vvA');
pairMemo.set('18', '^^>A');
pairMemo.set('81', '<vvA');
pairMemo.set('19', '^^>>A');
pairMemo.set('91', '<<vvA');
pairMemo.set('23', '>A');
pairMemo.set('32', '<A');
pairMemo.set('24', '<^A');
pairMemo.set('42', 'v>A');
pairMemo.set('25', '^A');
pairMemo.set('52', 'vA');
pairMemo.set('26', '^>A');
pairMemo.set('62', '<vA');
pairMemo.set('27', '<^^A');
pairMemo.set('72', 'vv>A');
pairMemo.set('28', '^^A');
pairMemo.set('82', 'vvA');
pairMemo.set('29', '^^>A');
pairMemo.set('92', '<vvA');
pairMemo.set('34', '<<^A');
pairMemo.set('43', 'v>>A');
pairMemo.set('35', '<^A');
pairMemo.set('53', 'v>A');
pairMemo.set('36', '^A');
pairMemo.set('63', 'vA');
pairMemo.set('37', '<<^^A');
pairMemo.set('73', 'vv>>A');
pairMemo.set('38', '<^^A');
pairMemo.set('83', 'vv>A');
pairMemo.set('39', '^^A');
pairMemo.set('93', 'vvA');
pairMemo.set('45', '>A');
pairMemo.set('54', '<A');
pairMemo.set('46', '>>A');
pairMemo.set('64', '<<A');
pairMemo.set('47', '^A');
pairMemo.set('74', 'vA');
pairMemo.set('48', '^>A');
pairMemo.set('84', '<vA');
pairMemo.set('49', '^>>A');
pairMemo.set('94', '<<vA');
pairMemo.set('56', '>A');
pairMemo.set('65', '<A');
pairMemo.set('57', '<^A');
pairMemo.set('75', 'v>A');
pairMemo.set('58', '^A');
pairMemo.set('85', 'vA');
pairMemo.set('59', '^>A');
pairMemo.set('95', '<vA');
pairMemo.set('67', '<<^A');
pairMemo.set('76', 'v>>A');
pairMemo.set('68', '<^A');
pairMemo.set('86', 'v>A');
pairMemo.set('69', '^A');
pairMemo.set('96', 'vA');
pairMemo.set('78', '>A');
pairMemo.set('87', '<A');
pairMemo.set('79', '>>A');
pairMemo.set('97', '<<A');
pairMemo.set('89', '>A');
pairMemo.set('98', '<A');
pairMemo.set('<^', '>^A');
pairMemo.set('^<', 'v<A');
pairMemo.set('<v', '>A');
pairMemo.set('v<', '<A');
pairMemo.set('<>', '>>A');
pairMemo.set('><', '<<A');
pairMemo.set('<A', '>>^A');
pairMemo.set('A<', 'v<<A');
pairMemo.set('^v', 'vA');
pairMemo.set('v^', '^A');
pairMemo.set('^>', 'v>A');
pairMemo.set('>^', '<^A');
pairMemo.set('^A', '>A');
pairMemo.set('A^', '<A');
pairMemo.set('v>', '>A');
pairMemo.set('>v', '<A');
pairMemo.set('vA', '^>A');
pairMemo.set('Av', '<vA');
pairMemo.set('>A', '^A');
pairMemo.set('A>', 'vA');

const sequenceMap: Map<string, number> = new Map();
function getSequenceLength(sequence: string, depth: number): number {
    let key: string = `${sequence}-D${depth}`;
    if(sequenceMap.has(key)) {
        return sequenceMap.get(key)!;
    }

    let length: number = 0;
    if(depth === 0) {
        length = sequence.length;
    } else {
        let current: string = 'A';
        for(let i = 0; i < sequence.length; i++) {
            let next: string = sequence[i];
            let len: number = getMoveCount(current, next, depth);
            current = next;
            length += len;
        }
    }

    sequenceMap.set(key, length);
    return length;
}

function getMoveCount(current: string, next: string, depth: number): number {
    if(current === next) return 1;
    let sequence: string = pairMemo.get(`${current}${next}`)!;
    return getSequenceLength(sequence, depth - 1);
}

function partOne(input: string[]): number {
    return input.reduce((acc, code) => {
        let sequence: number = getSequenceLength(code, 3);
        return acc + (sequence * Number.parseInt(code.substring(0, code.length - 1)));
    }, 0);
}

function partTwo(input: string[]): number {
    return input.reduce((acc, code) => {
        let length = getSequenceLength(code, 26);
        return acc + (length * Number.parseInt(code.substring(0, code.length - 1)));
    }, 0);
}

test(day, () => {
    debug(`[**${day}**] - ${new Date()}\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(126384);
    expect(partOne(getDayInput(day))).toBe(176650);

    expect(partTwo(getExampleInput(day))).toBe(154115708116294);
    expect(partTwo(getDayInput(day))).toBe(217698355426872);
});