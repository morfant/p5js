var SERIAL_OUT = true;

// overall setting
var trans = 255;
var _fontSize = 80;

// serial
var serial = null;
// var portName = "/dev/cu.usbmodem1461"; // UNO
// var portName = "/dev/cu.usbmodem14641"; // UNO // var portName = "/dev/cu.usbserial-A9005QwS";
var portName = "/dev/cu.usbmodem1441"; // UNO // var portName = "/dev/cu.usbserial-A9005QwS";
var msg_date, msg_all;
var inByte = null; // serial receive byte

// condition
var _displayLoadingBar = false;
var printOnPaper = false;
var sessionEnd = false;
var connectionCheckTime = 2000; // ms
var resetDone = false;
var binPrinting = false;
var numbersPrinted = false;
var enterInput = false;

// input field
var input, inputWidth;
var input_name = "";
var inputPosX;
var inputPosY = 600;

// loading bar
var loadingBarRate = 300; // ms
var loadingBar = "";
var loadingBarCnt = 0;
var loadingBarNum = 15;

// info
var announceSessionEnd = "감사합니다";
var greet = "이름을 입력해 주세요.\nEnter your name.";
var inputInfo = "한글/영문 최대 4글자까지 입력 가능합니다.\nMaximum four letters in Korean/English";

// greeting
var greetMovLimitY = 300;
var greeting_posY = 150;
var textVelY = 20;
var startXpos = 0; // name char start X pos

// char name
var charLength = 0;
var charIdx = 0;
var charXPoses;

// binName
var binNum = 0;
var binName = "";
var binPrintInterval = 100; //ms
var binsPosY = 500;
var cnt = 0;

// date
var d; // date object


function setup() {

  // get date
  d = new Date();
  // dd/mm/yyyy
  // msg_date = d.getFullYear() + '/'
  //           + ('0' + (d.getMonth()+1)).slice(-2) + '/'
  //           + ('0' + d.getDate()).slice(-2);

  // mm/dd/yyyy
  msg_date = ('0' + (d.getMonth()+1)).slice(-2) + '/'
            + ('0' + d.getDate()).slice(-2) + '/'
            + d.getFullYear();

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
  input.attribute('maxlength', '4');
  input.class("text-field"); // see data/style.css
  input.elt.focus();
  inputWidth = input.elt.clientWidth;
  inputPosX = width/2 - inputWidth/2;
  input.position(inputPosX, inputPosY); // need to be set after other options.


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

    // input_name
    textSize(_fontSize + 20);
    push();
    translate(width/2, greeting_posY + 530); // trim
    text(input_name, 0, 0);
    pop();

    greeting_posY -= textVelY/2;

    // phase of animation
    if (greeting_posY < -greetMovLimitY) { // moving toward Y is finished

      // greet = "";
      textVelY = 0; // velocity Y is zero = will not move anymore

      if (numbersPrinted == false) {
        // trigger recursive function
        if (!binPrinting) {
          binPrinting = true;
          countBins();
        }
      }
    }
  }

  // print bin numbers
  if (binPrinting) {
    push();
    translate(0, binsPosY);
    var binCharWidth = _fontSize - 52;

    // bin number text
    for (var i = 0; i < cnt; i++) {
      var posX = (width - (binCharWidth * binNum)) / 2 + 15; // console.log(posX); // trim

      textSize(binCharWidth);
      fill(255, trans);
      text(binName[i], posX + i * binCharWidth, 0);

      // bin number pointing line
      // stroke(113, 246, 79, 100); // green
      stroke(255, 100);
      if (!numbersPrinted) {
        if (i == cnt - 1) line(charXPoses[charIdx], greeting_posY + 50, posX + i * binCharWidth, -50)
      }

      // rect, pulse, puhch hole
      if (binName[i] == '0'){

        // rect
        noStroke();
        fill(0, trans);
        rect(posX + (i-0.5) * (binCharWidth), 20, binCharWidth, binCharWidth);

        // pulse
        stroke(255, trans);
        line(posX + (i-0.5) * (binCharWidth), 100, posX + (i+0.5) * (binCharWidth), 100);
        if (binName[i-1] == '1') {
          line(posX + (i-0.5) * (binCharWidth), 100, posX + (i-0.5) * (binCharWidth), 70);
        }

        // punch hole
        noStroke();
        ellipse(posX + i * binCharWidth, 130, binCharWidth*2/3, binCharWidth*2/3);

      } else if (binName[i] == '1'){

        // rect
        noStroke();
        fill(255, trans);
        rect(posX + (i-0.5) * (binCharWidth), 20, binCharWidth, binCharWidth);

        // pulse
        stroke(255, trans);
        line(posX + (i-0.5) * (binCharWidth), 70, posX + (i+0.5) * (binCharWidth), 70);
        if (binName[i-1] == '0') {
          line(posX + (i-0.5) * (binCharWidth), 70, posX + (i-0.5) * (binCharWidth), 100);
        }

        // punch hole
        // noStroke();
        // ellipse(posX + i * binCharWidth, 130, 20, 20);

      } else if (binName[i] == ' ') {
        // console.log("except: " + binName[i]);
      }
    }

    // bin numbers and rect, pulse, puhch hole are printed.(finished)
    if (numbersPrinted) {
      if (!printOnPaper) {
        if (SERIAL_OUT) serial.write(msg_all); // make printer work!
        printOnPaper = true;
        // console.log("run displayLoadingBar()");
        setTimeout(displayLoadingBar, 200);
      }

      // lodingBar
      if (!sessionEnd) {
        if (_displayLoadingBar == true) {
          countLoading();
          _displayLoadingBar = false;
        }

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
        if (!resetDone){
          setTimeout(reset, 2000);
          resetDone = true;
        }
      }

    }

    pop();
  }


  /*
  // Guide lines

  // center line
  stroke(0, 255, 0);
  line(width/2, 0, width/2, height);

  // char start X pos
  stroke(0, 0, 255);
  line(startXpos, 0, startXpos, height);

  // show input field width
  stroke(0, 255, 255);
  line(inputPosX, 0, inputPosX, height);
  line(inputPosX + inputWidth, 0, inputPosX + inputWidth, height);

  // check width
  stroke(255, 255, 0);
  line(0, 0, 0, height);
  line(width-1, 0, width-1, height);
  */





}


