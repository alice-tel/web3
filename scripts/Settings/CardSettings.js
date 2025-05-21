import {
    setBoardBackCharacters
} from '../Board/Cards.js'

const DEFAULT_BACK_CHARACTERS = '-';

export let cardCharacters = DEFAULT_BACK_CHARACTERS;

const characterOnCardsInput = document.getElementById('characters_on_cards_input');

export function addCharactersOnCardsListener()
{
    characterOnCardsInput.addEventListener('input', event => {
        cardCharacters = event.target.value;
        setBoardBackCharacters(cardCharacters);
    });
    characterOnCardsInput.value = DEFAULT_BACK_CHARACTERS;
}

