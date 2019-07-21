class Bullet {
  
  constructor(posX, posY, targetForce) {
    this.radius = 10 
    this.posX = posX 
    this.posY = posY 
    this.velX = 0
    this.velY = 0
    this.mass = 1

    this.colorR = 200
    this.colorG = 200
    this.colorB = 10

    this.type = '-' // -, +
    this.isDead = false
    this.hitPlayer = false
    this.other = null

    this.targetForce = targetForce
  }

  shoot() { // f: shooting force

    // console.log("shoot " + targetForce);

    this.accX = this.targetForce.x/this.mass / 10
    this.accY = this.targetForce.y/this.mass / 10

    // console.log(this.accX + " / " + this.accY);

    this.velX = this.velX + this.accX
    this.velY = this.velY + this.accY

    // console.log(this.velX + " / " + this.velY);
    

  }


  collide() {

    for (let p of g_playerArray) {
      let hit = collideCircleCircle(this.posX, this.posY, this.radius, p.getPosition().x, p.getPosition().y, p.getRadius())
      if (hit) {
        this.other = p
        this.hitPlayer = true
        this.isDead = true
        p.setHitByBullet(this.type)
      }
    }

  }

  update() {

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

