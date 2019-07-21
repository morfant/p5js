g_width = 0 
g_height = 0
g_borderThickness = 4 
g_playerArray = []
g_bulletArray = []

let playerPosition = []
let p1 = new Player(300, 200, 1)
g_playerArray.push(p1)
let p2 = new Player(600, 200, 2)
g_playerArray.push(p2)

function setup() {
  // put setup code here
  createCanvas(800, 500)
  angleMode(DEGREES)

  // p1.setEnvironment(width, height, borderThickness)
  g_width = width
  g_height = height

  p1.setColor(255, 204, 0)
  p2.setColor(100, 174, 100)

}

function draw() {
  // put drawing code here

  background(0)

  // border
  fill(100, 200, 200)
  rect(0, 0, g_width, g_borderThickness) // top
  rect(0, g_height - 1 - g_borderThickness, g_width, g_borderThickness) // bottom
  rect(0, 0, g_borderThickness, g_height) // left
  rect(g_width - 1 - g_borderThickness, 0, g_borderThickness, g_height) // right



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


  if (keyIsDown(74)) { // j
    // console.log("a")
    p2.addForce(-f, 0)
  } else if (keyIsDown(75)) { // k
    // console.log("s")
    p2.addForce(0, f)
  } else if (keyIsDown(76)) { // l
    // console.log("d")
    p2.addForce(f, 0)
  } else if (keyIsDown(73)) { // i 
    // console.log("w")
    p2.addForce(0, -f)
  } else if (keyIsDown(85)) { // u
    p2.turnBarrel(-2) // barrel turning speed
  } else if (keyIsDown(79)) { // o
    p2.turnBarrel(2)
  }



  p1.update()
  p1.draw()
  p2.update()
  p2.draw()
  playerPosition[0] = p1.getPosition()
  playerPosition[1] = p2.getPosition()

  for (let i = g_bulletArray.length - 1; i >= 0; i--) {
    let b = g_bulletArray[i]
    if (b.getIsDead()) {
      delete b
      g_bulletArray.splice(i, 1)
    } else {
      b.update()
      b.collide()
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

  if (key === 'h') {
    let barrelVector = p2.getBarrel()
    let bulletPosX = playerPosition[1].x + barrelVector.x
    let bulletPosY = playerPosition[1].y + barrelVector.y 

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