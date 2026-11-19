/*
 * TEST 01: PIEZO BUZZER & SERIAL TEST
 * -----------------------------------
 * Purpose: Verify ESP32 stability, Serial Monitor connection, and Buzzer output.
 * Pin: 
 *   - Buzzer (+) (Longer pin) -> ESP32 GPIO 25 (Pin marked D25)
 *   - Buzzer (-) (Shorter pin) -> ESP32 GND
 * 
 * Note: We use GPIO 25 instead of GPIO 2 to avoid strapping pin boot-loop issues!
 */

#define BUZZER_PIN 25

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  
  Serial.println("\n=================================");
  Serial.println("  ESP32 BUZZER TEST STARTED       ");
  Serial.println("  Connected to GPIO 25            ");
  Serial.println("=================================");
  
  // Power-on double beep
  digitalWrite(BUZZER_PIN, HIGH);
  delay(100);
  digitalWrite(BUZZER_PIN, LOW);
  delay(100);
  digitalWrite(BUZZER_PIN, HIGH);
  delay(100);
  digitalWrite(BUZZER_PIN, LOW);
}

void loop() {
  Serial.println("[BEEP] Testing buzzer pulse...");
  digitalWrite(BUZZER_PIN, HIGH);
  delay(150);
  digitalWrite(BUZZER_PIN, LOW);
  
  delay(2000); // Wait 2 seconds
}
