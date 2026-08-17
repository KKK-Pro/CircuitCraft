const db = require("./db");


const components = [

    {
        id: "esp32",
        name: "ESP32 DevKit V1",
        category: "Microcontroller",
        price: 450,
        operating_voltage: "3.3V",
        input_voltage: "5V",
        gpio: 30,
        wifi: 1,
        bluetooth: 1,
        purpose:
            "Main controller for IoT, robotics and embedded projects.",
        warning: null,
        alternatives: [
            "Arduino Uno",
            "Raspberry Pi Pico W"
        ],
        alternativeIds: [
            "arduinoUno"
        ]
    },


    {
        id: "arduinoUno",
        name: "Arduino Uno",
        category: "Microcontroller",
        price: 550,
        operating_voltage: "5V",
        input_voltage: "7V - 12V",
        gpio: 20,
        wifi: 0,
        bluetooth: 0,
        purpose:
            "Beginner-friendly microcontroller for electronics projects.",
        warning: null,
        alternatives: [
            "ESP32 DevKit V1"
        ],
        alternativeIds: [
            "esp32"
        ]
    },


    {
        id: "l298n",
        name: "L298N Motor Driver",
        category: "Motor Driver",
        price: 180,
        operating_voltage: "5V",
        motor_voltage: "5V - 35V",
        channels: 2,
        purpose:
            "Controls two DC motors including direction and speed.",
        warning: null,
        alternatives: [
            "TB6612FNG"
        ],
        alternativeIds: [
            "tb6612"
        ]
    },


    {
        id: "tb6612",
        name: "TB6612FNG Motor Driver",
        category: "Motor Driver",
        price: 300,
        operating_voltage: "2.7V - 5.5V",
        channels: 2,
        purpose:
            "Efficient dual motor driver with lower voltage loss than L298N.",
        warning: null,
        alternatives: [
            "L298N"
        ],
        alternativeIds: [
            "l298n"
        ]
    },


    {
        id: "hcsr04",
        name: "HC-SR04 Ultrasonic Sensor",
        category: "Sensor",
        price: 90,
        operating_voltage: "5V",
        purpose:
            "Measures distance and detects obstacles.",
        warning:
            "Echo can output approximately 5V. Use a voltage divider or level shifter before an ESP32 GPIO.",
        alternatives: [
            "VL53L0X ToF Sensor"
        ],
        alternativeIds: [
            "vl53l0x"
        ]
    },


    {
        id: "vl53l0x",
        name: "VL53L0X ToF Distance Sensor",
        category: "Sensor",
        price: 220,
        operating_voltage:
            "2.6V - 5.5V module dependent",
        communication: "I2C",
        purpose:
            "Measures distance using time-of-flight sensing.",
        warning: null,
        alternatives: [
            "HC-SR04"
        ],
        alternativeIds: [
            "hcsr04"
        ]
    },


    {
        id: "dht22",
        name:
            "DHT22 Temperature & Humidity Sensor",
        category: "Sensor",
        price: 280,
        operating_voltage: "3.3V - 5V",
        purpose:
            "Measures temperature and humidity.",
        warning: null,
        alternatives: [
            "DHT11",
            "BME280"
        ],
        alternativeIds: []
    },


    {
        id: "oled",
        name: "0.96 inch OLED Display",
        category: "Display",
        price: 180,
        operating_voltage: "3.3V - 5V",
        communication: "I2C",
        purpose:
            "Displays sensor values, status information and project output.",
        warning: null,
        alternatives: [
            "1.3 inch OLED",
            "16x2 LCD"
        ],
        alternativeIds: []
    },


    {
        id: "irSensor",
        name: "IR Line Tracking Sensor",
        category: "Sensor",
        price: 80,
        operating_voltage: "3.3V - 5V",
        purpose:
            "Detects contrasting surfaces for line-following robots.",
        warning: null,
        alternatives: [],
        alternativeIds: []
    },


    {
        id: "buzzer",
        name: "Active Buzzer Module",
        category: "Output",
        price: 60,
        operating_voltage: "3.3V - 5V",
        purpose:
            "Provides audible alerts and status feedback.",
        warning: null,
        alternatives: [],
        alternativeIds: []
    },


    {
        id: "pir",
        name: "PIR Motion Sensor",
        category: "Sensor",
        price: 120,
        operating_voltage: "5V module supply",
        purpose:
            "Detects human motion for security and automation projects.",
        warning: null,
        alternatives: [],
        alternativeIds: []
    },


    {
        id: "relay1",
        name: "1-Channel Relay Module",
        category: "Switching",
        price: 110,
        operating_voltage: "5V",
        purpose:
            "Switches a load using a controller signal.",
        warning:
            "Relay modules differ in trigger voltage. Verify that the selected module accepts 3.3V ESP32 logic.",
        alternatives: [],
        alternativeIds: []
    },


    {
        id: "soilSensor",
        name:
            "Capacitive Soil Moisture Sensor",
        category: "Sensor",
        price: 180,
        operating_voltage: "3.3V - 5V",
        purpose:
            "Measures relative soil moisture for irrigation projects.",
        warning: null,
        alternatives: [],
        alternativeIds: []
    },


    {
        id: "waterPump",
        name: "Mini DC Water Pump",
        category: "Actuator",
        price: 250,
        operating_voltage:
            "5V - 12V model dependent",
        purpose:
            "Moves water in irrigation and small automation systems.",
        warning:
            "Do not drive a pump directly from a microcontroller GPIO. Use a suitable relay or transistor/MOSFET driver.",
        alternatives: [],
        alternativeIds: []
    },


    {
        id: "hc05",
        name: "HC-05 Bluetooth Module",
        category: "Wireless",
        price: 280,
        operating_voltage: "5V module supply",
        purpose:
            "Adds classic Bluetooth serial control.",
        warning:
            "Verify serial logic levels before direct connection.",
        alternatives: [],
        alternativeIds: []
    },


    {
        id: "boMotor",
        name: "BO DC Gear Motor",
        category: "Motor",
        price: 150,
        operating_voltage: "3V - 12V",
        purpose:
            "Provides mechanical movement for small robots.",
        warning: null,
        alternatives: [
            "N20 Gear Motor",
            "TT Gear Motor"
        ],
        alternativeIds: []
    },


    {
        id: "wheel",
        name: "Robot Wheel",
        category: "Mechanical",
        price: 100,
        purpose:
            "Connects to geared motors to provide movement.",
        warning: null,
        alternatives: [],
        alternativeIds: []
    },


    {
        id: "chassis",
        name: "2WD Robot Chassis",
        category: "Mechanical",
        price: 250,
        purpose:
            "Provides the mechanical frame for a small mobile robot.",
        warning: null,
        alternatives: [],
        alternativeIds: []
    },


    {
        id: "battery74",
        name: "7.4V Li-ion Battery Pack",
        category: "Power",
        price: 450,
        voltage: "7.4V",
        purpose:
            "Provides portable power for robotics projects.",
        warning: null,
        alternatives: [
            "2S Li-ion Pack"
        ],
        alternativeIds: []
    },


    {
        id: "lm2596",
        name: "LM2596 Buck Converter",
        category: "Power",
        price: 120,
        input_voltage: "4V - 40V",
        purpose:
            "Steps a higher battery voltage down to a regulated output.",
        warning: null,
        alternatives: [
            "MP1584"
        ],
        alternativeIds: []
    },


    {
        id: "breadboard",
        name: "Breadboard",
        category: "Prototyping",
        price: 120,
        purpose:
            "Allows temporary circuit construction without soldering.",
        warning: null,
        alternatives: [],
        alternativeIds: []
    },


    {
        id: "jumperWires",
        name: "Jumper Wire Set",
        category: "Prototyping",
        price: 100,
        purpose:
            "Used to connect boards, sensors and modules.",
        warning: null,
        alternatives: [],
        alternativeIds: []
    }

];


