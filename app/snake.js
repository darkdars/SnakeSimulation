/*Comments
// * * oo
// ?
// *!
//TODO: 
//// nooo
*/



// * Colors
var gray = 51;
var white = 255;
var black = 0;
var yellow = [255, 255, 0];
var violet = [238, 130, 238];
var board = [];

//* Enviromnent variables
var sizeWindowX = 600;
var sizeWindowY = 600;
var frame_rate = 10;
var size = 15;

const pop_total = 250;

//* Class for handle snake
class Blocks {
    _pos_x = -1;
    _pos_y = -1;

    constructor(pos_x, pos_y) {
        this._pos_x = pos_x;
        this._pos_y = pos_y;
    }

    get pos_x() {
        return this._pos_x;
    }
    set pos_x(value) {
        this._pos_x = value;
    }

    get pos_y() {
        return this._pos_y;
    }
    set pos_y(value) {
        this._pos_y = value;
    }
}

class Snake {
    _head = null;
    _body = [];
    _xspeed = 0;
    _yspeed = 0;
    _speed = 1;
    _total = 0;
    _moves = 100;

    constructor() {
        this._head = new Blocks(floor(sizeWindowX / 2), floor(sizeWindowY / 2));
        this._body = [];
        this._yspeed = -this._speed;
        this._xspeed = 0;
        this._total = 0;
        this._moves = 100;
    }

    get head() {
        return this._head;
    }

    set head(value) {
        this._head = value;
    }

    get body() {
        return this._body;
    }

    set body(value) {
        this._body = value;
    }

    get xspeed() {
        return this._xspeed;
    }

    set xspeed(value) {
        this._xspeed = value;
    }

    get yspeed() {
        return this._yspeed;
    }

    set yspeed(value) {
        this._yspeed = value;
    }

    get speed() {
        return this._speed;
    }
    set speed(value) {
        this._speed = value;
    }

    get total() {
        return this._total;
    }

    set total(value) {
        this._total = value;
    }

    get moves() {
        return this._moves;
    }
    set moves(value) {
        this._moves = value;
    }


    //* Function to set a new Start on the snake ( Reseting values )
    newStart() { //! Deprecated for this project
        //console.log("New Start!")
        this._head = new Blocks(floor(sizeWindowX / 2), floor(sizeWindowY / 2));
        this._body = [];
        this._yspeed = -this._speed;
        this._xspeed = 0;
        this._total = 0;
        this._movements = 100;
    }

    //* Snake Movement functions
    movement() {
        this.bodyMovement();
        this.headMovement();
    }

    headMovement() {
        let head = this.head;

        head.pos_x += this.xspeed * size;
        head.pos_y += this.yspeed * size;

        this.moves -= 1;
        // head.pos_x = constrain(head.pos_x, 0, sizeWindowX - size);
        // head.pos_y = constrain(head.pos_y, 0, sizeWindowY - size);
    }

    bodyMovement() {
        for (let i = 0; i < this.body.length - 1; i++) {
            this.body[i] = this.body[i + 1];
        }
        this.body[this.body.length - 1] = new Blocks(this.head.pos_x, this.head.pos_y);
    }

    //TODO: Ends here (Snake Movement functions)


    //* Function that handle eat
    eat() {
        this.total += 1;
        this.addTail();
        this.moves += floor(sizeWindowX / 2 + sizeWindowY / 2);
    }

    addTail() {
        let pos_x = this.head.pos_x;
        let pos_y = this.head.pos_y;

        this.body.push(new Blocks(pos_x, pos_y));
    }

    //* Check if the snake colide with herself or with the wall; returns true if it colides 
    checkColision() {
        var head = this.head;

        for (var i = 0; i < this.body.length; i++) {
            var pos = this.body[i];
            var d = dist(head.pos_x, head.pos_y, pos.pos_x, pos.pos_y);

            if (d < 1) {
                return true;
            }

        }

        if (head.pos_x < 0 || head.pos_x >= sizeWindowX ||
            head.pos_y < 0 || head.pos_y > sizeWindowY) {
            return true;
        }

        return false;
    }

}

