let clearBoardSpell = {
  rune: [
    [0, 1, types.RED],
    [1, 0, types.RED],
    [-1, 0, types.RED],
    [-1, -1, types.RED],
    [1, -1, types.RED],
    [0, -2, types.RED]
  ],
  execution: function(x, y){
    let type = tiles[y-1][x].type
    for(y = 0; y < boardSize; y++){
      for(x = 0; x < boardSize; x++){
        tiles[y][x].setType(type)
      }
    }
  }
}

let starSpell = {
  rune: [
    [0, 1, types.YELLOW],
    [0, -1, types.YELLOW],
    [1, 0, types.YELLOW],
    [-1, 0, types.YELLOW]
  ],
  execution: function(x, y){
    let rune = [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2],
      [3, 0],
      [-3, 0],
      [0, 3],
      [0, -3]]

    rune.forEach((tuple) => {
      tiles[y+tuple[0]][x+tuple[1]].setType(types.YELLOW)
    })
  }
}

let pathSpell = {
  rune: [
    [0, 1, types.YELLOW],
    [1, 0, types.YELLOW],
    [-1, 0, types.YELLOW],
    [-1, -1, types.YELLOW],
    [1, -1, types.YELLOW],
    [0, -2, types.YELLOW]
  ],
  execution: function(x, y){
    let type = tiles[y-1][x].type

    let task = function(){
      if(tiles[character.yPos][character.xPos].type != type){
        tiles[character.yPos][character.xPos].setType(type)
      }
    }

    let spellInstance = new TimedSpell(task, 5)

    listOfActiveSpells.push(spellInstance)
  }
}

let spreadSpell = {
  rune: [
    [0, 1, types.GRAY],
    [1, 0, types.GRAY],
    [-1, 0, types.GRAY],
    [-1, -1, types.GRAY],
    [1, -1, types.GRAY],
    [0, -2, types.GRAY]
  ],
  execution: function(x, y){
    let type = tiles[y-1][x].type

    let task = function(){
      let yOffset = Math.round(randn_bm()*3)
      let xOffset = Math.round(randn_bm()*3)

      let yPos = y+yOffset
      let xPos = x+xOffset

      if(xPos < 0){xPos = 0}
      if(xPos > boardSize-1){xPos = boardSize-1}
      if(yPos < 0){yPos = 0}
      if(yPos > boardSize-1){yPos = boardSize-1}

      tiles[yPos][xPos].setType(type)
    }

    let spellInstance = new TimedSpell(task, 5)

    listOfActiveSpells.push(spellInstance)
  }
}

let hasteSpell = {
  rune: [
    [0, 1, types.TURQOUISE],
    [1, 0, types.TURQOUISE],
    [-1, 0, types.TURQOUISE],
    [0, -1, types.TURQOUISE],
    [0, -2, types.TURQOUISE],
    [0, 2, types.TURQOUISE],
    [-1, 3, types.TURQOUISE],
    [1, -3, types.TURQOUISE]
  ],
  execution: function(x, y){

    let task = function(){
      character.moveDelay = Math.round(characterMoveDelay/3)
    }

    let condition = function(x, y){
      return verifier(hasteSpell, x, y)
    }

    let finish = function(){
      character.moveDelay = characterMoveDelay
    }

    let spellInstance = new PersistentSpell(x, y, condition, task, finish)

    listOfActiveSpells.push(spellInstance)
  }
}



// List of all available spells.
let listOfSpells = [clearBoardSpell, starSpell, pathSpell, spreadSpell, hasteSpell]

// List of spells currently active.
var listOfActiveSpells = []

// Checks which spell to execute.
function verifier(spell, x, y){
  for(j = 0; j < spell.rune.length; j++){
    let current = spell.rune[j]
    if(tiles[current[1]+y][current[0]+x].type != current[2]){
      return false
    }
  }
  return true
}

// Object framework for creating timed spells.
// THe task is executed every spell tick until the time runs out.
// Duration input must be in seconds.
function TimedSpell(task, duration){
  this.task = task
  this.endTime = getCurrentTime()+duration*1000

  this.update = function(index){
    if(getCurrentTime() < this.endTime){
      this.task()
    }else{
      listOfActiveSpells.splice(index, 1)
    }
  }
}

// object framework for creating persistent spells.
// Persistent spells stay active until a certain condition is or is not met.
function PersistentSpell(x, y, condition, task, finish){
  this.xPos = x
  this.yPos = y
  this.condition = condition
  this.task = task
  this.finish = finish

  this.update = function(index){
    if(this.condition(x, y)){
      this.task()
    }else{
      this.finish()
      listOfActiveSpells.splice(index, 1)
    }
  }
}

// function that updates the active spells every sixteenth of a second.
function spellUpdater(){

  // nop: Number of spells (in the active spells array)
  let nop = listOfActiveSpells.length

  if(nop > 0){
    if(getCurrentTime() > lastSpellUpdate){
      lastSpellUpdate = getCurrentTime()+50

      for(var i = nop-1; i > -1; i--){
        listOfActiveSpells[i].update(i)
      }
    }
  }
}
