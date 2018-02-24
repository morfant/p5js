var serial;
var portName = "/dev/cu.usbmodem1461"; // UNO
// var portName = "/dev/cu.usbserial-A9005QwS";
var msg_date, msg_all;
var inByte = null;

var printOnPaper = false;
var sessionEnd = false;
var connectionCheckTime = 2000; // ms

var blinkRate = 100;
var trans = 255;

var input_name = "";

var playing = false;
var input, button, greeting;
var charLength = 0;
var binNum = 0;
var binName = "";
var binPrinting = false;
var numbersPrinted = false;
var binPrintInterval = 100; //ms
var binText;
var inputPosX = 450;
var inputPosY = 500;
var _fontSize = 80;
var announcePrinting = "출력중입니다…";
var announceSessionEnd = "감사합니다";
var greet = "넥슨컴퓨터박물관에 오신 것을 환영합니다.\n\n이름을 입력하세요.";
var greeting_posY = 150;
var binsPosY = 500;
var enterInput = false;
var textVelY = 20;
var cnt = 0;
var charIdx = 0;
var fontWidth = 30;
var charXPoses;
var firstCharBin;
var first = true;
var textMag = 0;
var binNumMag = 0;


var d; // date object


function setup() {
 
  // get date
  d = new Date();
  msg_date = d.getFullYear() + '/'
            + ('0' + (d.getMonth()+1)).slice(-2) + '/'
            + ('0' + d.getDate()).slice(-2);
  // console.log(msg_date);

  // canvas
  frameRate(30); // Attempt to refresh at starting FPS
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');

  /*
  // serial
  serial = new p5.SerialPort();
  // console.log(serial.list());
  // serial.open(portName);
  serial.open(portName, {
    baudRate: 19200, // this is necessary for solving bizzare serial data sending problem
    // dataBits: 8,
    // hupcl: false,
    // stopBits: 1,
    // parity: "none"
  });
  serial.on('data', serialEvent); // callback for when new data arrives
  // setInterval(keepConnection, connectionCheckTime);
  */

  
  // make space
  createElement("br");
  createElement("br");
  createElement("br");

  // Text Input 
  input = createInput();
  input.attribute('maxlength', '4');
  input.class("text-field"); // see data/style.css
  input.elt.focus();
}

