// some color constant
var game_speed = 90;
const canvas_border_color = 'black';
const canvas_background_color = "lightgray";
const snake_color = 'lightblue';
const snake_border_color = 'darkblue';
const food_color = 'orange';
const food_border_color = 'darkred';

// challenge blocks coordinate
let block = [
]

// const blockMap = block.map(x => x.toString());

// snake parts coordinate
let snake = [
    { x: 100, y: 150 },
    { x: 110, y: 150 },
]

var audio = document.getElementById("myAudio")

let score = 0;
let snake_length = 2;
let changingDirection = false; // when true -> snake change direction
let foodX; // food x-coordinate
let foodY; // food y-coordinate
let dx = 10; // horiozontal vel
let dy = 0; // vertical vel

const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");// 2D context

let challenge_level = 1;

// main();



// new food location
createFood();
// change direction when a key is pressed
document.addEventListener("keydown", changeDirection);


// main function


clearCanvas();

const restart_button = document.getElementById("restart");

var start = true;

document.onkeypress = function (event) {
    if (event.keyCode == 13 && start) {
        start = false
        start_button()

    } else if (didGameEnd()) {
        start_button()
    }
};



function start_button() {
    play_audio();
    document.getElementById("restart").style.display = "none";
    snake = [
        { x: 100, y: 150 },
        { x: 110, y: 150 },
    ];
    document.getElementById('snake_length').innerHTML = "Length: 2";
    document.getElementById('score').innerHTML = "Score: 0";
    score = 0;
    challenge_level = 1;
    snake_length = 2;
    changingDirection = false;
    foodX;
    foodY;
    dx = 10;
    dy = 0;
    game_speed = 90;

    block = [
    ]


    main();
    document.getElementById('restart').innerHTML = "Restart";
}


function main() {
    // if the game ended return early to stop game
    if (didGameEnd()) {
        document.getElementById("restart").style.display = "block";
        drawLoseCanvas();
        return;
    };

    setTimeout(function onTick() {
        clearCanvas();
        changingDirection = false;
        advanceSnake();
        drawSnake();
        drawFood();
        drawChallenge();
        // call again //
        main();

    }, game_speed)
}



function clearCanvas() {
    //color to fill the back
    ctx.fillStyle = canvas_background_color;
    // stroke color of the back
    ctx.strokestyle = canvas_border_color;
    // draw filled rectangle to cover the canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    // draw border for that rect
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}


function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function play_audio() {
    audio.play();
}

// _FOOD PART_

function drawFood() {
    // the same for drawing the food
    ctx.fillStyle = food_color;
    ctx.strokestyle = food_border_color;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
    // dimension 10px,10px
}

function createFood() { // food location
    // random number for food x-coord
    let blockMap = block.map(x => x.toString());
    while (true) {
        foodX = randomTen(0, gameCanvas.width - 10);
        foodY = randomTen(0, gameCanvas.height - 10);
        if (blockMap.indexOf([foodX, foodY].toString()) < 0) {
            break
        }
    }

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnsnake = part.x == foodX && part.y == foodY;
        if (foodIsOnsnake)
            createFood();
    });

    // for (let i = 0; i < block.length; i++) {

    //     if (block[i][0] === foodX && block[i][1] === foodY)
    //         createFood();
    // }

}


// CHALLENGE //




function drawChallenge() {
    ctx.fillStyle = "lightgreen"
    ctx.strokestyle = "black"

    block.forEach(e => {
        ctx.fillRect(e[0], e[1], 10, 10);
        ctx.strokeRect(e[0], e[1], 10, 10);
    })



}


function createChallenge() {
    let blockMap = block.map(x => x.toString());
    let snakeMap = snake.map(x => x.toString());
    while (true) {
        blockX = randomTen(0, gameCanvas.width - 10);
        blockY = randomTen(0, gameCanvas.height - 10);
        if (blockMap.indexOf([blockX, blockY].toString()) < 0 && snakeMap.indexOf([blockX, blockY].toString())) {
            block.push([blockX, blockY])
            break
        }
    }
}


// GAME_OVER_SCREEN //



function drawLoseCanvas() {
    clearCanvas();
    ctx.fillStyle = "black";
    ctx.font = "30px UTM Avo";
    ctx.fillText("GAME OVER", 60, 160);
}


// _SNAKE PART_

function drawSnakePart(snakePart) {
    ctx.fillStyle = snake_color;
    ctx.strokestyle = snake_border_color;
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    snake.forEach(drawSnakePart)
}

function advanceSnake() {
    // new head for snake (after ate food)
    const head = {
        x: snake[0].x +
            dx, y: snake[0].y + dy
    };
    snake.unshift(head);// add head to the begining
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        // increase score
        if (game_speed > 50) {
            game_speed -= 2;
            console.log(game_speed);
        }    
        
        score += 10;
        snake_length += 1;
        // display score
        document.getElementById('snake_length').innerHTML = "Length: " + snake_length;
        document.getElementById('score').innerHTML = "Score: " + score;
        // generate new food
        createFood();

        if (score / 30 >= challenge_level) {
            for (var i =0; i < challenge_level; i++ ){
                createChallenge();
            }
            challenge_level ++;
        }

    } else {
        // remove the last part of snake
        snake.pop();
    }
}

// _DIRECTION_

function changeDirection(event) {
    const left_key = 37; //key code for left
    const right_key = 39; //key code for right
    const up_key = 38; //kry code for up
    const down_key = 40;// key code for down


    if (changingDirection) {
        return;
    }
    changingDirection = true;
    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    //if press left and the snake not going right-> dx=-10
    if (keyPressed === left_key && !goingRight) {
        dx = -10;
        dy = 0;
    }
    //if press right and the snake not going left-> dx=10
    if (keyPressed === right_key && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    //if press up and the snake not going down-> dy=-10
    if (keyPressed === up_key && !goingDown) {
        dx = 0;
        dy = -10;
    }
    //if press down and the snake not going up-> dy=10
    if (keyPressed === down_key && !goingUp) {
        dx = 0;
        dy = 10;
    }
}



// _GAME OVER_

function didGameEnd() {
    // when the snake hit itself
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y)
            return true;
    }

    // when snake hit the challenge
    for (let sn = 0; sn < snake.length; sn++) {
        for (let i = 0; i < block.length; i++) {
            if (block[i][0] === snake[sn].x && block[i][1] === snake[sn].y)
                return true;
        }
    }

    // when the snake hit a wall
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}
