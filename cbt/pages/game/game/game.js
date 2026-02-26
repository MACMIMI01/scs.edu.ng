// --- HTML Element References ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

const mainMenu = document.getElementById('mainMenu');
const gameScreen = document.getElementById('gameScreen');
const howToPlayModal = document.getElementById('howToPlayModal');
const aboutModal = document.getElementById('aboutModal');
const loadingScreen = document.getElementById('loadingScreen');

const startButton = document.getElementById('startButton');
const howToPlayButton = document.getElementById('howToPlayButton');
const aboutButton = document.getElementById('aboutButton');
const restartGameButton = document.getElementById('restartGameButton');
const backToMenuButton = document.getElementById('backToMenuButton');
const closeModalButtons = document.querySelectorAll('.close-modal-button');


// --- Game Variables ---
let gameData = {}; // Will load from JSON
let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 40, // Adjusted size to better fit an image
    speed: 3,
    image: null // To hold the loaded player image
};
let pets = [];
let score = 0;
let timeLeft = 0;
let gameInterval;
let petSpawnInterval;
let countdownInterval;
let currentLevelData;

// --- Asset Storage ---
const assetCache = {
    images: {},
    sounds: {}
};
let backgroundMusic; // Global variable for background music


// --- UI and Screen Management Functions ---
function showScreen(screenElement) {
    document.querySelectorAll('.game-screen, .modal').forEach(el => el.classList.add('hidden'));
    screenElement.classList.remove('hidden');
}

function showMainMenu() {
    showScreen(mainMenu);
    clearInterval(gameInterval);
    clearInterval(petSpawnInterval);
    clearInterval(countdownInterval);
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
}

function startGame() {
    showScreen(gameScreen);
    initGame();
    restartGameButton.classList.add('hidden');
    if (backgroundMusic) {
        backgroundMusic.play().catch(e => console.log("Background music autoplay prevented:", e));
    }
}

function showHowToPlay() {
    showScreen(howToPlayModal);
}

function showAbout() {
    showScreen(aboutModal);
}


// --- Game Initialization ---
async function loadGameData() {
    showScreen(loadingScreen);

    try {
        // Load JSON Game Data
        const response = await fetch('pets.json');
        gameData = await response.json();
        console.log("Game Data Loaded:", gameData);

        // --- Load All Images ---
        const imagePromises = [];

        // Player image
        const playerImg = new Image();
        playerImg.src = 'assets/images/police-cruiser.png';
        imagePromises.push(playerImg.decode().then(() => player.image = playerImg));

        // Pet images
        for (const petType of gameData.petTypes) {
            const img = new Image();
            img.src = `assets/images/${petType.id}.png`;
            imagePromises.push(img.decode().then(() => assetCache.images[petType.id] = img));
        }

        // Obstacle images (if you choose to use them, otherwise they'll be drawn as shapes)
        // Example:
        // const bushImg = new Image();
        // bushImg.src = 'assets/images/bush.png';
        // imagePromises.push(bushImg.decode().then(() => assetCache.images['bush'] = bushImg));
        // const pondImg = new Image();
        // pondImg.src = 'assets/images/pond.png';
        // imagePromises.push(pondImg.decode().then(() => assetCache.images['pond'] = pondImg));

        await Promise.all(imagePromises); // Wait for all images to load
        console.log("Images Loaded:", assetCache.images);

        // --- Load Sounds ---
        assetCache.sounds.rescueChime = new Audio('assets/sounds/rescue-chime.mp3');
        // Preload if necessary, by briefly playing and pausing, or setting `preload="auto"` in HTML
        // assetCache.sounds.rescueChime.load();

        backgroundMusic = new Audio('assets/sounds/background-music.mp3');
        backgroundMusic.loop = true; // Loop the background music
        backgroundMusic.volume = 0.3; // Lower volume for background music
        // backgroundMusic.load(); // Preload

        console.log("Sounds Loaded:", assetCache.sounds);

        // Assets and data loaded, now show the main menu
        showMainMenu();

    } catch (error) {
        console.error("Failed to load game data or assets:", error);
        alert("Failed to load game. Please check the console for errors.");
        // Potentially show a more informative error screen
    } finally {
        loadingScreen.classList.add('hidden'); // Always hide loading screen regardless of success/failure
    }
}

function initGame(levelId = 1) {
    currentLevelData = gameData.levels.find(level => level.levelId === levelId);
    if (!currentLevelData) {
        console.error("Level data not found!");
        showMainMenu();
        return;
    }

    score = 0;
    timeLeft = currentLevelData.timeLimit;
    pets = [];
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;

    clearInterval(gameInterval);
    clearInterval(petSpawnInterval);
    clearInterval(countdownInterval);

    startGameLoop();
}

// --- Game Loop ---
function startGameLoop() {
    gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
    petSpawnInterval = setInterval(spawnPet, 2000); // Spawn a pet every 2 seconds
    countdownInterval = setInterval(updateTimer, 1000);
}

function gameLoop() {
    updateGame();
    drawGame();
}

