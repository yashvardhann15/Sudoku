//Load boards from file or manually
//https://github.com/bertoort/sugoku
//https://sugoku.onrender.com/board?difficulty=easy

// create variables
// var board;
let pausedTime;
let menuOpen = false;
let noBound = false;
let gamePause = false;
let gameRunning = false;
let gameEnd = false;
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect; // To stop the game when lives end, no cell can be selected.



function showOverlay() {
  document.getElementById("overlay").style.opacity = 1;
  document.getElementById("overlay").style.visibility = "visible";
}

function hideOverlay() {
  document.getElementById("overlay").style.opacity = 0;
  document.getElementById("overlay").style.visibility = "hidden";
}


let sudokuBoard = "";
let solutionBoard = "";

function solveSudoku(board) {
  const flatBoard = board.flat();
  if (solve(flatBoard)) {
    return flatBoard.join("");
  } else {
    return "Sudoku puzzle has no solution.";
  }
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;
    if (
      board[row * 9 + i] === num ||
      board[i * 9 + col] === num ||
      board[boxStartRow * 9 + boxStartCol + Math.floor(i / 3) * 9 + (i % 3)] === num
    ) {
      return false;
    }
  }
  return true;
}

function solve(board) {
  for (let i = 0; i < 81; i++) {
    const row = Math.floor(i / 9);
    const col = i % 9;
    if (board[i] === 0) {
      for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
          board[i] = num;
          if (solve(board)) {
            return true;
          }
          board[i] = 0;
        }
      }
      return false;
    }
  }
  return true;
}

async function fetchSudokuBoard(difficulty) {
  try {
    showOverlay();
    const response = await fetch(`https://sugoku.onrender.com/board?difficulty=${difficulty}`);
    if (response.status === 404) {
      console.log("Error 404... Unable to fetch board. Try again later.");
      return null;
    }
    const data = await response.json();
    console.log("Fetched board:", data);
    const inputBoard = data.board;
    solutionBoard = solveSudoku(inputBoard);
    sudokuBoard = inputBoard.flat().join("");
    console.log("Sudoku Board:", sudokuBoard);
    console.log("Solution Board:", solutionBoard);
    hideOverlay();
    return sudokuBoard;
  } catch (error) {
    console.error("Error fetching board:", error);
    return null;
  }
}

// Example usage:
// fetchSudokuBoard("medium");




window.onload = function () {

  let board;

        // Run startGame function when button is clicked
  id("start-btn").addEventListener("click", startGame);

  // Add event listener to the numberContainer
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].addEventListener("click", function () {
      // Check if selecting is enabled.
      if (!disableSelect) {
        // If number is already selected, deselect it
        if (this.classList.contains("selected")) {
          this.classList.remove("selected");
          selectedNum = null;
        } else {
          // Deselect all other numbers
          for (let j = 0; j < 9; j++) {
            id("number-container").children[j].classList.remove("selected");
          }

          // Select it and update selectedNum variable
          this.classList.add("selected");
          selectedNum = this;
          // Update move logic
          updateMove();
          clearHighlights();
        }
      }
    });
  }
};


function theme(){
        // set theme
        if (id("theme-1").checked) {
              qs("body").classList.remove("dark");
        } 
        else {
              qs("body").classList.add("dark");
        }
          
}


async function startGame() {
  // chose board difficulty
  if(!gamePause){
  gameRunning = true;
  if (id("diff-1").checked) board = await fetchSudokuBoard("easy");
  else if (id("diff-2").checked) board =await fetchSudokuBoard("medium");
  else board =await fetchSudokuBoard("hard");

  // set lives
  lives = 3;
  disableSelect = false; // To stop the game when lives end, no cell can be selected.
  id("lives").textContent = "Lives Remaining:  3";

  
  id("lives").classList.remove("incorrect");
  id("lives").classList.remove("selected");

  // create board based on difficulty
  generateBoard(board);

  // start timer
  startTimer();
  if(menuOpen){
    toggleMenu();
  }
  id("number-container").classList.remove("hidden");
}
else{
  window.alert("First resume or end the current game...")
}
}


