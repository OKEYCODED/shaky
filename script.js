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
const messageEl = document.getElementById("message");

function startGame() {
  counter = 0;
  timer = 15;
  shaking = true;
  counterEl.textContent = counter;
  timerEl.textContent = timer;
  messageEl.textContent = "";
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
  } else {
    messageEl.textContent = `👍 You got ${counter} shakes. Try again!`;
  }
}

startBtn.addEventListener("click", startGame);

if (window.DeviceMotionEvent) {
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
        shakeSound.currentTime = 0;
        shakeSound.play();
      }
    }
  });
} else {
  alert("DeviceMotion not supported on this device.");
}
