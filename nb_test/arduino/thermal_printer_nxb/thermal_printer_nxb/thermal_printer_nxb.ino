/*------------------------------------------------------------------------
  Example sketch for Adafruit Thermal Printer library for Arduino.
  Demonstrates a few text styles & layouts, bitmap printing, etc.

  IMPORTANT: DECLARATIONS DIFFER FROM PRIOR VERSIONS OF THIS LIBRARY.
  This is to support newer & more board types, especially ones that don't
  support SoftwareSerial (e.g. Arduino Due).  You can pass any Stream
  (e.g. Serial1) to the printer constructor.  See notes below.

  You may need to edit the PRINTER_FIRMWARE value in Adafruit_Thermal.h
  to match your printer (hold feed button on powerup for test page).
  ------------------------------------------------------------------------*/

#include "Adafruit_Thermal.h"

// image .h files
#include "lq.h"
//#include "kor_q.h"
#include "apple1.h"
#include "pong.h"
#include "emouse.h"
#include "mv.h"


//#include "Altair_8800.h"
//#include "Apple_1.h"
//#include "Apple_2.h"
//#include "HP_150.h"
//#include "HX_20.h"
//#include "mv.h"
//#include "PC5150.h"
//#include "Pong.h"
//#include "Simon.h"
//#include "en_mouse.h"
//#include "intel_4004.h"
//#include "osborn_1.h"



// Here's the new syntax when using SoftwareSerial (e.g. Arduino Uno) ----
// If using hardware serial instead, comment out or remove these lines:

#include "SoftwareSerial.h"
#define TX_PIN 6 // Arduino transmit  YELLOW WIRE  labeled RX on printer
#define RX_PIN 5 // Arduino receive   GREEN WIRE   labeled TX on printer
#define CON_CHECK_TIME 10000 // 10 sec

SoftwareSerial mySerial(RX_PIN, TX_PIN); // Declare SoftwareSerial obj first
Adafruit_Thermal printer(&mySerial);     // Pass addr to printer constructor
// Then see setup() function regarding serial & printer begin() calls.

// Here's the syntax for hardware serial (e.g. Arduino Due) --------------
// Un-comment the following line if using hardware serial:

//Adafruit_Thermal printer(&Serial1);      // Or Serial2, Serial3, etc.

// -----------------------------------------------------------------------

int incomingByte; // a variable to read incoming serial data into
char msg_date[11]; // 10 + null
char msg_binName[67]; // 64 + null * 3(spaces)
char buf[77]; // 10 + 67 (date, binName w spaces), binName has 64 digit max.

boolean newFeed = false;
int dataLength = 0;

unsigned long checkTime = 0;

void setup() {

  // This line is for compatibility with the Adafruit IotP project pack,
  // which uses pin 7 as a spare grounding point.  You only need this if
  // wired up the same way (w/3-pin header into pins 5/6/7):
  pinMode(7, OUTPUT);
  digitalWrite(7, LOW);


  Serial.begin(19200);
  // NOTE: SOME PRINTERS NEED 9600 BAUD instead of 19200, check test page.
  mySerial.begin(19200);  // Initialize SoftwareSerial
  //Serial1.begin(19200); // Use this instead if using hardware serial
  printer.begin();        // Init printer (same regardless of serial type)


  // for random result
  randomSeed(analogRead(0)); // use noise of analogRead(0)

  mySerial.flush();
  printer.flush();

  // The following calls are in setup(), but don't *need* to be.  Use them
  // anywhere!  They're just here so they run one time and are not printed
  // over and over (which would happen if they were in loop() instead).
  // Some functions will feed a line when called, this is normal.

  /*
    // Test inverse on & off
    printer.inverseOn();
    printer.println(F("Inverse ON"));
    printer.inverseOff();

    // Test character double-height on & off
    printer.doubleHeightOn();
    printer.println(F("Double Height ON"));
    printer.doubleHeightOff();

    // Set text justification (right, center, left) -- accepts 'L', 'C', 'R'
    printer.justify('R');
    printer.println(F("Right justified"));
    printer.justify('C');
    printer.println(F("Center justified"));
    printer.justify('L');
    printer.println(F("Left justified"));

    // Test more styles
    printer.boldOn();
    printer.println(F("Bold text"));
    printer.boldOff();

    printer.underlineOn();
    printer.println(F("Underlined text"));
    printer.underlineOff();

    printer.setSize('L');        // Set type size, accepts 'S', 'M', 'L'
    printer.println(F("Large"));
    printer.setSize('M');
    printer.println(F("Medium"));
    printer.setSize('S');
    printer.println(F("Small"));

    printer.justify('C');
    printer.println(F("normal\nline\nspacing"));
    printer.setLineHeight(50);
    printer.println(F("Taller\nline\nspacing"));
    printer.setLineHeight(); // Reset to default
    printer.justify('L');

    // Barcode examples:
    // CODE39 is the most common alphanumeric barcode:
    printer.printBarcode("ADAFRUT", CODE39);
    printer.setBarcodeHeight(100);
    // Print UPC line on product barcodes:
    printer.printBarcode("123456789123", UPC_A);

    // Print the 75x75 pixel logo in adalogo.h:
    printer.printBitmap(adalogo_width, adalogo_height, adalogo_data);

    // Print the 135x135 pixel QR code in adaqrcode.h:
    printer.printBitmap(adaqrcode_width, adaqrcode_height, adaqrcode_data);
    printer.println(F("Adafruit!"));
    printer.feed(2);

    printer.sleep();      // Tell printer to sleep
    delay(3000L);         // Sleep for 3 seconds
    printer.wake();       // MUST wake() before printing again, even if reset
    printer.setDefault(); // Restore printer to defaults

  */

  /* ---- nexon ---- */
  printer.justify('C');
  printer.feed(1);

  while (! Serial); // Wait until Serial is ready - Leonardo
}


