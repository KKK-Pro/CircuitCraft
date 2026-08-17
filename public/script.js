let componentDatabase = {};

const buildButton =
    document.getElementById("buildButton");

const projectInput =
    document.getElementById("projectInput");

const resultsSection =
    document.getElementById("resultsSection");

const componentResults =
    document.getElementById("componentResults");

const totalCost =
    document.getElementById("totalCost");

const projectTitle =
    document.getElementById("projectTitle");

const projectSummary =
    document.getElementById("projectSummary");

const componentCount =
    document.getElementById("componentCount");

const compatibilityResults =
    document.getElementById("compatibilityResults");

const pinPlannerResults =
    document.getElementById("pinPlannerResults");

const addComponentSelect =
    document.getElementById("addComponentSelect");

const addComponentButton =
    document.getElementById("addComponentButton");

const copyBomButton =
    document.getElementById("copyBomButton");

const resetProjectButton =
    document.getElementById("resetProjectButton");


let currentProjectComponents = [];

let currentProjectName =
    "Custom Electronics Project";

initializeApp();
async function initializeApp() {

    try {

        buildButton.disabled = true;

        buildButton.innerHTML = `
            <span>Loading Components...</span>
        `;


        const response =
            await fetch("/api/components");


        if (!response.ok) {

            throw new Error(
                "Could not load component database."
            );

        }


        const data =
            await response.json();


        if (
            !data.success ||
            !Array.isArray(data.components)
        ) {

            throw new Error(
                "Invalid component data received."
            );

        }


        /*
        Convert database array into:

        {
            esp32: {...},
            l298n: {...},
            oled: {...}
        }
        */

        componentDatabase = {};


        data.components.forEach(
            function(component) {

                componentDatabase[
                    component.id
                ] = component;

            }
        );


        console.log(
            "CircuitCraft database loaded:",
            data.count,
            "components"
        );


        populateAddComponentSelect();

        wireExampleButtons();


        buildButton.disabled =
            false;


        buildButton.innerHTML = `
            <span>Build My Project</span>
            <span aria-hidden="true">→</span>
        `;

    }

    catch (error) {

        console.error(
            "CircuitCraft initialization error:",
            error
        );


        buildButton.disabled =
            true;


        buildButton.innerHTML = `
            <span>Database Loading Failed</span>
        `;


        alert(
            "CircuitCraft could not load the component database. Make sure the Node.js server is running."
        );

    }

}


/* =========================================================
   BUILD PROJECT
========================================================= */

buildButton.addEventListener("click", function () {

    const rawProject =
        projectInput.value.trim();


    if (rawProject === "") {

        alert(
            "Please describe the project you want to build."
        );

        projectInput.focus();

        return;
    }


    const result =
        identifyProject(rawProject);


    currentProjectName =
        result.name;


    currentProjectComponents =
        result.components;


    renderProject();


    resultsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});


/* =========================================================
   QUICK EXAMPLES
========================================================= */

function wireExampleButtons() {

    document
        .querySelectorAll("[data-example]")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    projectInput.value =
                        button.dataset.example;

                    document
                        .getElementById("builder")
                        .scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    projectInput.focus();
                }
            );

        });

}


/* =========================================================
   PROJECT IDENTIFICATION
========================================================= */

