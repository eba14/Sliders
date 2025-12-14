// Game interaction and movement logic
import { gameState } from './game-state.js';
import { checkSolved, isSolvable, setTileColors } from './puzzle-logic.js';
import { renderPuzzle, renderGoal } from './rendering.js';
import { startTimer, resetTimer, stopTimer, getCurrentTime } from './timer.js';

const puzzleContainer = document.getElementById('puzzle-container');
const congratulationsMessage = document.getElementById('congratulations-message');
const newGameButton = document.getElementById('new-game-button');
const shuffleButton = document.getElementById('shuffle-button');

export function initializePuzzle(size) {
    gameState.isGameOver = false;
    gameState.puzzleSize = size;
    const fullSet = Array.from({ length: gameState.puzzleSize * gameState.puzzleSize - 1 }, (_, i) => i + 1);

    gameState.goalTiles = [...fullSet, null];
    do {
        for (let i = gameState.goalTiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gameState.goalTiles[i], gameState.goalTiles[j]] = [gameState.goalTiles[j], gameState.goalTiles[i]];
        }
    } while (JSON.stringify(gameState.goalTiles) === JSON.stringify([...fullSet, null]));

    gameState.tiles = [...fullSet, null];
    do {
        for (let i = gameState.tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gameState.tiles[i], gameState.tiles[j]] = [gameState.tiles[j], gameState.tiles[i]];
        }
    } while (!isSolvable() || JSON.stringify(gameState.tiles) === JSON.stringify(gameState.goalTiles));

    gameState.emptyTileIndex = gameState.tiles.indexOf(null);

    setTileColors();
    renderGoal();
    renderPuzzle();
}

export function shuffleTiles() {
    gameState.isGameOver = false;
    congratulationsMessage.style.display = 'none';
    newGameButton.style.display = 'none';

    const fullSet = Array.from({ length: gameState.puzzleSize * gameState.puzzleSize - 1 }, (_, i) => i + 1);
    gameState.tiles = [...fullSet, null];
    
    do {
        for (let i = gameState.tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gameState.tiles[i], gameState.tiles[j]] = [gameState.tiles[j], gameState.tiles[i]];
        }
    } while (!isSolvable() || JSON.stringify(gameState.tiles) === JSON.stringify(gameState.goalTiles));

    gameState.emptyTileIndex = gameState.tiles.indexOf(null);
    renderPuzzle();
    
    if (gameState.isProgressiveMode) {
        const currentTime = getCurrentTime();
        gameState.levelStartTime = currentTime.seconds + (currentTime.minutes * 60);
    } else {
        resetTimer();
        startTimer();
    }
}

export function moveTile(clickedIndex) {
    if (gameState.isGameOver) {
        return;
    }
    const rowClicked = Math.floor(clickedIndex / gameState.puzzleSize);
    const colClicked = clickedIndex % gameState.puzzleSize;
    const rowEmpty = Math.floor(gameState.emptyTileIndex / gameState.puzzleSize);
    const colEmpty = gameState.emptyTileIndex % gameState.puzzleSize;

    const isAdjacent = (
        (Math.abs(rowClicked - rowEmpty) === 1 && colClicked === colEmpty) ||
        (Math.abs(colClicked - colEmpty) === 1 && rowClicked === rowEmpty)
    );

    if (isAdjacent) {
        const clickedTile = puzzleContainer.children[clickedIndex];
        
        // Calculate slide direction
        const deltaRow = rowEmpty - rowClicked;
        const deltaCol = colEmpty - colClicked;
        
        // Get computed tile size more accurately
        const tileRect = clickedTile.getBoundingClientRect();
        const containerRect = puzzleContainer.getBoundingClientRect();
        const tileSize = tileRect.width;
        const gapSize = (containerRect.width - (gameState.puzzleSize * tileSize)) / (gameState.puzzleSize - 1);
        const moveDistance = tileSize + gapSize;
        
        // Apply sliding animation
        clickedTile.classList.add('sliding');
        clickedTile.style.transform = `translate(${deltaCol * moveDistance}px, ${deltaRow * moveDistance}px)`;
        
        setTimeout(() => {
            // Update data and re-render
            [gameState.tiles[clickedIndex], gameState.tiles[gameState.emptyTileIndex]] = [gameState.tiles[gameState.emptyTileIndex], gameState.tiles[clickedIndex]];
            gameState.emptyTileIndex = clickedIndex;
            renderPuzzle();
            
            if (checkSolved()) {
                handlePuzzleSolved();
            }
        }, 200);
    } else {
        // Shake animation for invalid moves
        const clickedTile = puzzleContainer.children[clickedIndex];
        clickedTile.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => {
            clickedTile.style.animation = '';
        }, 300);
    }
}

function handlePuzzleSolved() {
    if (gameState.isProgressiveMode) {
        const currentTime = getCurrentTime();
        const totalTime = currentTime.seconds + (currentTime.minutes * 60);
        const levelTime = totalTime - gameState.levelStartTime;
        gameState.progressiveTimes.push(`${gameState.puzzleSize}×${gameState.puzzleSize}: ${Math.floor(levelTime/60)}:${(levelTime%60).toString().padStart(2,'0')}`);
        
        if (gameState.currentProgressiveLevel < 7) {
            // Show progress notification
            const progressNotification = document.getElementById('progress-notification');
            progressNotification.style.display = 'block';
            
            setTimeout(() => {
                progressNotification.style.display = 'none';
                gameState.currentProgressiveLevel++;
                initializePuzzle(gameState.currentProgressiveLevel);
                shuffleTiles();
            }, 2000);
        } else {
            stopTimer();
            const time = getCurrentTime();
            congratulationsMessage.innerHTML = `<h2>🎉 Progressive Mode Complete! 🎉</h2><p>Total Time: ${time.minutes < 10 ? '0' + time.minutes : time.minutes}:${time.seconds < 10 ? '0' + time.seconds : time.seconds}</p><p>Level Times:<br>${gameState.progressiveTimes.join('<br>')}</p>`;
            congratulationsMessage.style.display = 'block';
            newGameButton.style.display = 'block';
            shuffleButton.style.display = 'none';
            gameState.isGameOver = true;
        }
    } else {
        stopTimer();
        congratulationsMessage.style.display = 'block';
        newGameButton.style.display = 'block';
        shuffleButton.style.display = 'none';
        gameState.isGameOver = true;
    }
    
    // Add celebration effect
    puzzleContainer.style.animation = 'pulse 0.5s ease-in-out';
}