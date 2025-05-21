
const pairsFoundLabel = document.getElementById('pairs-found');
let totalPairsFound = 0;


export function addOneToPairsFound(){
    totalPairsFound++;
    pairsFoundLabel.innerText = totalPairsFound.toString();
}



// todo: Won check
//  1. check if all the cards are found
//  2. if true then go to won state
//  3. if false then resume game (do nothing)

// todo: elapsed time

// todo: remaining time and progressbar

// todo: board size set

