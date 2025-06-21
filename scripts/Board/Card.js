import {BOOLEAN_ATR_FALSE, BOOLEAN_ATR_TRUE, CLASS_ATR, CLICK_EV, isAttributeTrue} from "../Util/Attributes.js";
import {createCardImage, hideImage, hideImageOfCard} from "./CardImage.js";
import {DEFAULT_BACK_CHARACTERS} from "../Settings/CardCharactersSetting.js";
import {DATA_CARD_FLIPPING_ANIMATION_ATR, flipCard } from "./Cards.js";
import {getCardClosedColor} from "../Settings/ColorSettings.js";

export const DEFAULT_CARD_CLASS_NAME = 'card';
export const DATA_CARD_FLIPPED_ATR = 'data-card-flipped';
export const DATA_CARD_FOUND_ATR = 'data-card-found';
export const DATA_CARD_ID_ATR = 'data-card-id';
export const DATA_CARD_MEM_VAL_ATR = 'data-card-mem-val';

const DEFAULT_CLASS_NAME_CARD_TEXT = 'card_text';



export function createCard(cardId){
    const newCard = document.createElement("div");
    newCard.setAttribute(CLASS_ATR, DEFAULT_CARD_CLASS_NAME);
    setCardId(newCard, cardId);
    newCard.addEventListener(CLICK_EV, cardClick);
    newCard.setAttribute(DATA_CARD_FOUND_ATR, BOOLEAN_ATR_FALSE);
    newCard.setAttribute(DATA_CARD_FLIPPED_ATR, BOOLEAN_ATR_FALSE);
    newCard.setAttribute(DATA_CARD_FLIPPING_ANIMATION_ATR, BOOLEAN_ATR_FALSE);
    setColorOfCard(newCard, getCardClosedColor())

    let image = createCardImage(cardId);
    let pTagText = createPTagForText(cardId, DEFAULT_BACK_CHARACTERS);
    hideImage(image)
    newCard.appendChild(image);
    newCard.appendChild(pTagText);

    return newCard;
}

function createPTagForText(card, value){
    let pTag = document.createElement("p");
    pTag.id = getCardTextIdFromId(card);
    pTag.className = DEFAULT_CLASS_NAME_CARD_TEXT;
    pTag.innerText = value;
    return pTag;
}

export function getCardTextPTag(card){
    const cardId = getCardId(card);
    const textId = getCardTextIdFromId(cardId);
    return  document.getElementById(textId);
}

export function getCardMemVal(card){
    return card.getAttribute(DATA_CARD_MEM_VAL_ATR);
}

export function getCardId(card){
    return card.getAttribute(DATA_CARD_ID_ATR);
}

export function setCardFound(card) {
    card.setAttribute(DATA_CARD_FOUND_ATR, BOOLEAN_ATR_TRUE);
}

export function setColorOfCard(card, color){
    card.style.backgroundColor = color;
}

export function setCardId(card, cardId) {
    card.id = `card-${cardId}`;
    card.setAttribute(DATA_CARD_ID_ATR, cardId);
}


export function isCardFlipped(card) {
    return isAttributeTrue(card.getAttribute(DATA_CARD_FLIPPED_ATR))
}

export function isCardFlipping(card){
    return isAttributeTrue(card.getAttribute(DATA_CARD_FLIPPING_ANIMATION_ATR));
}

export function isCardFound(card) {
    return isAttributeTrue(card.getAttribute(DATA_CARD_FOUND_ATR))
}

export function hasSameMemVal(card1, card2) {
    return getCardMemVal(card1) === getCardMemVal(card2);
}


export function cardClick(event){
    let card = event.target;
    if (card.getAttribute(CLASS_ATR) !== DEFAULT_CARD_CLASS_NAME)
       card = card.parentElement;
    tryFlipCard(card);

}

function tryFlipCard(card){
    if (isCardFlipped(card)) return;
    flipCard(card);
}

export function getCardTextIdFromId(cardId){
    return `card_text-${cardId}`
}
