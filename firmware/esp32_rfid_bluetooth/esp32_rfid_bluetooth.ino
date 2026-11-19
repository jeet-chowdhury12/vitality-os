/*
 * =========================================================================================
 * VITALITY-OS HOSPITAL SMART TERMINAL
 * ESP32 + RC522 RFID + I2C 0.96" OLED (SSD1306) + PIEZO BUZZER + BLUETOOTH
 * =========================================================================================
 */

#include <SPI.h>
#include <Wire.h>
#include <MFRC522.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <BluetoothSerial.h>
#include <ArduinoJson.h>

// PIN CONFIGURATION
#define SS_PIN 5      // RC522 SDA (SS)
#define RST_PIN 4     // RC522 RST (GPIO 4 avoids conflict with I2C SCL on GPIO 22)
#define BUZZER_PIN 25 // Piezo Buzzer (+) on GPIO 25 (avoid GPIO 2 strapping pin conflict)

// OLED DISPLAY (I2C on GPIO 21 SDA / GPIO 22 SCL)
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

MFRC522 mfrc522(SS_PIN, RST_PIN);
BluetoothSerial SerialBT;

// Known Hospital Patient RFID Database
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
const unsigned long SCAN_DEBOUNCE_MS = 1500;

void beep(int ms) {
  digitalWrite(BUZZER_PIN, HIGH);
  delay(ms);
  digitalWrite(BUZZER_PIN, LOW);
}

void showIdleScreen() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(14, 4);
  display.println("VITALITY-OS HOSPITAL");
  display.drawFastHLine(0, 15, 128, SSD1306_WHITE);

  display.setCursor(20, 24);
  display.setTextSize(1);
  display.println("PLEASE TAP YOUR");
  display.setCursor(16, 36);
  display.setTextSize(1);
  display.println("SMART HEALTH CARD");

  display.setCursor(12, 52);
  display.setTextSize(1);
  display.println(">> BT: ONLINE <<");
  display.display();
}

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // Initialize I2C and OLED
  Wire.begin(21, 22);  // SDA = 21, SCL = 22
  if (display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(10, 20);
    display.println("Booting Vitality-OS");
    display.setCursor(25, 34);
    display.println("Terminal...");
    display.display();
  }

  // Initialize SPI bus & RC522 Reader
  SPI.begin();
  mfrc522.PCD_Init();
  delay(100);

  // Initialize Bluetooth Serial
  SerialBT.begin("VitalityOS-RFID-Scanner");

  Serial.println("\n=======================================================");
  Serial.println("  [VITALITY-OS] ESP32 RFID + OLED + BUZZER ONLINE      ");
  Serial.println("  Bluetooth Device Name: 'VitalityOS-RFID-Scanner'     ");
  Serial.println("=======================================================");

  // Boot beep melody
  beep(80);
  delay(60);
  beep(120);

  showIdleScreen();
}

void loop() {
  handleIncomingCommands();

  // Check for new RFID Card Tap
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

  // Extract UID string (HEX Uppercase)
  String uidStr = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) uidStr += "0";
    uidStr += String(mfrc522.uid.uidByte[i], HEX);
  }
  uidStr.toUpperCase();

  // Match registered card
  const PatientRFIDCard* matchedCard = nullptr;
  for (int i = 0; i < KNOWN_CARD_COUNT; i++) {
    if (uidStr.equals(REGISTERED_CARDS[i].uid)) {
      matchedCard = &REGISTERED_CARDS[i];
      break;
    }
  }

  String pName = matchedCard ? String(matchedCard->patientName) : "Hospital Card";
  String pMrin = matchedCard ? String(matchedCard->mrin) : "MRIN-2026-GUEST";
  int pBalance = matchedCard ? matchedCard->balance : 5000;
  String pTier = matchedCard ? String(matchedCard->cardTier) : "Standard OPD";

  // Audio confirmation beep
  beep(180);

  // Update OLED with Card Details
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 2);
  display.println(">> CARD DETECTED <<");
  display.drawFastHLine(0, 13, 128, SSD1306_WHITE);

  display.setCursor(0, 18);
  display.print("Name: ");
  display.println(pName.substring(0, 14));

  display.setCursor(0, 30);
  display.print("MRIN: ");
  display.println(pMrin);

  display.setCursor(0, 42);
  display.print("Bal:  ");
  display.print("BDT ");
  display.println(pBalance);

  display.setCursor(0, 54);
  display.println("Processing Payment...");
  display.display();

  // Construct JSON Payload for Web Application
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

  // Transmit over USB Serial and Bluetooth Serial
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
        display.setTextSize(1);
        display.setCursor(14, 10);
        display.println("PAYMENT APPROVED!");
        display.drawRect(8, 26, 112, 28, SSD1306_WHITE);
        display.setCursor(20, 36);
        display.setTextSize(2);
        display.println("PAID OK");
        display.display();

        // 3 Success beeps
        for (int i = 0; i < 3; i++) {
          beep(80);
          delay(80);
        }
        delay(2000);
        showIdleScreen();
      }
    }
  }
}