function identifyProject(projectText) {

    const project =
        projectText.toLowerCase();


    const components = [];


    /*
    Controller choice
    */

    const usingArduino =
        project.includes("arduino");


    addOrIncrease(
        components,
        usingArduino
            ? "arduinoUno"
            : "esp32",
        1
    );


    /*
    ROBOTICS
    */

    const isRobot =
        project.includes("robot") ||
        project.includes("car");


    if (isRobot) {

        addOrIncrease(
            components,
            "l298n",
            1
        );

        addOrIncrease(
            components,
            "boMotor",
            2
        );

        addOrIncrease(
            components,
            "wheel",
            2
        );

        addOrIncrease(
            components,
            "chassis",
            1
        );

        addOrIncrease(
            components,
            "battery74",
            1
        );

        addOrIncrease(
            components,
            "lm2596",
            1
        );

        addOrIncrease(
            components,
            "jumperWires",
            1
        );
    }


    /*
    OBSTACLE / DISTANCE
    */

    if (
        project.includes("obstacle") ||
        project.includes("avoid") ||
        project.includes("distance") ||
        project.includes("ultrasonic")
    ) {

        addOrIncrease(
            components,
            "hcsr04",
            1
        );
    }


    /*
    LINE FOLLOWER
    */

    if (
        project.includes("line follow") ||
        project.includes("line-follow") ||
        (
            project.includes("line") &&
            project.includes("sensor")
        ) ||
        project.includes("ir sensor")
    ) {

        let count = 3;


        if (
            project.includes("2 ir")
        ) {
            count = 2;
        }


        if (
            project.includes("4 ir")
        ) {
            count = 4;
        }


        addOrIncrease(
            components,
            "irSensor",
            count
        );
    }


    /*
    TEMPERATURE / WEATHER
    */

    if (
        project.includes("temperature") ||
        project.includes("humidity") ||
        project.includes("weather")
    ) {

        addOrIncrease(
            components,
            "dht22",
            1
        );

        addOrIncrease(
            components,
            "breadboard",
            1
        );

        addOrIncrease(
            components,
            "jumperWires",
            1
        );
    }


    /*
    OLED / DISPLAY
    */

    if (
        project.includes("oled") ||
        project.includes("display") ||
        project.includes("screen")
    ) {

        addOrIncrease(
            components,
            "oled",
            1
        );
    }


    /*
    BUZZER / ALARM
    */

    if (
        project.includes("buzzer") ||
        project.includes("alarm") ||
        project.includes("sound")
    ) {

        addOrIncrease(
            components,
            "buzzer",
            1
        );
    }


    /*
    SECURITY / PIR
    */

    if (
        project.includes("pir") ||
        project.includes("motion") ||
        project.includes("security")
    ) {

        addOrIncrease(
            components,
            "pir",
            1
        );

        addOrIncrease(
            components,
            "buzzer",
            1
        );

        addOrIncrease(
            components,
            "breadboard",
            1
        );

        addOrIncrease(
            components,
            "jumperWires",
            1
        );
    }


    /*
    IRRIGATION
    */

    if (
        project.includes("irrigation") ||
        project.includes("soil moisture") ||
        project.includes("watering")
    ) {

        addOrIncrease(
            components,
            "soilSensor",
            1
        );

        addOrIncrease(
            components,
            "relay1",
            1
        );

        addOrIncrease(
            components,
            "waterPump",
            1
        );

        addOrIncrease(
            components,
            "breadboard",
            1
        );

        addOrIncrease(
            components,
            "jumperWires",
            1
        );
    }


    /*
    RELAY / HOME AUTOMATION
    */

    if (
        project.includes("relay") ||
        project.includes("home automation") ||
        project.includes("smart light")
    ) {

        addOrIncrease(
            components,
            "relay1",
            1
        );

        addOrIncrease(
            components,
            "breadboard",
            1
        );

        addOrIncrease(
            components,
            "jumperWires",
            1
        );
    }


    /*
    BLUETOOTH
    */

    if (
        project.includes("bluetooth") &&
        usingArduino
    ) {

        addOrIncrease(
            components,
            "hc05",
            1
        );
    }


    /*
    Generic prototype support.
    */

    if (
        components.length === 1
    ) {

        addOrIncrease(
            components,
            "breadboard",
            1
        );

        addOrIncrease(
            components,
            "jumperWires",
            1
        );
    }


    return {
        name:
            createProjectName(projectText),

        components:
            components
    };
}


