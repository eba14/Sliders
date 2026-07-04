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
            document.getElementById('leave-game-modal').style.display = 'flex';
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
    const closeLeave = document.getElementById('close-leave');

    const closeLeaveModal = () => { leaveGameModal.style.display = 'none'; };

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

    cancelLeave.addEventListener('click', closeLeaveModal);
    closeLeave.addEventListener('click', closeLeaveModal);

    window.addEventListener('click', (event) => {
        if (event.target === leaveGameModal) closeLeaveModal();
    });
}

function setupRulesModal() {
    const rulesButton = document.getElementById('rules-button');
    const rulesModal = document.getElementById('rules-modal');
    const closeRules = document.getElementById('close-rules');

    rulesButton.addEventListener('click', () => {
        rulesModal.style.display = 'flex';
    });

    closeRules.addEventListener('click', () => {
        rulesModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === rulesModal) {
            rulesModal.style.display = 'none';
        }
    });
}

// Countdown functionality
function runCountdown(label, callback, isProgressive = false) {
    const countdownOverlay = document.getElementById('countdown-overlay');
    const countdownNumber = document.querySelector('.countdown-number');
    const countdownText = document.querySelector('.countdown-text');

    countdownOverlay.style.display = 'flex';
    countdownText.textContent = label;
    countdownText.classList.toggle('progressive', isProgressive);

    const steps = ['3', '2', '1', 'GO!'];
    let i = 0;

    function showStep() {
        // Animate in
        countdownNumber.textContent = steps[i];
        countdownNumber.classList.remove('animate-out');
        countdownNumber.classList.add('animate-in');

        const isLast = i === steps.length - 1;
        const displayDuration = isLast ? 900 : 650;

        setTimeout(() => {
            if (isLast) {
                countdownOverlay.style.display = 'none';
                callback();
            } else {
                // Animate out then show next
                countdownNumber.classList.remove('animate-in');
                countdownNumber.classList.add('animate-out');
                setTimeout(() => {
                    i++;
                    showStep();
                }, 350);
            }
        }, displayDuration);
    }

    showStep();
}

function showGameStartCountdown(callback) {
    runCountdown('Get Ready!', callback, false);
}

function showProgressiveCountdown(callback) {
    const nextLevel = gameState.currentProgressiveLevel + 1;
    runCountdown(`Next: ${nextLevel}×${nextLevel}`, callback, true);
}

// Export the countdown functions
export { showProgressiveCountdown };