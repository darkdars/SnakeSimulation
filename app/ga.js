//* Populates again the AI
function nextGeneration(){
    for( let i = 0; i < pop_total; i++){
        board[i] = new Board();
    }
}