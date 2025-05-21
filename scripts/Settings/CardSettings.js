import {
    resetCards,
    setBoardBackCharacters
} from '../Board/Cards.js'
import {setEasterEgg, EASTER_EGG_JEB_, resetEasterEgg} from "../Util/EasterEggs.js";

export const DEFAULT_BACK_CHARACTERS = '-';
const JEB_EASTER_EGG_CHARACTERS = 'jeb_';
const JEB2_EASTER_EGG_CHARACTERS = 'Jeb_';
const JEB3_EASTER_EGG_CHARACTERS = 'JEB_';
const DEFAULT_CARD_ROW_SIZE = 6;
const DEFAULT_BOARD_SIZE_OPTIONS = [
    ["4x4", 4],
    ["5x5",5],
    ["6x6",6],
    ["7x7",7],
    ["8x8",8],
    ["9x9",9],
    ["10x10",10],
]
const DEFAULT_SELECTED_BOARD_SIZE_OPTION = 6;

export let cardCharacters = DEFAULT_BACK_CHARACTERS;
export let cardRowSize = DEFAULT_CARD_ROW_SIZE;

const characterOnCardsInput = document.getElementById('characters_on_cards_input');
const boardSizeInput = document.getElementById('size_of_board_input');

export function addCharactersOnCardsListener()
{
    characterOnCardsInput.addEventListener('input', event => {
        cardCharacters = event.target.value;
        if (isJebEastEggText(cardCharacters)){
            setEasterEgg(EASTER_EGG_JEB_);
            setBoardBackCharacters(JEB3_EASTER_EGG_CHARACTERS);
        }
        else{
            setBoardBackCharacters(cardCharacters);
            resetEasterEgg(EASTER_EGG_JEB_);
        }
    });
    characterOnCardsInput.value = DEFAULT_BACK_CHARACTERS;
}

function isJebEastEggText(text){
    return (
    text === JEB_EASTER_EGG_CHARACTERS ||
    text === JEB2_EASTER_EGG_CHARACTERS ||
    text === JEB3_EASTER_EGG_CHARACTERS
    )
}

export function addBoardSizeListener()
{
    addBoardSizeInputOptions();
    boardSizeInput.addEventListener('input', event => {
        cardRowSize = event.target.value;
        resetCards();
    });
}

function addBoardSizeInputOptions(){
    for (const option of DEFAULT_BOARD_SIZE_OPTIONS) {
        let optionEl = document.createElement("option");
        optionEl.textContent = option[0];
        optionEl.value = option[1];
        if (DEFAULT_SELECTED_BOARD_SIZE_OPTION === option[1]) {
            optionEl.selected = true;
        }
        boardSizeInput.appendChild(optionEl);
    }
}


