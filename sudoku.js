//https://github.com/bertoort/sugoku
//https://sugoku.onrender.com/board?difficulty=easy

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
var disableSelect;






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
    hideOverlay();
    return sudokuBoard;
  } catch (error) {
    console.error("Error fetching board:", error);
    return null;
  }
}






window.onload = function () {

  let board;

  id("start-btn").addEventListener("click", startGame);

  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].addEventListener("click", function () {
      
      if (!disableSelect) {
        if (this.classList.contains("selected")) {
          this.classList.remove("selected");
          selectedNum = null;
        } else {
          for (let j = 0; j < 9; j++) {
            id("number-container").children[j].classList.remove("selected");
          }

          this.classList.add("selected");
          selectedNum = this;
          updateMove();
          clearHighlights();
        }
      }
    });
  }
};


function theme(){
        if (id("theme-1").checked) {
              qs("body").classList.remove("dark");
        } 
        else {
              qs("body").classList.add("dark");
        }
          
}


async function startGame() {
  if(!gamePause){
  gameRunning = true;
  if (id("diff-1").checked) board = await fetchSudokuBoard("easy");
  else if (id("diff-2").checked) board =await fetchSudokuBoard("medium");
  else board =await fetchSudokuBoard("hard");

  lives = 3;
  disableSelect = false;
  id("lives").textContent = "Lives Remaining:  3";

  
  id("lives").classList.remove("incorrect");
  id("lives").classList.remove("selected");

  generateBoard(board);


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
  if(!gamePause){
  gameRunning = true;
    board = sudokuBoard;
  lives = 3;
  disableSelect = false;
  id("lives").textContent = "Lives Remaining:  3";
  
  id("lives").classList.remove("incorrect");
  id("lives").classList.remove("selected");


  generateBoard(board);

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
  if (id("time-0").checked) {
    noBound = true;
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

  timer = setInterval(function () {
    if (noBound) {
      timeRemaining++;
    } 
    else{
      if(timeRemaining != 0){
        timeRemaining--;
      }
      if (timeRemaining === 0) endGame();
    }
    id("timer").textContent = timeConversion(timeRemaining);
  }, 1000);
}

function timeConversion(time) {
  let minutes = Math.floor(time / 60);
  if (minutes < 10) minutes = "0" + minutes;
  let seconds = time % 60;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + " : " + seconds;
}

function generateBoard(board) {
  clearPrevious();

  let idCount = 0;
  for (let i = 0; i < 81; i++) {
    let tile = document.createElement("p");
    if (board.charAt(i) != "0") {
      tile.textContent = board.charAt(i);
    } else {
      tile.addEventListener("click", function () {
        if (!disableSelect) {
          if (tile.classList.contains("selected")) {
            tile.classList.remove("selected");
            clearHighlights();
            selectedTile = null;
          } else {
            for (let i = 0; i < 81; i++) {
              qsa(".tile")[i].classList.remove("selected");
            }
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
      
            highlightCellAndRelated(tile.id);
          }
        }
      });
      
    }
    tile.id = idCount;
    idCount++;
    tile.classList.add("tile");


    if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
      tile.classList.add("bottomBorder");
    }
    if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
      tile.classList.add("rightBorder");
    }

 
    id("board").appendChild(tile);
  }
}


function updateMove() {
  if (selectedTile && selectedNum) {
    selectedTile.textContent = selectedNum.textContent;
    if (checkCorrect(selectedTile)) {

      selectedTile.classList.remove("selected");
      selectedNum.classList.remove("selected");
      clearHighlights();

      selectedNum = null;
      selectedTile = null;

      if (checkDone()) {
        endGame();
      }
    } else {
      disableSelect = true;
      selectedTile.classList.add("incorrect");
      id("lives").classList.add("incorrect");
      setTimeout(function () {
        lives--;
        if (lives === 0) {
          endGame();
        } else {
          id("lives").textContent = "Lives Remaining: " + lives;
          setTimeout(function () {
            selectedTile.classList.remove("incorrect");
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            id("lives").classList.remove("incorrect");
            
            clearHighlights();

            selectedTile.textContent = "";
            selectedTile = null;
            selectedNum = null;

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
  gameRunning = false;
  gameEnd = true;
  disableSelect = true;
  clearTimeout(timer);
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
    console.log(sudokuBoard);
    gamePause = true;
    disableSelect = true;
    clearTimeout(timer);
    id("pause").textContent = "Resume Game";
    id("pause-res").textContent = "Game Paused";
    
    id("board").style.display = "none";
    pausedTime = timeRemaining;
  } else {
    disableSelect = false;
    gamePause = false;
    id("pause-res").textContent = "";
    id("board").style.display = "flex";
    id("pause").textContent = "Pause Game";
    startimer(pausedTime);
  }
}
}
function startimer(remainingTime) {
  id("timer").textContent = timeConversion(timeRemaining);


  timer = setInterval(function () {

    if (noBound) {
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
  }, 1000);
}


function restartGame() {

  if(!gamePause && (gameRunning || gameEnd)){
  clearPrevious();


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

  let solution = solutionBoard;

  if(solution.charAt(tile.id) === tile.textContent) return true;
  else return false;
}

function clearPrevious() {
  let tiles = qsa(".tile");


  for (let i = 0; i < tiles.length; i++) {
    tiles[i].remove();
  }

  if (timer) clearTimeout(timer);

  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].classList.remove("selected");
  }

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
  clearHighlights();


  highlightRow(cellIndex);
  highlightColumn(cellIndex);
  highlightBox(cellIndex);
}

function clearHighlights() {
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
