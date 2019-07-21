var p1 = new Player();
var borderThickness = 4;
var playerPosition = [];

function setup() {
  // put setup code here
  createCanvas(800, 500)
  angleMode(DEGREES)

  p1.setEnvironment(width, height, borderThickness)


}

function draw() {
  // put drawing code here

  background(0)

  // border
  fill(100, 200, 200)
  rect(0, 0, width, borderThickness) // top
  rect(0, height - borderThickness, width, borderThickness) // bottom
  rect(0, 0, borderThickness, height) // left
  rect(width - borderThickness, 0, borderThickness, height) // right



  var f = 0.4; // force

  if (keyIsDown(65)) { // a
    // console.log("a")
    p1.addForce(-f, 0)
  } else if (keyIsDown(83)) { // s
    // console.log("s")
    p1.addForce(0, f)
  } else if (keyIsDown(68)) { // d
    // console.log("d")
    p1.addForce(f, 0)
  } else if (keyIsDown(87)) { // w
    // console.log("w")
    p1.addForce(0, -f)
  } else if (keyIsDown(81)) { // q
    p1.turnBarrel(-2)
  } else if (keyIsDown(69)) { // e
    p1.turnBarrel(2)
  }

  p1.update()
  p1.draw()
  playerPosition[0] = p1.getPosition()
  // playerPosition[1] = p2.getPosition()
}





function keyTyped() {
  if (key === 'f') {
    console.log("f")
    var b = new Bullet(playerPosition[0])
  }
  return false;
}


function keyPressed() {
  if (keyCode === LEFT_ARROW) {

  }
}