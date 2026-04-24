function maskSquare(square, level) {
    const n = square.length;
    const totalCells = n * n;
    let masked = [];

    for (let i = 0; i < n; i++) masked[i] = [...square[i]];

    let maskTens = Math.random() < 0.5;

    if (level === "EASY_LEVEL") {
        let coords = [];
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) coords.push({r: i, c: j});
        }

        coords.sort(() => Math.random() - 0.5);

        const minToMask = Math.floor(totalCells * 0.5);
        const maxToMask = Math.floor(totalCells * 0.7);
        
        let countToMask = Math.floor(Math.random() * (maxToMask - minToMask + 1)) + minToMask;

        if (totalCells - countToMask < 2) {
            countToMask = totalCells - 2;
        }

        for (let k = 0; k < countToMask; k++) {
            const {r, c} = coords[k];
            const num = square[r][c];
            const tens = Math.floor(num / 10);
            const units = num % 10;
            masked[r][c] = maskTens ? tens + "_" : "_" + units;
        }
    } else {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const num = square[i][j];
                const tens = Math.floor(num / 10);
                const units = num % 10;
                if (level === "MEDIUM_LEVEL") {
                    masked[i][j] = maskTens ? tens + "_" : "_" + units;
                } else if (level === "HARD_LEVEL") {
                    masked[i][j] = Math.random() < 0.5 ? tens + "_" : "_" + units;
                }
            }
        }
    }
    return masked;
}