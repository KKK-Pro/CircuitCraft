const express = require("express");
const path = require("path");
const db = require("./database/db");

const app = express();

const PORT = 3000;


// Allow JSON requests
app.use(express.json());


// Serve frontend files from public folder
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// Test API
app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message: "CircuitCraft backend is working"
    });

});


// Home page
app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});
app.get("/api/components", (req, res) => {

    try {

        const rows =
            db.prepare(`
                SELECT *
                FROM components
                ORDER BY category, name
            `).all();


        const components =
            rows.map(row => ({

                id:
                    row.id,

                name:
                    row.name,

                category:
                    row.category,

                price:
                    row.price,

                operatingVoltage:
                    row.operating_voltage,

                inputVoltage:
                    row.input_voltage,

                motorVoltage:
                    row.motor_voltage,

                voltage:
                    row.voltage,

                gpio:
                    row.gpio,

                channels:
                    row.channels,

                communication:
                    row.communication,

                wifi:
                    Boolean(row.wifi),

                bluetooth:
                    Boolean(row.bluetooth),

                purpose:
                    row.purpose,

                warning:
                    row.warning,

                alternatives:
                    JSON.parse(
                        row.alternatives_json || "[]"
                    ),

                alternativeIds:
                    JSON.parse(
                        row.alternative_ids_json || "[]"
                    )

            }));


        res.json({
            success: true,
            count: components.length,
            components: components
        });

    }

    catch (error) {

        console.error(
            "Component API error:",
            error
        );


        res.status(500).json({
            success: false,
            message:
                "Failed to load components."
        });

    }

});
  app.get(
    "/components",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "components.html"
            )
        );

    }
);
// Start server
app.listen(PORT, () => {

    console.log("");
    console.log("=================================");
    console.log("   CircuitCraft Server Started");
    console.log("=================================");
    console.log("");

    console.log(
        `Website: http://localhost:${PORT}`
    );

    console.log(
        `API Test: http://localhost:${PORT}/api/test`
    );

    console.log("");

});