function createProjectName(projectText) {

    const project =
        projectText.toLowerCase();


    if (
        project.includes("line") &&
        project.includes("robot")
    ) {
        return "Line Following Robot";
    }


    if (
        project.includes("obstacle") &&
        project.includes("robot")
    ) {
        return "Obstacle Avoiding Robot";
    }


    if (
        project.includes("irrigation")
    ) {
        return "Smart Irrigation System";
    }


    if (
        project.includes("temperature") ||
        project.includes("weather")
    ) {
        return "Temperature & Humidity Monitor";
    }


    if (
        project.includes("security") ||
        project.includes("motion")
    ) {
        return "Motion Security System";
    }


    if (
        project.includes("bluetooth") &&
        project.includes("robot")
    ) {
        return "Bluetooth Controlled Robot";
    }


    return "Custom Electronics Project";
}


/* =========================================================
   PROJECT STATE HELPERS
========================================================= */

function addOrIncrease(
    list,
    componentId,
    quantity
) {

    const existing =
        list.find(function(item) {
            return item.componentId === componentId;
        });


    if (existing) {

        existing.quantity += quantity;

        return;
    }


    list.push({
        componentId:
            componentId,

        quantity:
            quantity
    });
}


function getComponentById(componentId) {

    return (
        Object
            .values(componentDatabase)
            .find(function(component) {
                return component.id === componentId;
            })
        || null
    );
}


/* =========================================================
   RENDER WHOLE PROJECT
========================================================= */

function renderProject() {

    resultsSection.style.display =
        "block";


    projectTitle.textContent =
        currentProjectName;


    renderComponents();

    runCompatibilityCheck();

    generatePinPlan();

}


/* =========================================================
   COMPONENT CARDS
========================================================= */

function renderComponents() {

    componentResults.innerHTML =
        "";


    let total =
        0;


    let totalUnits =
        0;


    currentProjectComponents
        .forEach(function(item, index) {

            const component =
                getComponentById(
                    item.componentId
                );


            if (!component) {
                return;
            }


            const subtotal =
                component.price *
                item.quantity;


            total +=
                subtotal;


            totalUnits +=
                item.quantity;


            const card =
                document.createElement("article");


            card.className =
                "component-card";


            const alternatives =
                createAlternativeUI(
                    component,
                    index
                );


            const warningHTML =
                component.warning
                    ? `
                        <div class="warning">
                            ⚠ ${component.warning}
                        </div>
                    `
                    : "";


            const alternativeText =
                component.alternatives &&
                component.alternatives.length > 0
                    ? `
                        <p class="alternative-text">
                            <strong>Known alternatives:</strong>
                            ${component.alternatives.join(", ")}
                        </p>
                    `
                    : "";


            card.innerHTML = `

                <div class="component-card-top">

                    <h4>
                        ${component.name}
                    </h4>

                    <span class="category-tag">
                        ${component.category}
                    </span>

                </div>


                <div class="component-meta">

                    <div class="meta-item">
                        <span>Unit price</span>
                        <strong>
                            ₹${component.price}
                        </strong>
                    </div>

                    <div class="meta-item">
                        <span>Subtotal</span>
                        <strong>
                            ₹${subtotal}
                        </strong>
                    </div>

                </div>


                <p class="component-purpose">
                    <strong>Purpose:</strong>
                    ${component.purpose}
                </p>


                ${alternativeText}

                ${warningHTML}


                <div class="component-actions">

                    <div class="quantity-control">

                        <button
                            type="button"
                            onclick="changeQuantity(${index}, -1)"
                            aria-label="Decrease quantity">
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            onclick="changeQuantity(${index}, 1)"
                            aria-label="Increase quantity">
                            +
                        </button>

                    </div>


                    ${alternatives}


                    <button
                        type="button"
                        class="danger-button"
                        onclick="removeComponent(${index})">
                        Remove
                    </button>

                </div>

            `;


            componentResults
                .appendChild(card);

        });


    totalCost.textContent =
        "₹" + total;


    componentCount.textContent =
        totalUnits +
        (
            totalUnits === 1
                ? " item"
                : " items"
        );


    projectSummary.textContent =
        currentProjectComponents.length +
        " component types • " +
        totalUnits +
        " total units";

}


