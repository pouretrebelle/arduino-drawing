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
JsonObject& status = jsonBuffer.createObject();

bool active = false;
bool switchState = false;
int LED = 6;
int BUTTON = 5;

void setup(void) {
  Serial.begin(9600);

  pinMode(LED, OUTPUT);
  pinMode(BUTTON, INPUT);

  mag.enableAutoRange(true);

  if(!mag.begin()) {
    while(1);
  }
}

void loop(void) {

  if (switchState != digitalRead(BUTTON)) {
    switchState = digitalRead(BUTTON);
    if (switchState == true) {
      active = !active;

      if (active == true) {
        digitalWrite(LED, HIGH);
        status["active"] = true;
      }
      else {
        digitalWrite(LED, LOW);
        status["active"] = false;
      }

      status.printTo(Serial);
      Serial.println();
    }
  }

  sensors_event_t event;
  mag.getEvent(&event);

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
