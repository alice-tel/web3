import {addMemListToCards, createAddCards, getCards, setCardImages, MAX_COUNT_FLIPPED_CARDS} from './Board/Cards.js'
import {getMemListOptions, randomizeMemList} from './Board/MemListShuffle.js'
import { initializeGame } from './Board/Game.js';
import { setupSettings } from "./Settings/Settings.js";
import {fetchImages} from "./Api/Image/ImageApi.js";
import {cardImageType} from "./Settings/ImageSettings.js";
import { onGameEnd, getCurrentGameSettings, initializeUserPreferences } from './game-integration.js';

export { onGameEnd, getCurrentGameSettings };

async function initializePreferences() {
    try {
        await initializeUserPreferences();
    } catch (error) {
        console.error('Error initializing preferences:', error);
    }
}

async function initializeGameWithPreferences() {
    await initializePreferences();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // boardBackCharactersOnLoad();
    // cardRowSizeOnLoad();
    colorSettingsOnLoad();
    cardImageTypeOnLoad();
    
    createAddCards();
    const cards = getCards();
    const memListOptions = getMemListOptions(cards.length);
    const memList = randomizeMemList(memListOptions);
    addMemListToCards(memList);
    
    initializeGame(cards);
}

document.addEventListener('DOMContentLoaded', () => {
    const imageSelect = document.getElementById('image_of_board_input');
    if (imageSelect && imageSelect.options.length === 0) {
        imageSelect.innerHTML = `
            <option value="0">Characters</option>
            <option value="1">Dog Images</option>
            <option value="2">Cat Images</option>
        `;
    }

    initializeGameWithPreferences();
});

document.addEventListener('preferencesUpdated', () => {    
    setTimeout(() => {
        colorSettingsOnLoad();
        cardImageTypeOnLoad();
    }, 100);
});

export function resetBoard(){
    createAddCards();
    let cards= getCards();

    let memList = getMemListOptions(cards.length);
    let randomMemList = randomizeMemList(memList);
    addMemListToCards(randomMemList);

    fetchImages(cardImageType,cards.length/MAX_COUNT_FLIPPED_CARDS)
        .then(urls => {
            const mappedUrls = {};
            memList.map(option => mappedUrls[option] = urls.pop());
            setCardImages(mappedUrls);
        });

    initializeGame(cards);
}

setupSettings()
resetBoard();