function displayLoadingBar() {
  _displayLoadingBar = true;
}

function reset() {
  console.log("reset()");

  printOnPaper = false;
  sessionEnd = true;

  // recreate Text Input
  if (input == null) {
    input = createInput();
    textAlign(CENTER);
    input.attribute('maxlength', '4');
    input.class("text-field"); // see data/style.css
    input.elt.focus();
    input.position(inputPosX, inputPosY); // need to be set after other options.
  }

  cnt = 0;
  enterInput = false;
  binPrinting = false;
  numbersPrinted = false;
  greeting_posY = 150;
  textVelY = 20;
  loadingBarCnt = 0;
  _displayLoadingBar = false;

  resetDone = false;

  serialClose();
}


function countBins() {
  // console.log("countBins()");
  cnt++;
  if (binName[cnt] == ' ') charIdx++;

  if (cnt < binNum) {
    setTimeout(countBins, binPrintInterval);
  } else {
    numbersPrinted = true; // it's going to print barcode image
    // console.log("numbersPrinted: " + numbersPrinted);
  }
}

function countLoading() {
  // console.log("cl");
  loadingBarCnt++;

  if (!sessionEnd){
    if (loadingBarCnt <= loadingBarNum) {
      setTimeout(countLoading, loadingBarRate);
    } else {
      // console.log("c1");
      loadingBarCnt = 0;
      loadingBar = "";
      setTimeout(countLoading, loadingBarRate);
    }
  } else {
      // console.log("cend");
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
    input_name = input.value()
    charLength = input_name.length;

    var charWidth = [];
    var sumCharWidth = 0;
    var temp_space = 20;

    for (var i = 0; i < input_name.length; i++) {
      // console.log(textWidth(input_name[i]));
      charWidth[i] = textWidth(input_name[i]);
      sumCharWidth += charWidth[i];
      if (i < (input_name.length-1)) {
        sumCharWidth += temp_space;
      }
    }

    //Enter
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

      if (SERIAL_OUT) serialOpen();

      // text handle
      binName = text2Binary(input_name);
      console.log(binName);
      binNum = binNum + (charLength - 1); // add num of space
      console.log("binNum: " + binNum);

      // set charXPoses
      charXPoses = [];
      // var startXpos = width/2 - sumCharWidth/2;
      startXpos = width/2 - sumCharWidth/2;
      if (charLength == 1) {
        charXPoses[0] = width/2;
      } else if (charLength == 2) {
        charXPoses[0] = startXpos + (charWidth[0]/2);
        charXPoses[1] = startXpos + (charWidth[0] + temp_space + charWidth[1]/2);
      } else if (charLength == 3) {
        charXPoses[0] = startXpos + (charWidth[0]/2 + temp_space/2);
        charXPoses[1] = startXpos + (charWidth[0] + temp_space + charWidth[1]/2);
        charXPoses[2] = startXpos + (charWidth[0] + temp_space + charWidth[1] + temp_space + charWidth[2]/2);
      } else if (charLength == 4) {

        charXPoses[0] = startXpos + (charWidth[0]/2 + temp_space/2);
        charXPoses[1] = startXpos + (charWidth[0] + temp_space + charWidth[1]/2);
        charXPoses[2] = startXpos + (charWidth[0] + temp_space + charWidth[1] + temp_space + charWidth[2]/2);
        charXPoses[3] = startXpos + (
          charWidth[0] + temp_space +
          charWidth[1] + temp_space +
          charWidth[2] + temp_space +
          charWidth[3]/2
        );
      }

      msg_all = msg_date + binName + '*'; // '*' is a end mark of serial send

      input.remove();
      input = null;

      return false;
    }

  } else if (keyCode === 32) { // space key
    console.log("space pressed");
    console.log(msg_date);
    console.log(msg_all);
    // serial.write(msg_all); // make printer work!

    return false; // Prevent the key working as default function

  } else {
    // console.log(keyCode);
  }
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
  console.log("serial close callback");
  // console.log(c);
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
      console.log("read byte: " + inByte.toString() + " means close session.");
      serialClose();
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
  } else {
    console.log(key);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// refresh handler
window.onbeforeunload = function(e) {
  console.log("refreshed");
  serialClose();
  // console.log(e);
  return 'Do you?';
};
