import {
    setBoardCardsColor,
    setBoardOpenColor,
    setBoardFoundColor
} from '../Board/Cards.js'

export const CARD_COLOR_DEFAULT = '#444444';
export const OPEN_COLOR_DEFAULT = '#808080';
export const FOUND_COLOR_DEFAULT = '#007722';

export let boardCardsColor = CARD_COLOR_DEFAULT;
export let boardOpenColor = OPEN_COLOR_DEFAULT;
export let boardFoundColor = FOUND_COLOR_DEFAULT;

const DATA_COLOR_TYPE_ATR = 'data-color-type';
const CARD_COLOR_TYPE = 'card';
const OPEN_COLOR_TYPE = 'open';
const FOUND_COLOR_TYPE = 'found';


const cardColorPicker = document.getElementsByClassName("colors__card--card")[0];
const openColorPicker = document.getElementsByClassName("colors__open--card")[0];
const foundColorPicker = document.getElementsByClassName("colors__found--card")[0];

export function setupColorSettings(){
    addDefaultColors();
    addColorEventListeners();
}


function addDefaultColors(){
    cardColorPicker.setAttribute('value', CARD_COLOR_DEFAULT);
    openColorPicker.setAttribute('value', OPEN_COLOR_DEFAULT);
    foundColorPicker.setAttribute('value', FOUND_COLOR_DEFAULT);
}

function addColorEventListeners(){
    cardColorPicker.addEventListener('input', colorSelectedChanged);
    openColorPicker.addEventListener('input', colorSelectedChanged);
    foundColorPicker.addEventListener('input', colorSelectedChanged);
}

function colorSelectedChanged(event){
    const colorPicker = event.target;
    const color = colorPicker.value;

    switch(colorPicker.getAttribute(DATA_COLOR_TYPE_ATR)){
        case CARD_COLOR_TYPE: {
            boardCardsColor = color;
            setBoardCardsColor(color);
            break;
        }
        case OPEN_COLOR_TYPE: {
            boardOpenColor = color;
            setBoardOpenColor(color);
            break;
        }
        case FOUND_COLOR_TYPE: {
            boardFoundColor = color;
            setBoardFoundColor(color);
            break;
        }

    }
}