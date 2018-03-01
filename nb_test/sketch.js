
var SERIAL_OUT = true;

var serial = null;
// var portName = "/dev/cu.usbmodem1461"; // UNO
var portName = "/dev/cu.usbmodem14641"; // UNO // var portName = "/dev/cu.usbserial-A9005QwS";
var msg_date, msg_all;
var inByte = null;

var _displayLoadingBar = false;
var printOnPaper = false;
var sessionEnd = false;
var connectionCheckTime = 2000; // ms

var blinkRate = 100;
var trans = 255;

var input_name = "";
var loadingBarRate = 300; // ms

var greetMovLimitY = 300; 
var loadingBar = "";
var loadingBarCnt = 0;
var loadingBarNum = 15;

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
var announceSessionEnd = "감사합니다";
var greet = "이름을 입력해 주세요.\nEnter your name.";
var inputInfo = "한글/영문 최대 4글자까지 입력 가능합니다.\nMaximum four letters in Korean/English";

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

  // make space
  createElement("br");
  createElement("br");
  createElement("br");

  // Text Input 
  input = createInput();
  textAlign(CENTER);
  input.position((width - input.elt.clientWidth)/2 - input.elt.clientWidth + 10, 600); // trim
  input.attribute('maxlength', '4');
  input.class("text-field"); // see data/style.css
  input.elt.focus();

}

function draw() {
  background(89, 89, 89);

  // greeting text
  fill(250);
  noStroke();
  textAlign(CENTER);

  // greeting text 
  textSize(_fontSize);
  push();
  translate(width/2, greeting_posY);
  text(greet, 0, 0);
  textSize(_fontSize*5/10);
  translate(0, 250);
  text(inputInfo, 0, 0);
  pop();


  if (enterInput) {
    input_name = input.value();
    input.remove();

    // input_name
    textSize(_fontSize + 20);
    push();
    translate(width/2, greeting_posY + 530); // trim
    text(input_name, 0, 0);
    pop();

    greeting_posY -= textVelY/2;

    // phase of animation
    if (greeting_posY < -greetMovLimitY && numbersPrinted == false) { // moving toward Y is finished
      // greet = "";
      textVelY = 0; // velocity Y is zero = will not move anymore

      // trigger recursive function
      if (!binPrinting) {
        binPrinting = true;
        countBins();
      }
    } 
  }

  // print bin numbers
  if (binPrinting) {
    push();
    translate(0, binsPosY);
    var charWidth = _fontSize - 50;

    // bin number text
    for (var i = 0; i < cnt; i++) {
      var posX = (width - (charWidth * binNum)) / 2 + 15; // console.log(posX); // trim

      textSize(charWidth);
      fill(255, trans);
      text(binName[i], posX + i * charWidth, 0);

      // bin number pointing line
      // stroke(113, 246, 79, 100); // green
      stroke(255, 100);
      if (!numbersPrinted) {
        if (i == cnt - 1) line(charXPoses[charIdx], -230, posX + i * charWidth, -50)
      }

      // rect, pulse, puhch hole
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

    // bin numbers and rect, pulse, puhch hole are printed.(finished)
    if (numbersPrinted) {
      if (!printOnPaper) {
        if (SERIAL_OUT) serial.write(msg_all); // make printer work!
        printOnPaper = true;
        console.log("run displayLoadingBar()");
        setTimeout(displayLoadingBar, 200);
      }

      // lodingBar
      if (!sessionEnd) {
        if (_displayLoadingBar == true) {
          console.log("mcc");
          countLoading();
          _displayLoadingBar = false;
        }

        // blinkRate = 600 + ((Math.sin(millis())) * 50);
        // blinkRate = 2000; 
        // var t = Math.round(millis() / blinkRate);

        fill(255, 200);
        textSize(_fontSize);
        textAlign(LEFT);
        // loadingBar = "[";
        loadingBar = "";

        if (loadingBarCnt > 0) {
          // noStroke();
         for (var i = 0; i < loadingBarCnt; i++){
            loadingBar += ">"; // loading char
          }
          // loadingBar += ">";
        }
        text(loadingBar, width/2 - 350, 300);
        // text(']', width/2 + 250, 300);

      } else {
        fill(255, 200);
        textSize(_fontSize);
        text(announceSessionEnd, width/2, 300); // thank you
        setTimeout(reset, 3000);
      }

    }

    pop();
  }
}


function displayLoadingBar() {
  _displayLoadingBar = true;
}

function reset() {

  printOnPaper = false;
  sessionEnd = true;
  // greet = "넥슨컴퓨터박물관에 오신 것을 환영합니다.\n\n이름을 입력하세요."

  // recreate Text Input 
  input = createInput();
  textAlign(CENTER);
  input.position((width - input.elt.clientWidth)/2 - input.elt.clientWidth + 10, 600); // trim
  input.attribute('maxlength', '4');
  input.class("text-field"); // see data/style.css
  input.elt.focus();

  enterInput = false;
  binPrinting = false;
  numbersPrinted = false;
  greeting_posY = 150;
  textVelY = 20;
  textMag = 0;
  loadingBarCnt = 0;
  _displayLoadingBar = false;

  setTimeout(serialClose, 500);
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

function countLoading() {
  console.log("cl");
  loadingBarCnt++;

  if (!sessionEnd){
    if (loadingBarCnt <= loadingBarNum) {
      setTimeout(countLoading, loadingBarRate);
    } else {
      console.log("c1");
      loadingBarCnt = 0;
      loadingBar = "";
      setTimeout(countLoading, loadingBarRate);
    }
  } else {
      console.log("cend");

  }
}



function serialOpen() {
  console.log("serialOpen()");
  console.log(serial);
  if (serial != undefined) serial.close();
  if (serial == null) serial = new p5.SerialPort();
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
  serial.on('list', callback_gotList);
  serial.on('close', callback_serialClose);

}

function serialClose() {
  console.log("serialClose()");
  if (serial != undefined) serial.close();

}

function keyTyped() {

  if (keyCode === ENTER && enterInput == false) {
    console.log("enter input!");

    // check input length
    var str = input.value();
    charLength = str.length;

    //Enter reset
    if (charLength > 0) {
      sessionEnd = false;
      enterInput = true;
      loadingBar = "";
      loadingBarCnt = 0;

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
function callback_serverConnected(msg) {
  console.log("server connected");
  console.log(msg);
}

function callback_serialClose(c) {
  console.log("serial CLOSE!!");
  console.log(c);

}
function callback_serialError(err) {
  console.log("serial ERROR!!");
  console.log(err);

}

function callback_serialOpen(m) {
  console.log("serial OPEN!!");
  console.log(m);
}

function callback_gotList(l) {
  console.log("serial list!!");
  console.log(l);
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