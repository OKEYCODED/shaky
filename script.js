let counter = 0;
let timer = 15;
let shaking = false;
let lastShakeTime = 0;
let shakeThreshold = 15; // Adjust this based on sensitivity
let timerInterval;
let countdownInterval;

const counterEl = document.getElementById("counter");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");

function startGame() {
  counter = 0;
  timer = 15;
  shaking = true;
  counterEl.textContent = counter;
  timerEl.textContent = timer;
  startBtn.disabled = true;

  countdownInterval = setInterval(() => {
    timer--;
    timerEl.textContent = timer;
    if (timer <= 0) {
      clearInterval(countdownInterval);
      shaking = false;
      startBtn.disabled = false;
    }
  }, 1000);
}

startBtn.addEventListener("click", startGame);

if (window.DeviceMotionEvent) {
  window.addEventListener("devicemotion", event => {
    if (!shaking || timer <= 0) return;

    const acc = event.accelerationIncludingGravity;
    const totalAcc = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);

    if (totalAcc > shakeThreshold) {
      const now = new Date().getTime();
      if (now - lastShakeTime > 500) { // 500ms cooldown to prevent double-counting
        counter++;
        counterEl.textContent = counter;
        lastShakeTime = now;
      }
    }
  });
} else {
  alert("DeviceMotion not supported on this device.");
}