const insertComponent = db.prepare(`

    INSERT OR REPLACE INTO components (

        id,
        name,
        category,
        price,

        operating_voltage,
        input_voltage,
        motor_voltage,
        voltage,

        gpio,
        channels,
        communication,

        wifi,
        bluetooth,

        purpose,
        warning,

        alternatives_json,
        alternative_ids_json

    )

    VALUES (

        @id,
        @name,
        @category,
        @price,

        @operating_voltage,
        @input_voltage,
        @motor_voltage,
        @voltage,

        @gpio,
        @channels,
        @communication,

        @wifi,
        @bluetooth,

        @purpose,
        @warning,

        @alternatives_json,
        @alternative_ids_json

    )

`);


const seedDatabase =
    db.transaction(() => {

        components.forEach(component => {

            insertComponent.run({

                id:
                    component.id,

                name:
                    component.name,

                category:
                    component.category,

                price:
                    component.price || 0,

                operating_voltage:
                    component.operating_voltage || null,

                input_voltage:
                    component.input_voltage || null,

                motor_voltage:
                    component.motor_voltage || null,

                voltage:
                    component.voltage || null,

                gpio:
                    component.gpio || null,

                channels:
                    component.channels || null,

                communication:
                    component.communication || null,

                wifi:
                    component.wifi || 0,

                bluetooth:
                    component.bluetooth || 0,

                purpose:
                    component.purpose || null,

                warning:
                    component.warning || null,

                alternatives_json:
                    JSON.stringify(
                        component.alternatives || []
                    ),

                alternative_ids_json:
                    JSON.stringify(
                        component.alternativeIds || []
                    )

            });

        });

    });


seedDatabase();


console.log("");
console.log(
    "CircuitCraft component database seeded."
);

console.log(
    `Components inserted: ${components.length}`
);

console.log("");