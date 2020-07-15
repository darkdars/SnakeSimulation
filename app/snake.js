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
var boards = [];
var saveBoards = [];

//* Enviromnent variables
var frame_rate = 10;

const pop_total = 30;
var spaceBetween = 1;

var n_per_row = 8;

var sizeWindowX = 200;
var sizeWindowY = 200;

var sizeCanvasX = n_per_row * sizeWindowX;
var sizeCanvasY = (pop_total / n_per_row + 0.5) * sizeWindowY;

var size = ((sizeWindowX + sizeWindowY) / 2) / 10;


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
    _time_alive = 0;

    constructor(pos_x, pos_y) {
        this._head = new Blocks(pos_x, pos_y);
        this._body = [];
        this._yspeed = 0;
        this._xspeed = this._speed;
        this._score = 0;
        this._time_alive = 0;
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

    get time_alive() {
        return this._time_alive;
    }

    set time_alive(value) {
        this._time_alive = value;
    }

    //* Snake Movement functions
    movement() {
        this.bodyMovement();
        this.headMovement();
        this.moves -= 1;
        this.time_alive += 1;
    }


    headMovement(){
        let head = this.head;

        head.pos_x += this.xspeed * size;
        head.pos_y += this.yspeed * size;
    }

    bodyMovement(){
        if(this.body.length > 0){
            for (let i = 0; i < this.body.length - 1; i++) {
                this.body[i] = this.body[i + 1];
            }
    
            this.body[this.body.length - 1] = new Blocks(this.head.pos_x, this.head.pos_y);
        }
    }

    //TODO: Ends here (Snake Movement functions)

    //* Function that handle eat
    eat() {
        this.score += 1;
        this.moves += 100;
        this.addTail();
    }

    addTail() {
        this.body.push(new Blocks(this.head.pos_x, this.head.pos_y));
    }

    //* Check if the snake colide with herself or with the wall; returns true if it colides 
    checkColision() {
        let head = this.head;

        if (head.pos_x < 0 || head.pos_x > sizeWindowX ||
            head.pos_y < 0 || head.pos_y > sizeWindowY) {
            return true;
        }

        if(this.body.length > 1){
            for (let i = 0; i < this.body.length - 1; i++) {
                let pos = this.body[i];
                let d = dist(head.pos_x, head.pos_y, pos.pos_x, pos.pos_y);
                if (d < 1) {
                    return true;
                }
            }
        }

        return false;
    }

    status(){
        if(this.checkColision()){
            return true;
        }else if(this.moves <= 0){
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
        this._snake =  this.newSnake();
        this._food = this.randomFood();
        this._buffer = createGraphics(sizeWindowX, sizeWindowY);

        if (brain) {
            this.brain = brain.copy();
        } else {
            this._brain = new NeuralNetwork(9, 30, 3);
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

    newRandomSnake(){
        var cols = floor(sizeWindowX / size);
        var rows = floor(sizeWindowY / size);
        let x = floor(this.getRandom(1, cols - 1) * size);
        let y = floor(this.getRandom(1, rows - 1) * size);
        return new Snake(x, y);
    }
    
    newSnake(){
        return new Snake(0, sizeWindowX / 2);
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
        this.think();
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
        if (d < size) {
            return true;
        } else {
            return false;
        }
    }

    //* Functions to give values to the AI
    checkColisionWall(pos_x, pos_y) { // Returnss true if it colides with the wall
        if (pos_x > sizeWindowX || pos_x < 0 || pos_y > sizeWindowY || pos_y < 0) {
            return true;
        } else {
            return false;
        }
    }

    checkColisionBodySnake(pos_x, pos_y) { // Returns true if it colides with herself
        var body = this.snake.body;

        if(body.length > 1){
            for (var i = 0; i < body.length - 1; i++) {
                var pos = body[i];
                var d = dist(pos_x, pos_y, pos.pos_x, pos.pos_y);
    
                if (d < 1) {
                    return true;
                }
            }
        }
        

        return false;
    }

    checkColisionFood(pos_x, pos_y) { // Returns true if he colides with the food
        let d = dist(pos_x, pos_y, this.food.pos_x, this.food.pos_y);
        if (d < size) {
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
        //inputs[9] = this.snake.score;
        //inputs[10] = this.snake.moves;

        let output = this.brain.predict(inputs);
        if (output[0] > output[1] && output[0] > output[2]) { // Foward
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


    up() {
        if (this.snake.xspeed != 0) {
            this.snake.xspeed = 0;
            this.snake.yspeed = - this.snake.speed;
        }
    }

    left() {
        if (this.snake.yspeed != 0) {
            this.snake.xspeed = - this.snake.speed;
            this.snake.yspeed = 0;
        }

    }

    down() {
        if (this.snake.xspeed != 0) {
            this.snake.xspeed = 0;
            this.snake.yspeed = this.snake.speed;
        }
    }

    right() {
        if (this.snake.yspeed != 0) {
            this.snake.xspeed = this.snake.speed;
            this.snake.yspeed = 0;
        }
    }

}

let slider;

//Draw functions
function setup() {
    slider = createSlider(1, 100, 1);

    createCanvas(sizeCanvasX + 10, sizeCanvasY + 10);
    for (let i = 0; i < pop_total; i++) {
        boards[i] = new Board();
    }

    background(gainsboro);
    frameRate(frame_rate);
}

function draw() {

    for (let j = 0; j < slider.value(); j++) {        
        for (let board of boards) {
            board.update();
        }

        for (let i = boards.length - 1; i >= 0; i--) {
            // Delete snakes that are "Dead" and saves it (for another array)
            if (boards[i].snake.checkColision()) {
                saveBoards.push(boards.splice(i, 1)[0]);
            }
        }

        if (boards.length === 0) {
            nextGeneration();
        }

    }

    
    //Drawing
    let aux_x = spaceBetween;
    let aux_y = spaceBetween;
    let contador = 0;
    background(gainsboro);
    for (let board of boards) {
        contador += 1;
        board.show(aux_x, aux_y);
        aux_x += (sizeWindowX + spaceBetween);
        if (contador >= n_per_row) {
            aux_x = spaceBetween;
            aux_y += (sizeWindowY + spaceBetween);
            contador = 0;
        }
    }

}


function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        boards[0].left();
    } else if (keyCode === RIGHT_ARROW) {
        boards[0].right();
    } else if (keyCode === UP_ARROW) {
        boards[0].up();
    } else if (keyCode === DOWN_ARROW) {
        boards[0].down();
    }
}