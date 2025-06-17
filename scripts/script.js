import {addMemListToCards, createAddCards, getCards, setCardImages, MAX_COUNT_FLIPPED_CARDS} from './Board/Cards.js'
import {getMemListOptions, randomizeMemList} from './Board/MemListShuffle.js'
import { initializeGame } from './Board/Game.js';
import { setupSettings } from "./Settings/Settings.js";
import {fetchImages} from "./Api/Image/ImageApi.js";
import {cardImageType} from "./Settings/ImageSettings.js";
import { onGameEnd, getCurrentGameSettings } from './game-integration.js';

export { onGameEnd, getCurrentGameSettings };

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