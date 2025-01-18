import { getDayInput, getExampleInput } from 'advent-of-code-utils';

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

function doesRuleApply(rule: Rule, update: Update): boolean {
    let firstIndex = update.pageNumbers.indexOf(rule.first);
    let secondIndex = update.pageNumbers.indexOf(rule.second);
    return firstIndex !== -1 && secondIndex !== -1;
}

function isInRightOrder(rule: Rule, update: Update): boolean {
    if(doesRuleApply(rule, update)) {
        let firstIndex = update.pageNumbers.indexOf(rule.first);
        let secondIndex = update.pageNumbers.indexOf(rule.second);
        return firstIndex < secondIndex; 
    }
    return true;
}

function isAllInRightOrder(rules: Rule[], update: Update): boolean {
    return rules.reduce((acc, rule) => {
        return acc && isInRightOrder(rule, update);
    }, true);
}

function reorderUpdate(rules: Rule[], update: Update): Update {
    const pageNumbers = update.pageNumbers.map(n => n);
    let done = false;
    while(!done) {
        let ruleIndex = 0;
        for(ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
            const rule = rules[ruleIndex];
            let applies = doesRuleApply(rule, update);
            let ordered = isInRightOrder(rule, { pageNumbers: pageNumbers });
            if(applies && !ordered) {
                let firstIndex = pageNumbers.indexOf(rule.first);
                let secondIndex = pageNumbers.indexOf(rule.second);
                pageNumbers.splice(firstIndex, 1, rule.second);
                pageNumbers.splice(secondIndex, 1, rule.first);
                break;
            }
        }
        done = ruleIndex === rules.length;
    }

    return {
        pageNumbers: pageNumbers
    };
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

function partTwo(input: string[]): number {
    const { rules, updates } = parseInput(input);
    return updates.filter(update => !isAllInRightOrder(rules, update))
        .map(update => reorderUpdate(rules, update))
        .reduce((acc, update) => {
            return acc += getMiddlePart(update);
        }, 0);
}

test(day, () => {
    expect(partOne(getExampleInput(day))).toBe(143);
    expect(partOne(getDayInput(day))).toBe(3608);

    expect(partTwo(getExampleInput(day))).toBe(123);
    expect(partTwo(getDayInput(day))).toBe(4922);
});