function draw() {
  background(89, 89, 89);
  // background(21, 21, 21);

  // greeting text
  fill(250);
  noStroke();
  // fill(113, 246, 79);
  textAlign(CENTER);

  // greeting text 
  textSize(_fontSize);
  push();
  translate(width/2, greeting_posY);
  text(greet, 0, 0);
  pop();

  if (enterInput) {


    input_name = input.value();
    input.remove();

    // input_name
    // textSize(50 + textMag);
    // textSize(50 + binNumMag);
    textSize(_fontSize + 20);
    push();
    translate(width/2, greeting_posY + 400);
    text(input_name, 0, 0);
    pop();

    greeting_posY -= textVelY/2;
    if (textMag < 50) textMag += 5;

    // phase of animation
    if (greeting_posY < -150 && numbersPrinted == false) {
      greet = "";
      textVelY = 0; // velocity Y is zero = will not move anymore

      // trigger recursive function
      if (!binPrinting) {
        binPrinting = true;
        countBins();
      }

    } else if (numbersPrinted) {
      if (greeting_posY < 150) {
        // textVelY = -10;
        // textMag += 10;
      } else {
        textVelY = 0;
      }

    }

  }

  if (binPrinting) {
    push();
    translate(0, binsPosY);

    var charWidth = _fontSize - 50;
    for (var i = 0; i < cnt; i++) {
      var posX = (width - (charWidth * binNum)) / 2; // console.log(posX);

      // textSize(50 + binNumMag);
      textSize(charWidth);
      fill(255, trans);
      text(binName[i], posX + i * charWidth, 0);

      // bin number pointing line
      // stroke(113, 246, 79, 100); // green
      stroke(255, 100);
      if (!numbersPrinted) {
        if (i == cnt - 1) line(charXPoses[charIdx], -230, posX + i * charWidth, -50)
      }
    }

    
    for (var i = 0; i < cnt; i++) {
      // console.log(binName[i]);
      if (binName[i] == '0'){
        binNumMag = 0;

        // rect
        noStroke();
        fill(0, trans);
        rect(posX + (i-0.5) * (charWidth), 20, charWidth, charWidth);

        // pulse
        stroke(255, trans);
        line(posX + (i-0.5) * (charWidth), 100, posX + (i+0.5) * (charWidth), 100);
        if (binName[i-1] == '1') {
          line(posX + (i-0.5) * (charWidth), 100, posX + (i-0.5) * (charWidth), 70);
        }

        // punch hole
        noStroke();
        ellipse(posX + i * charWidth, 130, charWidth*2/3, charWidth*2/3);
      } else if (binName[i] == '1'){
        binNumMag = 200;

        // rect
        noStroke();
        fill(255, trans);
        rect(posX + (i-0.5) * (charWidth), 20, charWidth, charWidth);

        // pulse
        stroke(255, trans);
        line(posX + (i-0.5) * (charWidth), 70, posX + (i+0.5) * (charWidth), 70);
        if (binName[i-1] == '0') {
          line(posX + (i-0.5) * (charWidth), 70, posX + (i-0.5) * (charWidth), 100);
        }

        // punch hole
        // noStroke();
        // ellipse(posX + i * charWidth, 130, 20, 20);

      } else if (binName[i] == ' ') {
        // console.log("except: " + binName[i]);
      }
    }

    if (numbersPrinted) {
      binNumMag = 0;

      if (!printOnPaper) {
        serial.write(msg_all); // make printer work!
        printOnPaper = true;
      }

      if (!sessionEnd) {
        // blinkRate = 600 + ((Math.sin(millis())) * 50);
        blinkRate = 800; 

        var t = Math.round(millis() / blinkRate);
        if (t % 2 == 0) {
          noStroke();
          fill(255, 0);
          textSize(_fontSize);
          text(announcePrinting, width/2, 300);
          // trans = 0;

        } else {
          stroke(255);
          fill(255, 200);
          textSize(_fontSize);
          text(announcePrinting, width/2, 300);
          // trans = 255;
        }

      } else {
        fill(255, 200);
        textSize(_fontSize);
        text(announceSessionEnd, width/2, 300); // thank you
        setTimeout(reset, 3000);
      }

    }

    pop();
  }


  // console.log(binName);
  // binText.html(binName);
  // console.log("draw()");
}


function textBlink(_text, _interval, _posX, _posY, _num) {
  text(_text, _posX, _posY);
  setTimeout(textBlink, _interval);
}

function reset() {

  printOnPaper = false;
  sessionEnd = false;
  greet = "넥슨컴퓨터박물관에 오신 것을 환영합니다.\n\n이름을 입력하세요."

  // recreate Text Input 
  // console.log(select('.text-field'));
  if (select('.text-field') == null) {
    input = createInput();
    input.attribute('maxlength', '4');
    input.class("text-field"); // see data/style.css
    input.elt.focus();
  }

  enterInput = false;
  binPrinting = false;
  numbersPrinted = false;
  greeting_posY = 150;
  textVelY = 20;
  textMag = 0;

}


function countBins() {
  console.log("countBins()");
  cnt++;
  if (binName[cnt] == ' ') charIdx++;

  if (cnt < binNum) {
    setTimeout(countBins, binPrintInterval);
  } else {
    numbersPrinted = true; // it's going to print barcode image
    console.log("numbersPrinted: " + numbersPrinted);
  }
}


function serialOpen() {
  serial = new p5.SerialPort();
  serial.open(portName, {
    baudRate: 19200, // this is necessary for solving bizzare serial data sending problem
    // dataBits: 8,
    // hupcl: false,
    // stopBits: 1,
    // parity: "none"
  });
  serial.on('connected', callback_serverConnected);
  serial.on('open', callback_serialOpen);
  serial.on('error', callback_serialError);
  serial.on('data', callback_serialEvent);

}

