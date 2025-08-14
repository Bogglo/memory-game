// script/game.js
const soundFlip = new Audio('sound/flip.mp3');
const soundMatch = new Audio('sound/match.mp3');
const soundNoMatch = new Audio('sound/nomatch.mp3');
const soundWin = new Audio('sound/win.mp3');

function playSound(audio) {
  audio.currentTime = 0;
  audio.play();
}

let timer = 0;
let intervalId;
let attempts = 0;
let timerStarted = false;

function startTimer() {
  timer = 0;
  document.getElementById('timeCounter').innerText = '0';
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    timer++;
    document.getElementById('timeCounter').innerText = timer;
  }, 1000);
}

function resetStats() {
  attempts = 0;
  timerStarted = false;
  document.getElementById('attemptCounter').innerText = '0';
  document.getElementById('timeCounter').innerText = '0';
  clearInterval(intervalId);
}

function startGame() {
  document.getElementById('playAgain').style.display = 'none';
  document.getElementById('winMessage').style.display = 'none';
  document.getElementById('gameBoard').innerHTML = '';
  resetStats();

  const allEmojis = ['😀','😎','😂','😍','🥳','😈','🤖','👽'];
  const cards = [...allEmojis, ...allEmojis].sort(() => Math.random() - 0.5);

  const gameBoard = document.getElementById('gameBoard');
  let flippedCards = [];
  let matched = 0;

  cards.forEach((emoji) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.item = emoji;
    card.innerText = '';

    card.addEventListener('click', () => {
      if (!timerStarted) {
        startTimer();
        timerStarted = true;
      }

      if (card.classList.contains('flipped') || flippedCards.length === 2) return;

      card.classList.add('flipped');
      card.innerText = emoji;
      flippedCards.push(card);
      attempts++;
      document.getElementById('attemptCounter').innerText = attempts;
      playSound(soundFlip);

      if (flippedCards.length === 2) {
        const [first, second] = flippedCards;
        if (first.dataset.item === second.dataset.item) {
          matched++;
          flippedCards = [];
          playSound(soundMatch);

          if (matched === allEmojis.length) {
            clearInterval(intervalId);
            document.getElementById('winMessage').style.display = 'block';
            document.getElementById('playAgain').style.display = 'inline-block';
            playSound(soundWin);
          }
        } else {
          playSound(soundNoMatch);
          setTimeout(() => {
            first.classList.remove('flipped');
            second.classList.remove('flipped');
            first.innerText = '';
            second.innerText = '';
            flippedCards = [];
          }, 800);
        }
      }
    });

    gameBoard.appendChild(card);
  });
}

document.getElementById('playAgain').addEventListener('click', startGame);
document.getElementById('resetGame').addEventListener('click', startGame);

startGame();
