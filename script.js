// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timeKeeper; // Will store the game countdown timer
let timer = document.getElementById("time"); // Will keep track of the 30 sec timer
let score = document.getElementById("score"); // Will keep track of the score of the current game

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reset-btn").addEventListener("click", resetGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

  timeKeeper = setInterval(function() {
    const currentTime = timer.textContent;
    timer.textContent = currentTime - 1;

    if(currentTime <= 0)
    {
      clearInterval(timeKeeper);
      clearInterval(dropMaker);
      timer.textContent = "0";
    }
  }, 1000);
}

function resetGame() {
  clearInterval(dropMaker);
  clearInterval(timeKeeper);
  gameRunning = false;
  timer.textContent = "30";
  score.textContent = "0";
  document.getElementById("game-container").replaceChildren();
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";
  if (Math.random() < 0.1) drop.classList.add("bad-drop");

  // Make drops different sizes for visual variety
  const initialSize = 60;
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
    else {
      // Player will earn double points if they hit a small normal drop
      if(size <= 45) score.textContent = currentScore + 2;
      else score.textContent = currentScore + 1;
    }
  });
}
