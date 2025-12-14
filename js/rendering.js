// DOM rendering functions
import { gameState } from './game-state.js';
import { moveTile } from './game-controls.js';

const puzzleContainer = document.getElementById('puzzle-container');
const goalContainer = document.getElementById('goal-container');

export function renderPuzzle() {
    puzzleContainer.innerHTML = '';
    puzzleContainer.style.setProperty('--puzzle-size', gameState.puzzleSize);

    gameState.tiles.forEach((tile, index) => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('puzzle-tile');
        
        if (tile === null) {
            tileElement.classList.add('empty-tile');
            tileElement.textContent = '';
        } else {
            tileElement.textContent = tile;
            tileElement.tabIndex = 0;
            tileElement.setAttribute('aria-label', `Tile ${tile}`);
            tileElement.addEventListener('click', () => moveTile(index));
            tileElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    moveTile(index);
                }
            });
        }
        
        // Reset any transforms from previous animations
        tileElement.style.transform = '';
        
        puzzleContainer.appendChild(tileElement);
    });
}

export function renderGoal() {
    goalContainer.innerHTML = '';
    goalContainer.style.setProperty('--puzzle-size', gameState.puzzleSize);

    gameState.goalTiles.forEach(tile => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('goal-tile');
        if (tile === null) {
            tileElement.classList.add('empty-tile');
        } else {
            tileElement.textContent = tile;
        }
        goalContainer.appendChild(tileElement);
    });
}