function restartame() {
  // chose board difficulty
  if(!gamePause){
  gameRunning = true;
  // if (id("diff-1").checked) board = generateSudoku(easy);
  // else if (id("diff-2").checked) board = generateSudoku(medium);
  // else board = generateSudoku(hard);
    board = sudokuBoard;
  // set lives
  lives = 3;
  disableSelect = false; // To stop the game when lives end, no cell can be selected.
  id("lives").textContent = "Lives Remaining:  3";
  
  id("lives").classList.remove("incorrect");
  id("lives").classList.remove("selected");

  // set timer

  // create board based on difficulty
  generateBoard(board);

  // start timer
  startTimer();
  if(menuOpen){
    toggleMenu();
  }
  id("number-container").classList.remove("hidden");
}
else{
  window.alert("First resume or end the current game...")
}
}



function startTimer() {
  // Sets time remaining based on input
  if (id("time-0").checked) {
    noBound = true;  // Fix: Set noBound to true for the "unlimited" option
    timeRemaining = 0;
  } else if (id("time-1").checked) {
    noBound = false;
    timeRemaining = 300;
  } else if (id("time-2").checked) {
    noBound = false;
    timeRemaining = 600;
  } else {
    noBound = false;
    timeRemaining = 1200;
  }

  // Sets the timer for the first second
  timer = setInterval(function () {
    if (noBound) {
      // Increment time for "unlimited" option
      timeRemaining++;
    } 
    else{
      if(timeRemaining != 0){
        timeRemaining--;
      }
      // If time ends
      if (timeRemaining === 0) endGame();
    }
    id("timer").textContent = timeConversion(timeRemaining);
  }, 1000); // every 1000 sec func runs
}

// convert string to MM:SS
function timeConversion(time) {
  let minutes = Math.floor(time / 60);
  if (minutes < 10) minutes = "0" + minutes;
  let seconds = time % 60;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + " : " + seconds;
}

function generateBoard(board) {
  // Clear previous board
  clearPrevious();

  // Let used to increment tile ids
  let idCount = 0;
  // create 81 tiles
  for (let i = 0; i < 81; i++) {
    // Create a new paragraph element
    let tile = document.createElement("p");
    // Set the text content of the tile
    if (board.charAt(i) != "0") {
      tile.textContent = board.charAt(i);
    } else {
      // Add click event listener to tile
      tile.addEventListener("click", function () {
        if (!disableSelect) {
          // If the tile is already selected
          if (tile.classList.contains("selected")) {
            // then remove selection
            tile.classList.remove("selected");
            clearHighlights();
            selectedTile = null;
          } else {
            // deselect all other tiles
            for (let i = 0; i < 81; i++) {
              qsa(".tile")[i].classList.remove("selected");
            }
            // Add selection and update variable
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
      
            // Highlight the entire row, column, and 3x3 box
            highlightCellAndRelated(tile.id);
          }
        }
      });
      
    }
    // assign tile id
    tile.id = idCount;
    // increment for the next tile
    idCount++;
    // Add tile class to all tiles
    tile.classList.add("tile");

    // border
    if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
      tile.classList.add("bottomBorder");
    }
    if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
      tile.classList.add("rightBorder");
    }

    // Add tile to board
    id("board").appendChild(tile);
  }
}


function updateMove() {
  // if a tile and a number is selected
  if (selectedTile && selectedNum) {
    // set the tile to the correct number
    selectedTile.textContent = selectedNum.textContent;
    // if the number matches the corresponding number in the solution key
    if (checkCorrect(selectedTile)) {
      // Deselect the tile
      selectedTile.classList.remove("selected");
      selectedNum.classList.remove("selected");
      clearHighlights();
      // Clear the selected variables
      selectedNum = null;
      selectedTile = null;
      // Check if the board is completed
      if (checkDone()) {
        endGame();
      }
    } else {
      // Disable selecting new numbers for one second
      disableSelect = true;
      // Make the tile turn red
      selectedTile.classList.add("incorrect");
      id("lives").classList.add("incorrect");
      // subtract lives by one after one second
      setTimeout(function () {
        lives--;
        // if no lives left end the game
        if (lives === 0) {
          endGame();
        } else {
          // if lives are not equal to zero
          // Update lives text
          id("lives").textContent = "Lives Remaining: " + lives;
          // Restore tile color and remove selected from both after one second
          setTimeout(function () {
            selectedTile.classList.remove("incorrect");
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            id("lives").classList.remove("incorrect");
            
            clearHighlights();

            // Clear the tiles text and clear selected variables
            selectedTile.textContent = "";
            selectedTile = null;
            selectedNum = null;

            // Re-enable selecting numbers and tiles
            disableSelect = false;
          }, 1000);
        }
      }, 1000);
    }
  }
}



function checkDone() {
  let tiles = qsa(".tile");
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].textContent === "") return false;
  }
  return true;
}

