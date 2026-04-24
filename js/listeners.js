document.getElementById("order").addEventListener("input", (e) => {
    const genBtn = document.getElementById("generate");
    genBtn.textContent = "Створити";
    genBtn.classList.remove("wrong-input-btn");
    
    renderEmptyBoard();
    clearFeedback();
});


let currentStep = 1;
const totalSteps = 4;

function help() {
    document.getElementById('helpModal').style.display = 'flex';
    currentStep = 1;
    updateCards();
}

function changeCard(direction) {
    currentStep += direction;
    updateCards();
}

function updateCards() {
    document.querySelectorAll('.help-card').forEach(card => card.classList.remove('active'));
    document.querySelector(`.help-card[data-step="${currentStep}"]`).classList.add('active');

    document.getElementById('cardCounter').textContent = `${currentStep} / ${totalSteps}`;

    const prevBtn = document.getElementById('prevCard');
    prevBtn.disabled = (currentStep === 1);

    const nextBtn = document.getElementById('nextCard');
    
    if (currentStep === totalSteps) {
        nextBtn.textContent = "Зрозуміло!";
        nextBtn.classList.add('finish-btn');
        nextBtn.onclick = closeHelp;
    } else {
        nextBtn.textContent = "Далі →";
        nextBtn.classList.remove('finish-btn');
        nextBtn.onclick = () => changeCard(1);
    }
}

function closeHelp() {
    document.getElementById('helpModal').style.display = 'none';
}

document.addEventListener("mousedown", (e) => {
    if (e.target.closest("#game-board") || e.target.classList.contains("magic-number-input")) {
        restoreCheckButton();
    }
});