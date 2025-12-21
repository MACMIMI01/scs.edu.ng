document.addEventListener('DOMContentLoaded', () => {
    const redLight = document.getElementById('red-light');
    const yellowLight = document.getElementById('yellow-light');
    const greenLight = document.getElementById('green-light');
    const instructionText = document.getElementById('instruction-text');
    const feedbackText = document.getElementById('feedback-text');
    const startGameBtn = document.getElementById('start-game-btn');
    const reactButton = document.getElementById('react-button');
    const nextRoundBtn = document.getElementById('next-round-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const scoreDisplay = document.getElementById('score-display');

    let currentLightState = null; // 'red', 'yellow', 'green'
    let timerId = null;
    let reactionTimer = null; // To measure user reaction time
    let gameMessages = {}; // To store messages from JSON
    let gameSettings = {}; // To store settings from JSON

    let currentRound = 0;
    let mistakes = 0;
    let gameActive = false; // Flag to control game flow

    // --- Sound Effects ---
    const correctSound = new Audio('../../assets/sounds/correct.mp3');
    const wrongSound = new Audio('../../assets/sounds/wrong.mp3');
    const winSound = new Audio('../../assets/sounds/win.mp3'); // For game win/level complete
    const whistleSound = new Audio('../../assets/sounds/whistle.mp3'); // For start/stop cues

    function playSound(sound) {
        if (sound) {
            sound.currentTime = 0; // Rewind to start
            sound.play().catch(e => console.error("Sound play failed:", e));
        }
    }

    // --- Game Initialization ---
    async function initGame() {
        try {
            const response = await fetch('trafficData.json');
            const data = await response.json();
            gameMessages = data.messages;
            gameSettings = data.gameSettings;
            
            resetGame();
            instructionText.textContent = gameMessages.ready;
            feedbackText.textContent = '';
            startGameBtn.style.display = 'inline-block';
            reactButton.style.display = 'none';
            nextRoundBtn.style.display = 'none';
            restartGameBtn.style.display = 'none';
        } catch (error) {
            console.error('Error loading traffic data:', error);
            instructionText.textContent = 'Failed to load game data. Please try again.';
            startGameBtn.disabled = true;
        }
    }

    function resetGame() {
        currentRound = 0;
        mistakes = 0;
        gameActive = false;
        clearLights();
        updateScoreDisplay();
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `Rounds: ${currentRound} / ${gameSettings.numRounds} | Mistakes: ${mistakes}`;
    }

    // --- Light Management ---
    function clearLights() {
        redLight.classList.remove('active');
        yellowLight.classList.remove('active');
        greenLight.classList.remove('active');
    }

    function setLight(color) {
        clearLights();
        if (color === 'red') {
            redLight.classList.add('active');
            instructionText.textContent = gameMessages.red;
            playSound(whistleSound); // Whistle for stop
        } else if (color === 'yellow') {
            yellowLight.classList.add('active');
            instructionText.textContent = gameMessages.yellow;
        } else if (color === 'green') {
            greenLight.classList.add('active');
            instructionText.textContent = gameMessages.green;
            playSound(whistleSound); // Whistle for go
        }
        currentLightState = color;
    }

    // --- Game Flow ---
    function startRound() {
        feedbackText.textContent = ''; // Clear previous feedback
        reactButton.disabled = false;
        reactButton.style.display = 'inline-block';
        nextRoundBtn.style.display = 'none';
        restartGameBtn.style.display = 'none';

        // Randomize initial light (red or yellow for a short period before green)
        const initialDelay = Math.random() * (gameSettings.maxLightDuration - gameSettings.minLightDuration) + gameSettings.minLightDuration;

        setLight('red'); // Start with red
        timerId = setTimeout(() => {
            setLight('yellow'); // Then yellow
            timerId = setTimeout(() => {
                setLight('green'); // Finally green
                reactionTimer = Date.now(); // Start measuring reaction time
            }, initialDelay / 2); // Yellow for half the initial delay
        }, initialDelay); // Red for a random duration
    }

    function endRound(reason) {
        clearTimeout(timerId);
        clearLights();
        reactButton.disabled = true;
        reactButton.style.display = 'none';
        gameActive = false; // Pause game until next round or restart

        if (mistakes >= 3) { // Game Over condition
            feedbackText.textContent = gameMessages.gameOver;
            feedbackText.style.color = '#dc3545'; // Red for game over
            instructionText.textContent = 'Better luck next time!';
            restartGameBtn.style.display = 'inline-block';
            playSound(wrongSound); // Play a final wrong sound
            return;
        }

        if (currentRound < gameSettings.numRounds) {
            feedbackText.textContent = reason;
            instructionText.textContent = gameMessages.roundComplete;
            nextRoundBtn.style.display = 'inline-block';
        } else {
            // All rounds completed successfully
            feedbackText.textContent = 'Amazing! All rounds completed perfectly!';
            feedbackText.style.color = '#28a745'; // Green for success
            instructionText.textContent = 'You are a Traffic Light Master!';
            restartGameBtn.style.display = 'inline-block';
            playSound(winSound);
        }
    }

    // --- User Reaction Handling ---
    reactButton.addEventListener('click', () => {
        if (!gameActive) return;

        const reactionTime = Date.now() - reactionTimer; // Calculate reaction time

        if (currentLightState === 'green') {
            // Correct reaction
            if (reactionTime <= gameSettings.reactionTimeLimit) {
                feedbackText.textContent = `${gameMessages.perfect} (Reaction: ${reactionTime}ms)`;
                feedbackText.style.color = '#28a745'; // Green
                playSound(correctSound);
            } else {
                feedbackText.textContent = `${gameMessages.tooSlow} (Reaction: ${reactionTime}ms)`;
                feedbackText.style.color = '#ffc107'; // Yellow/Orange
                mistakes++;
                playSound(wrongSound);
            }
            currentRound++;
            updateScoreDisplay();
            endRound(feedbackText.textContent); // End the current round
        } else if (currentLightState === 'red') {
            // Incorrect reaction: moved on red
            feedbackText.textContent = gameMessages.wrongAction;
            feedbackText.style.color = '#dc3545'; // Red
            mistakes++;
            playSound(wrongSound);
            currentRound++; // Still counts as a round for mistake tracking
            updateScoreDisplay();
            endRound(feedbackText.textContent);
        } else if (currentLightState === 'yellow') {
             // Incorrect reaction: moved on yellow (optional: depends on game rules)
            feedbackText.textContent = 'Oops! You reacted on yellow. Wait for green!';
            feedbackText.style.color = '#ffc107'; // Yellow/Orange
            mistakes++;
            playSound(wrongSound);
            currentRound++; // Still counts as a round for mistake tracking
            updateScoreDisplay();
            endRound(feedbackText.textContent);
        }
    });

    // --- Button Event Listeners ---
    startGameBtn.addEventListener('click', () => {
        resetGame();
        gameActive = true;
        startGameBtn.style.display = 'none';
        startRound();
    });

    nextRoundBtn.addEventListener('click', () => {
        gameActive = true;
        startRound();
    });

    restartGameBtn.addEventListener('click', () => {
        initGame(); // Re-initialize to load data and reset everything fully
    });

    // Initialize the game when the page loads
    initGame();
});
