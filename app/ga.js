//TODO: Genetic algorithm

//* Populates again the AI
function nextGeneration() {
    generation += 1;
    calculateFitness();

    for (let i = pop_total / 2; i < pop_total; i++) {
        boards[i] = pickOne();
    }

    for(let i = 0; i < pop_total / 2; i++){
        boards[i] = pickMax();
    }
    
    for(let i = 0; i < pop_total; i++){
        saveBoards[i].dispose();
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
    child.mutate(0.2);

    return child;
}

function pickMax(){
    let max = 0;
    let aux;
    for (let board of saveBoards){
        if(board.snake.score > max){
            max = board.snake.score;
            aux = board.brain;
        }
    }

    let child = new Board(aux);
    child.mutate(0.1);
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