//* Class that handles all the simulation
class Board {
    _snake = null;
    _food = null;
    _brain = null;

    constructor() {
        this._snake = new Snake();
        this._food = this.randomFood();
        this._brain = new NeuralNetwork(4, 14, 3);
    }

    get snake() {
        return this._snake;
    }

    set snake(value) {
        this._snake = value;
    }

    get food() {
        return this._food;
    }

    set food(value) {
        this._food = value;
    }

    get brain() {
        return this._brain;
    }

    set brain(value) {
        this._brain = value;
    }

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    randomFood() {
        var cols = floor(sizeWindowX / size);
        var rows = floor(sizeWindowY / size);
        let x = floor(this.getRandom(1, cols - 1) * size);
        let y = floor(this.getRandom(1, rows - 1) * size);
        return new Blocks(x, y);
    }

    //* Iteration functions
    update() {
        this.snackMovement();
    }

    snackMovement() {
        this.snake.movement();
        this.snakeEat();
    }

    snakeEat() {
        if (this.checkColisionBetweenTwoBlocks(this.snake.head, this.food)) {
            this.food = this.randomFood();
            this.snake.eat();
        }
    }

    //TODO: End of iteration functions

    //* Function that handles colisions
    checkColisionBetweenTwoBlocks(block1, block2) {
        var d = dist(block1.pos_x, block1.pos_y, block2.pos_x, block2.pos_y);
        if (d < size / 2 + 5) {
            return true;
        } else {
            return false;
        }
    }

    status(){ // Function that give the status of the snake
        if(this.statusColision()){
            return true;
        }else if(this.snake.moves <= 0){
            return true;
        }

        return false;
    }

    statusColision() {
        if (this.snake.checkColision()) {
            return true;
        }
        return false;
    }

    //* Functions to give values to the AI
    checkColisionWall(pos_x, pos_y) {
        if (pos_x > sizeWindowX || pos_x < 0) {
            return true;
        } else if (pos_y > sizeWindowX || pos_y < 0) {
            return true;
        } else {
            return false;
        }
    }

    checkColisionBodySnake(pos_x, pos_y) {
        return false;
    }

    //* Function that returns an array of the speed of snake ( To pass the error of null values for the AI )
    arraySnakeSpeed() {
        let snake_xspeed = 0;
        let snake_yspeed = 0;
        let array = [];

        if (this.snake.xspeed > 0) {
            snake_xspeed = this.snake.speed;
        } else if (this.snake.xspeed < 0) {
            snake_xspeed = -this.snake.speed;
        }

        if (this.snake.yspeed > 0) {
            snake_yspeed = this.snake.speed;
        } else if (this.snake.yspeed < 0) {
            snake_yspeed = -this.snake.speed;
        }

        array.push(snake_xspeed);
        array.push(snake_yspeed);
        return array;
    }


    //* Functions that give the position ahead, on the right and the left of the current location of the snake
    leftSideCoordArray() {
        let array = [];
        let x = 0;
        let y = 0;
        let snake_x = this.snake.head.pos_x;
        let snake_y = this.snake.head.pos_y;

        if (this.snake.xspeed > 0) {
            x = snake_x;
            y = snake_y + size;
        } else if (this.snake.xspeed < 0) {
            x = snake_x;
            y = snake_y - size;
        }

        if (this.snake.yspeed > 0) {
            x = snake_x + size;
            y = snake_y;
        } else if (this.snake.yspeed < 0) {
            x = snake_x - size;
            y = snake_y;
        }

        array.push(x, y);
        return array;
    }

    rightSideCoordArray() {
        let array = [];
        let x = 0;
        let y = 0;
        let snake_x = this.snake.head.pos_x;
        let snake_y = this.snake.head.pos_y;

        if (this.snake.xspeed > 0) {
            x = snake_x;
            y = snake_y - size;
        } else if (this.snake.xspeed < 0) {
            x = snake_x;
            y = snake_y + size;
        }

        if (this.snake.yspeed > 0) {
            x = snake_x - size;
            y = snake_y;
        } else if (this.snake.yspeed < 0) {
            x = snake_x + size;
            y = snake_y;
        }

        array.push(x, y);
        return array;
    }

