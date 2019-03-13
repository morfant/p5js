let pad = 10
let bufNumLondon = 0 
let bufNumSeoul = 0 
let bufLondon = []
let bufSeoul = []
let baseYLondon = 0
let baseYSeoul = 0
let velLondon = 3
let velSeoul = 1
let wc = null
let wc2 = null
let DIRECTION = Object.freeze({"UP":1, "DOWN":2})

class WaveCircle {
    constructor(_x, _y, _r) {
        this.x = _x
        this.y = _y
        this.r = _r
        this.ampDirectionFlag = DIRECTION.UP 
    }

    update(bufferArray) {
        this.buffer = bufferArray
    }

    direction(_ampDirectionFlag) {
        this.ampDirectionFlag = _ampDirectionFlag
    }

    draw() {
        angleMode(DEGREES)

        // noFill()
        let newValue = this.buffer[this.buffer.length - 1]
        fill(10, 80, 200)
        strokeWeight(0.4)
        stroke(0, 150)

        push()
        translate(this.x, this.y)
        beginShape()
        let d = 360 / this.buffer.length
        for (var i = 0; i <this.buffer.length; i++) {

            let x = this.r * cos(i * 1)
            let y = this.r * sin(i * 1)
            if (this.ampDirectionFlag === DIRECTION.UP) {
                vertex(x, y - this.buffer[this.buffer.length - i] * 1000)
            } else if (this.ampDirectionFlag === DIRECTION.DOWN) {
                vertex(x, y + this.buffer[this.buffer.length - i] * 1000)
            }

        }
        endShape()
        pop()


    }

}


function setup() {

    // Canvas Setup
    createCanvas(1280, 900)
    background(255)

    // Enum for direction flat

    wc = new WaveCircle(width*1/4, height/2, 200)
    wc2 = new WaveCircle(width*3/4, height/2, 100)

    // Audio In
    mic = new p5.AudioIn()
    mic.start();

    // Buffer Init
    // bufNumLondon = (width - (pad * 2))/velLondon
    // bufNumSeoul = (width - (pad * 2))/velSeoul
    bufNumLondon = 360 * 4
    bufNumSeoul = 360 * 4
    bufLondon.fill(0)
    bufSeoul.fill(0)

    baseYLondon = (height - (pad * 2)) / 3
    // print(baseYLondon)
    baseYSeoul = baseYLondon * 2

}

function draw() {

    // background(255, 25)
    background(255)

    // Boundary
    stroke(0)
    line(pad, pad, width - pad, pad)
    line(width - pad, pad, width - pad, height - pad)
    line(width - pad, height - pad, pad, height - pad)
    line(pad, height - pad, pad, pad)

    // Center red line
    // stroke(255, 0, 0)
    // line(width/2, 0, width/2, height)


    // Update buffer
    let newValue = mic.getLevel()
    if (bufLondon.length < bufNumLondon) {
        bufLondon.push(newValue)
    } else {
        bufLondon.push(newValue) // append to last index position
        bufLondon.shift() // remove first element
        // print(bufLondon)
    }

    if (bufSeoul.length < bufNumSeoul) {
        bufSeoul.push(newValue)
    } else {
        bufSeoul.push(newValue) // append to last index position
        bufSeoul.shift() // remove first element
        // print(bufSeoul)
    }

    wc.update(bufSeoul)
    wc.direction(DIRECTION.UP)
    wc.draw()

    wc2.update(bufLondon)
    wc2.direction(DIRECTION.DOWN)
    wc2.draw()



    // Sound line
    // for (var i = 0; i < bufNum; i++) {
    //     let w = width - pad
    //     fill(0)
    //     ellipse(w - i/2, baseYLondon + bufLondon[bufLondon.length - i] * 1000 , 5, 5)

    //     fill(10, 60, 120)
    //     ellipse(pad + i/2, baseYSeoul+ bufSeoul[bufSeoul.length - i] * 1000 , 5, 5)

    // }


    // fill(0, (1 - newValue) * 1000)
    // noFill()
    // strokeWeight(0.4)
    // stroke(0, 150)
    // beginShape()
    // for (var i = 0; i < bufNumLondon; i++) {
    //     let w = width - pad
    //     vertex(w - (i*velLondon), baseYLondon + bufLondon[bufLondon.length - i] * 1000)
    // }
    // endShape()

    // fill(10, 80, 200, (1 - newValue) * 1000)
    // noFill()
    // strokeWeight(0.4)
    // stroke(10, 80, 200)
    // beginShape()
    // for (var i = 0; i < bufNumSeoul; i++) {
    //     let w = width - pad
    //     vertex(pad + (i*velSeoul), baseYSeoul - bufSeoul[bufSeoul.length - i] * 1000)
    // }
    // endShape()



}