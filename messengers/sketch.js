g_width = 0 
g_height = 0
g_borderThickness = 10 
g_bulletArray = []

var p1 = new Player();
var playerPosition = [];

function setup() {
  // put setup code here
  createCanvas(800, 500)
  angleMode(DEGREES)

  // p1.setEnvironment(width, height, borderThickness)
  g_width = width
  g_height = height

}

function draw() {
  // put drawing code here

  background(0)

  // border
  fill(100, 200, 200)
  rect(0, 0, g_width, g_borderThickness) // top
  rect(0, g_height - g_borderThickness, g_width, g_borderThickness) // bottom
  rect(0, 0, g_borderThickness, g_height) // left
  rect(g_width - g_borderThickness, 0, g_borderThickness, g_height) // right



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
    p1.turnBarrel(-2) // barrel turning speed
  } else if (keyIsDown(69)) { // e
    p1.turnBarrel(2)
  }

  p1.update()
  p1.draw()
  playerPosition[0] = p1.getPosition()
  // playerPosition[1] = p2.getPosition()

  for (let i = g_bulletArray.length - 1; i >= 0; i--) {
    let b = g_bulletArray[i]
    if (b.getIsDead()) {
      delete b
      g_bulletArray.splice(i, 1)
    } else {
      b.update()
      b.draw()
    }
  }

}





function keyTyped() {
  if (key === 'f') {

    let barrelVector = p1.getBarrel()
    let bulletPosX = playerPosition[0].x + barrelVector.x
    let bulletPosY = playerPosition[0].y + barrelVector.y 

    let b = new Bullet(bulletPosX, bulletPosY, barrelVector)
    b.shoot()
    g_bulletArray.push(b)

  }
  return false;
}


function keyPressed() {
  if (keyCode === LEFT_ARROW) {

  }
}