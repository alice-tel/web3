import {addMemListToCards, createAddCards, getCards, setCardImages, MAX_COUNT_FLIPPED_CARDS} from './Board/Cards.js'
import {getMemListOptions, randomizeMemList} from './Board/MemListShuffle.js'
import { initializeGame } from './Board/Game.js';
import { setupSettings } from "./Settings/Settings.js";
import {fetchImages} from "./Api/Image/ImageApi.js";
import {getCardImageType} from "./Settings/ImageSettings.js";
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

    resetBoard();
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGameWithPreferences();
});


export function resetBoard(){
    createAddCards();
    let cards= getCards();

    let memList = getMemListOptions(cards.length);
    let randomMemList = randomizeMemList(memList);
    addMemListToCards(randomMemList);

    fetchImages(getCardImageType(),cards.length/MAX_COUNT_FLIPPED_CARDS)
        .then(urls => {
            const mappedUrls = {};
            memList.map(option => mappedUrls[option] = urls.pop());
            setCardImages(mappedUrls);
        });

    initializeGame(cards);
}

setupSettings()
resetBoard();