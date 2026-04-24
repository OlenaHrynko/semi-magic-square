function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

class SemiMagicSquare {
    constructor(n) {
        this.n = n;
        
        let isValid = false;
        while (!isValid) {
            this.magicConst = Math.floor(Math.random() * (n * 70)) + (n * 20);
            this.square = this.generateSquare();
            
            isValid = this.validateSquare(this.square);
        }
    }

    generateSquare() {
        const n = this.n;
        const S = this.magicConst;
        let matrix = Array.from({ length: n }, () => Array(n).fill(0));

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - 1; j++) {
                matrix[i][j] = Math.floor(Math.random() * 60) + 15;
            }
        }

        for (let i = 0; i < n - 1; i++) {
            let rowSum = 0;
            for (let j = 0; j < n - 1; j++) rowSum += matrix[i][j];
            matrix[i][n - 1] = S - rowSum;
        }

        for (let j = 0; j < n; j++) {
            let colSum = 0;
            for (let i = 0; i < n - 1; i++) colSum += matrix[i][j];
            matrix[n - 1][j] = S - colSum;
        }

        return matrix;
    }

    validateSquare(matrix) {
        const flat = matrix.flat();
        const inRange = flat.every(num => num >= 10 && num <= 99);
        const unique = new Set(flat).size === this.n * this.n;
        
        return inRange && unique;
    }
}

function generateNewSquare(n) {
    const instance = new SemiMagicSquare(n);
    return instance.square;
}