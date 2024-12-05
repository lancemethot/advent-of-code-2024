import { getDayInput, getExampleInput } from '../utils';

const day = "day05";

type Rule = {
    first: number;
    second: number;
}

type Update = {
    pageNumbers: number[];
}

function parseInput(input: string[]): { rules: Rule[], updates: Update[] } {
    const rules: Rule[] = [];
    const updates: Update[] = [];
    let split = false;

    input.forEach(line => {
        if(line.trim().length === 0) {
            split = true;
            return;
        }

        if(split) {
            updates.push({
                pageNumbers: line.split(',').map(n => Number.parseInt(n))
            });
        } else {
            let rule: number[] = line.split('|').map(n => Number.parseInt(n));
            rules.push({
                first: rule[0],
                second: rule[1],
            });
        }
    });

    return {
        rules,
        updates
    }
}

function isInRightOrder(rule: Rule, update: Update): boolean {
    let firstIndex = update.pageNumbers.indexOf(rule.first);
    let secondIndex = update.pageNumbers.indexOf(rule.second);
    if(firstIndex !== -1 && secondIndex !== -1) {
        return firstIndex < secondIndex;
    }
    return true;
}

function isAllInRightOrder(rules: Rule[], update: Update): boolean {
    return rules.reduce((acc, rule) => {
        return acc && isInRightOrder(rule, update);
    }, true);
}

function getMiddlePart(update: Update): number {
    return update.pageNumbers[Math.floor(update.pageNumbers.length / 2)];
}

function partOne(input: string[]): number {
    const { rules, updates } = parseInput(input);
    return updates.filter(update => isAllInRightOrder(rules, update)).reduce((acc, update) => {
        return acc += getMiddlePart(update);
    }, 0);
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(143);
    expect(partOne(getDayInput(day))).toBe(0);
});