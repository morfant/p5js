class Bullet {
  
  constructor(posX, posY) {
    this.radius = 5
    this.posX = posX 
    this.posY = posY 
    this.velX = 1
    this.velY = 1
    this.mass = 0.1

    this.colorR = 100
    this.colorG = 100
    this.colorB = 10

    this.type = '-' // -, +
    this.isDead = false
    this.hitPlaher = false
  }

  // setEnvironment (w, h, b) {
  //   this.envWitdh = w 
  //   this.envHeight = h 
  //   this.envBorderThickness = b
  // }


  shoot(targetForce) { // f: shooting force

    this.accX = targetForce.x/this.mass
    this.accY = targetForce.y/this.mass

    this.velX = this.velX + this.accX
    this.velY = this.velY + this.accY

  }

  update() {

    // collide with border
    // this.hitT = collideRectCircle(0, 0, this.envWitdh, this.envBorderThickness, this.posX, this.posY, this.radius)
    // this.hitB = collideRectCircle(0, this.envHeight - this.envBorderThickness, this.envWitdh, this.borderThickness, this.posX, this.posY, this.radius) 
    // this.hitL = collideRectCircle(0, 0, this.envBorderThickness, this.envHeight, this.posX, this.posY, this.radius)
    // this.hitR = collideRectCircle(this.envWitdh - this.envBorderThickness, 0, this.envBorderThickness, this.envHeight, this.posX, this.posY, this.radius)

    // console.log("hitT: " + this.hitT + " hitB: " + this.hitB + " hitL: " + this.hitL + " hitR: " + this.hitR )


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

