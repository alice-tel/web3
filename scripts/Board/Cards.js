import {
    CARD_COLOR_DEFAULT,
    FOUND_COLOR_DEFAULT,
    OPEN_COLOR_DEFAULT
} from '../Settings/ColorSettings.js'

import {
    BOOLEAN_ATR_FALSE,
    BOOLEAN_ATR_TRUE,
    isAttributeTrue
} from "../Util/Attriburtes.js";


export const DEFAULT_CARD_CLASS_NAME = 'card';
export const MAX_COUNT_FLIPPED_CARDS = 2;
const CARD_FLIP_SPEED = 2; // In degrees per step.
const CARD_FLIPPING_POINT = 85; // The amount of degrees before the character of an card has been changed.
const CARD_MAX_FLIP_DEGREES = 180;
const DEFAULT_TEXT_OF_CARD = '-';
const DATA_CARD_ID_ATR = 'data-card-id';
const DATA_CARD_MEM_VAL_ATR = 'data-card-mem-val';
const DATA_CARD_FOUND_ATR = 'data-card-found';
const DATA_CARD_FLIPPED_ATR = 'data-card-flipped';
const DATA_CARD_FLIPPING_ANIMATION_ATR = 'data-card-flipping-animation';

let boardCardsColor = CARD_COLOR_DEFAULT;
let boardOpenColor = OPEN_COLOR_DEFAULT;
let boardFoundColor = FOUND_COLOR_DEFAULT;

let boardCards; // maybe move this down to onBodyLoad, if we eventually do not use this in the context of this script
let selectedCards = [];

export function addCards(cards){
    boardCards = cards;
    for (const card of cards) {
        card.addEventListener("click", cardClick);
    }
}

export function setBoardCardsColor(color) {
    boardCardsColor = color;
    setBoardCardBackColor(color, boardCard => !isCardFlipped(boardCard));
}
export function setBoardOpenColor(color) {
    boardOpenColor = color;
    setBoardCardBackColor(color, boardCard => isCardFlipped(boardCard) && !isCardFound(boardCard))
}
export function setBoardFoundColor(color) {
    boardFoundColor = color;
    setBoardCardBackColor(color, boardCard => isCardFlipped(boardCard) && isCardFound(boardCard));
}

function setBoardCardBackColor(color, conditionCB) {
    for (const boardCard of boardCards) {
        if (conditionCB(boardCard))
            boardCard.style.backgroundColor = color;
    }
}

function cardClick(event){
    const card = event.target;
    if (isCardFlipped(card)) return;
    flipCard(card);
}

function flipCard(card){
    let degrees = 0;
    if (isCardFlipping(card) || isCardFound(card)) return;
    let flipCardAni = setInterval(
        () => {
            let isFlipped = isCardFlipped(card);
            let dataCardId = card.getAttribute(DATA_CARD_ID_ATR);

            if (!isFlipped && selectedCards.length >= MAX_COUNT_FLIPPED_CARDS && !selectedCards.includes(dataCardId)) {
                clearInterval(flipCardAni);
                return;
            }

            if (degrees >= CARD_MAX_FLIP_DEGREES){
                clearInterval(flipCardAni);
                card.setAttribute(DATA_CARD_FLIPPED_ATR, isFlipped ? BOOLEAN_ATR_FALSE : BOOLEAN_ATR_TRUE);
                card.setAttribute(DATA_CARD_FLIPPING_ANIMATION_ATR, BOOLEAN_ATR_FALSE);

                if(!areAllCardsFlipped()) return;

                    if (cardsFlippedSameValue()) setFlippedCardsFound();
                    else flipBackTimer();

            }
            else {
                if (degrees <= 0){
                    updateCardInclusion(dataCardId, isFlipped);
                    card.setAttribute(DATA_CARD_FLIPPING_ANIMATION_ATR, BOOLEAN_ATR_TRUE)
                }

                degrees += CARD_FLIP_SPEED;
                let actualDegrees = degrees;
                if (degrees > CARD_FLIPPING_POINT)
                {
                    updateCardText(!isFlipped, card);
                    updateCardColor(card, !isFlipped);
                    actualDegrees = 180-degrees;
                }
                card.style.transform = `rotateY(${actualDegrees}deg)`;
            }
        });
}

export function addMemListToCards(memList) {
    for (let i = 0; i < boardCards.length; i++) {
        boardCards[i].setAttribute(DATA_CARD_MEM_VAL_ATR, memList[i]);
    }
}

function getCardMemVal(card){
    return card.getAttribute(DATA_CARD_MEM_VAL_ATR);
}

function getCardId(card){
    return card.getAttribute(DATA_CARD_ID_ATR);
}

function setCardFound(card) {
    card.setAttribute(DATA_CARD_FOUND_ATR, BOOLEAN_ATR_TRUE);
}

function setFlippedCardsFound(){
    for (const cardId of selectedCards) {
        let card = getCardWithCardId(cardId);
        setCardFound(card);
        updateCardColor(card);
    }
    selectedCards = [];
}

function flipAllFlippedCards()
{
    for (const cardId of selectedCards) {
        flipCard(getCardWithCardId(cardId));
    }
}

function isCardFlipped(card) {
    return isAttributeTrue(card.getAttribute(DATA_CARD_FLIPPED_ATR))
}

function isCardFlipping(card){
    return isAttributeTrue(card.getAttribute(DATA_CARD_FLIPPING_ANIMATION_ATR));
}

function isCardFound(card) {
    return isAttributeTrue(card.getAttribute(DATA_CARD_FOUND_ATR))
}

function areAllCardsFlipped(){
    return selectedCards.length === MAX_COUNT_FLIPPED_CARDS;
}

function cardsFlippedSameValue(){
    let areSame = true;
    let lastCard = getCardWithCardId(selectedCards[0]);
    for (let i = 1; i < selectedCards.length; i++) {
        let card = getCardWithCardId(selectedCards[i]);
        areSame &= hasSameMemVal(lastCard, card);
        lastCard = card;
    }
    return areSame;
}

function getCardWithCardId(cardId){
    for (const card of boardCards) {
        let id = getCardId(card);
        if (id === cardId) return card;
    }

    throw Error(`Now Card Found with id: ${cardId}`);
}

function hasSameMemVal(card1, card2) {
    return getCardMemVal(card1) === getCardMemVal(card2);
}

function flipBackTimer(){
    setTimeout(() => flipAllFlippedCards(), 1000)
}

function updateCardColor(card, isFlipped = undefined)
{
    let flippedColor = isCardFound(card) ? boardFoundColor : boardOpenColor;
    if (isFlipped === undefined) isFlipped = isCardFlipped(card);
    card.style.backgroundColor = isFlipped ? flippedColor : boardCardsColor;
}

function updateCardText(isFlipped, card)
{
    let mem = card.getAttribute(DATA_CARD_MEM_VAL_ATR);
    card.innerText = isFlipped ? mem : DEFAULT_TEXT_OF_CARD;
}

function updateCardInclusion(dataCardId, isFlipped){
    let index = selectedCards.indexOf(dataCardId);

    if (!isFlipped && selectedCards.length < MAX_COUNT_FLIPPED_CARDS && index < 0)
        selectedCards.push(dataCardId);
    //todo maybe make the below logic scaleble instead of hardcoding for max 2 flipped cards
    else if (index === 0)
        selectedCards = selectedCards.slice(1, 2);
    else if (index === 1)
        selectedCards = selectedCards.slice(0, 1);

    // console.log('[');
    // for (const index1 of selectedCards) {
    //     console.log(index1);
    // }
    // console.log(']');
}