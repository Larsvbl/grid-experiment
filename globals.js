var mouseDown = 0
// Used to indicate if the mouse is in a pressed state.

let mouseX = 0
let mouseY = 0
// Used to remember the cursor position.

var keyState = {}
// Saves the currently pressed keys.

var tiles = createArray(boardSize, boardSize)
// Creates and saves the 2d array of tiles.

var character = null
// The character object.

var tileMenu = null
// The tileMenu object.

var selectorTile = null
// The Selector (green square) object.

var multiSelector = null
// The object used as parent for the multi selection indicators.

let screen = document.getElementsByTagName("html")[0]
// The screen object.

var lastSpellUpdate = 0
// Integer that keeps track of the last time persistent spells were updated.
