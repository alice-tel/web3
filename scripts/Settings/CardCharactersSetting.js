import { setBoardBackCharacters } from '../Board/Cards.js'
import {setEasterEgg, EASTER_EGG_JEB_, resetEasterEgg} from "../Util/EasterEggs.js";
import {INPUT_EV} from "../Util/Attributes.js";

export const DEFAULT_BACK_CHARACTERS = '-';
export let cardCharacters = DEFAULT_BACK_CHARACTERS;

const JEB_EASTER_EGG_CHARACTERS = 'JEB_';

const characterOnCardsInput = document.getElementById('characters_on_cards_input');

export function setupCharactersOnCardsSetting(){
    addDefaultCharactersOnCards()
    addCharactersOnCardsListener();
}

function addCharactersOnCardsListener()
{
    characterOnCardsInput.addEventListener(INPUT_EV, event => {
        cardCharacters = event.target.value;
        if (isJebEastEggText(cardCharacters)){
            setEasterEgg(EASTER_EGG_JEB_);
            setBoardBackCharacters(JEB_EASTER_EGG_CHARACTERS);
        }
        else{
            setBoardBackCharacters(cardCharacters);
            resetEasterEgg(EASTER_EGG_JEB_);
        }
    });
}
function addDefaultCharactersOnCards(){
    characterOnCardsInput.value = DEFAULT_BACK_CHARACTERS;
}

function isJebEastEggText(text){
    return text.toUpperCase() === JEB_EASTER_EGG_CHARACTERS;
}