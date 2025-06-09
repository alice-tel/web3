import { resetBoard } from '../script.js'
import {INPUT_EV} from "../Util/Attributes.js";
import {createAddOptions} from "./Settings.js";

const DEFAULT_CARD_ROW_SIZE = 6;
const DEFAULT_BOARD_SIZE_OPTIONS = [
    ["2x2", 2],
    ["4x4", 4],
    ["6x6", 6],
    ["8x8", 8],
]
const DEFAULT_SELECTED_BOARD_SIZE_OPTION = 6;

export let cardRowSize = DEFAULT_CARD_ROW_SIZE;


const boardSizeInput = document.getElementById('size_of_board_input');


export function setupBoardSizeSelector()
{
    addBoardSizeInputOptions();
    addBoardSizeListener();
}

function addBoardSizeListener()
{
    boardSizeInput.addEventListener(INPUT_EV, event => {
        cardRowSize = event.target.value;
        resetBoard();
    });
}

function addBoardSizeInputOptions(){
    createAddOptions(DEFAULT_BOARD_SIZE_OPTIONS, boardSizeInput, DEFAULT_SELECTED_BOARD_SIZE_OPTION)
}


