#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>

const char* ssid = "SSID";
const char* password = "password";

// MQTT settings
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_topic = "6EF9E8B4-0A6C-4EEC-8949-DEA5A69DE7D9-data";

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsgTime = 0;
const unsigned long interval = 1000;


int switch1 = 16;
int switch2 = 5;

#define SELECT_1 D5
#define SELECT_2 D6
#define SELECT_3 D7
#define MUX_PIN A0

float inv, ina, outv, outa;

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Client")) { // Client ID
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish(mqtt_topic, "ESP8266 connected to HiveMQ");
      // ... and resubscribe
      client.subscribe(mqtt_topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}


void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
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

void sendEvent(const char* eventName = "updateEvent") {

  digitalWrite(SELECT_1, 0);
  digitalWrite(SELECT_2, 0);
  digitalWrite(SELECT_3, 0);

  delay(5);
  inv = analogRead(MUX_PIN);
  delay(5);


  digitalWrite(SELECT_1, 1);
  digitalWrite(SELECT_2, 0);
  digitalWrite(SELECT_3, 0);

  delay(5);
  ina = analogRead(MUX_PIN);
  delay(5);


  digitalWrite(SELECT_1, 0);
  digitalWrite(SELECT_2, 1);
  digitalWrite(SELECT_3, 0);

  delay(5);
  outv = analogRead(MUX_PIN);
  delay(5);


  digitalWrite(SELECT_1, 1);
  digitalWrite(SELECT_2, 1);
  digitalWrite(SELECT_3, 0);

  delay(5);
  outa = analogRead(MUX_PIN);
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

  const char* chars = output.c_str();

  client.publish(mqtt_topic, chars);
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

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long currentMillis = millis();
  if (currentMillis - lastMsgTime >= interval) {
    lastMsgTime = currentMillis;
    // Publish message
    sendEvent();
  }
}