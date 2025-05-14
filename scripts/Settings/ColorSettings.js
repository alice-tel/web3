import {
    setBoardCardsColor,
    setBoardOpenColor,
    setBoardFoundColor
} from '../Board/Cards.js'

export const CARD_COLOR_DEFAULT = '#444444';
export const OPEN_COLOR_DEFAULT = '#808080';
export const FOUND_COLOR_DEFAULT = '#007722';
const DATA_COLOR_TYPE_ATR = 'data-color-type';

let cardColorPicker;
let openColorPicker;
let foundColorPicker;

export function loadColorSettings(){
    addDefaultColors();
}


function addDefaultColors(){
    cardColorPicker = document.getElementsByClassName("colors__card--card")[0];
    openColorPicker = document.getElementsByClassName("colors__open--card")[0];
    foundColorPicker = document.getElementsByClassName("colors__found--card")[0];

    cardColorPicker.setAttribute('value', CARD_COLOR_DEFAULT);
    openColorPicker.setAttribute('value', OPEN_COLOR_DEFAULT);
    foundColorPicker.setAttribute('value', FOUND_COLOR_DEFAULT);

    cardColorPicker.addEventListener('input', colorSelectedChanged);
    openColorPicker.addEventListener('input', colorSelectedChanged);
    foundColorPicker.addEventListener('input', colorSelectedChanged);
}

function colorSelectedChanged(event){
    const colorPicker = event.target;
    const color = colorPicker.value;

    switch(colorPicker.getAttribute(DATA_COLOR_TYPE_ATR)){
        case "card": {
            setBoardCardsColor(color);
            break;
        }
        case "open": {
            setBoardOpenColor(color);
            break;
        }
        case "found": {
            setBoardFoundColor(color);
            break;
        }

    }
}