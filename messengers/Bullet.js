class Bullet {
  
  constructor(posX, posY, targetForce) {
    this.radius = 30 
    this.posX = posX 
    this.posY = posY 
    this.velX = 1
    this.velY = 1
    this.mass = 0.1

    this.colorR = 200
    this.colorG = 200
    this.colorB = 10

    this.type = '-' // -, +
    this.isDead = false
    this.hitPlaher = false

    this.targetForce = targetForce
  }

  // setEnvironment (w, h, b) {
  //   this.envWitdh = w 
  //   this.envHeight = h 
  //   this.envBorderThickness = b
  // }


  shoot() { // f: shooting force

    // console.log("shoot " + targetForce);
    
    // this.accX = targetForce.x/this.mass
    // this.accY = targetForce.y/this.mass

    this.accX = this.targetForce.x/10
    this.accY = this.targetForce.y/10

    this.velX = this.velX + this.accX
    this.velY = this.velY + this.accY

    // console.log(this.velX + " / " + this.velY);
    

  }

  update() {

    // collide with border
    // this.hitT = collideRectCircle(0, 0, this.envWitdh, this.envBorderThickness, this.posX, this.posY, this.radius)
    // this.hitB = collideRectCircle(0, this.envHeight - this.envBorderThickness, this.envWitdh, this.borderThickness, this.posX, this.posY, this.radius) 
    // this.hitL = collideRectCircle(0, 0, this.envBorderThickness, this.envHeight, this.posX, this.posY, this.radius)
    // this.hitR = collideRectCircle(this.envWitdh - this.envBorderThickness, 0, this.envBorderThickness, this.envHeight, this.posX, this.posY, this.radius)

    // console.log("hitT: " + this.hitT + " hitB: " + this.hitB + " hitL: " + this.hitL + " hitR: " + this.hitR )

    if (this.posX > g_width  || this.posX < 0 || this.posY > g_height || this.posY < 0) {
      this.isDead = true
    }

    // move player
    this.posX = this.posX + this.velX
    this.posY = this.posY + this.velY

    // console.log("x: " + this.posX + " / y: " + this.posY)


  }

  draw() {

    noStroke()
    fill(this.colorR, this.colorG, this.colorB)
    ellipse(this.posX, this.posY, this.radius)

  }

  getIsDead() {
    return this.isDead
  }

}

