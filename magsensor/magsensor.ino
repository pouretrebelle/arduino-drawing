#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_LSM303_U.h>

// Assign a unique ID to this sensor
Adafruit_LSM303_Mag_Unified mag = Adafruit_LSM303_Mag_Unified(12345);

// Start a JSON buffer and setup data structure
StaticJsonBuffer<200> jsonBuffer;
JsonObject& root = jsonBuffer.createObject();
JsonObject& magnetic = root.createNestedObject("magnetic");
JsonObject& acceleration = root.createNestedObject("acceleration");

void setup(void) {
  Serial.begin(9600);
  mag.enableAutoRange(true);
}

void loop(void) {
  sensors_event_t event;

  magnetic["x"] = event.magnetic.x;
  magnetic["y"] = event.magnetic.y;
  magnetic["z"] = event.magnetic.z;

  acceleration["x"] = event.acceleration.x;
  acceleration["y"] = event.acceleration.y;
  acceleration["z"] = event.acceleration.z;
  
  root.printTo(Serial);
  Serial.println();
  
  delay(50);
}
