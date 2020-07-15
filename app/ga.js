//TODO: Genetic algorithm

//* Populates again the AI
function nextGeneration() {
    console.log("New Generation");
    calculateFitness();

    for (let i = 0; i < pop_total; i++) {
        board[i] = pickOne();
    }
    
    saveBoards = [];
    
}

function pickOne() {
    var index = 0;
    var r = random(1);

    while (r > 0) {
        r = r - saveBoards[index].fitness;
        index++;
    }
    index--;

    let brd = saveBoards[index];
    let child = new Board(brd.brain);
    child.mutate();

    return child;
}


function calculateFitness() { //* Calculate Quality of the solution
    let sum = 0;
    for (let brd of saveBoards) {
        sum += brd.snake.score;
    }
    

    for (let brd of saveBoards) {
        brd.snake.fitness = brd.snake.score / sum;
    }

}