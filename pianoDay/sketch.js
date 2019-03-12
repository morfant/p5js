let pad = 10
let bufNumLondon = 0 
let bufNumSeoul = 0 
let bufLondon = []
let bufSeoul = []
let baseYLondon = 0
let baseYSeoul = 0
let velLondon = 3
let velSeoul = 1

function setup() {

    // Canvas Setup
    createCanvas(1280, 900)
    background(255)

    // Audio In
    mic = new p5.AudioIn()
    mic.start();

    // Buffer Init
    bufNumLondon = (width - (pad * 2))/velLondon
    bufNumSeoul = (width - (pad * 2))/velSeoul
    bufLondon.fill(0)
    bufSeoul.fill(0)

    baseYLondon = (height - (pad * 2)) / 3
    print(baseYLondon)
    baseYSeoul = baseYLondon * 2

}

function draw() {

    background(255, 25)

    // Boundary
    stroke(0)
    line(pad, pad, width - pad, pad)
    line(width - pad, pad, width - pad, height - pad)
    line(width - pad, height - pad, pad, height - pad)
    line(pad, height - pad, pad, pad)

    // Center line
    stroke(255, 0, 0)
    line(width/2, 0, width/2, height)


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



    // Sound line
    // for (var i = 0; i < bufNum; i++) {
    //     let w = width - pad
    //     fill(0)
    //     ellipse(w - i/2, baseYLondon + bufLondon[bufLondon.length - i] * 1000 , 5, 5)

    //     fill(10, 60, 120)
    //     ellipse(pad + i/2, baseYSeoul+ bufSeoul[bufSeoul.length - i] * 1000 , 5, 5)

    // }

    fill(0, (1 - newValue) * 1000)
    noFill()
    strokeWeight(0.4)
    stroke(0, 150)
    beginShape()
    for (var i = 0; i < bufNumLondon; i++) {
        let w = width - pad
        vertex(w - (i*velLondon), baseYLondon + bufLondon[bufLondon.length - i] * 1000)
    }
    endShape(CLOSE)

    fill(10, 80, 200, (1 - newValue) * 1000)
    noFill()
    strokeWeight(0.4)
    stroke(10, 80, 200)
    beginShape()
    for (var i = 0; i < bufNumSeoul; i++) {
        let w = width - pad
        vertex(pad + (i*velSeoul), baseYSeoul - bufSeoul[bufSeoul.length - i] * 1000)
    }
    endShape()



}