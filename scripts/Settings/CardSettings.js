import {
    setBoardBackCharacters
} from '../Board/Cards.js'
import {setEasterEgg, EASTER_EGG_JEB_, resetEasterEgg} from "../Util/EasterEggs.js";

const DEFAULT_BACK_CHARACTERS = '-';
const JEB_EASTER_EGG_CHARACTERS = 'jeb_';
const JEB2_EASTER_EGG_CHARACTERS = 'Jeb_';
const JEB3_EASTER_EGG_CHARACTERS = 'JEB_';

export let cardCharacters = DEFAULT_BACK_CHARACTERS;

const characterOnCardsInput = document.getElementById('characters_on_cards_input');

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


