/*
 * TEST 03: RFID-RC522 SPI COMMUNICATION & CARD READ TEST
 * ------------------------------------------------------
 * Purpose: Verify RC522 reader communication, SPI bus pins,
 *          and read the UID of 13.56 MHz RFID cards or key fobs.
 * 
 * Required Library (Arduino Library Manager):
 *   - "MFRC522" by GithubCommunity / Miguel Balboa
 * 
 * Pinout:
 *   - RC522 3.3V  -> ESP32 3V3  (WARNING: 3.3V ONLY! DO NOT USE 5V/VIN!)
 *   - RC522 RST   -> ESP32 D4   (GPIO 4)
 *   - RC522 GND   -> ESP32 GND
 *   - RC522 IRQ   -> [LEAVE DISCONNECTED]
 *   - RC522 MISO  -> ESP32 D19  (GPIO 19)
 *   - RC522 MOSI  -> ESP32 D23  (GPIO 23)
 *   - RC522 SCK   -> ESP32 D18  (GPIO 18)
 *   - RC522 SDA   -> ESP32 D5   (GPIO 5 - Slave Select)
 */

#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN  5   // SDA / SS
#define RST_PIN 4   // RST

MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n=============================================");
  Serial.println("  MFRC522 RFID SPI CARD READER TEST          ");
  Serial.println("=============================================");

  SPI.begin();        // Init SPI bus (Default: SCK=18, MISO=19, MOSI=23)
  mfrc522.PCD_Init(); // Init MFRC522 card
  delay(100);

  // Check reader communication
  Serial.print("Reader Firmware Version: ");
  mfrc522.PCD_DumpVersionToSerial();
  
  byte v = mfrc522.PCD_ReadRegister(mfrc522.VersionReg);
  if (v == 0x00 || v == 0xFF) {
    Serial.println("WARNING: Communication failure! Check wiring (3.3V, GND, MOSI=D23, MISO=D19, SCK=D18, SDA=D5, RST=D4).");
  } else {
    Serial.println("SUCCESS: RC522 connected and responding properly!");
    Serial.println("Ready! Bring a card or keyfob close to the blue antenna...");
  }
}

void loop() {
  // Look for new cards
  if (!mfrc522.PICC_IsNewCardPresent()) {
    delay(50);
    return;
  }

  // Select one of the cards
  if (!mfrc522.PICC_ReadCardSerial()) {
    delay(50);
    return;
  }

  // Read UID
  Serial.println("\n-------------------------------------------");
  Serial.print("[CARD SCANNED] UID (HEX): ");
  String uidStr = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) {
      Serial.print(" 0");
      uidStr += "0";
    } else {
      Serial.print(" ");
    }
    Serial.print(mfrc522.uid.uidByte[i], HEX);
    uidStr += String(mfrc522.uid.uidByte[i], HEX);
  }
  uidStr.toUpperCase();
  Serial.println();
  
  Serial.print("Formatted UID String: ");
  Serial.println(uidStr);

  // Card Type
  MFRC522::PICC_Type piccType = mfrc522.PICC_GetType(mfrc522.uid.sak);
  Serial.print("Card Technology: ");
  Serial.println(mfrc522.PICC_GetTypeName(piccType));
  Serial.println("-------------------------------------------");

  // Halt PICC
  mfrc522.PICC_HaltA();
  // Stop encryption on PCD
  mfrc522.PCD_StopCrypto1();

  delay(1500); // Debounce delay
}
