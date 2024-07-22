let music = new Audio("music.mp3");
let audioTurn = new Audio("ting.mp3");
let gameover = new Audio("gameover.mp3");
let turn = "X";
let playerSymbol = "X";
let aiSymbol = "O";
let isgameover = false;
let playWithAI = false;
let gameStarted = false;

// Function to change the turn
const changeTurn = () => {
    return turn === "X" ? "O" : "X";
};

// Function to set the color of the box text based on the symbol
const setSymbolColor = (element, symbol) => {
    if (symbol === "X") {
        element.style.color = "#f73a0b"; // Color for X
    } else if (symbol === "O") {
        element.style.color = "black"; // Color for O
    }
};

// Function to remove highlights
const removeHighlights = () => {
    let boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.classList.remove('highlight');
    });
};

// Function to check for a win
const checkWin = () => {
    let boxtexts = document.getElementsByClassName('boxtext');
    let wins = [
        [0, 1, 2, 5, 5, 0],
        [3, 4, 5, 5, 15, 0],
        [6, 7, 8, 5, 25, 0],
        [0, 3, 6, -5, 15, 90],
        [1, 4, 7, 5, 15, 90],
        [2, 5, 8, 15, 15, 90],
        [0, 4, 8, 5, 15, 45],
        [2, 4, 6, 5, 15, 135],
    ];
    wins.forEach(e => {
        if ((boxtexts[e[0]].innerText === boxtexts[e[1]].innerText) && (boxtexts[e[2]].innerText === boxtexts[e[1]].innerText) && (boxtexts[e[0]].innerText !== "")) {
            document.querySelector('.info').innerText = boxtexts[e[0]].innerText + " Won";
            isgameover = true;
            document.querySelector('.imgbox img').style.width = "256px";
            document.querySelector(".line").style.width = "0";
            gameover.play();
            // Highlight the winning row or column
            e.slice(0, 3).forEach(index => {
                document.querySelectorAll('.box')[index].classList.add('highlight');
            });
        }
    });

    // Check for draw
    if (!isgameover && Array.from(boxtexts).every(box => box.innerText !== "")) {
        document.querySelector('.info').innerText = "It's a Draw!";
        isgameover = true;
    }
};

// Function for AI to make a move
const aiMove = () => {
    let boxtexts = document.getElementsByClassName('boxtext');
    let emptyBoxes = [];
    Array.from(boxtexts).forEach((boxtext, index) => {
        if (boxtext.innerText === '') {
            emptyBoxes.push(index);
        }
    });
    if (emptyBoxes.length > 0 && !isgameover) {
        let randomIndex = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
        boxtexts[randomIndex].innerText = turn;
        setSymbolColor(boxtexts[randomIndex], turn); // Set color based on the symbol
        turn = changeTurn();
        audioTurn.play();
        checkWin();
        if (!isgameover) {
            document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
        }
    }
};

// Game logic
music.play();
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element => {
    let boxtext = element.querySelector('.boxtext');
    element.addEventListener('click', () => {
        if (boxtext.innerText === '' && !isgameover && gameStarted) {
            boxtext.innerText = turn;
            setSymbolColor(boxtext, turn); // Set color based on the symbol
            turn = changeTurn();
            audioTurn.play();
            checkWin();
            if (!isgameover) {
                document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
                if (playWithAI && turn === aiSymbol && !isgameover) {
                    setTimeout(aiMove, 500);  // Delay AI move for better UX
                }
            }
        }
    });
});

// Function to start the game with selected symbol
const startGame = (symbol) => {
    playerSymbol = symbol;
    aiSymbol = symbol === "X" ? "O" : "X";
    turn = playerSymbol;
    document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
    document.getElementById('playerSelection').style.display = 'none';
    gameStarted = true;
    isgameover = false;  // Ensure the game is not over when starting
    removeHighlights(); // Remove any previous highlights
    // Clear the board
    let boxtexts = document.getElementsByClassName('boxtext');
    Array.from(boxtexts).forEach(element => {
        element.innerText = "";
        element.style.color = "#fff"; // Reset color
    });
    // Reset line visibility
    document.querySelector(".line").style.width = "0";
    document.querySelector('.imgbox img').style.width = "0px";
    if (playWithAI && turn === aiSymbol) {
        setTimeout(aiMove, 500);  // AI starts if AI is 'X'
    }
};

// Add onclick listeners for symbol selection
document.getElementById('selectX').addEventListener('click', () => startGame("X"));
document.getElementById('selectO').addEventListener('click', () => startGame("O"));

// Add onclick listener to reset button
document.getElementById('reset').addEventListener('click', () => {
    startGame(playerSymbol); // Restart game with current symbol
});

// Add onclick listener to toggle mode button
document.getElementById('toggleMode').addEventListener('click', () => {
    playWithAI = !playWithAI;
    document.getElementById('toggleMode').innerText = "Play with AI: " + (playWithAI ? "On" : "Off");
    document.getElementById('reset').click();  // Reset the game when changing mode
});

