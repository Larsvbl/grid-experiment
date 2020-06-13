

screen.addEventListener("mousedown", function(){
  mouseDown++
})

screen.addEventListener("mouseup", function(){
  mouseDown--

  let x = Math.floor(mouseX/ppt)
  let y = Math.floor(mouseY/ppt)

  if(x < boardSize && y < boardSize){

    if (keyState["Control"]) {

      character.interact(x, y)
      multiSelector.deactivate()
      tileMenu.unClicked(x, y)

    }else if(keyState["Shift"]){

      tileMenu.unClicked(x, y)

      if(multiSelector.multiSelect){
        multiSelector.deactivate()
      }else{
        multiSelector.activate()
      }

    }else{

      if(tileMenu.visible){
        tileMenu.unClicked()
        multiSelector.deactivate()
      }else{
        tileMenu.clicked(x, y)
        multiSelector.multiSelect = false
      }
    }
  }
})

screen.addEventListener("keydown", (event)=>{
  keyState[event.key] = true
})

screen.addEventListener("keyup", (event)=>{
  keyState[event.key] = false
})

document.addEventListener("mousemove", updateMouse, false);

function updateMouse(e){
  mouseX = e.clientX + screen.scrollLeft
  mouseY = e.clientY + screen.scrollTop
}

function createTile(x, y){
  let tile = document.getElementById("blueTile")

  let tileClone = tile.cloneNode(true)
  tileClone.id = "tile"
  document.body.appendChild(tileClone)
  tileClone.style.display = "inline"

  tileClone.style.left = (x*ppt)+"px"
  tileClone.style.top = (y*ppt)+"px"

  var singleTile = new Tile(x, y, tileClone, types.BLUE)

  tiles[y][x] = singleTile
}

function generateTileField(){

  for(i = 0; i < boardSize; i++){
    for(j = 0; j < boardSize; j++){
      createTile(i, j)
    }
  }
}

function setupSelector(){
  let selector = document.getElementById("selector")
  let selectorClone = selector.cloneNode(true)
  selectorClone.id = "selectorClone"
  selectorClone.style.zIndex = "0"
  selectorClone.style.display = "none"
  document.body.appendChild(selectorClone)
  selectorTile = new Selector(selectorClone)
}

function setupMultiSelector(){
  let multiSelectorObject = document.getElementById("multiSelector")
  let msc = document.getElementById("multiSelectorChildren")

  let multiSelectorClone = multiSelectorObject.cloneNode(true)
  document.body.appendChild(multiSelectorClone)
  multiSelector = new MultiSelector(multiSelectorClone, msc)
}

function createCharacter(){

  character = new Character(0, 0, document.getElementById("player"))
  character.updatePosition(0, 0)

}

function createMenu(){

  var typeList = []

  for(var key in types){
      typeList.push(types[key])
  }

  let width = (ppt+10)*typeList.length+10
  tileMenu = new TileMenu(document.getElementById("menu"), width)

  tileMenu.object.style.width = width+"px"

  var counter = typeList.length

  typeList.forEach((type) => {
    let tile = document.getElementById(type+"Tile")
    let menuButton = tile.cloneNode(true)
    menuButton.id = type
    tileMenu.object.appendChild(menuButton)
    menuButton.style.left = (10+(typeList.length-counter)*(ppt+10))+"px"
    menuButton.style.top = 10+"px"
    menuButton.style.display = "inline"
    menuButton.addEventListener("mouseup", function(){
        tileMenu.executeSelection(menuButton.id)
    })
    counter-=1
  })
}

setupSelector()
generateTileField()
createCharacter()
createMenu()
setupMultiSelector()

function render(){

  let x = Math.floor(mouseX/ppt)
  let y = Math.floor(mouseY/ppt)

  character.updateSprite(x, y)

  if(tileMenu.visible == false){
    selectorTile.update(x, y)
  }

  if(keyState["w"] || keyState["a"] || keyState["s"] || keyState["d"]){
      character.move()
  }

  if(x < boardSize && y < boardSize){

    if(multiSelector.multiSelect){
      let tc = [x, y]
      if(arrayContainsArray(tc, multiSelector.selectedTiles) == false){
        multiSelector.selectedTiles.push(tc)
        multiSelector.createChild(x, y)
      }
    }
  }

  //Call to update active spells.
  spellUpdater()

  requestAnimationFrame(render);
}

requestAnimationFrame(render);
