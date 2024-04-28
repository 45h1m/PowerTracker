#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <Adafruit_ADS1X15.h>

Adafruit_ADS1115 ads; 

// const char* ssid = "SSID";
// const char* password = "password";

#define SELECT_1 D5
#define SELECT_2 D6
#define SELECT_3 D7
#define MUX_PIN A0

float inv, ina, outv, outa;

float R1 = 100000;
float R2 = 100000;

void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(9600);
  pinMode(12, OUTPUT);
  pinMode(13, OUTPUT);
  pinMode(14, OUTPUT);
}

float calculateCurrent(float calib = 0) {

  int adc = analogRead(MUX_PIN);
  float voltage = adc*5/1023.0;
  float current = (voltage-2.5)/0.185;

  if((current + calib) < .006) return 0;

  return current + calib;
}

float calculateVoltage(float calib = 0) {

  int adc_value = analogRead(MUX_PIN);
   
   // Determine voltage at ADC input
   float adc_voltage  = (adc_value * 5.0) / 1024.0; 
   
   // Calculate voltage at divider input
   float voltage = adc_voltage / (R2/(R1+R2)); 
   
   // Print results to Serial Monitor to 2 decimal places
   if((voltage + calib) < 0) return 0;

  return voltage + calib;
}

void loop() {
  // read the analog in value:
  digitalWrite(SELECT_1, 0);
  digitalWrite(SELECT_2, 0);
  digitalWrite(SELECT_3, 0);

  delay(5);
  inv = calculateVoltage(4.7);
  delay(5);


  digitalWrite(SELECT_1, 1);
  digitalWrite(SELECT_2, 0);
  digitalWrite(SELECT_3, 0);

  delay(5);
  ina = calculateCurrent(-0.53);
  ina *= 4000;
  delay(5);


  digitalWrite(SELECT_1, 0);
  digitalWrite(SELECT_2, 1);
  digitalWrite(SELECT_3, 0);

  delay(5);
  outv = calculateVoltage(4.7);
  delay(5);


  digitalWrite(SELECT_1, 1);
  digitalWrite(SELECT_2, 1);
  digitalWrite(SELECT_3, 0);

  delay(5);
  outa = calculateCurrent();
  delay(5);

  // Construct the event message
  DynamicJsonDocument jsonBuffer(256);
  jsonBuffer["event"] = "eventName";
  jsonBuffer["inv"] = String(inv);
  jsonBuffer["ina"] = String(ina);
  jsonBuffer["outv"] = String(outv);
  jsonBuffer["outa"] = String(outa);

  String output;
  serializeJson(jsonBuffer, output);
  Serial.println(output);
  delay(500);
}
