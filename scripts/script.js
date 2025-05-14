import { addCards, DEFAULT_CARD_CLASS_NAME } from './Board/Cards.js'
import { loadColorSettings } from './Settings/ColorSettings.js'

let cards = document.getElementsByClassName(DEFAULT_CARD_CLASS_NAME);
addCards(cards);

loadColorSettings();