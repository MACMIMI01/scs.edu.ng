document.addEventListener('DOMContentLoaded', () => {
    const levelTitle = document.getElementById('level-title');
    const levelInfo = document.getElementById('level-info');
    const currentObstacleChallenge = document.getElementById('current-obstacle-challenge');
    const obstacleFeedback = document.getElementById('obstacle-feedback');
    const playerCharacter = document.getElementById('player-character');
    const keypadButtons = document.querySelectorAll('.keypad-button');
    const restartLevelBtn = document.getElementById('restart-level-btn');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const gameStatus = document.getElementById('game-status');
    const scoreDisplay = document.getElementById('score-display');

    let currentLevelIndex = 0;
    let levelsData = [];
    let currentLevel;
    let currentObstacleIndex = 0;
    let obstaclesCleared = 0;
    let totalObstacles = 0;
    let gameActive = false;

    // --- Game Initialization ---
    async function initGame() {
        try {
            const response = await fetch('obstacleData.json');
            levelsData = await response.json();
            loadLevel(currentLevelIndex);
        } catch (error) {
            console.error('Error loading obstacle data:', error);
            gameStatus.textContent = 'Failed to load game data. Please try again.';
        }
    }

    // --- Level Loading ---
    function loadLevel(levelIndex) {
        if (levelIndex >= levelsData.levels.length) {
            gameStatus.textContent = 'Phenomenal! You completed all obstacle courses!';
            gameStatus.style.color = '#28a745';
            levelTitle.textContent = 'Course Master!';
            levelInfo.textContent = 'You have conquered every challenge!';
            currentObstacleChallenge.textContent = 'Game Complete!';
            nextLevelBtn.style.display = 'none';
            restartLevelBtn.style.display = 'none';
            disableKeypad();
            playWinSound();
            return;
        }

        currentLevel = levelsData.levels[levelIndex];
        currentObstacleIndex = 0;
        obstaclesCleared = 0;
        totalObstacles = currentLevel.obstacles.length;
        gameActive = true;

        levelTitle.textContent = `Level ${levelIndex + 1}: ${currentLevel.levelName}`;
        levelInfo.textContent = currentLevel.info;
        gameStatus.textContent = ''; // Clear previous messages
        obstacleFeedback.textContent = '';
        nextLevelBtn.style.display = 'none';
        
        updateScoreDisplay();
        displayCurrentObstacle();
        enableKeypad();
    }

    // --- Obstacle Display ---
    function displayCurrentObstacle() {
        if (currentObstacleIndex < totalObstacles) {
            const obstacle = currentLevel.obstacles[currentObstacleIndex];
            currentObstacleChallenge.textContent = obstacle.actionText;
            playerCharacter.style.transform = 'translateX(-50%)'; // Reset player animation
            playerCharacter.classList.remove(...playerCharacter.classList); // Clear previous animation classes
            playerCharacter.classList.add('player-character'); // Add base class back
        } else {
            // Level complete
            handleLevelComplete();
        }
    }

    // --- Keypad Interaction ---
    keypadButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!gameActive) return; // Don't allow clicks if game is not active

            const actionType = button.dataset.action;
            const requiredKey = button.dataset.key;

            if (currentObstacleIndex < totalObstacles) {
                const currentObstacle = currentLevel.obstacles[currentObstacleIndex];

                if (actionType === currentObstacle.type) {
                    // Correct action
                    obstaclesCleared++;
                    obstacleFeedback.textContent = currentObstacle.feedback;
                    obstacleFeedback.style.color = '#28a745'; // Green for correct
                    playCorrectSound();
                    animatePlayer(actionType); // Trigger player animation

                    // Move to next obstacle after animation (or immediately for simplicity)
                    setTimeout(() => {
                        currentObstacleIndex++;
                        updateScoreDisplay();
                        displayCurrentObstacle();
                    }, 500); // Small delay to see animation
                } else {
                    // Incorrect action
                    obstacleFeedback.textContent = `Wrong action! Try "${currentObstacle.actionText}" (Key ${currentObstacle.key}).`;
                    obstacleFeedback.style.color = '#dc3545'; // Red for incorrect
                    playWrongSound();
                }
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (event) => {
        if (!gameActive) return;
        
        const pressedKey = event.key;
        let actionTypeFromKey = null;

        // Map keyboard keys to actions
        keypadButtons.forEach(button => {
            if (button.dataset.key === pressedKey) {
                actionTypeFromKey = button.dataset.action;
                button.click(); // Programmatically click the button
                event.preventDefault(); // Prevent default browser actions
            }
        });
    });


    // --- Game State & Scoring ---
    function updateScoreDisplay() {
        scoreDisplay.textContent = `Obstacles Cleared: ${obstaclesCleared} / ${totalObstacles}`;
    }

    function handleLevelComplete() {
        gameActive = false;
        gameStatus.textContent = currentLevel.finishLineText;
        gameStatus.style.color = '#28a745';
        nextLevelBtn.style.display = 'inline-block';
        disableKeypad();
        playWinSound(); // Play a win sound
    }

    function disableKeypad() {
        keypadButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.6';
        });
    }

    function enableKeypad() {
        keypadButtons.forEach(button => {
            button.disabled = false;
            button.style.opacity = '1';
        });
    }

    // --- Player Animations ---
    function animatePlayer(actionType) {
        playerCharacter.classList.add(actionType); // Add specific animation class
        // Remove the class after animation completes to reset for next animation
        playerCharacter.addEventListener('animationend', () => {
            playerCharacter.classList.remove(actionType);
        }, { once: true }); // Ensure the event listener is removed after first execution
    }


    // --- Sound Effects (requires files in assets/sounds) ---
    const correctSound = new Audio('../../assets/sounds/correct.mp3');
    const wrongSound = new Audio('../../assets/sounds/wrong.mp3');
    const winSound = new Audio('../../assets/sounds/win.mp3'); 

    function playCorrectSound() {
        if (correctSound) {
            correctSound.currentTime = 0; // Rewind to start
            correctSound.play().catch(e => console.error("Sound play failed:", e));
        }
    }

    function playWrongSound() {
        if (wrongSound) {
            wrongSound.currentTime = 0;
            wrongSound.play().catch(e => console.error("Sound play failed:", e));
        }
    }

    function playWinSound() {
        if (winSound) {
            winSound.currentTime = 0;
            winSound.play().catch(e => console.error("Sound play failed:", e));
        }
    }

    // --- Event Listeners for Buttons ---
    restartLevelBtn.addEventListener('click', () => {
        loadLevel(currentLevelIndex); // Reload the current level
        gameStatus.textContent = '';
        obstacleFeedback.textContent = '';
    });

    nextLevelBtn.addEventListener('click', () => {
        currentLevelIndex++;
        loadLevel(currentLevelIndex);
    });

    // Start the game!
    initGame();
});