function createAlternativeUI(
    component,
    index
) {

    if (
        !component.alternativeIds ||
        component.alternativeIds.length === 0
    ) {
        return "";
    }


    let options =
        "";


    component.alternativeIds
        .forEach(function(alternativeId) {

            const alternative =
                getComponentById(
                    alternativeId
                );


            if (!alternative) {
                return;
            }


            options += `
                <option value="${alternative.id}">
                    ${alternative.name} - ₹${alternative.price}
                </option>
            `;

        });


    if (options === "") {
        return "";
    }


    return `
        <div class="replace-box">

            <select
                class="alternative-select"
                id="alternative-${index}"
                aria-label="Alternative component">
                ${options}
            </select>

            <button
                type="button"
                class="replace-button"
                onclick="replaceComponent(${index})">
                Replace
            </button>

        </div>
    `;
}


/* =========================================================
   COMPONENT EDITING
========================================================= */

function replaceComponent(index) {

    const select =
        document.getElementById(
            `alternative-${index}`
        );


    if (!select) {
        return;
    }


    const newComponent =
        getComponentById(
            select.value
        );


    if (!newComponent) {

        alert(
            "The selected alternative was not found."
        );

        return;
    }


    currentProjectComponents[index].componentId =
        newComponent.id;


    mergeDuplicateComponents();

    renderProject();
}


function changeQuantity(
    index,
    delta
) {

    const item =
        currentProjectComponents[index];


    if (!item) {
        return;
    }


    item.quantity +=
        delta;


    if (
        item.quantity <= 0
    ) {

        currentProjectComponents
            .splice(index, 1);

    }


    renderProject();
}


function removeComponent(index) {

    currentProjectComponents
        .splice(index, 1);


    renderProject();
}


function mergeDuplicateComponents() {

    const merged =
        [];


    currentProjectComponents
        .forEach(function(item) {

            addOrIncrease(
                merged,
                item.componentId,
                item.quantity
            );

        });


    currentProjectComponents =
        merged;
}


/* =========================================================
   ADD COMPONENT
========================================================= */

function populateAddComponentSelect() {

    const components =
        Object
            .values(componentDatabase)
            .sort(function(a, b) {

                if (
                    a.category ===
                    b.category
                ) {

                    return a.name.localeCompare(
                        b.name
                    );
                }


                return a.category.localeCompare(
                    b.category
                );

            });


    addComponentSelect.innerHTML =
        '<option value="">Select a component...</option>';


    components
        .forEach(function(component) {

            const option =
                document.createElement("option");


            option.value =
                component.id;


            option.textContent =
                `${component.category} — ${component.name} — ₹${component.price}`;


            addComponentSelect
                .appendChild(option);

        });

}


addComponentButton
    .addEventListener(
        "click",
        function() {

            const componentId =
                addComponentSelect.value;


            if (!componentId) {

                alert(
                    "Select a component to add."
                );

                return;
            }


            addOrIncrease(
                currentProjectComponents,
                componentId,
                1
            );


            addComponentSelect.value =
                "";


            renderProject();

        }
    );


/* =========================================================
   COMPATIBILITY CHECK
========================================================= */

