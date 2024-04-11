#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
const char* ssid = "SSID";
const char* password = "password";
const char* serverAddress = "powertracker-production.up.railway.app";
const int serverPort = 80;
WebSocketsClient webSocket;

void setup() {
    Serial.begin(115200);
    delay(10);
    
    // Connect to Wi-Fi network
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.println("WIFI");
        Serial.print(".");
    }
    Serial.println(WiFi.localIP());
    
    // Connect to WebSocket server
    webSocket.begin(serverAddress, serverPort);
    Serial.println("Socket begin");
    webSocket.onEvent(webSocketEvent);
    Serial.println("END of setup");
}
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case WStype_DISCONNECTED:
            Serial.println("Disconnected from WebSocket server");
            break;
        case WStype_CONNECTED:
            Serial.println("Connected to WebSocket server");
            break;
        case WStype_TEXT:
            Serial.printf("Received message: %s\n", payload);
            break;
        default:
            break;
    }
}
void loop() {
    webSocket.loop();
}
void sendMessage(String message) {
    webSocket.sendTXT(message);
}
