import {setBoardCardsColor} from "../Board/Cards.js";
import {CARD_COLOR_DEFAULT, boardCardsColor} from "../Settings/ColorSettings.js";
import {changeHue} from "./Color.js";

const DEFAULT_JEB_COLOR = "#FF0000"

export const EASTER_EGG_NONE = 0;
export const EASTER_EGG_JEB_ = 1;

let currentJebColor = DEFAULT_JEB_COLOR;
let jebInterval;
let hasJebEasterEgg = false;

export function setEasterEgg(easterEgg){
    switch (easterEgg){
        case EASTER_EGG_NONE:
            break;
        case EASTER_EGG_JEB_:
            setJeb_EasterEgg();
    }
}
export function resetEasterEgg(easterEgg){
    switch (easterEgg){
        case EASTER_EGG_NONE:
            break;
        case EASTER_EGG_JEB_:
            unSetJeb_EasterEgg();
    }
}

function setJeb_EasterEgg(){
    hasJebEasterEgg = true;
    jebInterval = setInterval(() => {
        currentJebColor = changeHue(currentJebColor, 5);
        setBoardCardsColor(currentJebColor)
    }, 50)
}

function unSetJeb_EasterEgg(){
    clearInterval(jebInterval);
    currentJebColor = DEFAULT_JEB_COLOR;
    if (hasJebEasterEgg)
        setBoardCardsColor(boardCardsColor);
    hasJebEasterEgg = false;
}