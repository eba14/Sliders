// Game state management
export const gameState = {
    puzzleSize: null,
    tiles: [],
    goalTiles: [],
    emptyTileIndex: null,
    isGameOver: false,
    isProgressiveMode: false,
    currentProgressiveLevel: 3,
    progressiveTimes: [],
    levelStartTime: 0,
    isTransitioning: false
};

export function resetGameState() {
    gameState.isGameOver = false;
    gameState.tiles = [];
    gameState.goalTiles = [];
    gameState.emptyTileIndex = null;
}

export function setProgressiveMode(enabled) {
    gameState.isProgressiveMode = enabled;
    if (enabled) {
        gameState.currentProgressiveLevel = 3;
        gameState.progressiveTimes = [];
    }
}