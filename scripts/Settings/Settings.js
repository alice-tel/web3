import {setupColorSettings} from "./ColorSettings.js";
import {setupBoardSizeSelector} from "./CardSizeSetting.js";
import {setupCharactersOnCardsSetting} from "./CardCharactersSetting.js";
import {setupCardImageTypeSetting} from "./ImageSettings.js";
import {OPTION_TAG} from "../Util/Tags.js";

export function setupSettings(){
    setupColorSettings();

    setupBoardSizeSelector();
    setupCharactersOnCardsSetting();

    setupCardImageTypeSetting();
}

export function createAddOptions(options, inputElement, defaultOption){
    for (const option of options) {
        let optionEl = document.createElement(OPTION_TAG);
        optionEl.textContent = option[0];
        optionEl.value = option[1];
        if (defaultOption === option[1]) {
            optionEl.selected = true;
        }
        inputElement.appendChild(optionEl);
    }
}