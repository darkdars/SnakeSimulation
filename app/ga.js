//TODO: Genetic algorithm

//* Populates again the AI
function nextGeneration() {
    console.log("New Generation");
    calculateFitness();

    for (let i = 0; i < pop_total; i++) {
        boards[i] = pickOne();
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

    let board = saveBoards[index];
    let child = new Board(board.brain);
    child.mutate();

    return child;
}


function calculateFitness() { //* Calculate Quality of the solution
    let sum = 0;
    for (let board of saveBoards) {
        sum += board.snake.score;
    }
    

    for (let board of saveBoards) {
        board.snake.fitness = board.snake.score / sum;
    }

}