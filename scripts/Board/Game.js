


// Randomizer,
//  1. create a list of possible characters (maybe later something like cat pictures haha).
//  2. randomize at the beginning of the game (for now when page is reloaded).

// Found check
//  1. call event when card is being flipped.
//  2. check if there are now 2 cards flipped (this is possible by checking the length of 'selectedCards' in Cards (maybe create a function for this in Cards))
//  3. check if their characters are the same.
//  4. if characters are the same set found attribute (Cards.DATA_CARD_FOUND_ATR) of both cards to true attribute (Attributes.BOOLEAN_ATR_TRUE)
//  5. update both characters and the background (boardFoundColor), this sould be done in Cards module.

// Won check
//  1. check if all the cards are found
//  2. if true then go to won state
//  3. if false then resume game (do nothing)