function runCompatibilityCheck() {

    compatibilityResults.innerHTML =
        "";


    const ids =
        currentProjectComponents
            .map(function(item) {
                return item.componentId;
            });


    const checks =
        [];


    /*
    ESP32 + HC-SR04
    */

    if (
        ids.includes("esp32") &&
        ids.includes("hcsr04")
    ) {

        checks.push({
            type: "warning",
            title: "ESP32 + HC-SR04",
            message:
                "HC-SR04 Echo can be approximately 5V while ESP32 GPIO uses 3.3V logic. Add a voltage divider or suitable level shifter on Echo."
        });
    }


    /*
    ESP32 + VL53L0X
    */

    if (
        ids.includes("esp32") &&
        ids.includes("vl53l0x")
    ) {

        checks.push({
            type: "success",
            title: "ESP32 + VL53L0X",
            message:
                "Compatible in a typical I2C module configuration. Verify the breakout board voltage requirements."
        });
    }


    /*
    OLED
    */

    if (
        ids.includes("esp32") &&
        ids.includes("oled")
    ) {

        checks.push({
            type: "success",
            title: "ESP32 + OLED",
            message:
                "Compatible. The OLED can use the ESP32 I2C bus."
        });
    }


    /*
    DHT22
    */

    if (
        ids.includes("esp32") &&
        ids.includes("dht22")
    ) {

        checks.push({
            type: "success",
            title: "ESP32 + DHT22",
            message:
                "Compatible. The DHT22 can operate from 3.3V in common configurations."
        });
    }


    /*
    L298N
    */

    if (
        ids.includes("esp32") &&
        ids.includes("l298n")
    ) {

        checks.push({
            type: "success",
            title: "ESP32 + L298N",
            message:
                "Generally usable together for a prototype. Use a common ground and do not power the motors from the ESP32."
        });
    }


    /*
    TB6612FNG
    */

    if (
        ids.includes("esp32") &&
        ids.includes("tb6612")
    ) {

        checks.push({
            type: "success",
            title: "ESP32 + TB6612FNG",
            message:
                "Compatible. TB6612FNG is a more efficient dual motor-driver option and works well with 3.3V controller logic."
        });
    }


    /*
    Motors without driver
    */

    if (
        ids.includes("boMotor") &&
        !ids.includes("l298n") &&
        !ids.includes("tb6612")
    ) {

        checks.push({
            type: "danger",
            title: "Motor Driver Missing",
            message:
                "DC motors should not be driven directly from a microcontroller. Add a suitable motor driver."
        });
    }


    /*
    Pump without switching stage
    */

    if (
        ids.includes("waterPump") &&
        !ids.includes("relay1")
    ) {

        checks.push({
            type: "danger",
            title: "Pump Driver Missing",
            message:
                "A DC pump should use an appropriate relay or transistor/MOSFET switching stage rather than a microcontroller GPIO directly."
        });
    }


    /*
    Relay note
    */

    if (
        ids.includes("esp32") &&
        ids.includes("relay1")
    ) {

        checks.push({
            type: "warning",
            title: "ESP32 + Relay Module",
            message:
                "Check the exact relay board trigger requirements. Some 5V relay modules do not reliably trigger from 3.3V logic."
        });
    }


    /*
    Battery and ESP32
    */

    if (
        ids.includes("esp32") &&
        ids.includes("battery74")
    ) {

        if (
            ids.includes("lm2596")
        ) {

            checks.push({
                type: "success",
                title: "7.4V Battery + ESP32",
                message:
                    "A buck converter is included. Adjust and verify its output before connecting it to the ESP32 power input."
            });

        } else {

            checks.push({
                type: "danger",
                title: "7.4V Battery + ESP32",
                message:
                    "Do not connect a 7.4V battery directly to the ESP32 3.3V rail or GPIO. Add an appropriate regulator/buck converter."
            });

        }
    }


    /*
    Arduino + HC-05
    */

    if (
        ids.includes("arduinoUno") &&
        ids.includes("hc05")
    ) {

        checks.push({
            type: "warning",
            title: "Arduino Uno + HC-05",
            message:
                "Commonly used together, but verify serial logic levels and use suitable level shifting for the HC-05 RX input where required."
        });
    }


    /*
    Common ground
    */

    const activeModules =
        [
            "l298n",
            "tb6612",
            "hcsr04",
            "vl53l0x",
            "oled",
            "dht22",
            "irSensor",
            "buzzer",
            "relay1",
            "pir",
            "soilSensor"
        ];


    const hasActiveModule =
        activeModules.some(
            function(id) {
                return ids.includes(id);
            }
        );


    if (
        (
            ids.includes("esp32") ||
            ids.includes("arduinoUno")
        ) &&
        hasActiveModule
    ) {

        checks.push({
            type: "warning",
            title: "Common Ground",
            message:
                "Modules that exchange electrical signals normally need a common reference ground unless the design intentionally uses isolation."
        });
    }


    if (
        checks.length === 0
    ) {

        checks.push({
            type: "success",
            title: "Basic Compatibility",
            message:
                "No predefined compatibility issue was found for this combination. Verify the exact datasheets before wiring."
        });
    }


    displayCompatibilityChecks(
        checks
    );
}