function updateGame() {
    // Update pet positions and check collisions
    pets.forEach(pet => {
        pet.x += (Math.random() - 0.5) * pet.speed * 2;
        pet.y += (Math.random() - 0.5) * pet.speed * 2;

        pet.x = Math.max(pet.size / 2, Math.min(canvas.width - pet.size / 2, pet.x));
        pet.y = Math.max(pet.size / 2, Math.min(canvas.height - pet.size / 2, pet.y));

        if (checkCollision(player, pet)) {
            rescuePet(pet);
        }
    });
}

function drawGame() {
    // Clear canvas and draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#aaddaa'; // Green grass/park background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw obstacles (using shapes for now, but could use images from assetCache.images)
    currentLevelData.obstacles.forEach(obstacle => {
        // if (assetCache.images[obstacle.type]) {
        //     ctx.drawImage(assetCache.images[obstacle.type], obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        // } else {
            if (obstacle.type === 'bush') {
                ctx.fillStyle = '#228B22';
            } else if (obstacle.type === 'pond') {
                ctx.fillStyle = '#87CEEB';
            }
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        // }
    });

    // Draw player (friendly cruiser)
    if (player.image) {
        ctx.drawImage(player.image, player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
    } else {
        ctx.fillStyle = 'blue'; // Fallback color
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw pets
    pets.forEach(pet => {
        const petImg = assetCache.images[pet.id];
        if (petImg) {
            ctx.drawImage(petImg, pet.x - pet.size / 2, pet.y - pet.size / 2, pet.size, pet.size);
        } else {
            ctx.fillStyle = pet.color; // Fallback color from JSON
            ctx.beginPath();
            ctx.arc(pet.x, pet.y, pet.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = 'black';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(pet.name, pet.x, pet.y + pet.size / 2 + 10);
    });
}


// --- Player Input ---
let keys = {};
window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
    }
    keys[e.key] = true;
    updatePlayerPosition();
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function updatePlayerPosition() {
    if (gameScreen.classList.contains('hidden')) return;

    if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;

    player.x = Math.max(player.size / 2, Math.min(canvas.width - player.size / 2, player.x));
    player.y = Math.max(player.size / 2, Math.min(canvas.height - player.size / 2, player.y));
}

// --- Game Mechanics ---
function spawnPet() {
    if (gameScreen.classList.contains('hidden') || pets.length >= currentLevelData.petsToRescue * 2) return;

    const randomPetType = getRandomPetType();
    if (!randomPetType) return;

    const petData = gameData.petTypes.find(type => type.id === randomPetType);
    if (!petData) return;

    pets.push({
        ...petData,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        isRescued: false
    });
}

function getRandomPetType() {
    const rand = Math.random();
    let cumulativeProbability = 0;
    for (const petId in currentLevelData.petSpawnRates) {
        cumulativeProbability += currentLevelData.petSpawnRates[petId];
        if (rand <= cumulativeProbability) {
            return petId;
        }
    }
    return null;
}

function checkCollision(obj1, obj2) {
    const distanceX = obj1.x - obj2.x;
    const distanceY = obj1.y - obj2.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    return distance < (obj1.size / 2 + obj2.size / 2);
}

function rescuePet(pet) {
    if (pet.isRescued) return;
    pet.isRescued = true;
    score++;
    scoreDisplay.textContent = score;

    // Play rescue sound
    if (assetCache.sounds.rescueChime) {
        assetCache.sounds.rescueChime.play().catch(e => console.log("Rescue sound autoplay prevented:", e));
    }

    setTimeout(() => {
        pets = pets.filter(p => p !== pet);
        checkGameOver();
    }, 200);

    console.log(`Rescued ${pet.name}!`);
}

function updateTimer() {
    if (gameScreen.classList.contains('hidden')) return;
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
        gameOver();
    }
}

function checkGameOver() {
    if (score >= currentLevelData.petsToRescue) {
        clearInterval(gameInterval);
        clearInterval(petSpawnInterval);
        clearInterval(countdownInterval);
        alert(`Level Complete! You rescued all ${currentLevelData.petsToRescue} pets!`);
        restartGameButton.textContent = "Play Again";
        restartGameButton.classList.remove('hidden');
        if (backgroundMusic) backgroundMusic.pause();
    }
}

function gameOver() {
    clearInterval(gameInterval);
    clearInterval(petSpawnInterval);
    clearInterval(countdownInterval);
    alert(`Game Over! You rescued ${score} pets out of ${currentLevelData.petsToRescue}.`);
    restartGameButton.textContent = "Try Again";
    restartGameButton.classList.remove('hidden');
    if (backgroundMusic) backgroundMusic.pause();
}


// --- Event Listeners for UI ---
startButton.addEventListener('click', startGame);
howToPlayButton.addEventListener('click', showHowToPlay);
aboutButton.addEventListener('click', showAbout);
backToMenuButton.addEventListener('click', showMainMenu);
restartGameButton.addEventListener('click', () => {
    initGame();
    restartGameButton.classList.add('hidden');
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.modal').classList.add('hidden');
        showMainMenu();
    });
});


// --- Initial Load ---
loadGameData();