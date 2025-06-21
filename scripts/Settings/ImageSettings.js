import {INPUT_EV} from "../Util/Attributes.js";
import {resetBoard} from "../script.js";
import {createAddOptions} from "./Settings.js";
import {fetchImages as emptyFetchImages} from "../Api/Image/EmptyImageApi.js";
import {fetchImages as dogFetchImages} from "../Api/Image/DogImageApi.js";
import {fetchImages as catFetchImages} from "../Api/Image/CatImageApi.js";

export const FETCH_FUNC_INDEX = 2;
export const CHARACTER_IMAGE_TYPE_OPTION = 0;
export const DEFAULT_IMAGE_TYPE_OPTION = 1;

export const CARD_IMAGE_TYPE_OPTIONS = [
    ["Characters", 0, emptyFetchImages],
    ["Dog Images", 1, dogFetchImages],
    ["Cat Images", 2, catFetchImages],
]

// export let cardImageType = DEFAULT_IMAGE_TYPE_OPTION;
const cardImageInput = document.getElementById('image_of_board_input');

export function getCardImageType(){
    return cardImageInput.selectedIndex;
}
export function getCardImageTypeOption(){
    return CARD_IMAGE_TYPE_OPTIONS[cardImageInput.selectedIndex];
}

export function setCardImageType(imageType){
    cardImageInput.selectedIndex = imageType;
    resetBoard();
}

export function setupCardImageTypeSetting()
{
    addCardImageTypeInputOptions();
    addCardImageTypeListener();
}

function addCardImageTypeListener()
{
    cardImageInput.addEventListener(INPUT_EV, event => {
        setCardImageType(Number(event.target.value));
    });
}

function addCardImageTypeInputOptions(){
    createAddOptions(CARD_IMAGE_TYPE_OPTIONS, cardImageInput, DEFAULT_IMAGE_TYPE_OPTION);
}