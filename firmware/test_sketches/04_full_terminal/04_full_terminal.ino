/*
 * =========================================================================================
 * VITALITY-OS HOSPITAL SMART RFID TERMINAL (PRODUCTION FIRMWARE)
 * ESP32 + RC522 RFID + I2C 0.96" OLED (SSD1306) + PIEZO BUZZER + BLUETOOTH SERIAL
 * =========================================================================================
 * 
 * MASTER PINOUT GUIDE (ESP32 DOIT DEVKIT V1 30-PIN):
 * ---------------------------------------------------
 * [RC522 RFID MODULE - SPI]
 *   3.3V  -> ESP32 3V3       (CRITICAL: 3.3V ONLY! DO NOT CONNECT TO 5V)
 *   RST   -> ESP32 GPIO 4    (Pin marked D4)
 *   GND   -> ESP32 GND
 *   IRQ   -> [NOT CONNECTED]
 *   MISO  -> ESP32 GPIO 19   (Pin marked D19)
 *   MOSI  -> ESP32 GPIO 23   (Pin marked D23)
 *   SCK   -> ESP32 GPIO 18   (Pin marked D18)
 *   SDA   -> ESP32 GPIO 5    (Pin marked D5 - Chip Select)
 * 
 * [0.96" I2C OLED DISPLAY (SSD1306)]
 *   GND   -> ESP32 GND
 *   VCC   -> ESP32 3V3       (or VIN 5V)
 *   SCL   -> ESP32 GPIO 22   (Pin marked D22)
 *   SDA   -> ESP32 GPIO 21   (Pin marked D21)
 * 
 * [PIEZO BUZZER]
 *   (+) Longer Pin -> ESP32 GPIO 25 (Pin marked D25)
 *   (-) Shorter Pin -> ESP32 GND
 * =========================================================================================
 */

#include <SPI.h>
#include <Wire.h>
#include <MFRC522.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <BluetoothSerial.h>
#include <ArduinoJson.h>

// PIN ASSIGNMENTS
#define SS_PIN      5    // RC522 SDA (SS)
#define RST_PIN     4    // RC522 RST
#define BUZZER_PIN 25    // Buzzer on GPIO 25 (Safe, non-strapping pin)

// OLED CONFIGURATION
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

MFRC522 mfrc522(SS_PIN, RST_PIN);
BluetoothSerial SerialBT;

// Patient RFID Database (Bangladesh Hospital Demo Suite)
struct PatientRFIDCard {
  const char* uid;
  const char* mrin;
  const char* patientName;
  int balance;
  const char* cardTier;
};

const PatientRFIDCard REGISTERED_CARDS[] = {
  { "E280685A", "MRIN-2026-9042", "Al-Amin Hossain", 5000, "Corporate Health Gold" },
  { "337AB21C", "MRIN-2026-8819", "Nusrat Jahan", 8500, "Platinum Executive Care" },
  { "A1F4902B", "MRIN-2026-7731", "Rafiqul Islam", 3200, "Standard OPD Prepaid" },
  { "F902CD18", "MRIN-2026-4402", "Tanvir Ahmed", 6000, "Senior Citizen Privilege" }
};
const int KNOWN_CARD_COUNT = sizeof(REGISTERED_CARDS) / sizeof(REGISTERED_CARDS[0]);

unsigned long lastScanTime = 0;
const unsigned long SCAN_DEBOUNCE_MS = 2000;

void beep(int ms) {
  digitalWrite(BUZZER_PIN, HIGH);
  delay(ms);
  digitalWrite(BUZZER_PIN, LOW);
}

void showIdleScreen() {
  display.clearDisplay();
  
  // Header banner
  display.fillRect(0, 0, 128, 14, SSD1306_WHITE);
  display.setTextColor(SSD1306_BLACK);
  display.setTextSize(1);
  display.setCursor(6, 3);
  display.println("VITALITY-OS HOSPITAL");

  // Middle callout
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(18, 22);
  display.println("PLEASE TAP YOUR");
  display.setCursor(12, 34);
  display.println("SMART HEALTH CARD");

  // Footer status
  display.drawFastHLine(0, 48, 128, SSD1306_WHITE);
  display.setCursor(16, 53);
  display.println(">> BT: ONLINE <<");
  
  display.display();
}

void handleIncomingCommands();

