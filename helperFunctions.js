// Below code from stackoverflow
// Function that creates the 2d array that houses the tiles.
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

// Compare two arrays of equal length with.
// From stackoverflow: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
function compareArrays(a, b){
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

// Checks to see if array b contains an isntance of array a.
function arrayContainsArray(a, b){
  for (var i = 0; i < b.length; ++i) {
    if (compareArrays(a, b[i])) return true
  }
  return false
}

// Converts string to enum.
// Currently not used because.
function convertToEnum(type){
  switch(type){
    case "blue":
      return types.BLUE
      break
    case "yellow":
      return types.YELLOW
      break
    case "red":
      return types.RED
      break
    case "purple":
      return types.PURPLE
      break
    }
}

function getCurrentTime(){
  return Date.now()
}

// The function below was written by Maxwell Collard.
// Standard Normal variate using Box-Muller transform.
// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}
