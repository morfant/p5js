class Bullet {
  
  // constructor(posX, posY, targetForce) {
  constructor(p) { // p = player instance
    this.radius = 10 
    this.posX = 0
    this.posY = 0
    this.velX = 0
    this.velY = 0
    this.mass = 1

    this.colorR = 200
    this.colorG = 200
    this.colorB = 10

    this.player = p
    this.type = '-' // -, +
    this.isDead = false
    this.hitPlayer = false
    this.other = null

    this.targetForce = 0

    this.ready()
  }

  ready() {
    let barrelVector = this.player.getBarrel()
    this.posX = this.player.getPosition().x + barrelVector.x
    this.posY = this.player.getPosition().y + barrelVector.y 
    this.targetForce = barrelVector

    this.shoot()
  }


  shoot() { // f: shooting force

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

    // check out of borders
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

