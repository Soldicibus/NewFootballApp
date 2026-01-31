import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'football.db');

let db;
try {
  db = new Database(dbPath);
  console.log('Connected to SQLite database at:', dbPath);
} catch (err) {
  console.error('Error opening database:', err && err.message ? err.message : err);
  // Re-throw so the app initialization fails loudly
  throw err;
}

// Ensure foreign keys are enforced
try {
  // better-sqlite3 provides a pragma helper
  db.pragma('foreign_keys = ON');
} catch (err) {
  console.error('Error enabling foreign keys:', err && err.message ? err.message : err);
}

// Create schema (runs synchronously)
const schema = `
CREATE TABLE IF NOT EXISTS countries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  balance NUMERIC,
  atk INTEGER NOT NULL DEFAULT 50 CHECK (atk BETWEEN 1 AND 100),
  mid INTEGER NOT NULL DEFAULT 50 CHECK (mid BETWEEN 1 AND 100),
  def INTEGER NOT NULL DEFAULT 50 CHECK (def BETWEEN 1 AND 100),
  rating NUMERIC NOT NULL DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  second_name TEXT NOT NULL,
  third_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (
    role IN ('GK','CB','RB','LB','DMF','RMF','CMF','LMF','SS','CF','LWF','RWF')
  ),
  country_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS abilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL UNIQUE,
  weak_foot_usage INTEGER NOT NULL DEFAULT 1 CHECK (weak_foot_usage BETWEEN 1 AND 4),
  weak_foot_accuracy INTEGER NOT NULL DEFAULT 1 CHECK (weak_foot_accuracy BETWEEN 1 AND 4),
  form INTEGER NOT NULL DEFAULT 1 CHECK (form BETWEEN 1 AND 8),
  injury_resistance INTEGER NOT NULL DEFAULT 1 CHECK (injury_resistance BETWEEN 1 AND 3),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attack (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ability_id INTEGER NOT NULL UNIQUE,
  attacking_prowess INTEGER NOT NULL DEFAULT 50 CHECK (attacking_prowess BETWEEN 1 AND 100),
  ball_control INTEGER NOT NULL DEFAULT 50 CHECK (ball_control BETWEEN 1 AND 100),
  dribbling INTEGER NOT NULL DEFAULT 50 CHECK (dribbling BETWEEN 1 AND 100),
  low_pass INTEGER NOT NULL DEFAULT 50 CHECK (low_pass BETWEEN 1 AND 100),
  lofted_pass INTEGER NOT NULL DEFAULT 50 CHECK (lofted_pass BETWEEN 1 AND 100),
  finishing INTEGER NOT NULL DEFAULT 50 CHECK (finishing BETWEEN 1 AND 100),
  place_kicking INTEGER NOT NULL DEFAULT 50 CHECK (place_kicking BETWEEN 1 AND 100),
  swerve INTEGER NOT NULL DEFAULT 50 CHECK (swerve BETWEEN 1 AND 100),
  header INTEGER NOT NULL DEFAULT 50 CHECK (header BETWEEN 1 AND 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ability_id) REFERENCES abilities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS defence (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ability_id INTEGER NOT NULL UNIQUE,
  defensive_prowess INTEGER NOT NULL DEFAULT 50 CHECK (defensive_prowess BETWEEN 1 AND 100),
  ball_winning INTEGER NOT NULL DEFAULT 50 CHECK (ball_winning BETWEEN 1 AND 100),
  kicking_power INTEGER NOT NULL DEFAULT 50 CHECK (kicking_power BETWEEN 1 AND 100),
  speed INTEGER NOT NULL DEFAULT 50 CHECK (speed BETWEEN 1 AND 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ability_id) REFERENCES abilities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS support (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ability_id INTEGER NOT NULL UNIQUE,
  explosive_power INTEGER NOT NULL DEFAULT 50 CHECK (explosive_power BETWEEN 1 AND 100),
  strength_on_the_ball INTEGER NOT NULL DEFAULT 50 CHECK (strength_on_the_ball BETWEEN 1 AND 100),
  physical_contact INTEGER NOT NULL DEFAULT 50 CHECK (physical_contact BETWEEN 1 AND 100),
  jump INTEGER NOT NULL DEFAULT 50 CHECK (jump BETWEEN 1 AND 100),
  stamina INTEGER NOT NULL DEFAULT 50 CHECK (stamina BETWEEN 1 AND 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ability_id) REFERENCES abilities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS goalkeeping (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ability_id INTEGER NOT NULL UNIQUE,
  goalkeeping INTEGER NOT NULL DEFAULT 50 CHECK (goalkeeping BETWEEN 1 AND 100),
  catching INTEGER NOT NULL DEFAULT 50 CHECK (catching BETWEEN 1 AND 100),
  reflexes INTEGER NOT NULL DEFAULT 50 CHECK (reflexes BETWEEN 1 AND 100),
  coverage INTEGER NOT NULL DEFAULT 50 CHECK (coverage BETWEEN 1 AND 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ability_id) REFERENCES abilities(id) ON DELETE CASCADE
);
`;

try {
  db.exec(schema);
  console.log('Database schema ensured');
} catch (err) {
  console.error('Error creating schema:', err && err.message ? err.message : err);
  throw err;
}

export default db;

db.start = () => {
  console.log('Database initialization complete');
};

db.shutdown = () => {
  try {
    const closed = db.close();
    console.log('Closed SQLite database connection.');
    return closed;
  } catch (err) {
    console.error('Error closing database:', err && err.message ? err.message : err);
    return false;
  }
};