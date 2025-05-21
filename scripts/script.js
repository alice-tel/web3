import {addMemListToCards, createCards, DEFAULT_CARD_CLASS_NAME} from './Board/Cards.js'
import { loadColorSettings } from './Settings/ColorSettings.js'
import { randomizeMemList, memList } from './Board/MemListShuffle.js'
import {addBoardSizeListener, addCharactersOnCardsListener} from "./Settings/CardSettings.js";
import { initializeGame } from './Board/Game.js';

let cards= createCards();

initializeGame(cards);

loadColorSettings();

randomizeMemList(cards);

addMemListToCards(memList);

addBoardSizeListener();
addCharactersOnCardsListener();
