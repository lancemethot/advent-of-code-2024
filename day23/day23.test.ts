import { debug, getDayInput, getExampleInput } from '../utils';

const day = 'day23';

type Connection = {
    a: string;
    b: string;
}

function parseInput(input: string[]): Connection [] {
    return input.reduce((acc, line) => {
        acc.push({ a: line.split('-')[0], b: line.split('-')[1]});
        return acc;
    }, [] as Connection[]);
}

function updateMap(map: Map<string, string[]>, computer: string, neighbor: string): void {
    if(map.has(computer) && !map.get(computer)!.includes(neighbor)) {
        map.get(computer)!.push(neighbor);
    } else {
        map.set(computer, [ neighbor ]);
    }
}

function isClique(graph: number[][], store: number[], b: number): boolean {
	// Run a loop for all the set of edges
	// for the select vertex
	for (let i = 1; i < b; i++) {
		for (let j = i + 1; j < b; j++) {
			// If any edge is missing
			if (graph[store[i]][store[j]] === 0) {
				return false;
            }
        }
	}
	return true;
}

// Function to find all the cliques of size s
// Modified from: https://www.geeksforgeeks.org/find-all-cliques-of-size-k-in-an-undirected-graph/
//
function findCliques(graph: number[][], result: number[][], store: number[], d: number[], n: number, i: number, l: number, s: number) {
	// Check if any vertices from i+1 can be inserted
	for (let j = i; j <= n - (s - l); j++) {
		// If the degree of the graph is sufficient
		if (d[j] >= s - 1) {
			// Add the vertex to store
			store[l] = j;
			// If the graph is not a clique of size k
			// then it cannot be a clique
			// by adding another edge
			if (isClique(graph, store, l + 1)) {
				// If the length of the clique is
				// still less than the desired size
				if (l < s) {
					// Recursion to add vertices
					findCliques(graph, result, store, d, n, j, l + 1, s);
				} else {
                    // Size is met
                    result.push(store.slice(1, l + 1));
                }
            }
        }
    }
}

function determineNetworks(connections: Connection[], size: number): string[] {

    let computers: Map<string, string[]> = connections.reduce((acc, connection) => {
        updateMap(acc, connection.a, connection.b);
        updateMap(acc, connection.b, connection.a);
        return acc;
    }, new Map<string, string[]>());

    let names: string[] = Array.from(computers.keys());
    let edges: number[][] = connections.reduce((acc, connection) => {
        acc.push([ names.indexOf(connection.a), names.indexOf(connection.b) ]);
        return acc;
    }, [] as number[][]);
    let graph: number[][] = new Array(names.length).fill(0).map(() => new Array(names.length).fill(0));
    let d = new Array(names.length).fill(0);

    edges.forEach(edge => {
        graph[edge[0]][edge[1]] = 1;
		graph[edge[1]][edge[0]] = 1;
		d[edge[0]]++;
		d[edge[1]]++;
    })

    let store = new Array(names.length).fill(0);
    let result: number[][] = [];
    findCliques(graph, result, store, d, names.length + 1, 0, 1, size);

    return result.map(res => res.map(r => names[r]).join(','));
}

function partOne(input: string[]): number {
    return determineNetworks(parseInput(input), 3).filter(network => {
        return network.split(',').filter(computer => computer.startsWith('t')).length > 0;
    }).length;
}

function partTwo(input: string[]): string {
    let password: string = '';
    let connections: Connection[] = parseInput(input);
    let k: number = 2;
    let networks: string[] = determineNetworks(connections, k);
    while(networks.length > 0) {
        password = networks[0].split(',').sort((a, b) => a.localeCompare(b)).join(',');
        networks = determineNetworks(connections, ++k);
    }
    return password;
}

test(day, ()=> {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(determineNetworks(parseInput(getExampleInput(day)), 3).length).toBe(12);

    expect(partOne(getExampleInput(day))).toBe(7);
    expect(partOne(getDayInput(day))).toBe(1327);

    expect(partTwo(getExampleInput(day))).toBe("co,de,ka,ta");
    expect(partTwo(getDayInput(day))).toBe("df,kg,la,mp,pb,qh,sk,th,vn,ww,xp,yp,zk");
})