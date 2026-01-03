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
        const selectedValue = difficultySelector.value;
        const validationError = document.getElementById('validation-error');
        
        // Validate that a difficulty is selected
        if (!selectedValue) {
            validationError.style.display = 'block';
            setTimeout(() => {
                validationError.style.display = 'none';
            }, 3000);
            return;
        }
        
        // Hide validation error if shown
        validationError.style.display = 'none';
        
        document.body.className = 'game-page';
        gameSetup.style.display = 'none';
        gameContainer.style.display = 'flex';
        
        if (selectedValue === 'progressive') {
            setProgressiveMode(true);
            gameState.currentProgressiveLevel = 3;
            gameState.progressiveTimes = [];
            setTime(0, 0);
            document.getElementById('timer-display').textContent = 'Time: 00:00';
            initializePuzzle(3);
            shuffleTiles();
            showGameStartCountdown(() => {
                startTimer();
            });
        } else {
            setProgressiveMode(false);
            initializePuzzle(parseInt(selectedValue));
            shuffleTiles();
            showGameStartCountdown(() => {
                resetTimer();
                startTimer();
            });
        }
    });

    shuffleButton.addEventListener('click', shuffleTiles);

    newGameButton.addEventListener('click', () => {
        shuffleButton.style.display = 'block';
        newGameButton.style.display = 'none';
        congratulationsMessage.style.display = 'none';
        // Reset puzzle highlight
        const puzzleContainer = document.getElementById('puzzle-container');
        puzzleContainer.style.transition = '';
        puzzleContainer.style.background = '';
        puzzleContainer.style.border = '';
        puzzleContainer.style.boxShadow = '';
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
            
            // Clear game mode selection
            const difficultyOptions = document.querySelectorAll('.difficulty-option');
            difficultyOptions.forEach(opt => opt.classList.remove('selected'));
            difficultySelector.value = '';
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
        
        // Clear game mode selection
        const difficultyOptions = document.querySelectorAll('.difficulty-option');
        difficultyOptions.forEach(opt => opt.classList.remove('selected'));
        difficultySelector.value = '';
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

// Countdown functionality
function showGameStartCountdown(callback) {
    const countdownOverlay = document.getElementById('countdown-overlay');
    const countdownNumber = document.querySelector('.countdown-number');
    const countdownText = document.querySelector('.countdown-text');
    
    countdownOverlay.style.display = 'flex';
    countdownText.textContent = 'Get Ready!';
    
    let count = 3;
    countdownNumber.textContent = count;
    countdownNumber.style.animation = 'countdownFadeSlide 0.8s ease-out';
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.style.animation = 'countdownSlideDown 0.4s ease-in';
            setTimeout(() => {
                countdownNumber.textContent = count;
                countdownNumber.style.animation = 'countdownFadeSlide 0.6s ease-out';
            }, 400);
        } else {
            countdownNumber.style.animation = 'countdownSlideDown 0.4s ease-in';
            setTimeout(() => {
                countdownNumber.textContent = 'GO!';
                countdownText.textContent = 'Start Playing!';
                countdownNumber.style.animation = 'countdownFadeSlide 0.6s ease-out';
            }, 400);
            
            setTimeout(() => {
                countdownOverlay.style.display = 'none';
                callback();
            }, 1400);
            
            clearInterval(countdownInterval);
        }
    }, 1000);
}

function showProgressiveCountdown(callback) {
    const countdownOverlay = document.getElementById('countdown-overlay');
    const countdownNumber = document.querySelector('.countdown-number');
    const countdownText = document.querySelector('.countdown-text');
    
    countdownOverlay.style.display = 'flex';
    countdownText.textContent = `Next Level: ${gameState.currentProgressiveLevel + 1}×${gameState.currentProgressiveLevel + 1}`;
    
    let count = 3;
    countdownNumber.textContent = count;
    countdownNumber.style.animation = 'countdownFadeSlide 0.8s ease-out';
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.style.animation = 'countdownSlideDown 0.4s ease-in';
            setTimeout(() => {
                countdownNumber.textContent = count;
                countdownNumber.style.animation = 'countdownFadeSlide 0.6s ease-out';
            }, 400);
        } else {
            countdownNumber.style.animation = 'countdownSlideDown 0.4s ease-in';
            setTimeout(() => {
                countdownNumber.textContent = 'GO!';
                countdownText.textContent = 'Continue!';
                countdownNumber.style.animation = 'countdownFadeSlide 0.6s ease-out';
            }, 400);
            
            setTimeout(() => {
                countdownOverlay.style.display = 'none';
                callback();
            }, 1400);
            
            clearInterval(countdownInterval);
        }
    }, 1000);
}

// Export the countdown functions
export { showProgressiveCountdown };