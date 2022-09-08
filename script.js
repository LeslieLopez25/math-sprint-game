// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0s";

// Scroll
let valueY = 0;

// STOP TIMER, PROCESS RESULTS, GO TO SCORE PAGE
function checkTime() {
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer);
    // CHECK FOR WRONG GUESSES, ADD PENALTY TIME
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // CORRECT GUESS, NO PENALTY
      } else {
        // INCORRECT GUESS, ADD PENALTY
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
  }
}

// ADD A TENTH OF A SECOND TO timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// START TIMER WHEN GAME PAGE IS CLICKED
function startTimer() {
  // RESET TIMES
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}

// SCROLL, STORE USER SELECTION IN playerGuessArray
function select(guessedTrue) {
  // SCROLL 80 PIXELS
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // ADD PLAYER GUESS TO ARRAY
  return guessedTrue
    ? playerGuessArray.push("true")
    : playerGuessArray.push("false");
}

// DISPLAYS GAME PAGE
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// GET RANDOM NUMBER UP TO A MAX NUMBER
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// ADD EQUATIONS TO DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // ITEM
    const item = document.createElement("div");
    item.classList.add("item");
    // EQUATION TEXT
    const equationText = document.createElement("h1");
    equationText.textContent = equation.value;
    // APPEND
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  //   // Reset DOM, Set Blank Space Above
  itemContainer.textContent = "";
  //   // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  //   // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  //   // Append
  itemContainer.append(topSpacer, selectedItem);

  //   // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();
  //   // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

// DISPLAYS 3, 2,1, GO!
function countdownStart() {
  countdown.textContent = "3";
  setTimeout(() => {
    countdown.textContent = "2";
  }, 1000);
  setTimeout(() => {
    countdown.textContent = "1";
  }, 2000);
  setTimeout(() => {
    countdown.textContent = "GO!";
  }, 3000);
}

// NAVIGATE FROM SPLASH PAGE TO COUNTDOWN PAGE
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 400);
}

// GET THE VALUE FROM SELECTED RADIO BUTTON
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// FORM THAT DECIDES AMOUNT OF QUESTIONS
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  if (questionAmount) {
    showCountdown();
  }
}

startForm.addEventListener("click", () => {
  radioContainers.forEach((radioEl) => {
    // REMOVE SELECTED LABEL STYLING
    radioEl.classList.remove("selected-label");
    // ADD IT BACK IF RADIO INPUT IS CHECKED
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label");
    }
  });
});

// EVENT LISTENERS
startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);
