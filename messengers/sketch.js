class Player {

  constructor() {
    this.radius = 40
    this.posX = 200
    this.posY = 300
    this.velX = 0
    this.velY = 0
    this.accX = 0
    this.accY = 0
    this.mass = 1
    this.friction = 0.1
    this.colorR = 255
    this.colorG = 204
    this.colorB = 0

    this.envBorderThickness = 4
    this.envWitdh = 100
    this.envHeight = 100

    this.hitT = false // hit with Top border
    this.hitB = false // Bottom border
    this.hitL = false // Left border
    this.hitR = false // Right border

    this.contactBorder = false 
  }


  setEnvironment (w, h, b) {
    this.envWitdh = w 
    this.envHeight = h 
    this.envBorderThickness = b
  }


  addForce(fx, fy) {

    this.accX = fx/this.mass
    this.accY = fy/this.mass

    this.velX = this.velX + this.accX
    this.velY = this.velY + this.accY

    // console.log("accx: " + this.accX);

  }


  update() {


    // friction
    if (this.velX > 0) {
      this.velX = this.velX - this.friction * this.mass
    } 

    if (this.velX < 0) {
      this.velX = this.velX + this.friction * this.mass
    } 

    if (this.velY > 0) {
      this.velY = this.velY - this.friction * this.mass
    } 

    if (this.velY < 0) {
      this.velY = this.velY + this.friction * this.mass
    }

    // collide with border
    this.hitT = collideRectCircle(0, 0, this.envWitdh, this.envBorderThickness, this.posX, this.posY, this.radius)
    this.hitB = collideRectCircle(0, this.envHeight - this.envBorderThickness, this.envWitdh, this.borderThickness, this.posX, this.posY, this.radius) 
    this.hitL = collideRectCircle(0, 0, this.envBorderThickness, this.envHeight, this.posX, this.posY, this.radius)
    this.hitR = collideRectCircle(this.envWitdh - this.envBorderThickness, 0, this.envBorderThickness, this.envHeight, this.posX, this.posY, this.radius)
    // console.log("hitT: " + this.hitT + " hitB: " + this.hitB + " hitL: " + this.hitL + " hitR: " + this.hitR )

    // bound player
    if (this.hitT || this.hitB) {
      this.velY = this.velY * -1
    }

    if (this.hitL || this.hitR) {
      this.velX = this.velX * -1 
    }


    // move player
    this.posX = this.posX + this.velX
    this.posY = this.posY + this.velY


  }

  draw() {


    noStroke()
    fill(this.colorR, this.colorG, this.colorB)
    ellipse(this.posX, this.posY, this.radius)

  }

}




var p1 = new Player();
var borderThickness = 4;

function setup() {
  // put setup code here
  createCanvas(800, 500)

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



  var f = 0.4;

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

  }

  p1.update()
  p1.draw()
}


function keyTyped() {
  // if (key === 'w') {
  //   p1.addForce(0, -f)
  // } else if (key === 'a') {
  //   p1.addForce(-f, 0)
  // } else if (key === 's') {
  //   p1.addForce(0, f)
  // } else if (key === 'd') {
  //   p1.addForce(f, 0)
  // }

  return false;
}


function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    p1.addForce(-1, 0)
  } else if (keyCode === RIGHT_ARROW) {
    p1.addForce(1, 0)
  } else if (keyCode === UP_ARROW) {
    p1.addForce(0, 1)
  } else if (keyCode === DOWN_ARROW) {
    p1.addForce(0, -1)
  }

}