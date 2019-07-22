class Player {

  constructor(posX, posY, id) {
    this.id = id
    this.radius = 40
    this.posX = posX
    this.posY = posY
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

    this.isDead = false

    this.msgPatten = "-+--+"
    this.patternIndex = 0

  }


  setMsgPattern(str) {
    this.msgPatten = str
  }

  setColor(r, g, b) {
    this.colorR = r
    this.colorG = g
    this.colorB = b

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

    if (this.radius < g_playerLifeLimit) {
      this.isDead = true
      return
    }


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

    // prevent drift
    if (abs(this.velX) < this.friction) this.velX = 0
    if (abs(this.velY) < this.friction) this.velY = 0


    // velocity limit
    if (abs(this.velX) > g_velocityLimit) {
      if (this.velX > 0) this.velX = g_velocityLimit
      else this.velX = -g_velocityLimit
    }
    if (abs(this.velY) > g_velocityLimit) {
      if (this.velY > 0) this.velY = g_velocityLimit 
      else this.velY = -g_velocityLimit 
    } 
    
    // debug
    if (this.posX > g_width || this.posX < 0) console.log("need velX limit: " + this.velX)
    if (this.posY > g_height|| this.posY < 0) console.log("need velY limit: " + this.velY)
    


    // collide with border
    this.hitT = collideRectCircle(0, 0, g_width, g_borderThickness, this.posX, this.posY, this.radius)
    this.hitB = collideRectCircle(0, g_height - g_borderThickness, g_width, g_borderThickness, this.posX, this.posY, this.radius) 
    this.hitL = collideRectCircle(0, 0, g_borderThickness, g_height, this.posX, this.posY, this.radius)
    this.hitR = collideRectCircle(g_width - g_borderThickness, 0, g_borderThickness, g_height, this.posX, this.posY, this.radius)
    // console.log("hitT: " + this.hitT + " hitB: " + this.hitB + " hitL: " + this.hitL + " hitR: " + this.hitR )
    // console.log("hitT: " + this.hitT )

    // bound player
    let bumper = 4
    let bouncingForce = 0.8

    if (this.hitT) {
      this.posY = this.radius/2 + bumper 
      this.velY = this.velY * -bouncingForce
    }

    if (this.hitB) {
      this.posY = g_height - this.radius/2 - bumper 
      this.velY = this.velY * -bouncingForce
    }

    if (this.hitL) {
      this.posX = this.radius/2 + bumper
      this.velX = this.velX * -bouncingForce 
    }

    if (this.hitR) {
      this.posX = g_width - this.radius/2 - bumper
      this.velX = this.velX * -bouncingForce 
    }


    // move player
    this.posX = this.posX + this.velX
    this.posY = this.posY + this.velY


  }

  draw() {

    if (this.isDead) return

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


  setHitByBullet(type) {

    if (type === '+') {
      this.makeBigger()
    } else if (type === '-') {
      this.makeSmaller()
    }
    // console.log(this.id + " hitted by bullet " + type);

  }

  makeBigger() {
    this.radius += 5
    this.mass += 0.1
  }

  makeSmaller() {
    this.radius -= 5
    this.mass -= 0.1
  }

  getPosition() {
    let pos = createVector(this.posX, this.posY)
    return pos
  }

  getRadius() {
    return this.radius
  }

  getBarrelAngle() {
    return this.barrelAngle
  }

  setBarrelAngle(deg) {
    // console.log(deg);
    this.barrelAngle = deg
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


  getMsgPattern() {
    return this.msgPatten
  }

  getPatternIndex() {
    return this.patternIndex
  }

  nextPatternIndex() {
    this.patternIndex = (this.patternIndex + 1) % this.msgPatten.length
  }


  getIsDead() {
    return this.isDead
  }


}


