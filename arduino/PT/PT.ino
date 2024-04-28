#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

const char* ssid = "SSID";
const char* password = "password";

String serverHost = "192.168.69.186";
int serverPort = 80;

// Data Sending Time
unsigned long CurrentMillis, PreviousMillis, DataSendingTime = (unsigned long) 1000 * 1;

WebSocketsClient webSocket;

int switch1 = 16; // D0
int switch2 = 5;

#define SELECT_1 D5
#define SELECT_2 D6
#define SELECT_3 D7
#define MUX_PIN A0

float R1 = 100000;
float R2 = 100000;

float inv, ina, outv, outa;

bool clientConnect = false;
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("\n[WSc] Disconnected!\n");
      clientConnect = false;
      break;
    case WStype_CONNECTED: {
        Serial.printf("\n[WSc] Connected to url: %s\n", payload);

        // send message to server when Connected
        webSocket.sendTXT("Connected");
        clientConnect = true;
      }
      break;
    case WStype_TEXT: {

      Serial.printf("\n[WSc] get text: %s\n", payload);

      String msg = (const char *) payload;
      // Dereference and get the integer value
      Serial.println(msg);

      int msgInt = msg.toInt();
      // Serial.println(idStr);

      // int id = idStr.toInt();
      // Serial.println(id);

      if(msgInt == 10 || msgInt == 11 || msgInt == 20 || msgInt == 21) {

        switch(msgInt) {
          
          case 10: {
            Serial.println("Switch 1 off");
            digitalWrite(switch1, 0);
          }
          break;
          case 11: {
            Serial.println("Switch 1 on");
            digitalWrite(switch1, 1);
            
          }
          break;
          case 20: {
            Serial.println("Switch 2 off");
            digitalWrite(switch2, 0);
            
          }
          break;
          case 21: {
            Serial.println("Switch 2 on");
            digitalWrite(switch2, 1);
            
          }
          break;

        }
      }

        
    }

      // send message to server
      // webSocket.sendTXT("message here");
      break;

    case WStype_BIN:
      Serial.printf("\n[WSc] get binary length: %u\n", length);
      hexdump(payload, length);

      // send data to server
      // webSocket.sendBIN(payload, length);
      break;
    case WStype_PING:
      // pong will be send automatically
      Serial.printf("[WSc] get ping\n");
      break;
    case WStype_PONG:
      // answer to a ping we send
      Serial.printf("\n[WSc] get pong\n");
      break;
  }
}

void setup() {

  pinMode(switch1, OUTPUT);
  pinMode(switch2, OUTPUT);

  pinMode(SELECT_1, OUTPUT);
  pinMode(SELECT_2, OUTPUT);
  pinMode(SELECT_3, OUTPUT);

  Serial.begin(115200);
  delay(1000);
  Serial.println("\n\n45h1m\n");
  setup_wifi();

  // server address, port, URL and protocol // URL and Protocol should not be change
  webSocket.begin(serverHost, serverPort);

  // event handler
  webSocket.onEvent(webSocketEvent);

  //	// use HTTP Basic Authorization this is optional remove if not needed
  //  	webSocket.setAuthorization("user", "Password");

  // try ever 5000 again if connection has failed
  webSocket.setReconnectInterval(5000);

  // start heartbeat (optional)
  // ping server every 15000 ms
  // expect pong from server within 3000 ms
  // consider connection disconnected if pong is not received 2 times
  //    webSocket.enableHeartbeat(15000, 3000, 2);
}

void loop() {
  webSocket.loop();

  CurrentMillis = millis();
  if (CurrentMillis - PreviousMillis > DataSendingTime) {
    PreviousMillis = CurrentMillis;

    if (clientConnect) {
      String data = String(random(1, 999999));
      Serial.println("\n\nSending data: " + data);
      // webSocket.sendTXT(data.c_str());
      sendEvent("update", "event_data");
    }
  }
}

float calculateCurrent(float calib = 0) {

  int adc = analogRead(MUX_PIN);
  Serial.println(adc);
  float voltage = adc*5/1023.0;
  Serial.println(voltage);
  float current = (voltage-2.5)/0.185;
  Serial.println(current);
  Serial.println(calib);
  
  Serial.println(current + calib);

  if((current + calib) < 0) return 0;

  return (current + calib)*5000;
}

float calculateVoltage(float calib = 0) {

  int adc_value = analogRead(MUX_PIN);
   
   // Determine voltage at ADC input
   float adc_voltage  = (adc_value * 5.0) / 1024.0; 
   
   // Calculate voltage at divider input
   float voltage = adc_voltage / (R2/(R1+R2)); 
   
   // Print results to Serial Monitor to 2 decimal places
  //  if((voltage + calib) < 0) return 0;

  return voltage + calib;
}


void sendEvent(const char* eventName, const char* eventData) {

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
  ina = calculateCurrent(-0.825);
  delay(5);


  digitalWrite(SELECT_1, 0);
  digitalWrite(SELECT_2, 1);
  digitalWrite(SELECT_3, 0);

  delay(5);
  // outv = calculateVoltage(4.7);
  outv = 12.2;
  delay(5);


  digitalWrite(SELECT_1, 1);
  digitalWrite(SELECT_2, 1);
  digitalWrite(SELECT_3, 0);

  delay(5);
  outa = calculateCurrent(-0.829);
  delay(5);

  // Construct the event message
  DynamicJsonDocument jsonBuffer(256);
  jsonBuffer["event"] = eventName;
  jsonBuffer["inv"] = String(inv);
  jsonBuffer["ina"] = String(ina);
  jsonBuffer["outv"] = String(outv);
  jsonBuffer["outa"] = String(outa);

  String output;
  serializeJson(jsonBuffer, output);
  Serial.println(output);

  // Send the event message
  webSocket.sendTXT(output);
}

void setup_wifi() {
  Serial.print("\nConnecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}