function keyTyped() {

  if (keyCode === ENTER && enterInput == false) {
    console.log("enter input!");

    // check input length
    var str = input.value();
    charLength = str.length;

    if (charLength > 0) {
      enterInput = true;

      // reset variables
      binNum = 0;
      binName = null;
      cnt = 0;
      charIdx = 0;

      serialOpen();
      
      // text handle
      // analyzeText(str);
      binName = text2Binary(str);
      console.log(binName);
      binNum = binNum + (charLength - 1); // add num of space
      console.log("binNum: " + binNum);

      // charXPoses
      charXPoses = [];
      var charWidth = _fontSize - 10; // need to be trim

      if (charLength == 1) {
        charXPoses[0] = width/2;
      } else if (charLength == 2) {
        charXPoses[0] = width/2 - (charWidth);
        charXPoses[1] = width/2 + (charWidth);
      } else if (charLength == 3) {
        charXPoses[0] = width/2 - (charWidth + charWidth/2);
        charXPoses[1] = width/2;
        charXPoses[2] = width/2 + (charWidth + charWidth/2);
      } else if (charLength == 4) {
        charXPoses[0] = width/2 - (charWidth * 2);
        charXPoses[1] = width/2 - (charWidth * 1);
        charXPoses[2] = width/2 + (charWidth * 1);
        charXPoses[3] = width/2 + (charWidth * 2);
      }

      // msg_all = msg_date + "*" + firstCharBin;
      msg_all = msg_date + binName + '*';
      console.log(msg_all);

      console.log("binName: " + binName);
      // console.log(binName[binNum-1]);

      return false;
    }

  } else if (keyCode === 32) { // space key
    console.log("sp");
    console.log(msg_date);
    console.log(msg_all);
    // serial.write(msg_all); // make printer work!

    return false; // Prevent the key working as default function

  } else {
    // console.log(keyCode);
  }
}

function analyzeText(string) {
  string.split('').map(function (char) {
    var b = char.charCodeAt(0).toString(2).length;
    binNum += b;
  });
}

function text2Binary(string) {
  return string.split('').map(function (char) {
    var charBin = char.charCodeAt(0).toString(2);
    var l = charBin.length;
    if (l < 16) {
      var leadingZero = ""; 
      for (var i = 0; i < (16 - l); i++) {
        leadingZero = leadingZero + '0';
      }
      charBin = leadingZero + charBin;
    }

    var b = charBin.length;
    binNum += b;

    return charBin;
  }).join(' ');
}


// serial callback
function callback_serverConnected() {
  console.log("server connected");
}

function callback_serialError() {
  console.log("serial ERROR!!");
}

function callback_serialOpen() {
  console.log("serial OPEN!!");
}

function callback_serialEvent() {
  // read a byte from the serial port:
  inByte = serial.read();
  if (inByte != 10 && inByte != 32 && inByte != 13 && inByte != 0 && inByte != 224) {
    if (inByte == 101) { // 'e' from Arduino
      console.log("read byte: " + inByte.toString());
      console.log("serial data length has error...");
    } else if (inByte == 99) { // 'c' from arduino
      console.log("read byte: " + inByte.toString());
      console.log("serial close...");
      serial.close();
      sessionEnd = true;
    } else if (inByte == 107) {
      console.log("read byte: " + inByte.toString());
    }
  }
}



function getTimeStamp() {
  var d = new Date();

  var s =
    (d.getHours()) + ':' +
    (d.getMinutes()) + ':' +
    (d.getSeconds());

  return s;
}


function keepConnection() {
  // console.log(serial);
  // console.log(d.now());
  console.log(getTimeStamp());
  if (!enterInput) {
    console.log("keepConnection()");
    serial.write(' ');
  }
}

// keyPressed
function keyPressed() {
  if (keyCode === 33) { // 'page up' key
    var fs = fullscreen();
    fullscreen(!fs);
    return false;
  } else if (keyCode === DELETE) {
    console.log("reset()");
    reset();
    return false;
  } else if (keyCode === ESCAPE) {
    console.log("esc");
    return false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
}

