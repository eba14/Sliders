// UI event handlers and modal management
import { gameState, setProgressiveMode } from './game-state.js';
import { initializePuzzle, shuffleTiles } from './game-controls.js';
import { startTimer, resetTimer, setTime } from './timer.js';

const startGameButton = document.getElementById('start-game-button');
const shuffleButton = document.getElementById('shuffle-button');
const newGameButton = document.getElementById('new-game-button');
const changeDifficultyButton = document.getElementById('change-difficulty-button');
const difficultySelector = document.getElementById('puzzle-size');
const gameSetup = document.querySelector('.game-setup');
const gameContainer = document.querySelector('.game-container');
const congratulationsMessage = document.getElementById('congratulations-message');

export function initializeUIHandlers() {
    setupDifficultySelection();
    setupGameControls();
    setupModals();
}

function setupDifficultySelection() {
    const difficultyOptions = document.querySelectorAll('.difficulty-option');

    difficultyOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            difficultyOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            option.classList.add('selected');
            // Update hidden input value
            difficultySelector.value = option.dataset.size;
        });
    });
}

function setupGameControls() {
    startGameButton.addEventListener('click', () => {
        document.body.className = 'game-page';
        gameSetup.style.display = 'none';
        gameContainer.style.display = 'flex';
        const selectedValue = difficultySelector.value;
        
        if (selectedValue === 'progressive') {
            setProgressiveMode(true);
            gameState.currentProgressiveLevel = 3;
            gameState.progressiveTimes = [];
            setTime(0, 0);
            document.getElementById('timer-display').textContent = 'Time: 00:00';
            initializePuzzle(3);
            shuffleTiles();
            startTimer();
        } else {
            setProgressiveMode(false);
            initializePuzzle(parseInt(selectedValue));
            shuffleTiles();
        }
    });

    shuffleButton.addEventListener('click', shuffleTiles);

    newGameButton.addEventListener('click', () => {
        shuffleButton.style.display = 'block';
        newGameButton.style.display = 'none';
        congratulationsMessage.style.display = 'none';
        initializePuzzle(gameState.puzzleSize);
        shuffleTiles();
    });

    changeDifficultyButton.addEventListener('click', () => {
        if (gameState.isGameOver) {
            // Game is completed, go directly to setup without warning
            document.body.className = 'setup-page';
            gameSetup.style.display = 'block';
            gameContainer.style.display = 'none';
            congratulationsMessage.style.display = 'none';
            newGameButton.style.display = 'none';
            shuffleButton.style.display = 'block';
            resetTimer();
        } else {
            // Game in progress, show warning modal
            document.getElementById('leave-game-modal').style.display = 'block';
        }
    });
}

function setupModals() {
    setupLeaveGameModal();
    setupRulesModal();
}

function setupLeaveGameModal() {
    const leaveGameModal = document.getElementById('leave-game-modal');
    const confirmLeave = document.getElementById('confirm-leave');
    const cancelLeave = document.getElementById('cancel-leave');

    confirmLeave.addEventListener('click', () => {
        document.body.className = 'setup-page';
        gameSetup.style.display = 'block';
        gameContainer.style.display = 'none';
        congratulationsMessage.style.display = 'none';
        newGameButton.style.display = 'none';
        shuffleButton.style.display = 'block';
        leaveGameModal.style.display = 'none';
        resetTimer();
    });

    cancelLeave.addEventListener('click', () => {
        leaveGameModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === leaveGameModal) {
            leaveGameModal.style.display = 'none';
        }
    });
}

function setupRulesModal() {
    const rulesButton = document.getElementById('rules-button');
    const rulesModal = document.getElementById('rules-modal');
    const closeModal = document.querySelector('.close');

    rulesButton.addEventListener('click', () => {
        rulesModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        rulesModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === rulesModal) {
            rulesModal.style.display = 'none';
        }
    });
}