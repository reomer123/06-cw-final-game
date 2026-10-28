// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let dropCounter = 1000; // Will store amount of time between each drop
let timeKeeper; // Will store the game countdown timer
let timer = document.getElementById("time"); // Will keep track of the 30 sec timer
let score = document.getElementById("score"); // Will keep track of the score of the current game
let initialSize = 60; // Will store the initial size of each bubble
let badDropOdds = 0.1;

document.getElementById("easy-btn").addEventListener("click", function(Event) {
  dropCounter = 500;
  initialSize = 80;
  badDropOdds = 0.05;
  document.getElementById("dif").textContent = "Easy";
})

document.getElementById("med-btn").addEventListener("click", function(Event) {
  dropCounter = 1000;
  initialSize = 60;
  badDropOdds = 0.1;
  document.getElementById("dif").textContent = "Medium";
})

document.getElementById("hard-btn").addEventListener("click", function(Event) {
  dropCounter = 1500;
  initialSize = 40;
  badDropOdds = 0.15;
  document.getElementById("dif").textContent = "Hard";
})

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reset-btn").addEventListener("click", resetGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning || Number(timer.textContent) <= 0) return;

  gameRunning = true;
  
  document.querySelectorAll(".dif-btn").forEach(button => { button.disabled = true; });

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, dropCounter);

  timeKeeper = setInterval(function() {
    const currentTime = Number(timer.textContent);

    if (currentTime <= 1) {
      gameRunning = false;
      clearInterval(timeKeeper);
      clearInterval(dropMaker);
      timer.textContent = "0";
      document.querySelectorAll(".dif-btn").forEach(button => { button.disabled = false; });
      return;
    }

    timer.textContent = currentTime - 1;
  }, 1000);
}

function resetGame() {
  clearInterval(dropMaker);
  clearInterval(timeKeeper);
  gameRunning = false;
  document.querySelectorAll(".dif-btn").forEach(button => { button.disabled = false; });
  timer.textContent = "30";
  score.textContent = "0";
  document.getElementById("game-container").replaceChildren();
}

function createDrop() {
  if (!gameRunning || Number(timer.textContent) <= 0) return;

  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";
  if (Math.random() < badDropOdds) drop.classList.add("bad-drop");

  // Make drops different sizes for visual variety
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });

  drop.addEventListener("click", function() {
    drop.remove();
    const currentScore = Number(score.textContent);

    // Player will lose double points if they hit a small bad drop
    if(drop.classList.contains("bad-drop"))
    {
      if(size <= 45) score.textContent = currentScore - 2;
      else score.textContent = currentScore - 1;
    }
    else score.textContent = currentScore + 1;
  });
}
