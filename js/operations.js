let currentSquare = [];
let N, CONST;
const board = document.getElementById("board");
const outputElement = document.getElementById("const");
const feedbackArea = document.getElementById("a");

window.onload = () => {
    const orderInput = document.getElementById("order");
    if (orderInput) {
        orderInput.value = ""; 
        orderInput.placeholder = "3";
    }
    N = 3; 
    renderEmptyBoard();
};

function renderEmptyBoard() {
    const orderInput = document.getElementById("order");
    let val = parseInt(orderInput.value);

    restoreCheckButton();

    if (orderInput.value !== "" && (isNaN(val) || val < 3 || val > 5)) {
        return; 
    }

    let displayN = isNaN(val) ? 3 : val;
    N = displayN;

    board.innerHTML = "";
    outputElement.className = "hide";
    const table = document.createElement("table");
    table.id = "game-board";
    const cellSize = 480 / N; 

    for (let i = 0; i < N; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < N; j++) {
            const td = document.createElement("td");
            td.style.width = `${cellSize}px`;
            td.style.height = `${cellSize * 0.9}px`;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    board.appendChild(table);
}

function generate() {
    const orderInput = document.getElementById("order");
    const genBtn = document.getElementById("generate");
    restoreCheckButton();

    if (orderInput.value.trim() === "") {
        orderInput.value = 3;
    }

    let val = parseInt(orderInput.value);

    if (isNaN(val) || val < 3 || val > 5) {
        genBtn.textContent = "Введіть цифру від 3 до 5";
        genBtn.classList.add("wrong-input-btn");
        return;
    }
    
    genBtn.textContent = "Створити";
    genBtn.classList.remove("wrong-input-btn");
    
    N = val;

    let complexityRadio = document.querySelector('input[name="complexity"]:checked');
    if (!complexityRadio) {
        const easyRadio = document.querySelector('input[value="EASY_LEVEL"]');
        easyRadio.checked = true;
        complexityRadio = easyRadio;
    }

    const magicObj = new SemiMagicSquare(N);
    currentSquare = magicObj.square;
    CONST = magicObj.magicConst;

    outputElement.textContent = CONST;
    outputElement.className = "magic-constant-circle";
    
    renderFullBoard(maskSquare(currentSquare, complexityRadio.value));
    clearFeedback();
}

function renderFullBoard(data) {
    board.innerHTML = "";
    const table = document.createElement("table");
    table.id = "game-board";
    const cellSize = 480 / N;
    for (let i = 0; i < N; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < N; j++) {
            const td = document.createElement("td");
            td.style.width = `${cellSize}px`;
            td.style.height = `${cellSize * 0.9}px`;
            const val = data[i][j];
            if (typeof val === "string" && val.includes("_")) {
                td.appendChild(createInput(i, j, val));
            } else {
                td.classList.add("base-element");
                const div = document.createElement("div");
                div.className = "content-wrapper";
                div.style.fontSize = `${180 / N}px`;
                div.textContent = val;
                td.appendChild(div);
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    board.appendChild(table);
}

function createInput(r, c, mask) {
    const wrapper = document.createElement("div");
    wrapper.className = "content-wrapper";
    wrapper.style.fontSize = `${180 / N}px`;
    const input = document.createElement("input");
    input.className = "magic-number-input";
    input.maxLength = 1;
    input.dataset.row = r;
    input.dataset.col = c;
    input.dataset.mask = mask;
    
    input.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
        restoreCheckButton();
    });

    const digit = mask.replace("_", "");
    if (mask.startsWith("_")) {
        wrapper.appendChild(input);
        wrapper.append(digit);
    } else {
        wrapper.append(digit);
        wrapper.appendChild(input);
    }

    input.addEventListener("keydown", (e) => {
    const key = e.key;

    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        return;
    }

    e.preventDefault();

    const inputs = Array.from(document.querySelectorAll(".magic-number-input"));
    if (inputs.length === 0) return;

    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    let newRow = row;
    let newCol = col;

    if (key === "ArrowRight") {
        newCol++;
        if (newCol >= N) {
            newCol = 0;
            newRow++;
        }
    }

    if (key === "ArrowLeft") {
        newCol--;
        if (newCol < 0) {
            newCol = N - 1;
            newRow--;
        }
    }

    if (key === "ArrowDown") {
        newRow++;
    }

    if (key === "ArrowUp") {
        newRow--;
    }

    if (newRow >= N) newRow = 0;
    if (newRow < 0) newRow = N - 1;

    let nextInput = document.querySelector(
        `.magic-number-input[data-row="${newRow}"][data-col="${newCol}"]`
    );

    while (!nextInput) {

        if (key === "ArrowRight") {
            newCol++;
            if (newCol >= N) {
                newCol = 0;
                newRow++;
            }
        }

        if (key === "ArrowLeft") {
            newCol--;
            if (newCol < 0) {
                newCol = N - 1;
                newRow--;
            }
        }

        if (key === "ArrowDown") newRow++;
        if (key === "ArrowUp") newRow--;

        if (newRow >= N) newRow = 0;
        if (newRow < 0) newRow = N - 1;

        nextInput = document.querySelector(
            `.magic-number-input[data-row="${newRow}"][data-col="${newCol}"]`
        );

        if (newRow === row && newCol === col) break;
    }

    if (nextInput) {
        nextInput.focus();
    }
});
    return wrapper;

    
}

