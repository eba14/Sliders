// Core puzzle logic and algorithms
import { gameState } from './game-state.js';

export function getEmptyRowFromBottom(arr, size) {
    const emptyIndex = arr.indexOf(null);
    const emptyRow = Math.floor(emptyIndex / size);
    return size - emptyRow;
}

export function getInversionCount(arr) {
    let inversions = 0;
    const cleanArr = arr.filter(tile => tile !== null);
    for (let i = 0; i < cleanArr.length; i++) {
        for (let j = i + 1; j < cleanArr.length; j++) {
            if (cleanArr[i] > cleanArr[j]) {
                inversions++;
            }
        }
    }
    return inversions;
}

export function isSolvable() {
    const startInversions = getInversionCount(gameState.tiles);
    const goalInversions = getInversionCount(gameState.goalTiles);

    if (gameState.puzzleSize % 2 !== 0) { // Odd grid
        return (startInversions % 2) === (goalInversions % 2);
    } else { // Even grid
        const startEmptyRow = getEmptyRowFromBottom(gameState.tiles, gameState.puzzleSize);
        const goalEmptyRow = getEmptyRowFromBottom(gameState.goalTiles, gameState.puzzleSize);
        
        return ((startInversions + startEmptyRow) % 2) === ((goalInversions + goalEmptyRow) % 2);
    }
}

export function checkSolved() {
    return JSON.stringify(gameState.tiles) === JSON.stringify(gameState.goalTiles);
}

export function setTileColors() {
    const tileColors = {
        3: { light: '#87ceeb', dark: '#4682b4' },  // Sky blue to steel blue
        4: { light: '#98d982', dark: '#2e7d32' },  // Soft green to forest green
        5: { light: '#ffff99', dark: '#cccc00' },  // Light yellow to dark yellow
        6: { light: '#ffb366', dark: '#ff8c00' },  // Light orange to dark orange
        7: { light: '#ff9999', dark: '#dc143c' }   // Light red to crimson
    };
    document.documentElement.style.setProperty('--tile-color', tileColors[gameState.puzzleSize].light);
    document.documentElement.style.setProperty('--tile-color-dark', tileColors[gameState.puzzleSize].dark);
}