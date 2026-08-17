const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(
    __dirname,
    "circuitcraft.db"
);

const db = new Database(dbPath);


// Improve SQLite reliability/performance
db.pragma("journal_mode = WAL");


// Create components table
db.exec(`

    CREATE TABLE IF NOT EXISTS components (

        id TEXT PRIMARY KEY,

        name TEXT NOT NULL,

        category TEXT NOT NULL,

        price INTEGER NOT NULL DEFAULT 0,

        operating_voltage TEXT,

        input_voltage TEXT,

        motor_voltage TEXT,

        voltage TEXT,

        gpio INTEGER,

        channels INTEGER,

        communication TEXT,

        wifi INTEGER DEFAULT 0,

        bluetooth INTEGER DEFAULT 0,

        purpose TEXT,

        warning TEXT,

        alternatives_json TEXT DEFAULT '[]',

        alternative_ids_json TEXT DEFAULT '[]',

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP

    );

`);


console.log(
    "SQLite database initialized:",
    dbPath
);


module.exports = db;