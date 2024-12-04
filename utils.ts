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

export function debug(message: string, filename: string, append: boolean = true) {
    if(append) {
        fs.appendFileSync(filename, message);
    } else {
        fs.writeFileSync(filename, message);
    }
}