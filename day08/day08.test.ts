import { debug, getDayInput, getExampleInput } from "../utils";

const day = "day08";

type Coord = {
    x: number;
    y: number;
}

type Tile = {
    x: number;
    y: number;
    frequency: string;
    antinodes: Set<string>;
}

function parseInput(input: string[]): Tile[][] {
    return input.reduce((acc, line, x) => {
        acc.push(line.split('').map((chr, y) => {
            return {
                x,
                y,
                frequency: chr,
                antinodes: new Set(),
            }
        }));
        return acc;
    }, [] as Tile[][]);
}

function printTiles(tiles: Tile[][]) {
    let msg = tiles.reduce((acc, row) => {
        return acc += row.map(col => col.frequency !== '.' ? col.frequency : col.antinodes.size > 0 ? '#': '.').join('') + '\n';
    }, '');
    debug('\n'+msg, day);
}

function getUniqueFrequencies(tiles: Tile[][]): Set<string> {
    return tiles.reduce((acc, row) => {
        row.forEach(col => {
            if(col.frequency !== '.') acc.add(col.frequency);
        });
        return acc;
    }, new Set<string>());
}

function getAntennaCoordinates(tiles: Tile[][], frequency: string): Coord[] {
    return tiles.reduce((acc, row) => {
        acc.push(... row.filter(col => col.frequency === frequency)
                        .map(col => {
                            return {
                                x: col.x,
                                y: col.y
                            }
                        }));
        return acc;
    }, [] as Coord[]);
}

function isInBounds(tiles: Tile[][], tile: Coord) {
    return tile.x >= 0 && tile.y >= 0 && tile.x < tiles.length && tile.y < tiles[0].length;
}

function determineAntinodes(antennaA: Tile, antennaB: Tile): Coord[] {
    const rise: number = antennaB.y - antennaA.y;
    const run: number = antennaB.x - antennaA.x;
    const slope: number = rise / run;
    const distance: number = Math.sqrt((rise * rise) + (run * run));
    const angle = Math.atan(slope);
    const distanceX = distance * Math.cos(angle);
    const distanceY = distance * Math.sin(angle);
    const antinodes: Coord[] = [
        {
            x: Math.round(antennaA.x - distanceX),
            y: Math.round(antennaA.y - distanceY),
        },
        {
            x: Math.round(antennaB.x + distanceX),
            y: Math.round(antennaB.y + distanceY)
        }
    ];
    return antinodes;
}

function scanFrequency(tiles: Tile[][], frequency: string): Tile[][] {
    const antennas = getAntennaCoordinates(tiles, frequency);
    for(let i = 0; i < antennas.length - 1; i++) {
        const antennaA = antennas[i];
        for(let check = i+1; check < antennas.length; check++) {
            const antennaB = antennas[check]; 
            const antinodes = determineAntinodes(tiles[antennaA.x][antennaA.y], tiles[antennaB.x][antennaB.y])
                                .filter(coord => isInBounds(tiles, coord));
            antinodes.forEach(antinode => {
                tiles[antinode.x][antinode.y].antinodes.add(`${frequency}-${antennaA.x},${antennaA.y}-${antennaB.x},${antennaB.y}`);
            });
        }
    }
    return tiles;
}

function scanFrequencies(tiles: Tile[][]): Tile[][] {
    const frequencies: Set<string> = getUniqueFrequencies(tiles);
    frequencies.forEach(frequency => {
        tiles = scanFrequency(tiles, frequency);
    });
    printTiles(tiles);
    return tiles;
}

function partOne(input: string[]): number {
    return scanFrequencies(parseInput(input)).reduce((acc, row) => {
        return acc += row.filter(col => col.antinodes.size > 0).length;
    }, 0);
}

test(day, () => {
    debug(`${new Date()}\n`, day, false);
    expect(partOne(getExampleInput(day))).toBe(14);
    expect(partOne(getDayInput(day))).toBe(341);
})