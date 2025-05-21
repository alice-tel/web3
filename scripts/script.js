import { addCards, addMemListToCards, DEFAULT_CARD_CLASS_NAME, MAX_COUNT_FLIPPED_CARDS } from './Board/Cards.js'
import { loadColorSettings } from './Settings/ColorSettings.js'
import { randomizeMemList, memList, DEFAULT_MEM_LIST_OPTIONS } from './Board/MemListShuffle.js'

let cards = document.getElementsByClassName(DEFAULT_CARD_CLASS_NAME);
addCards(cards);

loadColorSettings();

randomizeMemList(cards);

addMemListToCards(memList);
