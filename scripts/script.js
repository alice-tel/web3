import { addCards, addMemListToCards, DEFAULT_CARD_CLASS_NAME } from './Board/Cards.js'
import { loadColorSettings } from './Settings/ColorSettings.js'
import { randomizeMemList, memList } from './Board/MemListShuffle.js'
import {addCharactersOnCardsListener} from "./Settings/CardSettings.js";
import { initializeGame } from './Board/Game.js';

let cards = document.getElementsByClassName(DEFAULT_CARD_CLASS_NAME);

initializeGame(cards);

addCards(cards);

loadColorSettings();

randomizeMemList(cards);

addMemListToCards(memList);

addCharactersOnCardsListener();
console.log(`Game started with ${cards.length} cards`);
