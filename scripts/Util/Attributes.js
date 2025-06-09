export const BOOLEAN_ATR_TRUE = 'true';
export const BOOLEAN_ATR_FALSE = 'false';
export const CLASS_ATR = 'class';
export const SRC_ATR = 'src';
export const NONE_ATR = 'none';
export const BLOCK_ATR = 'block';

export const CLICK_EV = 'click';
export const INPUT_EV = 'input';

export function isAttributeTrue(atr){
    return !(atr === BOOLEAN_ATR_FALSE || atr == null);
}