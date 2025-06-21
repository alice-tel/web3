import {
    setBoardCardsColor,
    setBoardOpenColor,
    setBoardFoundColor
} from '../Board/Cards.js'

export const CARD_COLOR_DEFAULT = '#444444';
export const OPEN_COLOR_DEFAULT = '#808080';
export const FOUND_COLOR_DEFAULT = '#007722';

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

export function getCardClosedColor(){
    return cardColorPicker.getAttribute('value');
}
export function getCardOpenColor(){
    return openColorPicker.getAttribute('value');
}
export function getCardFoundColor(){
    return foundColorPicker.getAttribute('value');
}

export function disableCardClosedColor(disable){
    cardColorPicker.disabled = disable;
}

export function setCardClosedColor(color){
    cardColorPicker.setAttribute('value', color);
    setBoardCardsColor(color);
}
export function setCardOpenColor(color){
    openColorPicker.setAttribute('value', color);
    setBoardOpenColor(color);
}
export function setCardFoundColor(color){
    foundColorPicker.setAttribute('value', color);
    setBoardFoundColor(color);
}

function addDefaultColors(){
    setCardClosedColor(CARD_COLOR_DEFAULT);
    setCardOpenColor(OPEN_COLOR_DEFAULT);
    setCardFoundColor(FOUND_COLOR_DEFAULT);
}

function addColorEventListeners(){
    cardColorPicker.addEventListener('input', colorSelectedChanged);
    openColorPicker.addEventListener('input', colorSelectedChanged);
    foundColorPicker.addEventListener('input', colorSelectedChanged);
}

function colorSelectedChanged(event){
    const colorPicker = event.target;
    const color = colorPicker.value;
    setColor(colorPicker.getAttribute(DATA_COLOR_TYPE_ATR), color);

}

function setColor(type, color){
    switch(type){
        case CARD_COLOR_TYPE: {
            setCardClosedColor(color);
            break;
        }
        case OPEN_COLOR_TYPE: {
            setCardOpenColor(color);
            break;
        }
        case FOUND_COLOR_TYPE: {
            setCardFoundColor(color);
            break;
        }

    }
}