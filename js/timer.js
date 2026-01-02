// Timer functionality
import { gameState } from './game-state.js';

let timer;
let seconds = 0;
let minutes = 0;

const timerDisplay = document.getElementById('timer-display');

export function updateTimer() {
    seconds++;
    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    timerDisplay.textContent = `Time: ${formattedMinutes}:${formattedSeconds}`;
}

export function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

export function stopTimer() {
    clearInterval(timer);
}

export function resetTimer() {
    stopTimer();
    if (!gameState.isProgressiveMode) {
        seconds = 0;
        minutes = 0;
        timerDisplay.textContent = 'Time: 00:00';
    }
}

export function getCurrentTime() {
    return { seconds, minutes };
}

export function setTime(newSeconds, newMinutes) {
    seconds = newSeconds;
    minutes = newMinutes;
}

export function pauseTimer() {
    clearInterval(timer);
}

export function resumeTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}