function endGame() {
  // disable moves and stop the timer
  gameRunning = false;
  gameEnd = true;
  disableSelect = true;
  clearTimeout(timer);
  // Display win or loss message
  if (lives === 0 || (timeRemaining === 0 && !noBound)) {
    id("lives").textContent = "You Lost!";
    
    if(!menuOpen){
      toggleMenu();
    }
  } else {
    id("lives").textContent = "You Won!";
    id("lives").classList.remove("selected");
    if(!menuOpen){
      toggleMenu();
    }
  }
}

function pauseGame() {
  if(gameRunning){
  if (!disableSelect) {
    // Pausing the game
    gamePause = true;
    disableSelect = true;
    clearTimeout(timer);
    id("pause").textContent = "Resume Game";
    id("pause-res").textContent = "Game Paused";
    
    id("board").style.display = "none";
    // Save the remaining time when pausing
    pausedTime = timeRemaining;
  } else {
    // Resuming the game
    disableSelect = false;
    gamePause = false;
    id("pause-res").textContent = "";
    id("board").style.display = "flex";
    id("pause").textContent = "Pause Game";
    // Restore the timer with the remaining time
    startimer(pausedTime);
  }
}
}
function startimer(remainingTime) {
  // Sets time remaining based on input or uses the remaining time when resuming

  // Sets the timer for the first second
  id("timer").textContent = timeConversion(timeRemaining);

  // Update every second

  timer = setInterval(function () {

    if (noBound) {
      // Increment time for "unlimited" option
      timeRemaining++;
    } 
    else{
      if(timeRemaining != 0){
        timeRemaining--;
      }
      // If time ends
      if (timeRemaining === 0) endGame();
      
    id("board").classList.remove("hidden");
    }
    id("timer").textContent = timeConversion(timeRemaining);
  }, 1000); // every 1000 sec func runs
}


function restartGame() {
  // Clear the board and reset game variables
  if(!gamePause && (gameRunning || gameEnd)){
  clearPrevious();

  // Start a new game
  restartame();
  }
  else if(!gameRunning){
    window.alert("Start a game first")
  }
  else{
    window.alert("First resume or end your game");
  }
}


function checkCorrect(tile){
  //set solution
  let solution = solutionBoard;

  //if tiles's number is equal to solution's number
  if(solution.charAt(tile.id) === tile.textContent) return true;
  else return false;
}

function clearPrevious() {
  // Access all of the tiles
  let tiles = qsa(".tile");

  // remove each tile
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].remove();
  }

  // if there is a timer clear it
  if (timer) clearTimeout(timer);

  // deselect and numbers
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].classList.remove("selected");
  }

  // clear selected variables
  selectedTile = null;
  selectedNum = null;
}


function toggleMenu() {
  const sideMenu = document.getElementById('side-menu');
  const header = document.querySelector('header');

  if (sideMenu.style.left === '0px') {
      sideMenu.style.left = '-380px';
      menuOpen = false;
      header.style.left = '0';
  } else {
      menuOpen = true;
      sideMenu.style.left = '0';
      header.style.left = '380px';
  }
}

function highlightCellAndRelated(cellIndex) {
  // Clear previous highlights
  clearHighlights();

  // Highlight the entire row, column, and 3x3 box
  highlightRow(cellIndex);
  highlightColumn(cellIndex);
  highlightBox(cellIndex);
}

function clearHighlights() {
  // Remove highlights from all tiles
  const tiles = qsa(".tile");
  tiles.forEach(tile => tile.classList.remove("highlight"));
  
  tiles.forEach(tile => tile.classList.remove("highlightt"));
}

function highlightRow(cellIndex) {
  const rowStart = Math.floor(cellIndex / 9) * 9;
  const rowEnd = rowStart + 9;
  for (let i = rowStart; i < rowEnd; i++) {
    qsa(".tile")[i].classList.add("highlight");
  }
}

function highlightColumn(cellIndex) {
  const colStart = cellIndex % 9;
  for (let i = colStart; i < 81; i += 9) {
    qsa(".tile")[i].classList.add("highlight");
  }
}

function highlightBox(cellIndex) {
  const boxStartRow = Math.floor(cellIndex / 27) * 27;
  const boxStartCol = Math.floor((cellIndex % 9) / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const index = boxStartRow + i * 9 + boxStartCol + j;
      qsa(".tile")[index].classList.add("highlightt");
    }
  }
}





function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}

function id(id) {
  return document.getElementById(id);
}