import {setCardClosedColor, getCardClosedColor, disableCardClosedColor} from "../Settings/ColorSettings.js";
import {changeHue} from "./Color.js";

const DEFAULT_JEB_COLOR = "#FF0000"

export const EASTER_EGG_NONE = 0;
export const EASTER_EGG_JEB_ = 1;

let savedCardClosedColor = "";
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
    savedCardClosedColor = getCardClosedColor();
    disableCardClosedColor(true);
    jebInterval = setInterval(() => {
        currentJebColor = changeHue(currentJebColor, 5);
        setCardClosedColor(currentJebColor)
    }, 50)
}

function unSetJeb_EasterEgg(){
    clearInterval(jebInterval);
    currentJebColor = DEFAULT_JEB_COLOR;
    if (hasJebEasterEgg)
        setCardClosedColor(savedCardClosedColor);
    disableCardClosedColor(false);
    hasJebEasterEgg = false;
}