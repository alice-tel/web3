import {
    boardCardsColor,
    boardOpenColor,
    boardFoundColor,
} from '../Settings/ColorSettings.js'

import {
    BOOLEAN_ATR_FALSE,
    BOOLEAN_ATR_TRUE,
} from "../Util/Attributes.js";

import { addOneToPairsFound, isGameStarted } from "./Game.js";
import {cardRowSize} from "../Settings/CardSizeSetting.js";
import {cardCharacters} from "../Settings/CardCharactersSetting.js";
import {hideImageOfCard, setCardImage} from "./CardImage.js";
import {
    createCard,
    getCardId,
    hasSameMemVal,
    isCardFlipped,
    isCardFlipping,
    isCardFound,
    setCardFound,
    DATA_CARD_FLIPPED_ATR, DATA_CARD_MEM_VAL_ATR, DATA_CARD_ID_ATR, getCardTextPTag, getCardMemVal
} from "./Card.js";
import {cardImageType, CHARACTER_IMAGE_TYPE_OPTION} from "../Settings/ImageSettings.js";

export const MAX_COUNT_FLIPPED_CARDS = 2;
export const DATA_CARD_FLIPPING_ANIMATION_ATR = 'data-card-flipping-animation';

const CARD_FLIP_SPEED = 2; // In degrees per step.
const CARD_FLIPPING_POINT = 85; // The amount of degrees before the character of a card has been changed.
const CARD_MAX_FLIP_DEGREES = 180;

let gameBoard = document.getElementsByClassName('game')[0];
let boardCards = []; // maybe move this down to onBodyLoad, if we eventually do not use this in the context of this script
let selectedCards = [];


export function createAddCards(){
    gameBoard.innerHTML = "";
    boardCards = [];
    selectedCards = [];

    for (let i = 1; i <= cardRowSize; i++) {
        const newRow = document.createElement("div");
        newRow.setAttribute("class", "game__row");
        for (let j = 1; j <= cardRowSize; j++) {
            let card = createCard((i*cardRowSize)+j);
            boardCards.push(card);
            newRow.appendChild(card);
        }
        gameBoard.appendChild(newRow);
    }
}
export function getCards(){
    return boardCards;
}


export function setBoardCardsColor(color) {
    setBoardCardBackColor(color, boardCard => !isCardFlipped(boardCard));
}
export function setBoardOpenColor(color) {
    setBoardCardBackColor(color, boardCard => isCardFlipped(boardCard) && !isCardFound(boardCard))
}
export function setBoardFoundColor(color) {
    setBoardCardBackColor(color, boardCard => isCardFlipped(boardCard) && isCardFound(boardCard));
}

export function setBoardBackCharacters(text) {
    for (const boardCard of boardCards) {
        if (!isCardFlipped(boardCard)) {
            setCardText(boardCard, text)
        }
    }
}

export function setCardImages(mappedUrls) {
    for (const boardCard of boardCards) {
        const cardMemVal = getCardMemVal(boardCard);
        setCardImage(boardCard, mappedUrls[cardMemVal]);
    }
}

function setBoardCardBackColor(color, conditionCB) {
    for (const boardCard of boardCards) {
        if (conditionCB(boardCard))
            boardCard.style.backgroundColor = color;
    }
}

export function flipCard(card){
    // Prevent flipping if game hasn't started
    if (!isGameStarted()) {
        return;
    }
    
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

                if(!minCountCardsFlipped()) return;

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
                    updateCardText(card, !isFlipped);
                    updateCardImage(card, !isFlipped);
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


function setFlippedCardsFound(){
    for (const cardId of selectedCards) {
        let card = getCardWithCardId(cardId);
        setCardFound(card);
        updateCardColor(card);
    }
    selectedCards = [];
    addOneToPairsFound();
}

export function areAllCardsFound() {
    if (!boardCards || boardCards.length === 0) return false;

    for (const card of boardCards) {
        if (!isCardFound(card)) {
            return false;
        }
    } 
    return true;
}

function flipAllFlippedCards()
{
    for (const cardId of selectedCards) {
        flipCard(getCardWithCardId(cardId));
    }
}


function minCountCardsFlipped(){
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



function flipBackTimer(){
    setTimeout(() => flipAllFlippedCards(), 1000)
}

function updateCardColor(card, isFlipped = undefined)
{
    let flippedColor = isCardFound(card) ? boardFoundColor : boardOpenColor;
    if (isFlipped === undefined) isFlipped = isCardFlipped(card);
    card.style.backgroundColor = isFlipped ? flippedColor : boardCardsColor;
}

function updateCardText(card, isFlipped)
{
    if (cardImageType !== CHARACTER_IMAGE_TYPE_OPTION && isFlipped) {
        setCardText(card,'');
        return;
    }
    let mem = card.getAttribute(DATA_CARD_MEM_VAL_ATR);
    const text = isFlipped ? mem : cardCharacters;
    setCardText(card, text);
}


function setCardText(card, value){
    const cardText = getCardTextPTag(card);
    cardText.innerText = value;
}

function updateCardImage(card, isFlipped)
{
    if (cardImageType === CHARACTER_IMAGE_TYPE_OPTION){
        hideImageOfCard(card);
        return;
    }
    hideImageOfCard(card, !isFlipped);
}


function updateCardInclusion(dataCardId, isFlipped){
    let index = selectedCards.indexOf(dataCardId);

    if (!isFlipped && selectedCards.length < MAX_COUNT_FLIPPED_CARDS && index < 0)
        selectedCards.push(dataCardId);
    //todo maybe make the below logic scalable instead of hardcoding for max 2 flipped cards
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