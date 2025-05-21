import { MAX_COUNT_FLIPPED_CARDS } from "./Cards.js";

const DEFAULT_ROW_SIZE = 6;

export const DEFAULT_MEM_LIST_OPTIONS = [
    "A", "B", "C", "D", "E", "F",
    "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R",
    "S", "T", "U", "V", "W", "X", "Y", "Z"
];

let rowSize = DEFAULT_ROW_SIZE;

// Randomizer,
//  1. create a list of possible characters (maybe later something like cat pictures haha).
//  2. randomize at the beginning of the game (for now when page is reloaded).
export let memList = [];

function getTotalAmountOfCards() {
    return rowSize**MAX_COUNT_FLIPPED_CARDS;
}

function getMemOptionCount(){
    return getTotalAmountOfCards() / MAX_COUNT_FLIPPED_CARDS;
}

export function randomizeMemList(cards, ){
    let listOfOptions = DEFAULT_MEM_LIST_OPTIONS.slice(0, cards.length/MAX_COUNT_FLIPPED_CARDS);

    if (listOfOptions.length < getMemOptionCount())
        throw Error("The number of options for memory is too low!");

    // multiply all characters
    let completeList = listOfOptions.reduce((res, current) => res.concat(multiplyMemVal(current)), []);
    // shuffleList(completeList);
    memList = completeList;
}

function multiplyMemVal(current){
    let arr = [];

    for (let i = 0; i < MAX_COUNT_FLIPPED_CARDS; i++) {
        arr.push(current);
    }

    return arr;
}

function shuffleList(array) {
    for (let i = 0; i < array.length-1; i++) {
        let randomIndex = Math.floor(Math.random() * i);

        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }

}