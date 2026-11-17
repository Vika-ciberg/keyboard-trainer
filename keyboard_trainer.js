const texts = [
  "Програмування — це мистецтво створювати щось нове з нуля за допомогою логіки та коду.",
  "Швидкий сліпий друк економить десятки годин під час написання коду та роботи з текстами.",
  "Кожен великий проєкт починається з першого рядка коду та бажання експериментувати.",
  "Практика та регулярність — головні секрети впевненого володіння клавіатурою без погляду на клавіші."
];

const textDisplay = document.getElementById('text-display');
const timerEl = document.getElementById('timer');
const cpmEl = document.getElementById('cpm');
const accuracyEl = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');

let currentIndex = 0;
let errors = 0;
let totalTyped = 0;
let timeElapsed = 0;
let timerInterval = null;
let isStarted = false;
let isFinished = false;

// Ініціалізація нового тексту
function initTest() {
  clearInterval(timerInterval);
  currentIndex = 0;
  errors = 0;
  totalTyped = 0;
  timeElapsed = 0;
  isStarted = false;
  isFinished = false;

  timerEl.textContent = '0';
  cpmEl.textContent = '0';
  accuracyEl.textContent = '100';

  // Вибираємо випадковий текст
  const randomText = texts[Math.floor(Math.random() * texts.length)];
  
  // Розбиваємо текст на окремі <span> для кожного символу
  textDisplay.innerHTML = '';
  randomText.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.classList.add('char');
    if (index === 0) span.classList.add('current');
    textDisplay.appendChild(span);
  });
}

// Запуск таймера
function startTimer() {
  timerInterval = setInterval(() => {
    timeElapsed++;
    timerEl.textContent = timeElapsed;
    updateStats();
  }, 1000);
}

// Оновлення швидкості та точності
function updateStats() {
  if (timeElapsed > 0) {
    const cpm = Math.round((currentIndex / timeElapsed) * 60);
    cpmEl.textContent = cpm;
  }
  if (totalTyped > 0) {
    const accuracy = Math.max(0, Math.round(((totalTyped - errors) / totalTyped) * 100));
    accuracyEl.textContent = accuracy;
  }
}

// Обробка натискань клавіш
document.addEventListener('keydown', (e) => {
  // Ігноруємо службові клавіші (Shift, Ctrl, Alt, CapsLock тощо)
  if (e.key.length > 1 || isFinished) return;

  // Забороняємо прокрутку сторінки при натисканні пробілу
  if (e.key === ' ') e.preventDefault();

  if (!isStarted) {
    isStarted = true;
    startTimer();
  }

  const chars = textDisplay.querySelectorAll('.char');
  const currentChar = chars[currentIndex];

  totalTyped++;

  if (e.key === currentChar.textContent) {
    currentChar.classList.remove('current', 'incorrect');
    currentChar.classList.add('correct');
    currentIndex++;

    // Перевіряємо, чи закінчився текст
    if (currentIndex < chars.length) {
      chars[currentIndex].classList.add('current');
    } else {
      isFinished = true;
      clearInterval(timerInterval);
      updateStats();
    }
  } else {
    // Якщо натиснуто неправильну клавішу
    if (!currentChar.classList.contains('incorrect')) {
      errors++;
      currentChar.classList.add('incorrect');
    }
  }

  updateStats();
});

restartBtn.addEventListener('click', initTest);

// Старт при завантаженні сторінки
initTest();