function displayCompatibilityChecks(
    checks
) {

    checks.forEach(
        function(check) {

            const item =
                document.createElement("div");


            let symbol =
                "✓";


            let titleClass =
                "status-success";


            let boxClass =
                "success";


            if (
                check.type === "warning"
            ) {

                symbol =
                    "⚠";

                titleClass =
                    "status-warning";

                boxClass =
                    "warning-check";
            }


            if (
                check.type === "danger"
            ) {

                symbol =
                    "✕";

                titleClass =
                    "status-danger";

                boxClass =
                    "danger";
            }


            item.className =
                `compatibility-item ${boxClass}`;


            item.innerHTML = `

                <h4 class="${titleClass}">
                    ${symbol} ${check.title}
                </h4>

                <p>
                    ${check.message}
                </p>

            `;


            compatibilityResults
                .appendChild(item);

        }
    );
}


/* =========================================================
   ESP32 PIN PLANNER
========================================================= */

function generatePinPlan() {

    pinPlannerResults.innerHTML =
        "";


    const controller =
        currentProjectComponents
            .find(function(item) {
                return (
                    item.componentId === "esp32" ||
                    item.componentId === "arduinoUno"
                );
            });


    if (!controller) {

        pinPlannerResults.innerHTML = `
            <div class="pin-info">
                Add a supported controller to generate a pin plan.
            </div>
        `;

        return;
    }


    if (
        controller.componentId ===
        "arduinoUno"
    ) {

        pinPlannerResults.innerHTML = `
            <div class="pin-info">
                The automatic pin planner in this version currently targets ESP32 DevKit V1.
                Arduino Uno planning can be added as the next board profile.
            </div>
        `;

        return;
    }


    const items =
        currentProjectComponents;


    /*
    We reserve GPIO 21 and 22 for the I2C bus when required.
    The following list is a conservative prototype pool for this demo.
    Exact usable pins depend on the ESP32 board variant and connected hardware.
    */

    const availablePins = [
        13,
        14,
        16,
        17,
        18,
        19,
        23,
        25,
        26,
        27,
        32,
        33
    ];


    const usedPins =
        [];


    const devices =
        [];


    const errors =
        [];


    function allocatePin() {

        for (
            let i = 0;
            i < availablePins.length;
            i++
        ) {

            const pin =
                availablePins[i];


            if (
                !usedPins.includes(pin)
            ) {

                usedPins.push(pin);

                return pin;
            }

        }


        return null;
    }


    function addPinDevice(
        name,
        signals
    ) {

        const pins =
            [];


        signals.forEach(
            function(signal) {

                const gpio =
                    allocatePin();


                if (
                    gpio === null
                ) {

                    errors.push(
                        `${name}: no free GPIO for ${signal.signal}`
                    );

                    return;
                }


                pins.push({
                    signal:
                        signal.signal,

                    gpio:
                        gpio,

                    purpose:
                        signal.purpose
                });

            }
        );


        if (
            pins.length > 0
        ) {

            devices.push({
                name:
                    name,

                pins:
                    pins
            });
        }
    }


    /*
    I2C bus
    */

    const i2cDevices =
        [];


    if (
        items.some(
            function(item) {
                return item.componentId === "oled";
            }
        )
    ) {

        i2cDevices.push(
            "OLED Display"
        );
    }


    if (
        items.some(
            function(item) {
                return item.componentId === "vl53l0x";
            }
        )
    ) {

        i2cDevices.push(
            "VL53L0X"
        );
    }


    if (
        i2cDevices.length > 0
    ) {

        devices.push({
            name:
                "Shared I2C Bus",

            pins: [
                {
                    signal: "SDA",
                    gpio: 21,
                    purpose:
                        i2cDevices.join(", ")
                },

                {
                    signal: "SCL",
                    gpio: 22,
                    purpose:
                        i2cDevices.join(", ")
                }
            ]
        });

        usedPins.push(
            21,
            22
        );
    }


    /*
    L298N
    */

    if (
        items.some(
            function(item) {
                return item.componentId === "l298n";
            }
        )
    ) {

        addPinDevice(
            "L298N Motor Driver",
            [
                {
                    signal: "ENA",
                    purpose: "Motor A speed"
                },
                {
                    signal: "IN1",
                    purpose: "Motor A direction"
                },
                {
                    signal: "IN2",
                    purpose: "Motor A direction"
                },
                {
                    signal: "IN3",
                    purpose: "Motor B direction"
                },
                {
                    signal: "IN4",
                    purpose: "Motor B direction"
                },
                {
                    signal: "ENB",
                    purpose: "Motor B speed"
                }
            ]
        );
    }


    /*
    TB6612
    */

    if (
        items.some(
            function(item) {
                return item.componentId === "tb6612";
            }
        )
    ) {

        addPinDevice(
            "TB6612FNG Motor Driver",
            [
                {
                    signal: "PWMA",
                    purpose: "Motor A speed"
                },
                {
                    signal: "AIN1",
                    purpose: "Motor A direction"
                },
                {
                    signal: "AIN2",
                    purpose: "Motor A direction"
                },
                {
                    signal: "BIN1",
                    purpose: "Motor B direction"
                },
                {
                    signal: "BIN2",
                    purpose: "Motor B direction"
                },
                {
                    signal: "PWMB",
                    purpose: "Motor B speed"
                },
                {
                    signal: "STBY",
                    purpose: "Driver enable"
                }
            ]
        );
    }


    /*
    HC-SR04
    */

    if (
        items.some(
            function(item) {
                return item.componentId === "hcsr04";
            }
        )
    ) {

        addPinDevice(
            "HC-SR04 Ultrasonic Sensor",
            [
                {
                    signal: "TRIG",
                    purpose: "Ultrasonic trigger"
                },
                {
                    signal: "ECHO",
                    purpose: "Ultrasonic echo"
                }
            ]
        );
    }


    /*
    DHT22
    */

    if (
        items.some(
            function(item) {
                return item.componentId === "dht22";
            }
        )
    ) {

        addPinDevice(
            "DHT22",
            [
                {
                    signal: "DATA",
                    purpose: "Temperature / humidity data"
                }
            ]
        );
    }


    /*
    IR Sensors
    */

    const irItem =
        items.find(
            function(item) {
                return item.componentId === "irSensor";
            }
        );


    if (irItem) {

        const signals =
            [];


        for (
            let i = 1;
            i <= irItem.quantity;
            i++
        ) {

            signals.push({
                signal:
                    `IR ${i}`,

                purpose:
                    `Line sensor ${i}`
            });
        }


        addPinDevice(
            "IR Line Sensors",
            signals
        );
    }


    /*
    Buzzer
    */

    if (
        items.some(
            function(item) {
                return item.componentId === "buzzer";
            }
        )
    ) {

        addPinDevice(
            "Active Buzzer",
            [
                {
                    signal: "SIG",
                    purpose: "Buzzer control"
                }
            ]
        );
    }


    /*
    PIR
    */

    if (
        items.some(
            function(item) {
                return item.componentId === "pir";
            }
        )
    ) {

        addPinDevice(
            "PIR Motion Sensor",
            [
                {
                    signal: "OUT",
                    purpose: "Motion detection"
                }
            ]
        );
    }


    /*
    Relay
    */

    if (
        items.some(
            function(item) {
                return item.componentId === "relay1";
            }
        )
    ) {

        addPinDevice(
            "Relay Module",
            [
                {
                    signal: "IN",
                    purpose: "Relay control"
                }
            ]
        );
    }


    /*
    Soil moisture sensor.
    GPIO 32/33 from the available pool are commonly ADC-capable
    on many ESP32 boards, but this remains a prototype suggestion.
    */

    if (
        items.some(
            function(item) {
                return item.componentId === "soilSensor";
            }
        )
    ) {

        addPinDevice(
            "Soil Moisture Sensor",
            [
                {
                    signal: "AO",
                    purpose: "Analog moisture reading"
                }
            ]
        );
    }


    /*
    DISPLAY
    */

    if (
        devices.length === 0
    ) {

        pinPlannerResults.innerHTML = `
            <div class="pin-info">
                No supported GPIO peripherals were detected for this project.
            </div>
        `;

        return;
    }


    devices.forEach(
        function(device) {

            const deviceBox =
                document.createElement("div");


            deviceBox.className =
                "pin-device";


            let rows =
                "";


            device.pins.forEach(
                function(pin) {

                    rows += `
                        <div class="pin-row">

                            <span>
                                ${pin.signal}
                            </span>

                            <strong>
                                GPIO ${pin.gpio}
                            </strong>

                            <span>
                                ${pin.purpose}
                            </span>

                        </div>
                    `;

                }
            );


            deviceBox.innerHTML = `

                <div class="pin-device-title">
                    ${device.name}
                </div>

                ${rows}

            `;


            pinPlannerResults
                .appendChild(deviceBox);

        }
    );


    if (
        errors.length > 0
    ) {

        pinPlannerResults.innerHTML += `
            <div class="pin-error">
                ✕ GPIO capacity issue: ${errors.join(" • ")}
            </div>
        `;

    } else {

        pinPlannerResults.innerHTML += `
            <div class="pin-success">
                ✓ No duplicate GPIO assignments were generated.
            </div>
        `;

    }


    if (
        currentProjectComponents
            .some(function(item) {
                return item.componentId === "hcsr04";
            })
    ) {

        pinPlannerResults.innerHTML += `
            <div class="pin-warning">
                ⚠ HC-SR04 Echo needs suitable level reduction before an ESP32 GPIO.
            </div>
        `;
    }


    pinPlannerResults.innerHTML += `
        <div class="pin-info">
            Pin assignments are prototype suggestions for ESP32 DevKit V1.
            Verify your exact board pinout and boot-strapping restrictions before final wiring.
        </div>
    `;
}


