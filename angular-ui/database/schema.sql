-- User Table
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  salt TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email_addr TEXT NOT NULL UNIQUE
);

-- Child Table
CREATE TABLE IF NOT EXISTS children (
  child_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender INTEGER NOT NULL CHECK (gender IN (0, 1, 2, 3)),
  user_id INTEGER NOT NULL,
  birthday DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Event Table
CREATE TABLE IF NOT EXISTS events (
  event_id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_name TEXT NOT NULL,
  event_start_date_time DATETIME NOT NULL,
  event_duration INTEGER NOT NULL,
  event_type INTEGER NOT NULL CHECK (event_type IN (0, 1, 2)),
  child_id INTEGER NOT NULL,
  FOREIGN KEY (child_id) REFERENCES children(child_id)
);

-- Metric Table
CREATE TABLE IF NOT EXISTS metrics (
  metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_date_time DATETIME NOT NULL,
  metric_type INTEGER NOT NULL CHECK (metric_type IN (0, 1, 2, 3)),
  child_id INTEGER NOT NULL,
  metric_record REAL NOT NULL,
  FOREIGN KEY (child_id) REFERENCES children(child_id)
);

-- Note Table
CREATE TABLE IF NOT EXISTS notes (
  note_id INTEGER PRIMARY KEY AUTOINCREMENT,
  note_record TEXT NOT NULL,
  metric_id INTEGER,
  event_id INTEGER,
  FOREIGN KEY (metric_id) REFERENCES metrics(metric_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id)
);