function check() {
    const inputs = document.querySelectorAll(".magic-number-input");
    const btn = document.getElementById("check");
    let hasEmpty = false;
    inputs.forEach(inp => { if (inp.value.trim() === "") hasEmpty = true; });

    if (hasEmpty) {
        btn.className = "cta cta-primary wrong";
        btn.textContent = "Будь ласка, заповни всі порожні клітинки!";
        return;
    }

    let matrix = Array.from({ length: N }, () => Array(N).fill(0));
    const table = document.getElementById("game-board");
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const td = table.rows[i].cells[j];
            if (td.classList.contains("base-element")) {
                matrix[i][j] = parseInt(td.textContent);
            } else {
                const inp = td.querySelector("input");
                const m = inp.dataset.mask;
                matrix[i][j] = m.startsWith("_") ? parseInt(inp.value + m[1]) : parseInt(m[0] + inp.value);
            }
        }
    }

    let errRows = [], errCols = [];
    for (let i = 0; i < N; i++) {
        if (matrix[i].reduce((a, b) => a + b, 0) !== CONST) errRows.push(i);
        let colSum = 0;
        for (let r = 0; r < N; r++) colSum += matrix[r][i];
        if (colSum !== CONST) errCols.push(i);
    }

    if (errRows.length === 0 && errCols.length === 0) {
        btn.className = "cta cta-primary correct";
        btn.textContent = "Правильно!";
        document.querySelectorAll("td").forEach(td => {
            td.classList.remove("line-error");
            td.classList.add("all-correct");
        });
    } else {
        highlightErrors(errRows, errCols);
        btn.className = "cta cta-primary wrong";
        btn.textContent = `Майже! У червоних зонах сума поки не ${CONST}`;
    }
}

function highlightErrors(rows, cols) {
    const table = document.getElementById("game-board");
    document.querySelectorAll("td").forEach(td => td.classList.remove("line-error"));
    rows.forEach(r => { for (let c = 0; c < N; c++) table.rows[r].cells[c].classList.add("line-error"); });
    cols.forEach(c => { for (let r = 0; r < N; r++) table.rows[r].cells[c].classList.add("line-error"); });
}

function clearFeedback() {
    if (feedbackArea) feedbackArea.innerHTML = "";
    document.querySelectorAll("td").forEach(td => td.classList.remove("line-error", "all-correct"));
    restoreCheckButton();
}

function restoreCheckButton() {
    const btn = document.getElementById("check");
    if (btn) {
        btn.className = "cta cta-primary";
        btn.textContent = "Перевірити";
    }
}

function retry() {
    document.querySelectorAll(".magic-number-input").forEach(i => i.value = "");
    clearFeedback();
}