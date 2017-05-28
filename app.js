/**
 * Created by foo on 5/28/17.
 */

let concepts;
let relations;

if (process.argv[2] === 'ex') {
    concepts = [
        { id: 1, time: 2, importance: 5 },
        { id: 2, time: 1, importance: 4 },
        { id: 3, time: 3, importance: 5 },
        { id: 4, time: 1, importance: 2 },
        { id: 5, time: 3, importance: 4 },
        { id: 6, time: 4, importance: 2 },
        { id: 7, time: 2, importance: 4 },
        { id: 8, time: 1, importance: 2 },
        { id: 9, time: 3, importance: 4 }
    ];

    relations = [
        { source: 1, target: 2, influence: 0.8 },
        { source: 2, target: 3, influence: 0.5 },
        { source: 2, target: 4, influence: 0.7 },
        { source: 2, target: 8, influence: 0.8 },
        { source: 4, target: 5, influence: 0.2 },
        { source: 5, target: 6, influence: 0.6 },
        { source: 8, target: 9, influence: 0.6 },
        { source: 8, target: 7, influence: 0.6 },
    ];
} else {
    concepts = [
        { id: 1, time: 1, importance: 1 },
        { id: 2, time: 1, importance: 1 },
        { id: 3, time: 1, importance: 1 },
        { id: 4, time: 1, importance: 1 },
        { id: 5, time: 1, importance: 1 },
        { id: 6, time: 1, importance: 1 },
        { id: 7, time: 1, importance: 1 },
        { id: 8, time: 1, importance: 1 },
        { id: 9, time: 1, importance: 1 }
    ];

    relations = [
        { source: 1, target: 2, influence: 1 },
        { source: 2, target: 3, influence: 1 },
        { source: 2, target: 6, influence: 1 },
        { source: 2, target: 8, influence: 1 },
        { source: 3, target: 4, influence: 1 },
        { source: 3, target: 5, influence: 1 },
        { source: 4, target: 9, influence: 1 },
        { source: 5, target: 9, influence: 1 },
        { source: 6, target: 7, influence: 1 },
        { source: 7, target: 9, influence: 1 },
    ];
}



let matrix = buildMatrix(concepts, relations);
let influenceMatrix = buildInfluenceMatrix(matrix.matrix, relations);
let solution = solve({ matrix: influenceMatrix, positions: matrix.positions }, concepts);

let conceptsInfluenceOnMap = calcMapInfluenceOnConcepts(influenceMatrix);
let mapInfluenceOnConcepts = calcConceptsInfluenceOnMap(influenceMatrix);

l('Concepts Influence');
l(conceptsInfluenceOnMap);

l('Map Influence');
l(mapInfluenceOnConcepts);

l('Result Matrix');
console.log(influenceMatrix);

l('Result value');
console.log(solution);
console.log(randomBetween(1, 100));

function buildInfluenceMatrix(matrix) {
    let nodeCount = matrix.length;
    let resultedMatrix = matrix.slice();

    for (let i = 0; i < nodeCount; i++) {
        for (let j = 0; j < nodeCount; j++) {
            let multipliedMatrix = matrix;

            for (let k = 0; k < nodeCount; k++) {
                multipliedMatrix = multiplyMatrix(multipliedMatrix, matrix);
                if (+resultedMatrix[i][j] < +multipliedMatrix[i][j]) {
                    resultedMatrix[i][j] = multipliedMatrix[i][j];
                }
            }
        }
    }

    return resultedMatrix;
}

function buildMatrix(nodes, relations) {
    nodes = nodes.sort();

    let conceptIdByPosition = nodes.reduce((res, node, index) => {
        res[index] = node.id;
        return res;
    }, {});

    let conceptPositionById = nodes.reduce((res, node, index) => {
        res[node.id] = index;
        return res;
    }, {});

    let rows = new Array(nodes.length).fill(null);

    rows = rows.map((row, rowPosition) => {
        row = new Array(nodes.length).fill(null);
        row = row.map((column, columnPosition) => {
            if (columnPosition === rowPosition) return 0;

            let relation = relations.find(relation => {
                return (
                    (+relation.source === +conceptIdByPosition[rowPosition]) &&
                    (+relation.target === +conceptIdByPosition[columnPosition])
                );
            });

            if (relation && +relation.influence) {
                return +relation.influence;
            }

            return 0;
        });

        return row;
    });

    return { matrix: rows, positions: conceptPositionById};
}


function solve(matrix = {}, nodes, types = [], { timeRestriction = 5, alpha = 1, beta = 1, disabledNodes = [], enabledNodes = [] } = {}) {
    let conceptIndicatorById = nodes.reduce((res, node) => {
        res[node.id] = true;
        return res;
    }, {});

    let result = nodes.reduce((res, node) => {
        if (!conceptIndicatorById[node.id]) return res;

        let includedCount = Object.keys(conceptIndicatorById).reduce((res, id) => res + (conceptIndicatorById[id] ? 1 : 0), 0);

        let conceptAlpha = round(+alpha * +node.importance, 4);

        let influenceSum = nodes.reduce((res, secondNode) => {
            if (!conceptIndicatorById[secondNode.id]) return res;

            return round(+res + +matrix.matrix[matrix.positions[node.id]][matrix.positions[secondNode.id]], 4);
        }, 0);

        let conceptBeta = round(+beta * round( 1 / includedCount, 2 ) * influenceSum, 4);

        return round(res + conceptAlpha + conceptBeta, 4);
    }, 0);

    return result;
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function l() {
    console.log(...arguments);
}

function round(number, precision) {
    precision = parseFloat(precision) || 0;
    number = parseFloat(number) || 0;

    return Number(Math.round(number + ('e+' + precision)) + ('e-' + precision));
}

function calcMapInfluenceOnConcepts(influenceMatrix) {
    let nodesCount = influenceMatrix.length;
    return (new Array(nodesCount).fill(0)).map((row, index) => {
        return round(influenceMatrix.reduce((value, row) => round(row[index] + value, 4), 0)/ nodesCount, 4);
    });
}

function calcConceptsInfluenceOnMap(influenceMatrix) {
    let nodesCount = influenceMatrix.length;

    return (new Array(nodesCount).fill(0)).map((row, index) => {
        return round(influenceMatrix[index].reduce((r, value) => round(r + value, 4), 0)/ nodesCount, 4);
    });
}


function multiplyMatrix(a, b) {
    let aNumRows = a.length, aNumCols = a[0].length;
    let bNumRows = b.length, bNumCols = b[0].length;
    let m = new Array(aNumRows);  // initialize array of rows
    for (let r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (let c = 0; c < bNumCols; ++c) {
            m[r][c] = 0;             // initialize the current cell
            for (let i = 0; i < aNumCols; ++i) {
                if (m[r][c] < a[r][i] * b[i][c]) {
                    m[r][c] = round(a[r][i] * b[i][c], 4);
                }
            }
        }
    }
    return m;
}
