const lessonAllowedChars = [
  "олджфіва", 
  "олджфіваенгшщз", 
  "олджфіваенгшщзячсмитьбю" 
];

const trainingData = {
  words: [
    "код магія стиль метод файл клас обєкт цикл масив",
    "сайт веб дизайн крок тест швидкість букви текст",
    "рядок логіка пошук клік кнопка стан файл проєкт"
  ],
  sentences: [
    "Програмування — це мистецтво створювати нове за допомогою логіки та коду.",
    "Швидкий сліпий друк економить десятки годин під час написання коду.",
    "Кожен великий проєкт починається з першого рядка коду та практики."
  ]
};

const keyFingerMap = {
  'ф': { key: 'ф', finger: 'l-pinky' },
  'і': { key: 'і', finger: 'l-ring' },
  'в': { key: 'в', finger: 'l-middle' },
  'а': { key: 'а', finger: 'l-index' },
  'п': { key: 'п', finger: 'l-index' },
  'р': { key: 'р', finger: 'r-index' },
  'о': { key: 'о', finger: 'r-index' },
  'л': { key: 'л', finger: 'r-middle' },
  'д': { key: 'д', finger: 'r-ring' },
  'ж': { key: 'ж', finger: 'r-pinky' },
  'є': { key: 'є', finger: 'r-pinky' },
  
  'й': { key: 'й', finger: 'l-pinky' },
  'ц': { key: 'ц', finger: 'l-ring' },
  'у': { key: 'у', finger: 'l-middle' },
  'к': { key: 'к', finger: 'l-index' },
  'е': { key: 'е', finger: 'l-index' },
  'н': { key: 'н', finger: 'r-index' },
  'г': { key: 'г', finger: 'r-index' },
  'ш': { key: 'ш', finger: 'r-middle' },
  'щ': { key: 'щ', finger: 'r-ring' },
  'з': { key: 'з', finger: 'r-pinky' },
  'х': { key: 'х', finger: 'r-pinky' },
  'ї': { key: 'ї', finger: 'r-pinky' },

  'я': { key: 'я', finger: 'l-pinky' },
  'ч': { key: 'ч', finger: 'l-ring' },
  'с': { key: 'с', finger: 'l-middle' },
  'м': { key: 'м', finger: 'l-index' },
  'и': { key: 'и', finger: 'l-index' },
  'т': { key: 'т', finger: 'r-index' },
  'ь': { key: 'ь', finger: 'r-index' },
  'б': { key: 'б', finger: 'r-middle' },
  'ю': { key: 'ю', finger: 'r-ring' },
  ' ': { key: ' ', finger: 'r-thumb' }
};

let currentCategory = 'lessons'; 
let currentLessonIndex = 0;      

const textDisplay = document.getElementById('text-display');
const timerEl = document.getElementById('timer');
const cpmEl = document.getElementById('cpm');
const accuracyEl = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');
const categoryButtons = document.querySelectorAll('.mode-btn');
const lessonsNav = document.getElementById('lessons-nav');
const lessonButtons = document.querySelectorAll('.lesson-btn');

let currentIndex = 0;
let errors = 0;
let totalTyped = 0;
let timeElapsed = 0;
let timerInterval = null;
let isStarted = false;
let isFinished = false;

function generateRandomLessonText(allowedChars, wordCount = 6, wordLength = 4) {
  let words = [];
  for (let i = 0; i < wordCount; i++) {
    let word = "";
    for (let j = 0; j < wordLength; j++) {
      const randomChar = allowedChars[Math.floor(Math.random() * allowedChars.length)];
      word += randomChar;
    }
    words.push(word);
  }
  return words.join(" ");
}

function updateVisualGuide() {
  document.querySelectorAll('.key').forEach(k => k.classList.remove('active-key'));
  document.querySelectorAll('.finger').forEach(f => f.classList.remove('active-finger'));

  if (isFinished) return;

  const chars = textDisplay.querySelectorAll('.char');
  if (currentIndex < chars.length) {
    const currentCharVal = chars[currentIndex].textContent.toLowerCase();
    const mapData = keyFingerMap[currentCharVal];

    if (mapData) {
      const keyElement = document.querySelector(`.key[data-key="${mapData.key}"]`);
      if (keyElement) keyElement.classList.add('active-key');

      const fingerElement = document.getElementById(mapData.finger);
      if (fingerElement) fingerElement.classList.add('active-finger');
    }
  }
}

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

  let randomText = "";
  if (currentCategory === 'lessons') {
    const allowed = lessonAllowedChars[currentLessonIndex];
    randomText = generateRandomLessonText(allowed, 7, 4);
  } else {
    const textSource = trainingData[currentCategory];
    randomText = textSource[Math.floor(Math.random() * textSource.length)];
  }
  
  textDisplay.innerHTML = '';
  randomText.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.classList.add('char');
    if (index === 0) span.classList.add('current');
    textDisplay.appendChild(span);
  });

  updateVisualGuide();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeElapsed++;
    timerEl.textContent = timeElapsed;
    updateStats();
  }, 1000);
}

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

document.addEventListener('keydown', (e) => {
  if (e.key.length > 1 || isFinished) return;
  if (e.key === ' ') e.preventDefault();

  if (!isStarted) {
    isStarted = true;
    startTimer();
  }

  const chars = textDisplay.querySelectorAll('.char');
  const currentChar = chars[currentIndex];

  totalTyped++;

  if (e.key.toLowerCase() === currentChar.textContent.toLowerCase()) {
    currentChar.classList.remove('current', 'incorrect');
    currentChar.classList.add('correct');
    currentIndex++;

    if (currentIndex < chars.length) {
      chars[currentIndex].classList.add('current');
      updateVisualGuide();
    } else {
      isFinished = true;
      clearInterval(timerInterval);
      updateVisualGuide();
      updateStats();
    }
  } else {
    if (!currentChar.classList.contains('incorrect')) {
      errors++;
      currentChar.classList.add('incorrect');
    }
  }

  updateStats();
});

categoryButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    categoryButtons.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentCategory = e.target.getAttribute('data-category');
    lessonsNav.style.display = (currentCategory === 'lessons') ? 'flex' : 'none';
    initTest();
  });
});

lessonButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    lessonButtons.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentLessonIndex = parseInt(e.target.getAttribute('data-lesson'));
    initTest();
  });
});

restartBtn.addEventListener('click', initTest);

initTest();