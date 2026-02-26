document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves-count');
    const timerDisplay = document.getElementById('timer-display');
    const difficultySelect = document.getElementById('difficulty-select');
    const winOverlay = document.getElementById('win-overlay');

    let cardsData = []; // To be loaded from JSON
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let seconds = 0;
    let timerInterval = null;
    let isLocked = false;
    let totalPairs = 8;

    // Hardcoded fallback data if JSON fetch fails
    const defaultCards = [
        { name: 'atom', icon: 'fa-atom' },
        { name: 'bio', icon: 'fa-dna' },
        { name: 'tech', icon: 'fa-microchip' },
        { name: 'math', icon: 'fa-calculator' },
        { name: 'space', icon: 'fa-rocket' },
        { name: 'brain', icon: 'fa-brain' },
        { name: 'code', icon: 'fa-code' },
        { name: 'globe', icon: 'fa-globe' },
        { name: 'robot', icon: 'fa-robot' },
        { name: 'book', icon: 'fa-book' },
        { name: 'flask', icon: 'fa-flask' },
        { name: 'cog', icon: 'fa-cog' },
        { name: 'star', icon: 'fa-star' },
        { name: 'moon', icon: 'fa-moon' },
        { name: 'bolt', icon: 'fa-bolt' },
        { name: 'leaf', icon: 'fa-leaf' },
        { name: 'shield', icon: 'fa-shield-halved' },
        { name: 'anchor', icon: 'fa-anchor' }
    ];

    async function initGame() {
        totalPairs = parseInt(difficultySelect.value);
        
        // Update grid layout based on difficulty
        if (totalPairs > 12) {
            gameBoard.style.gridTemplateColumns = "repeat(6, 1fr)";
        } else {
            gameBoard.style.gridTemplateColumns = "repeat(4, 1fr)";
        }

        try {
            // Attempt to load from JSON
            const response = await fetch('cards.json');
            const data = await response.json();
            cardsData = data.slice(0, totalPairs);
        } catch (e) {
            // Fallback to default list if JSON is missing
            cardsData = defaultCards.slice(0, totalPairs);
        }

        const gameCards = [...cardsData, ...cardsData];
        shuffle(gameCards);
        renderBoard(gameCards);
        resetStats();
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function renderBoard(cards) {
        gameBoard.innerHTML = '';
        cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.dataset.name = card.name;
            cardEl.innerHTML = `
                <div class="card-face card-front"><i class="fas fa-shield-halved"></i></div>
                <div class="card-face card-back"><i class="fas ${card.icon}"></i></div>
            `;
            cardEl.addEventListener('click', flipCard);
            gameBoard.appendChild(cardEl);
        });
    }

    function flipCard() {
        if (isLocked || this.classList.contains('is-flipped')) return;

        if (!timerInterval) startTimer();

        this.classList.add('is-flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkMatch();
        }
    }

    function checkMatch() {
        isLocked = true;
        const [c1, c2] = flippedCards;
        const isMatch = c1.dataset.name === c2.dataset.name;

        if (isMatch) {
            c1.classList.add('is-matched');
            c2.classList.add('is-matched');
            matchedPairs++;
            resetTurn();
            if (matchedPairs === totalPairs) handleWin();
        } else {
            setTimeout(() => {
                c1.classList.remove('is-flipped');
                c2.classList.remove('is-flipped');
                resetTurn();
            }, 1000);
        }
    }

    function resetTurn() {
        flippedCards = [];
        isLocked = false;
    }

    function startTimer() {
        seconds = 0;
        timerInterval = setInterval(() => {
            seconds++;
            const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
            const secs = String(seconds % 60).padStart(2, '0');
            timerDisplay.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    function resetStats() {
        clearInterval(timerInterval);
        timerInterval = null;
        seconds = 0;
        moves = 0;
        matchedPairs = 0;
        movesDisplay.textContent = '0';
        timerDisplay.textContent = '00:00';
    }

    function handleWin() {
        clearInterval(timerInterval);
        document.getElementById('final-time').textContent = timerDisplay.textContent;
        document.getElementById('final-moves').textContent = moves;
        
        // High Score Logic
        const bestScore = localStorage.getItem(`best_${totalPairs}`) || Infinity;
        if (moves < bestScore) {
            localStorage.setItem(`best_${totalPairs}`, moves);
            document.getElementById('high-score-val').textContent = moves + " (New!)";
        } else {
            document.getElementById('high-score-val').textContent = bestScore;
        }

        winOverlay.classList.add('visible');
    }

    window.resetGame = () => {
        winOverlay.classList.remove('visible');
        initGame();
    };

    difficultySelect.addEventListener('change', initGame);

    initGame();
});