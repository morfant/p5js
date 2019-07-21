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

    this.targetX = 0
    this.targetY = 0

    this.envBorderThickness = 4
    this.envWitdh = 100
    this.envHeight = 100

    this.hitT = false // hit with Top border
    this.hitB = false // Bottom border
    this.hitL = false // Left border
    this.hitR = false // Right border

    this.barrelAngle = 0

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

  turnBarrel(a) {
    console.log(a)
    this.barrelAngle += a
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


    push()
    translate(this.posX, this.posY)
    noStroke()
    fill(this.colorR, this.colorG, this.colorB)
    ellipse(0, 0, this.radius)

    stroke(this.colorR, this.colorG, this.colorB)
    rotate(this.barrelAngle)
    line(0, 0, 200, 0)
    pop()

    // push()
    // translate(this.posX, this.posY)
    // rect()
    // pop()

  }

  getPosition() {
    let pos = createVector(this.posX, this.posY)
    return pos
  }

}