/* =========================================================
   COPY BOM
========================================================= */

copyBomButton
    .addEventListener(
        "click",
        async function() {

            if (
                currentProjectComponents.length === 0
            ) {

                alert(
                    "Build a project first."
                );

                return;
            }


            let total =
                0;


            const lines =
                [
                    `CircuitCraft BOM - ${currentProjectName}`,
                    ""
                ];


            currentProjectComponents
                .forEach(function(item) {

                    const component =
                        getComponentById(
                            item.componentId
                        );


                    if (!component) {
                        return;
                    }


                    const subtotal =
                        component.price *
                        item.quantity;


                    total +=
                        subtotal;


                    lines.push(
                        `${item.quantity} x ${component.name} — ₹${subtotal}`
                    );

                });


            lines.push(
                "",
                `Estimated Total: ₹${total}`,
                "",
                "Prototype prices only. Verify exact datasheets and market prices."
            );


            const text =
                lines.join("\n");


            try {

                await navigator
                    .clipboard
                    .writeText(text);


                const oldText =
                    copyBomButton.textContent;


                copyBomButton.textContent =
                    "Copied ✓";


                setTimeout(
                    function() {
                        copyBomButton.textContent =
                            oldText;
                    },
                    1300
                );

            } catch (error) {

                window.prompt(
                    "Copy the BOM below:",
                    text
                );

            }

        }
    );


/* =========================================================
   RESET
========================================================= */

resetProjectButton
    .addEventListener(
        "click",
        function() {

            currentProjectComponents =
                [];


            currentProjectName =
                "Custom Electronics Project";


            componentResults.innerHTML =
                "";


            compatibilityResults.innerHTML =
                "";


            pinPlannerResults.innerHTML =
                "";


            totalCost.textContent =
                "₹0";


            projectSummary.textContent =
                "";


            componentCount.textContent =
                "0 items";


            resultsSection.style.display =
                "none";


            projectInput.value =
                "";


            document
                .getElementById("builder")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


            projectInput.focus();

        }
    );