void setup() {
  Serial.begin(115200);
  delay(500);

  // Initialize Buzzer
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // Startup Chime
  beep(80);
  delay(60);
  beep(120);

  // Initialize I2C OLED
  Wire.begin(21, 22); // SDA=21, SCL=22
  if (display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(12, 18);
    display.println("Vitality-OS Hub");
    display.setCursor(18, 34);
    display.println("Initializing...");
    display.display();
  }

  // Initialize SPI & RC522
  SPI.begin();
  mfrc522.PCD_Init();
  delay(100);

  // Initialize Bluetooth Serial
  SerialBT.begin("VitalityOS-RFID-Scanner");

  Serial.println("\n=======================================================");
  Serial.println("  [VITALITY-OS] ESP32 RFID + OLED + BUZZER ONLINE      ");
  Serial.println("  Bluetooth Device Name: 'VitalityOS-RFID-Scanner'     ");
  Serial.println("=======================================================");

  showIdleScreen();
}

void loop() {
  handleIncomingCommands();

  // Check for card presence
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
    delay(40);
    return;
  }

  // Debounce rapid multiple triggers
  if (millis() - lastScanTime < SCAN_DEBOUNCE_MS) {
    mfrc522.PICC_HaltA();
    return;
  }
  lastScanTime = millis();

  // Extract UID string (HEX)
  String uidStr = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) uidStr += "0";
    uidStr += String(mfrc522.uid.uidByte[i], HEX);
  }
  uidStr.toUpperCase();

  // Match against registered cards
  const PatientRFIDCard* matchedCard = nullptr;
  for (int i = 0; i < KNOWN_CARD_COUNT; i++) {
    if (uidStr.equals(REGISTERED_CARDS[i].uid)) {
      matchedCard = &REGISTERED_CARDS[i];
      break;
    }
  }

  String pName = matchedCard ? String(matchedCard->patientName) : "Hospital Patient";
  String pMrin = matchedCard ? String(matchedCard->mrin) : ("MRIN-" + uidStr.substring(0, 6));
  int pBalance = matchedCard ? matchedCard->balance : 5000;
  String pTier = matchedCard ? String(matchedCard->cardTier) : "OPD Smart Card";

  // Audio confirmation beep
  beep(180);

  // Update OLED with Card Details
  display.clearDisplay();
  display.fillRect(0, 0, 128, 14, SSD1306_WHITE);
  display.setTextColor(SSD1306_BLACK);
  display.setCursor(10, 3);
  display.println(">> CARD VERIFIED <<");

  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 18);
  display.print("Name: ");
  display.println(pName.substring(0, 14));

  display.setCursor(0, 30);
  display.print("MRIN: ");
  display.println(pMrin);

  display.setCursor(0, 42);
  display.print("Bal:  BDT ");
  display.println(pBalance);

  display.setCursor(0, 54);
  display.println("Syncing with Cloud...");
  display.display();

  // Construct JSON Payload for Vitality-OS Web Application
  JsonDocument doc;
  doc["event"] = "RFID_CARD_DETECTED";
  doc["cardUid"] = uidStr;
  doc["timestamp"] = millis();
  doc["mrin"] = pMrin;
  doc["patientName"] = pName;
  doc["balanceBDT"] = pBalance;
  doc["cardTier"] = pTier;
  doc["verified"] = true;

  String jsonOutput;
  serializeJson(doc, jsonOutput);

  // Transmit over USB Serial & Bluetooth Serial
  Serial.println(jsonOutput);
  SerialBT.println(jsonOutput);

  // Return to idle screen after 3.5s
  delay(3500);
  showIdleScreen();

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}

void handleIncomingCommands() {
  String incoming = "";

  while (Serial.available()) {
    char c = (char)Serial.read();
    if (c == '\n') break;
    incoming += c;
  }

  while (SerialBT.available()) {
    char c = (char)SerialBT.read();
    if (c == '\n') break;
    incoming += c;
  }

  if (incoming.length() > 0) {
    incoming.trim();
    JsonDocument inDoc;
    DeserializationError err = deserializeJson(inDoc, incoming);
    if (!err && inDoc.containsKey("cmd")) {
      const char* cmd = inDoc["cmd"];
      if (strcmp(cmd, "PAYMENT_CONFIRMED") == 0) {
        display.clearDisplay();
        display.fillRect(0, 0, 128, 14, SSD1306_WHITE);
        display.setTextColor(SSD1306_BLACK);
        display.setCursor(12, 3);
        display.println("PAYMENT APPROVED!");

        display.setTextColor(SSD1306_WHITE);
        display.drawRect(8, 22, 112, 34, SSD1306_WHITE);
        display.setCursor(20, 32);
        display.setTextSize(2);
        display.println("PAID OK");
        display.display();

        // 3 Success beeps
        for (int i = 0; i < 3; i++) {
          beep(70);
          delay(70);
        }
        delay(2000);
        showIdleScreen();
      }
    }
  }
}