    fowardSideCoordArray() {
        let array = [];
        let x = 0;
        let y = 0;
        let snake_x = this.snake.head.pos_x;
        let snake_y = this.snake.head.pos_y;

        if (this.snake.xspeed > 0) {
            x = snake_x + size;
            y = snake_y;
        } else if (this.snake.xspeed < 0) {
            x = snake_x - size;
            y = snake_y;
        }

        if (this.snake.yspeed > 0) {
            x = snake_x;
            y = snake_y + size;
        } else if (this.snake.yspeed < 0) {
            x = snake_x;
            y = snake_y - size;
        }

        array.push(x, y);
        return array;
    }

    //* Movement snake AI
    think() {
        let fw_pos = this.fowardSideCoordArray();
        let r_pos = this.rightSideCoordArray();
        let l_pos = this.leftSideCoordArray();

        let inputs = [];
        //! Needs to put more inputs, total, and colision with food and colision with herself
        inputs[0] = this.checkColisionWall(fw_pos[0], fw_pos[1]);
        inputs[1] = this.checkColisionWall(r_pos[0], r_pos[1]);
        inputs[2] = this.checkColisionWall(l_pos[0], l_pos[1]);
        inputs[3] = this.snake.moves;

        let output = this.brain.predict(inputs);
        if (output[0] > output[1] && output[0] > output[2]) { // Foward~
            //Does nothing
        } else if (output[1] > output[0] && output[1] > output[2]) { //Right
            this.aiRight();
        } else if (output[2] > output[0] && output[2] > output[1]) { //Left
            this.aiLeft();
        }

    }

    aiRight() {
        //Going*
        if (this.snake.xspeed > 0) { // Right
            this.snake.yspeed = this.snake.speed;
            this.snake.xspeed = 0;
            return;
        } else if (this.snake.xspeed < 0) { //Left
            this.snake.yspeed = -this.snake.speed;
            this.snake.xspeed = 0;
            return;
        }

        if (this.snake.yspeed > 0) { //Down
            this.snake.xspeed = - this.snake.speed;
            this.snake.yspeed = 0;
            return;
        } else if (this.snake.yspeed < 0) { // Up
            this.snake.xspeed = this.snake.speed;
            this.snake.yspeed = 0;
            return;
        }

    }

    aiLeft() {
        //Going*
        if (this.snake.xspeed > 0) { // Right
            this.snake.yspeed = - this.snake.speed;
            this.snake.xspeed = 0;
            return;
        } else if (this.snake.xspeed < 0) { //Left
            this.snake.yspeed = this.snake.speed;
            this.snake.xspeed = 0;
            return;
        }

        if (this.snake.yspeed > 0) { //Down
            this.snake.xspeed = this.snake.speed;
            this.snake.yspeed = 0;
            return;
        } else if (this.snake.yspeed < 0) { // Up
            this.snake.xspeed = - this.snake.speed;
            this.snake.yspeed = 0;
            return;
        }
    }

    //* Drawing functions
    show() {
        this.drawSnake();
        this.drawFood();
    }

    drawSnake() {
        stroke(255);
        fill(violet);
        let head = this.snake.head;
        rect(head.pos_x, head.pos_y, size, size);

        fill(white);
        let body = this.snake.body;
        for (let i = 0; i < body.length; i++) {
            rect(body[i].pos_x, body[i].pos_y, size, size);
        }
    }

    drawFood() {
        fill(yellow);
        rect(this.food.pos_x, this.food.pos_y, size, size);
    }
}

//Draw functions
function setup() {
    createCanvas(sizeWindowX, sizeWindowY);
    for (let i = 0; i < pop_total; i++) {
        board[i] = new Board();
    }

    background(gray);
    frameRate(frame_rate);
}

function draw() {
    background(gray);
    let i = 0;
    for (let brd of board) {
        brd.think();
        brd.update();
        //console.log("Snake " + i + " : " + brd.snake.moves);

        // Delete snakes that are "Dead"
        if (brd.status()) {
            board.splice(i, 1);
        }

        i += 1;

        brd.show();
    }

    if(board.length === 0){
        nextGeneration();
    }

}