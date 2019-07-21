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

    this.hitT = false // hit with Top border
    this.hitB = false // Bottom border
    this.hitL = false // Left border
    this.hitR = false // Right border

    this.barrelAngle = 0
    this.barrelLength = 100

  }

  addForce(fx, fy) {

    this.accX = fx/this.mass
    this.accY = fy/this.mass

    this.velX = this.velX + this.accX
    this.velY = this.velY + this.accY

    // console.log("accx: " + this.accX);

  }

  turnBarrel(a) {
    this.barrelAngle += a
    this.barrelAngle %= 360

    if (this.barrelAngle < 0) {
      this.barrelAngle = 360 + this.barrelAngle
    }

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
    this.hitT = collideRectCircle(0, 0, g_width, g_borderThickness, this.posX, this.posY, this.radius)
    this.hitB = collideRectCircle(0, g_height - g_borderThickness, g_width, g_borderThickness, this.posX, this.posY, this.radius) 
    this.hitL = collideRectCircle(0, 0, g_borderThickness, g_height, this.posX, this.posY, this.radius)
    this.hitR = collideRectCircle(g_width - g_borderThickness, 0, g_borderThickness, g_height, this.posX, this.posY, this.radius)
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
    line(0, 0, this.barrelLength, 0)
    pop()

  }

  getPosition() {
    let pos = createVector(this.posX, this.posY)
    return pos
  }

  getBarrelAngle() {
    return this.barrelAngle
  }

  getBarrelLength() {
    return this.barrelLength
  }

  getBarrel() {
    let vx = cos(360 - this.barrelAngle) * this.barrelLength 
    let vy = sin(360 - this.barrelAngle) * this.barrelLength 

    // console.log("vx: " + vx)
    // console.log("vy: " + vy)
    let v = createVector(round(vx), round(-vy))
    return v
  }

}