void loop() {

  int serialLen = Serial.available();

  if (Serial) {

    if (serialLen == 0 && (millis() - checkTime > CON_CHECK_TIME)) {

      //      Serial.write("k"); // send 'k' to p5js to keep connection
      //      checkTime = millis();

    } else {

      if (Serial.available() > 0) {
        //      Serial.println(serialLen);

        memset(buf, '0', sizeof(buf));
        //      dataLength = Serial.readBytes(buf, 77);
        dataLength = Serial.readBytesUntil('*', buf, 77);
        //      Serial.println(dataLength);

        newFeed = true;

      } else {
        if (newFeed == true && dataLength >= 26 && dataLength < 78) {

          strncpy(msg_date, buf, 10); // 2018/02/19 : date
          msg_date[strlen(msg_date)] = '\0';

          int n = (dataLength - 10) / 16; // char num
          //          printer.println(n);

          char** binNameChar = new char*[n];
          for (int i = 0; i < n; ++i) {
            binNameChar[i] = new char[17];
          }

          for (int i = 0; i < n; i++) {
            strncpy(binNameChar[i], buf + 10 + (i * 17), 16);
            binNameChar[i][16] = '\0';
          }


          // logo
          printer.justify('C');
          printer.printBitmap(lq_width, lq_height, lq_data);

          // QR code
          //          printer.justify('R');
          //          printer.printBitmap(nxc_qr_code_low_width, nxc_qr_code_low_height, nxc_qr_code_low_data);



          // Text
          printer.justify('C');
          printer.setSize('L');
          printer.boldOn();
          printer.println(F("\nMuseum Touch: Play Coding\n")); // 'F' means that string will stay on Flash memory, rather than being copied to SRAM.;
          printer.boldOff();

          // Hello my name is
          printer.println(F("================================")); // 32
          printer.boldOn();
          printer.setSize('L');
          printer.println(F("Hello"));
          printer.setSize('S');
          printer.println(F("my name is"));
          printer.boldOff();

          printer.println(F("================================"));

          // bin name & barcode of it
          printer.setSize('S');
          printer.boldOn();


          
          for (int i = 0; i < n; ++i) {
            for (int k = 0; k < 4; ++k) {
              for (int j = 0; j < 4; ++j) {
                printer.print(binNameChar[i][k * 4 + j]);
              }
              if (k < 3) {
                printer.print(' ');
              } else {
                printer.print('\n');
              }
            }
            //            printer.println(binNameChar[i]);
          }
          printer.boldOff();


          // set temporary
          char firstCharBin[17] = {};
          strncpy(firstCharBin, buf+10, 16);
          firstCharBin[16] = '\0';

          // barcode of first char w/o label - Adafruit_Tehrmal.cpp : comment line 251
          printer.setBarcodeHeight(40);
          printer.printBarcode(firstCharBin, CODE128); // can print 16 digits


          /*================================================================================*/

          // Device Image as random
          int r = (int)random(0, 4);
          //          printer.justify('C');
          //          printer.setSize('L');
          //          printer.println(r);

          switch (r) {
            case 0:
              printer.printBitmap(apple1_width, apple1_height, apple1_data);
              //              printer.printBitmap(emouse_width, emouse_height, emouse_data);
              //              printer.printBitmap(pong_width, pong_height, pong_data);
              //              printer.printBitmap(mv_width, mv_height, mv_data);
              break;

            case 1:
              printer.printBitmap(emouse_width, emouse_height, emouse_data);
              break;

            case 2:
              printer.printBitmap(pong_width, pong_height, pong_data);
              break;

            case 3:
              printer.printBitmap(mv_width, mv_height, mv_data);
              break;

            case 4:
              //              printer.printBitmap(HX_20_width, HX_20_height, HX_20_data);
              //              printer.printBitmap(osborn_1_width, osborn_1_height, osborn_1_data);

              break;

            case 5:
              //              printer.printBitmap(mv_width, mv_height, mv_data);
              //              printer.printBitmap(intel_4004_width, intel_4004_height, intel_4004_data);

              break;

            case 6:
              //                            printer.printBitmap(PC5150_width, PC5150_height, PC5150_data);
              break;

            case 7:
              //                            printer.printBitmap(kor_q_width, kor_q_height, kor_q_data);
              break;

            case 8:
              //              printer.printBitmap(Simon_width, Simon_height, Simon_data);
              break;

            case 9:
              //              printer.printBitmap(en_mouse_width, en_mouse_height, en_mouse_data);
              break;

            case 10:
              //              printer.printBitmap(intel_4004_width, intel_4004_height, intel_4004_data);
              break;

            case 11:
              //              printer.printBitmap(osborn_1_width, osborn_1_height, osborn_1_data);
              break;

            default:
              break;

          }



          // date
          printer.justify('C');
          printer.setSize('S');
          printer.println(F("================================")); // 32
          printer.println(msg_date);
          printer.println(F("================================"));

          // ending line spaces
          printer.feed(3);


          // delete 2D char array
          //Free each sub-array
          for (int i = 0; i < n; ++i) {
            delete[] binNameChar[i];
          }

          //Free the array of pointers
          delete[] binNameChar;

          Serial.flush();
          Serial.write('c'); // send 'c' to p5js to say close session.
          printer.wake();       // MUST wake() before printing again, even if reset

          // reset variable
          dataLength = 0;
          newFeed = false;
          Serial.flush();

        } else {

        }
      }
    }
  }
}
