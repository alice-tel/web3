import {CARD_IMAGE_TYPE_OPTIONS, FETCH_FUNC_INDEX} from "../../Settings/ImageSettings.js";


export function fetchImages(imageType, count) {
    return getFetchImages(imageType)(count);
}


function getFetchImages(imageType){
    return CARD_IMAGE_TYPE_OPTIONS[imageType][FETCH_FUNC_INDEX];
}
