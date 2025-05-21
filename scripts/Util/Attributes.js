export const BOOLEAN_ATR_TRUE = 'true';
export const BOOLEAN_ATR_FALSE = 'false';

export function isAttributeTrue(atr){
    return !(atr === BOOLEAN_ATR_FALSE || atr == null);
}