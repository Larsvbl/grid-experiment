var mouseDown = 0

let mouseX = 0
let mouseY = 0

var keyState = {}

let screen = document.getElementsByTagName("html")[0]

screen.addEventListener("mousedown", function(){
  mouseDown++
})

screen.addEventListener("mouseup", function(){
  mouseDown--
})

screen.addEventListener("keydown", (event)=>{
  keyState[event.key] = true
})

screen.addEventListener("keyup", (event)=>{
  keyState[event.key] = false
})

function makePointerLock(){

  const canvas = document.querySelector("#myCanvas");

  canvas.requestPointerLock = canvas.requestPointerLock ||
                              canvas.mozRequestPointerLock;

  document.exitPointerLock = document.exitPointerLock ||
                             document.mozExitPointerLock;

  canvas.onclick = function() {
    canvas.requestPointerLock();
  };

  // pointer lock event listeners

  // Hook pointer lock state change events for different browsers
  document.addEventListener('pointerlockchange', lockChangeAlert, false);
  document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

  function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
      console.log('The pointer lock status is now locked');
      document.addEventListener("mousemove", updateMouse, false);
    } else {
      console.log('The pointer lock status is now unlocked');
      document.removeEventListener("mousemove", updateMouse, false);
    }
  }

}

makePointerLock()

function updateMouse(e){
  mouseX += e.movementX
  mouseY += e.movementY
}

var world = new Node(0, 0)
world.update = function(){
  this.updateChildren()
}

let cursor = document.getElementById("cursor")

function createPlayer(world){
  let player = document.getElementById("player")

  var playerObject = new Node(0,0)
  playerObject.xVel = 0
  playerObject.yVel = 0
  playerObject.speed = 1.0
  playerObject.maxSpeed = 5
  playerObject.object = player
  playerObject.direction = new Vector(0, 0)
  playerObject.updateMovement = function(){
    var yv = this.yVel
    var xv = this.xVel
    let s = this.speed
    let ms = this.maxSpeed

    if(keyState["w"] || keyState["a"] || keyState["s"] || keyState["d"]){
      this.direction.x = 0
      this.direction.y = 0
    }

    if (keyState["w"]){
      yv-=s
      if(yv < -ms){
        yv = -ms
      }
      this.direction.y +=1
    }
    if (keyState["s"]) {
      yv+=s
      if(yv > ms){
        yv = ms
      }
      this.direction.y -=1
    }
    if (keyState["a"]) {
      xv-=s
      if(xv < -ms){
        xv = -ms
      }
      this.direction.x -=1
    }
    if (keyState["d"]) {
      xv+=s
      if(xv > ms){
        xv = ms
      }
      this.direction.x +=1
    }

    this.xPos += xv
    this.yPos += yv

    if(yv < 0){
      yv++
    }else if (yv > 0) {
      yv--
    }

    if(xv < 0){
      xv++
    }else if (xv > 0) {
      xv--
    }

    this.xVel = xv
    this.yVel = yv
  }
  playerObject.updateSprite = function(){
    let x = this.direction.x
    let y = this.direction.y

    if(x == 0 && y == 0){
      this.object.src = "mageSprites/mage-front.png"
      return
    }
    if(x == 0 && y == 1){
      this.object.src = "mageSprites/mage-back.png"
      return
    }
    if(x == 0 && y == -1){
      this.object.src = "mageSprites/mage-front.png"
      return
    }
    if(x == 1 && y == 0){
      this.object.src = "mageSprites/mage-right.png"
      return
    }
    if(x == 1 && y == 1){
      this.object.src = "mageSprites/mage-back-right.png"
      return
    }
    if(x == -1 && y == 1){
      this.object.src = "mageSprites/mage-back-left.png"
      return
    }
    if(x == -1 && y == 0){
      this.object.src = "mageSprites/mage-left.png"
      return
    }
    if(x == -1 && y == -1){
      this.object.src = "mageSprites/mage-front-left.png"
      return
    }
    if(x == 1 && y == -1){
      this.object.src = "mageSprites/mage-front-right.png"
      return
    }
  }

  playerObject.update = function(){
    this.updateCoordinates()
    this.updateMovement()
    this.updateSprite()
    this.updateObject()
    this.updateChildren()
  }

  playerObject.setParent(world)
  createConduit(playerObject)
}

function createConduit(node){
  let conduit = document.getElementById("conduit")

  var conduitObject = new Node(0, 0)
  conduitObject.object = conduit
  conduitObject.counter = 0
  conduitObject.updateCounter = function(){
    this.counter +=1
    if(this.counter == 359){
      this.counter = 0
    }
  }
  conduitObject.updateMovement = function(){
    this.xPos = 60*Math.cos(Math.PI * this.counter / 180)
    this.yPos = 60*Math.sin(Math.PI * this.counter / 180)
  }
  conduitObject.update = function(){
    this.updateCoordinates()
    this.updateCounter()
    this.updateMovement()
    this.updateObject()
    this.updateChildren()
  }

  conduitObject.setParent(node)

}

createPlayer(world)


function render(){

  world.update()
  //console.log(playerObject.direction)

  cursor.style.top = mouseY+"px"
  cursor.style.left = mouseX+"px"

  requestAnimationFrame(render);


}

requestAnimationFrame(render);
