/*Comments
// * * oo
// ?
// *!
//TODO: 
//// nooo
*/

// * Colors
var gray = 51;
var gainsboro = [211,211,211];
var white = 255;
var black = 0;
var yellow = [255, 255, 0];
var violet = [238, 130, 238];
var board = [];
var saveBoards = [];

//* Enviromnent variables
var frame_rate = 10;
var size = 100;
const pop_total = 1;
var spaceBetween = 1;

var sizeCanvasX = 800;
var sizeCanvasY = 800;

var sizeWindowX = Math.floor(sizeCanvasY / Math.sqrt(pop_total));
var sizeWindowY = Math.floor(sizeCanvasX / Math.sqrt(pop_total));



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
    _score = 0;
    _moves = 100;
    _fitness = 0;

    constructor() {
        this._head = new Blocks(floor(sizeWindowX / 2), floor(sizeWindowY / 2));
        this._body = [];
        this._yspeed = -this._speed;
        this._xspeed = 0;
        this._score = 0;
        this._moves = 100;
        this._fitness = 0;
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

    get score() {
        return this._score;
    }

    set score(value) {
        this._score = value;
    }

    get fitness() {
        return this._fitness;
    }

    set fitness(value) {
        this._fitness = value;
    }

    get moves() {
        return this._moves;
    }
    set moves(value) {
        this._moves = value;
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
        this.score += 1;
        this.addTail();
        this.moves += 100;
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
    _buffer = null;

    constructor(brain) {
        this._snake = new Snake();
        this._food = this.randomFood();
        this._buffer = createGraphics(sizeWindowX, sizeWindowY);

        if (brain) {
            this.brain = brain.copy();
        } else {
            this._brain = new NeuralNetwork(11, 30, 3);
        }
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

    get buffer() {
        return this._buffer;
    }
    set buffer(value) {
        this._buffer = value;
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

    status() { // Function that give the status of the snake
        if (this.statusColision()) {
            return true;
        } else if (this.snake.moves <= 0) {
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
    checkColisionWall(pos_x, pos_y) { // Returns true if it colides with the wall
        if (pos_x > sizeWindowX || pos_x < 0) {
            return true;
        } else if (pos_y > sizeWindowX || pos_y < 0) {
            return true;
        } else {
            return false;
        }
    }


    checkColisionBodySnake(pos_x, pos_y) { // Returns true if it colides with herself
        var body = this.snake.body;

        for (var i = 0; i < body.length; i++) {
            var pos = body[i];
            var d = dist(pos_x, pos_y, pos.pos_x, pos.pos_y);

            if (d < 1) {
                return true;
            }
        }

        return false;
    }

    checkColisionFood(pos_x, pos_y) { // Returns true if he colides with the food
        if (pos_x == this.food.pos_x && pos_y == this.food.pos_y) {
            return true;
        }

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

    //* AI mutate function
    mutate() {
        this.brain.mutate(0.1); // Mutate 10 %
    }

    //* Movement snake AI 
    think() { //! AI Network movement
        let fw_pos = this.fowardSideCoordArray();
        let r_pos = this.rightSideCoordArray();
        let l_pos = this.leftSideCoordArray();

        let inputs = [];
        inputs[0] = this.checkColisionWall(fw_pos[0], fw_pos[1]);
        inputs[1] = this.checkColisionWall(r_pos[0], r_pos[1]);
        inputs[2] = this.checkColisionWall(l_pos[0], l_pos[1]);
        inputs[3] = this.checkColisionBodySnake(fw_pos[0], fw_pos[1]);
        inputs[4] = this.checkColisionBodySnake(r_pos[0], r_pos[1]);
        inputs[5] = this.checkColisionBodySnake(l_pos[0], l_pos[1]);
        inputs[6] = this.checkColisionFood(fw_pos[0], fw_pos[1]);
        inputs[7] = this.checkColisionFood(l_pos[0], l_pos[1]);
        inputs[8] = this.checkColisionFood(r_pos[0], r_pos[1]);
        inputs[9] = this.snake.score;
        inputs[10] = this.snake.moves;

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
    show(x, y) {
        this.buffer.background(gray);
        this.drawSnake(x, y);
        this.drawFood(x, y);

        image(this.buffer, x, y);
    }

    drawSnake() {
        this.buffer.stroke(255);
        this.buffer.fill(violet);
        let head = this.snake.head;
        this.buffer.rect(head.pos_x, head.pos_y, size, size);

        this.buffer.fill(white);
        let body = this.snake.body;
        for (let i = 0; i < body.length; i++) {
            this.buffer.rect(body[i].pos_x, body[i].pos_y, size, size);
        }
    }

    drawFood() {
        this.buffer.fill(yellow);
        this.buffer.rect(this.food.pos_x, this.food.pos_y, size, size);
    }
}

let slider;

//Draw functions
function setup() {
    slider = createSlider(1, 100, 1);

    createCanvas(sizeCanvasX + 20, sizeCanvasY + 20);
    for (let i = 0; i < pop_total; i++) {
        board[i] = new Board();
    }

    background(gainsboro);
    frameRate(frame_rate);
}

function draw() {

    for (let j = 0; j < slider.value(); j++) {


        for (let i = board.length - 1; i >= 0; i--) {
            // Delete snakes that are "Dead"
            if (board[i].status()) {
                saveBoards.push(board.splice(i, 1)[0]);
            }
        }

        for (let brd of board) {
            brd.think();
            brd.update();
        }

        if (board.length === 0) {
            nextGeneration();
        }

    }

    var aux_x = spaceBetween;
    var aux_y = spaceBetween;

    //Drawing
    background(gainsboro);
    for (let brd of board) {
        brd.show(aux_x, aux_y);
        aux_x += (sizeWindowX + spaceBetween);
        if (aux_x >= sizeCanvasX || sizeCanvasX / aux_x < 1) {
            aux_x = spaceBetween;
            aux_y += (sizeWindowY + spaceBetween);
        }
    }

}