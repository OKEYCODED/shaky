let counter = 0;
let timer = 15;
let shaking = false;
let lastShakeTime = 0;
let shakeThreshold = 15;
let countdownInterval;

const counterEl = document.getElementById("counter");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const shakeSound = document.getElementById("shakeSound");
const hooraySound = document.getElementById("hooraySound");
const messageEl = document.getElementById("message");
const hoorayEl = document.getElementById("hooray");

function startGame() {
  counter = 0;
  timer = 15;
  shaking = true;
  counterEl.textContent = counter;
  timerEl.textContent = timer;
  messageEl.textContent = "";
  hoorayEl.textContent = "";
  hoorayEl.style.display = "none";
  startBtn.disabled = true;

  countdownInterval = setInterval(() => {
    timer--;
    timerEl.textContent = timer;

    if (timer <= 0) {
      clearInterval(countdownInterval);
      shaking = false;
      startBtn.disabled = false;
      showMessage();
    }
  }, 1000);
}

function showMessage() {
  if (counter >= 10) {
    messageEl.textContent = `🎉 Great job! You got ${counter} shakes!`;
    hoorayEl.textContent = "🎊 Hooray! 🎊";
    hoorayEl.style.display = "block";

    // Play hooray sound
    hooraySound.currentTime = 0;
    hooraySound.play();

    // Launch confetti
    launchConfetti();
  } else {
    messageEl.textContent = `👍 You got ${counter} shakes. Try again!`;
    hoorayEl.textContent = "";
    hoorayEl.style.display = "none";
  }
}

function launchConfetti() {
  const duration = 2000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 1000
  };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      particleCount,
      origin: {
        x: randomInRange(0.1, 0.9),
        y: Math.random() - 0.2
      },
      ...defaults
    });
  }, 250);
}

function enableShakeListener() {
  window.addEventListener("devicemotion", event => {
    if (!shaking || timer <= 0) return;

    const acc = event.accelerationIncludingGravity;
    const totalAcc = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);

    if (totalAcc > shakeThreshold) {
      const now = new Date().getTime();
      if (now - lastShakeTime > 500) {
        counter++;
        counterEl.textContent = counter;
        lastShakeTime = now;

        // Play shake sound
        shakeSound.currentTime = 0;
        shakeSound.play();
      }
    }
  });
}

function requestMotionPermission() {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === "granted") {
          enableShakeListener();
        } else {
          alert("Motion access denied.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error requesting motion access.");
      });
  } else {
    enableShakeListener();
  }
}

// Leaderboard Functions
function updateLeaderboard(newScore) {
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];

  scores.push({ score: newScore, date: new Date().toLocaleDateString() });
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 5);

  localStorage.setItem("leaderboard", JSON.stringify(scores));
  renderLeaderboard(scores);

}

function renderLeaderboard(scores) {
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  scores.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.score} shakes (${entry.date})`;
    list.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const savedScores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  renderLeaderboard(savedScores);
});

startBtn.addEventListener("click", () => {
  requestMotionPermission();
  startGame();
});
