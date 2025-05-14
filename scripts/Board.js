
const DEFAULT_CARD_CLASS_NAME = 'card'
const CARD_FLIP_SPEED = 2; // In degrees per step.
const CARD_FLIPPING_POINT = 85; // The amount of degrees before the character of an card has been changed.
const CARD_MAX_FLIP_DEGREES = 180;
const DEFAULT_TEXT_OF_CARD = '-';
const DATA_CARD_ID_ATR = 'data-card-id';
const DATA_CARD_FLIPPED_ATR = 'data-card-flipped';
const FLIPPED_ATR_FLIPPED = 'flipped';
const FLIPPED_ATR_NOT_FLIPPED = 'not_flipped';
const MAX_COUNT_FLIPPED_CARDS = 2;

let cards; // maybe move this down to onBodyLoad, if we eventually do not use this in the context of this script
function onBodyLoad(){
    cards = document.getElementsByClassName(DEFAULT_CARD_CLASS_NAME);

    for (const card of cards) {
        card.addEventListener("click", cardClick);
    }
}

let selectedCards = [];

function cardClick(event){
    const card = event.target;
    let degrees = 0;
    let flipCardAni = setInterval(
    () => {
        let isFlipped = isCardFlipped(card);
        let dataCardId = card.getAttribute(DATA_CARD_ID_ATR);
        if (!isFlipped && selectedCards.length >= 2 && !selectedCards.includes(dataCardId)) {
            clearInterval(flipCardAni);
            return;
        }

        if (degrees >= CARD_MAX_FLIP_DEGREES){
            clearInterval(flipCardAni);
            card.setAttribute(DATA_CARD_FLIPPED_ATR, isFlipped ? FLIPPED_ATR_NOT_FLIPPED : FLIPPED_ATR_FLIPPED);
        }
        else {
            if (degrees <= 0){
                updateCardInclusion(dataCardId, isFlipped);
            }

            degrees += CARD_FLIP_SPEED;
            let actualDegrees = degrees;
            if (degrees > CARD_FLIPPING_POINT)
            {
                // todo this 'LL' must be an character picket random later V
                card.innerText = isFlipped ? DEFAULT_TEXT_OF_CARD : "LL";
                changeCardColor(!isFlipped, card);
                actualDegrees = 180-degrees;
            }
            card.style.transform = `rotateY(${actualDegrees}deg)`;
        }
    });
}

function isCardFlipped(card) {
    const flipArt = card.getAttribute(DATA_CARD_FLIPPED_ATR);
    return !(flipArt === FLIPPED_ATR_NOT_FLIPPED || flipArt == null);
}

function changeCardColor(isFlipped, card)
{ card.style.backgroundColor = isFlipped ? "gray" : "#444"; }

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