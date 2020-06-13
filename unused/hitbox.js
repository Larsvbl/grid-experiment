function Hitbox(x, y, width, height){
  this.topLeft = [x, y+height]
  this.bottomRight = [x+width, y]

  this.pointIntersectionTest = function(x, y){
    if(x <= this.bottomRight[0] && x >= this.topLeft[0]){
      if(y <= this.topLeft[1] && y >= this.topLeft[1]){
        return true
      }
      return false
    }
    return false
  }

  this.hitboxIntersectionCheck = function(other){
    if(this.topLeft[0] > other.bottomRight[0] || other.topLeft[0] > this.bottomRight[0]){
      return false
    }

    if(this.topLeft[1] < other.bottomRight[1] || other.topLeft[1] < this.bottomRight[1]){
      return false
    }
  }

}
