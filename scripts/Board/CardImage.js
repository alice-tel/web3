import {BLOCK_ATR, CLASS_ATR, NONE_ATR, SRC_ATR} from '../Util/Attributes.js';
import { IMG_TAG } from '../Util/Tags.js';
import {getCardId} from "./Card.js";

const CARD_IMAGE_CLASS = 'card-image';

export function getCardImage(card) {
    let id = getCardImageIdFromId(getCardId(card));
    return document.getElementById(id);
}

export function getCardImageSrc(card) {
    let image = getCardImage(card);
    return image.getAttribute(SRC_ATR);
}

export function createCardImage(cardId){
    const image = document.createElement(IMG_TAG);
    image.id = getCardImageIdFromId(cardId);
    image.setAttribute(CLASS_ATR, CARD_IMAGE_CLASS);
    return image;
}

export function setCardImage(card, imageUrl){
    getCardImage(card).setAttribute(SRC_ATR, imageUrl);
}

export function hideImageOfCard(card, hidden = true){
   hideImage(getCardImage(card), hidden);
}

export function hideImage(image, hidden = true){
    image.style.display = hidden ? NONE_ATR : BLOCK_ATR;
}

function getCardImageIdFromId(cardId){
    return `card_image-${cardId}`
}