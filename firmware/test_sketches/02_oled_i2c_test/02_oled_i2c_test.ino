/*
 * TEST 02: I2C SCANNER & 0.96" OLED DISPLAY TEST (SSD1306)
 * --------------------------------------------------------
 * Purpose: Scan I2C bus to confirm OLED address (typically 0x3C)
 *          and render text & graphics to verify the screen.
 * 
 * Required Libraries (Arduino Library Manager):
 *   1. "Adafruit SSD1306" by Adafruit
 *   2. "Adafruit GFX Library" by Adafruit
 * 
 * Pinout:
 *   - OLED GND -> ESP32 GND
 *   - OLED VCC -> ESP32 3V3 (or VIN 5V)
 *   - OLED SCL -> ESP32 D22 (GPIO 22)
 *   - OLED SDA -> ESP32 D21 (GPIO 21)
 */

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define I2C_SDA 21
#define I2C_SCL 22

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
int counter = 0;
byte foundAddress = 0;

void scanI2C() {
  Serial.println("\n--- Scanning I2C Bus on GPIO 21 (SDA) / GPIO 22 (SCL) ---");
  byte count = 0;
  for (byte i = 1; i < 127; i++) {
    Wire.beginTransmission(i);
    if (Wire.endTransmission() == 0) {
      Serial.print("SUCCESS: Found I2C device at 0x");
      if (i < 16) Serial.print("0");
      Serial.println(i, HEX);
      foundAddress = i;
      count++;
    }
  }
  if (count == 0) {
    Serial.println("ERROR: No I2C devices found! Check GND, VCC, SDA (D21), and SCL (D22) wiring.");
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("OLED Test & I2C Scanner starting...");

  Wire.begin(I2C_SDA, I2C_SCL);
  scanI2C();

  byte addr = foundAddress != 0 ? foundAddress : 0x3C;
  if (!display.begin(SSD1306_SWITCHCAPVCC, addr)) {
    Serial.print("ERROR: SSD1306 initialization failed at 0x");
    Serial.println(addr, HEX);
    Serial.println("Retrying with 0x3D...");
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3D)) {
      Serial.println("Could not initialize OLED display. Halting.");
      while (true) delay(1000);
    }
  }

  Serial.println("OLED successfully initialized!");
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(10, 8);
  display.println("VITALITY-OS TERMINAL");
  display.drawFastHLine(0, 20, 128, SSD1306_WHITE);
  display.setCursor(15, 28);
  display.println("OLED DISPLAY: OK");
  display.setCursor(15, 42);
  display.print("I2C ADDR: 0x");
  display.println(addr, HEX);
  display.display();
  delay(2000);
}

void loop() {
  display.clearDisplay();
  
  // Header Box
  display.fillRect(0, 0, 128, 14, SSD1306_WHITE);
  display.setTextColor(SSD1306_BLACK);
  display.setCursor(8, 3);
  display.setTextSize(1);
  display.println("HOSPITAL SMART HUB");

  // Body Text
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(4, 20);
  display.println("Status: ONLINE");
  
  display.setCursor(4, 32);
  display.print("Heartbeat: ");
  display.print(counter);
  display.println("s");

  display.setCursor(4, 46);
  display.println("RFID Waiting: READY");

  // Bottom Border
  display.drawFastHLine(0, 62, 128, SSD1306_WHITE);
  display.display();

  Serial.print("OLED active - Uptime: ");
  Serial.print(counter);
  Serial.println("s");

  counter++;
  delay(1000);
}
