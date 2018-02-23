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
//#include "nxc_qr_code.h"
#include "nxc_qr_code_low.h"
#include "Altair_8800.h"
#include "Apple_1.h"
#include "Apple_2.h"
#include "HP_150.h"
#include "HX_20.h"
//#include "Magnavox.h"
//#include "PC5150.h"
//#include "Pong.h"
//#include "Simon.h"
//#include "en_mouse.h"
#include "intel_4004.h"
#include "logo.h"
//#include "osborn_1.h"
#include "kor_q.h"


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
char msg_binName[65]; // 64 + null
char buf[74]; // 10 + 64 (date, binName), binName has 64 digit max.

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
  printer.feed(3);

  while (! Serial); // Wait until Serial is ready - Leonardo
}


void loop() {

  int serialLen = Serial.available();



  if (Serial) {

    if (serialLen == 0 && (millis() - checkTime > CON_CHECK_TIME)) {

      Serial.write("k"); // send 'k' to p5js to keep connection
      checkTime = millis();

    } else {

      if (Serial.available() > 0) {
        //      Serial.println(serialLen);

        memset(buf, '0', sizeof(buf));
        //      dataLength = Serial.readBytes(buf, 74);
        dataLength = Serial.readBytesUntil('*', buf, 74);
        //      Serial.println(dataLength);

        newFeed = true;

      } else {
        if (newFeed == true && dataLength == 74) {

          strncpy(msg_date, buf, 10); // 2018/02/19 : date
          msg_date[strlen(msg_date)] = '\0';
          strncpy(msg_binName, buf + 10, 64); // 1100011101110100 x 4 (max)
          msg_binName[strlen(msg_binName)] = '\0'; // make last char as a NULL



          // logo
          printer.justify('L');
          printer.printBitmap(logo_width, logo_height, logo_data);

          // QR code
          printer.justify('R');
          printer.printBitmap(nxc_qr_code_low_width, nxc_qr_code_low_height, nxc_qr_code_low_data);

          // Text
          printer.justify('C');
          printer.setSize('M');
          printer.println(F("Museum Touch\n :Play Coding"));

          // Date
          printer.setSize('S');
          printer.println(F("************************************"));
          //        printer.println(dataLength);
          printer.println(msg_date);
          printer.println(F("************************************"));
          //        printer.println(msg_binName);


          // Device Image as random
          int r = (int)random(0, 12);
          printer.justify('C');

          switch (r) {
            case 0:
              printer.printBitmap(Altair_8800_width, Altair_8800_height, Altair_8800_data);
              break;

            case 1:
              printer.printBitmap(Apple_1_width, Apple_1_height, Apple_1_data);
              break;

            case 2:
              printer.printBitmap(Apple_2_width, Apple_2_height, Apple_2_data);
              break;

            case 3:
              printer.printBitmap(HP_150_width, HP_150_height, HP_150_data);
              break;

            case 4:
              printer.printBitmap(HX_20_width, HX_20_height, HX_20_data);
              break;

            case 5:
              //              printer.printBitmap(Magnavox_width, Magnavox_height, Magnavox_data);
              break;

            case 6:
              //              printer.printBitmap(PC5150_width, PC5150_height, PC5150_data);
              break;

            case 7:
              //              printer.printBitmap(Pong_width, Pong_height, Pong_data);
              break;

            case 8:
              //              printer.printBitmap(Simon_width, Simon_height, Simon_data);
              break;

            case 9:
              //              printer.printBitmap(en_mouse_width, en_mouse_height, en_mouse_data);
              break;

            case 10:
              printer.printBitmap(intel_4004_width, intel_4004_height, intel_4004_data);
              break;

            case 11:
              //              printer.printBitmap(osborn_1_width, osborn_1_height, osborn_1_data);
              break;

            default:
              break;

          }


          printer.feed(3);


          // bin name
          printer.justify('C');
          printer.setSize('M');
          printer.println(F("************************************"));
          printer.printBitmap(kor_q_width, kor_q_height, kor_q_data);
          printer.println(F("************************************"));

          printer.setBarcodeHeight(40);
          //          printer.printBarcode(binNameChar[0], CODE128); // can print 16 digits
          //          printer.printBarcode(binNameChar[1], CODE128); // can print 16 digits
          //          printer.printBarcode(binNameChar[2], CODE128); // can print 16 digits
          //          printer.printBarcode(binNameChar[3], CODE128); // can print 16 digits

          printer.feed(2);



          Serial.flush();
          Serial.write("e"); // send 'e' to p5js to say session end.
          printer.wake();       // MUST wake() before printing again, even if reset

          // reset variable
          dataLength = 0;
          newFeed = false;
          Serial.flush();


        }
      }
    }
  }
}
