
// Object that is used for the player controlled character.
function Character(x, y, object){
  this.xPos = x || 0
  this.yPos = y || 0
  this.object = object
  this.lastMoveTime = 0
  this.moveDelay = 100

  this.update = function(){}

  // Function used to let the player interact with a tile.
  this.interact = function(x, y){

    let type = tiles[y][x].type

    switch(type) {
      case types.BLUE:
        break

      case types.YELLOW:
        if(tiles[this.yPos][this.xPos].type == types.YELLOW){
          this.updatePosition(x, y)
        }
        break

      case types.RED:
        break

      case types.PURPLE:
        for(i = 0; i < listOfSpells.length; i++){
          if(verifier(listOfSpells[i], x, y)){
            listOfSpells[i].execution(x, y)
            break
          }
        }
    }
  }

  // Change the characters position to that defined by the parameters.
  this.updatePosition  = function(x, y){

    if(x < 0){x = 0}
    if(x > boardSize-1){x = boardSize-1}
    if(y < 0){y = 0}
    if(y > boardSize-1){y = boardSize-1}

    if(tiles[y][x].type == types.RED){
      return
    }

    this.xPos = x
    this.yPos = y
    this.object.style.left = (x*ppt)+"px"
    this.object.style.top = (y*ppt)+"px"
  }

  // Read keyboad inputs and move the character in the desired direction.
  this.move = function(){

    let now = Date.now()

    if(now > this.moveDelay+this.lastMoveTime){

      this.lastMoveTime = now

      var vector = [0, 0]

      if (keyState["w"]) {
        vector[0]-=1
      }
      if (keyState["a"]) {
        vector[1]-=1
      }
      if (keyState["s"]) {
        vector[0]+=1
      }
      if (keyState["d"]) {
        vector[1]+=1
      }

      this.updatePosition(this.xPos+vector[1], this.yPos+vector[0])

    }
  }

  // Change the sptite based on the position of the cursor.
  this.updateSprite = function(x, y){

    let deltaX = x-this.xPos
    let deltaY = y-this.yPos
    let angle = Math.atan2(deltaY, deltaX)

    if(angle < -(7/8)*pi || angle > (7/8)*pi){
      this.changeSpriteSource("left")
    }else if(angle < (7/8)*pi && angle > (5/8)*pi){
      this.changeSpriteSource("front-left")
    }else if(angle < (5/8)*pi && angle > (3/8)*pi){
      this.changeSpriteSource("front")
    }else if(angle < (3/8)*pi && angle > (1/8)*pi){
      this.changeSpriteSource("front-right")
    }else if(angle < (1/8)*pi && angle > -(1/8)*pi){
      this.changeSpriteSource("right")
    }else if(angle < -(1/8)*pi && angle > -(3/8)*pi){
      this.changeSpriteSource("back-right")
    }else if(angle < -(3/8)*pi && angle > -(5/8)*pi){
      this.changeSpriteSource("back")
    }else if(angle < -(5/8)*pi && angle > -(7/8)*pi){
      this.changeSpriteSource("back-left")
    }
  }

  this.changeSpriteSource = function(direction){
    this.object.src = "mageSprites/mage-"+direction+".png"
  }

}

// Object used to define a point in a 2d place. Currently unused.
function Point(x, y){
  this.x = x
  this.y = y

  // A function that takes another point and x y coords, and returns a bool
  // indicating whether the x y coords are contained in the rectangle defined
  // by the two points.
  this.contains = function(otherPoint, x, y){
    if(this.x < x && x < otherPoint.x && otherPoint.y < y && y < this.y){
      return true
    }
    return false
  }

}

// Object that defines a tile.
function Tile(x, y, object, type){
  this.x = x
  this.y = y
  this.leftPoint = new Point(x*ppt, (y+1)*ppt)
  this.rightPoint = new Point((x+1)*ppt, y*ppt)
  this.object = object
  this.type = type

  // Function that indicates if the tile
  this.contains = function(x, y){
    return this.leftPoint.contains(this.rightPoint, x, y)
  }

  // Currently unused function activated when a tile is clicked.
  // At the moment all interactions are handled by the chraacter object.
  this.clicked = function(){
  }

  // Changes the type of a tile.
  this.setType = function(type){
    if(this.type == type){return}
    this.type = type
    this.object.src = "tiles/"+type+"Tile.png"
  }
}

// Selector object (green sqare).
function Selector(object){
  this.x = 0
  this.y = 0
  this.object = object

  // Updates the selector's position based on the location of the cursor.
  // If the cursor is not within the bounds of the board, the selector is made
  // invisibleml.
  this.update = function(x, y){

    if(x < boardSize && y < boardSize){

      this.object.style.display = "inline"
      this.x = x
      this.y = y
      this.object.style.top = this.y*ppt+"px"
      this.object.style.left = this.x*ppt+"px"

    }else{

      this.object.style.display = "none"

    }
  }
}

// Multiselection object (orange square)
function MultiSelector(object, msc){
  this.object = object
  this.selectedTiles = []
  this.multiSelect = false
  this.multiSelectorChildren = msc

  this.activate = function(){
    this.multiSelect = true
  }

  this.deactivate = function(){
    this.selectedTiles = []
    this.multiSelect = false
    while (this.multiSelectorChildren.lastElementChild) {
      this.multiSelectorChildren.removeChild(this.multiSelectorChildren.lastElementChild);
    }
  }

  this.createChild = function(x, y){
    let msClone = this.object.cloneNode(true)
    msClone.style.top = y*ppt+"px"
    msClone.style.left = x*ppt+"px"
    msClone.style.opacity = "1.0"
    msClone.style.zIndex = "1"
    msClone.style.display = "inline"
    this.multiSelectorChildren.appendChild(msClone)
  }
}

// Menu object used to select a tile.
function TileMenu(object, width, selected){
  this.x = 0
  this.y = 0
  this.object = object
  this.width = width
  this.height = object.style.height
  this.visible = false

  // This function creates a tile menu at the selected location.
  // When a click is made to open a menu, we must ensure the menu stays within
  // the bounds of the baord.
  this.clicked = function(x, y){
    selectorTile.update(x, y)
    this.visible = true
    this.object.style.display = "inline"
    this.x = x
    this.y = y

    let top = ppt*(y-1.5)
    let left = ppt*(x+1)

    if(top-this.height < 0){
      this.object.style.top = ppt*(y+1.0)+"px"
    }else{
      this.object.style.top = top+"px"
    }

    if(left+this.width > ppt*boardSize){
      this.object.style.left = left-this.width-ppt+"px"
    }else{
      this.object.style.left = left+"px"
    }
  }

  // Hides the menu.
  this.unClicked = function(){
    this.visible = false
    this.object.style.display = "none"
  }

  // Changes the board based on the selection made by the player.
  this.executeSelection = function(selectedType){

    if(multiSelector.selectedTiles.length == 0){
      tiles[selectorTile.y][selectorTile.x].setType(selectedType)
    }else{
      multiSelector.selectedTiles.forEach((tuple) => {
        tiles[tuple[1]][tuple[0]].setType(selectedType)
      })
      multiSelector.deactivate()
    }
  }
}

function MagicConduit(object, x, y){
  this.object = object
  this.x = x
  this.y = y

  this.update = function(){



  }


}
