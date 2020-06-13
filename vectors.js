function Vector(x, y){
  this.x = x || 0
  this.y = y || 0
}

Vector.prototype = {

  divide: function(v){
    return new Vector(this.x /v, this.y/v)
  },

  dot: function(v) {
    return this.x * v.x + this.y * v.y
  },

  length: function(){
    return Math.sqrt(this.dot(this))
  },

  toAngles: function() {
    return {
      theta: Math.atan2(this.z, this.x),
      phi: Math.asin(this.y / this.length())
    };
  },

  init: function(x, y, z) {
    this.x = x; this.y = y; this.z = z;
    return this;
  }

}
