const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

class DatabaseService {
  constructor() {
    this.db = null;
    this.initializeDatabase();
  }

  async initializeDatabase() {
    try {
      const SQL = await initSqlJs();
      const dbPath = path.join(__dirname, 'sweet-juliet.db');

      if (fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        this.db = new SQL.Database(fileBuffer);
      } else {
        this.db = new SQL.Database();
      }

      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        this.db.run(schema);
      } else {
        throw new Error('Schema file not found: ' + schemaPath);
      }

      this.saveDatabase();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  saveDatabase() {
    if (!this.db) return;
    const dbPath = path.join(__dirname, 'sweet-juliet.db');
    const data = this.db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }

  getDatabase() {
    return this.db;
  }

  createUser(user) {
    if (!this.db) throw new Error('Database not initialized');
    
    this.db.run(`
      INSERT INTO users (username, password, salt, first_name, last_name, email_addr)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [user.username, user.password, user.salt, user.first_name, user.last_name, user.email_addr]);
    
    const result = this.db.exec('SELECT last_insert_rowid() as id');
    this.saveDatabase();
    return result[0].values[0][0];
  }
  
  updateUser(user) {
    if (!this.db) throw new Error('Database not initialized');
    
    this.db.run(`
      UPDATE users 
      SET username = ?, password = ?, first_name = ?, last_name = ?, email_addr = ?
      WHERE user_id = ?
    `, [user.username, user.password, user.first_name, user.last_name, user.email_addr, user.user_id]);
    
    this.saveDatabase();
  }

  updatePassword(user) {
    if (!this.db) throw new Error('Database not initialized');
    
    this.db.run(`
      UPDATE users 
      SET password = ?, salt = ?
      WHERE user_id = ?
    `, [user.password, user.salt, user.user_id]);
    
    this.saveDatabase();
  }

  getUserById(user_id) {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = this.db.exec('SELECT * FROM users WHERE user_id = ?', [user_id]);
    if (result.length === 0) return null;
    const columns = result[0].columns;
    const values = result[0].values[0];
    const row = {};
    columns.forEach((col, i) => row[col] = values[i]);
    return row;
  }

  getUserByUsername(username) {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = this.db.exec('SELECT * FROM users WHERE username = ?', [username]);
    if (result.length === 0) return null;
    const columns = result[0].columns;
    const values = result[0].values[0];
    const row = {};
    columns.forEach((col, i) => row[col] = values[i]);
    return row;
  }

  createChild(child) {
    if (!this.db) throw new Error('Database not initialized');
    
    this.db.run(`
      INSERT INTO children (first_name, last_name, gender, user_id, birthday)
      VALUES (?, ?, ?, ?, ?)
    `, [child.first_name, child.last_name, child.gender, child.user_id, child.birthday]);
    
    const result = this.db.exec('SELECT last_insert_rowid() as id');
    this.saveDatabase();
    return result[0].values[0][0];
  }
  
  updateChild(child) {
    if (!this.db) throw new Error('Database not initialized');
    
    this.db.run(`
      UPDATE children 
      SET first_name = ?, last_name = ?, gender = ?, user_id = ?, birthday = ?
      WHERE child_id = ?
    `, [child.first_name, child.last_name, child.gender, child.user_id, child.birthday, child.child_id]);
    
    this.saveDatabase();
  }

  getChildrenByUserId(user_id) {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = this.db.exec('SELECT * FROM children WHERE user_id = ?', [user_id]);
    if (result.length === 0) return [];
    const columns = result[0].columns;
    return result[0].values.map(values => {
      const row = {};
      columns.forEach((col, i) => row[col] = values[i]);
      return row;
    });
  }

  createEvent(event) {
    if (!this.db) throw new Error('Database not initialized');
    
    this.db.run(`
      INSERT INTO events (event_name, event_start_date_time, event_duration, event_type, child_id)
      VALUES (?, ?, ?, ?, ?)
    `, [event.event_name, event.event_start_date_time, event.event_duration, event.event_type, event.child_id]);
    
    const result = this.db.exec('SELECT last_insert_rowid() as id');
    this.saveDatabase();
    return result[0].values[0][0];
  }
  
  updateEvent(event) {
    if (!this.db) throw new Error('Database not initialized');
    
    this.db.run(`
      UPDATE events 
      SET event_name = ?, event_start_date_time = ?, event_duration = ?, event_type = ?, child_id = ?
      WHERE event_id = ?
    `, [event.event_name, event.event_start_date_time, event.event_duration, event.event_type, event.child_id, event.event_id]);
    
    this.saveDatabase();
  }

  getEventsByChildId(child_id) {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = this.db.exec('SELECT * FROM events WHERE child_id = ?', [child_id]);
    if (result.length === 0) return [];
    const columns = result[0].columns;
    return result[0].values.map(values => {
      const row = {};
      columns.forEach((col, i) => row[col] = values[i]);
      return row;
    });
  }

  createMetric(metric) {
    if (!this.db) throw new Error('Database not initialized');
    
    this.db.run(`
      INSERT INTO metrics (metric_date_time, metric_type, child_id, metric_record)
      VALUES (?, ?, ?, ?)
    `, [metric.metric_date_time, metric.metric_type, metric.child_id, metric.metric_record]);
    
    const result = this.db.exec('SELECT last_insert_rowid() as id');
    this.saveDatabase();
    return result[0].values[0][0];
  }

  updateMetric(metric) {
    if (!this.db) throw new Error('Database not initialized');
    
    this.db.run(`
      UPDATE metrics 
      SET metric_date_time = ?, metric_type = ?, child_id = ?, metric_record = ?
      WHERE metric_id = ?
    `, [metric.metric_date_time, metric.metric_type, metric.child_id, metric.metric_record, metric.metric_id]);
    
    this.saveDatabase();
  }

  getMetricsByChildId(child_id) {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = this.db.exec('SELECT * FROM metrics WHERE child_id = ?', [child_id]);
    if (result.length === 0) return [];
    const columns = result[0].columns;
    return result[0].values.map(values => {
      const row = {};
      columns.forEach((col, i) => row[col] = values[i]);
      return row;
    });
  }

  createNote(note) {
    if (!this.db) throw new Error('Database not initialized');
    
    this.db.run(`
      INSERT INTO notes (note_record, metric_id, event_id)
      VALUES (?, ?, ?)
    `, [note.note_record, note.metric_id, note.event_id]);
    
    const result = this.db.exec('SELECT last_insert_rowid() as id');
    this.saveDatabase();
    return result[0].values[0][0];
  }

  getNotesByMetricId(metric_id) {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = this.db.exec('SELECT * FROM notes WHERE metric_id = ?', [metric_id]);
    if (result.length === 0) return [];
    const columns = result[0].columns;
    return result[0].values.map(values => {
      const row = {};
      columns.forEach((col, i) => row[col] = values[i]);
      return row;
    });
  }

  getNotesByEventId(event_id) {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM notes WHERE event_id = ?', [event_id]);
    if (result.length === 0) return [];
    const columns = result[0].columns;
    return result[0].values.map(values => {
      const row = {};
      columns.forEach((col, i) => row[col] = values[i]);
      return row;
    });
  }

  updateNote(note) {
    if (!this.db) throw new Error('Database not initialized');
    
    this.db.run(`
      UPDATE notes 
      SET note_record = ?
      WHERE note_id = ?
    `, [note.note_record, note.note_id]);
    
    this.saveDatabase();
  }

  getNotesByDayAndChild(child_id, date) {
    if (!this.db) throw new Error('Database not initialized');

    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    const startUtc = startOfDay.toISOString();
    const endUtc = endOfDay.toISOString();

    const metricsResult = this.db.exec('SELECT * FROM metrics WHERE child_id = ? AND metric_date_time >= ? AND metric_date_time <= ?', [child_id, startUtc, endUtc]);
    const metricIds = metricsResult.length > 0 ? metricsResult[0].values.map(row => row[0]) : [];

    const eventsResult = this.db.exec('SELECT * FROM events WHERE child_id = ? AND event_start_date_time >= ? AND event_start_date_time <= ?', [child_id, startUtc, endUtc]);
    const eventIds = eventsResult.length > 0 ? eventsResult[0].values.map(row => row[0]) : [];

    const notes = [];

    metricIds.forEach(metricId => {
      const notesResult = this.db.exec('SELECT * FROM notes WHERE metric_id = ?', [metricId]);
      if (notesResult.length > 0) {
        const columns = notesResult[0].columns;
        notesResult[0].values.forEach(values => {
          const row = {};
          columns.forEach((col, i) => row[col] = values[i]);
          notes.push(row);
        });
      }
    });

    eventIds.forEach(eventId => {
      const notesResult = this.db.exec('SELECT * FROM notes WHERE event_id = ?', [eventId]);
      if (notesResult.length > 0) {
        const columns = notesResult[0].columns;
        notesResult[0].values.forEach(values => {
          const row = {};
          columns.forEach((col, i) => row[col] = values[i]);
          notes.push(row);
        });
      }
    });

    return notes;
  }

  getFeedingByDayAndChild(child_id, date) {
    if (!this.db) throw new Error('Database not initialized');

    const pad = (n) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    const startLocal = `${year}-${month}-${day} 00:00:00`;
    const endLocal = `${year}-${month}-${day} 23:59:59`;

    const result = this.db.exec(
      'SELECT * FROM metrics WHERE child_id = ? AND metric_date_time >= ? AND metric_date_time <= ? AND metric_type = 0', 
      [child_id, startLocal, endLocal]
    );
    
    if (result.length === 0) return [];
    return result[0].values.map(row => ({
      metric_id: row[0], metric_date_time: row[1], metric_type: row[2], child_id: row[3], metric_record: row[4]
    }));
  }

  getSleepByDayAndChild(child_id, date) {
    if (!this.db) throw new Error('Database not initialized');

    const pad = (n) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    const startLocal = `${year}-${month}-${day} 00:00:00`;
    const endLocal = `${year}-${month}-${day} 23:59:59`;

    const result = this.db.exec('SELECT * FROM metrics WHERE child_id = ? AND metric_date_time >= ? AND metric_date_time <= ? AND metric_type = 1', [child_id, startLocal, endLocal]);
    if (result.length === 0) return [];
    return result[0].values.map(row => ({
      metric_id: row[0],
      metric_date_time: row[1],
      metric_type: row[2],
      child_id: row[3],
      metric_record: row[4]
    }));
  }
  
  getLastWeightByChildBeforeDate(child_id, date) {
    if (!this.db) throw new Error('Database not initialized');

    const pad = (n) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    const endLocal = `${year}-${month}-${day} 23:59:59`;

    const result = this.db.exec('SELECT * FROM metrics WHERE child_id = ? AND metric_type = 3 AND metric_date_time <= ? ORDER BY metric_date_time DESC LIMIT 1', [child_id, endLocal]);
    if (result.length === 0) return null;
    const row = result[0].values[0];
    return {
      metric_id: row[0],
      metric_date_time: row[1],
      metric_type: row[2],
      child_id: row[3],
      metric_record: row[4]
    };
  }

  getLastHeightByChildBeforeDate(child_id, date) {
    if (!this.db) throw new Error('Database not initialized');

    const pad = (n) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    const endLocal = `${year}-${month}-${day} 23:59:59`;

    const result = this.db.exec('SELECT * FROM metrics WHERE child_id = ? AND metric_type = 2 AND metric_date_time <= ? ORDER BY metric_date_time DESC LIMIT 1', [child_id, endLocal]);
    if (result.length === 0) return null;
    const row = result[0].values[0];
    return {
      metric_id: row[0],
      metric_date_time: row[1],
      metric_type: row[2],
      child_id: row[3],
      metric_record: row[4]
    };
  }
  
  getEventCountByDayAndChild(child_id, date) {
    if (!this.db) throw new Error('Database not initialized');

    const pad = (n) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    const startLocal = `${year}-${month}-${day} 00:00:00`;
    const endLocal = `${year}-${month}-${day} 23:59:59`;
    
    const result = this.db.exec('SELECT COUNT(*) as count FROM notes WHERE child_id = ? AND date >= ? AND date <= ? AND event_id IS NOT NULL', [child_id, startLocal, endLocal]);
    if (result.length === 0) return 0;
    return result[0].values[0][0];
  }

  getUpcomingEventsByDayAndChild(child_id, date) {
    if (!this.db) throw new Error('Database not initialized');

    const pad = (n) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    const startLocal = `${year}-${month}-${day} 00:00:00`;

    const result = this.db.exec('SELECT * FROM events WHERE child_id = ? AND event_start_date_time >= ? ORDER BY event_start_date_time ASC LIMIT 5', [child_id, startLocal]);
    if (result.length === 0) return [];
    const columns = result[0].columns;
    return result[0].values.map(values => {
      const row = {};
      columns.forEach((col, i) => row[col] = values[i]);
      return row;
    });
  }

  getWeightMetrics() {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM metrics WHERE metric_type = 3');
    if (result.length === 0) return [];
    return result[0].values.map(row => ({
      metric_id: row[0],
      metric_date_time: row[1],
      metric_type: row[2],
      child_id: row[3],
      metric_record: row[4]
    }));
  }
  
  getHeightMetrics() {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM metrics WHERE metric_type = 2');
    if (result.length === 0) return [];
    return result[0].values.map(row => ({
      metric_id: row[0],
      metric_date_time: row[1],
      metric_type: row[2],
      child_id: row[3],
      metric_record: row[4]
    }));
  }
  
  getFeedingMetrics() {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM metrics WHERE metric_type = 0');
    if (result.length === 0) return [];
    return result[0].values.map(row => ({
      metric_id: row[0],
      metric_date_time: row[1],
      metric_type: row[2],
      child_id: row[3],
      metric_record: row[4]
    }));
  }
  
  getSleepMetrics() {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM metrics WHERE metric_type = 1');
    if (result.length === 0) return [];
    return result[0].values.map(row => ({
      metric_id: row[0],
      metric_date_time: row[1],
      metric_type: row[2],
      child_id: row[3],
      metric_record: row[4]
    }));
  }
  
  getMetric(metric_id) {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM metrics WHERE metric_id = ?', [metric_id]);
    if (result.length === 0) {
      return null;
    }
    const values = result[0].values[0];
    const metric = {
      metric_id: values[0],
      metric_date_time: values[1],
      metric_type: values[2],
      child_id: values[3],
      metric_record: values[4]
    };
    return metric;
  }

  updateMetric(metric) {
    if (!this.db) throw new Error('Database not initialized');

    this.db.exec('UPDATE metrics SET metric_date_time = ?, metric_type = ?, child_id = ?, metric_record = ? WHERE metric_id = ?', 
      [metric.metric_date_time, metric.metric_type, metric.child_id, metric.metric_record, metric.metric_id]);
  }

  updateNote(note) {
    if (!this.db) throw new Error('Database not initialized');

    this.db.exec('UPDATE notes SET note_record = ?, metric_id = ?, event_id = ? WHERE note_id = ?', 
      [note.note_record, note.metric_id, note.event_id, note.note_id]);
  }
  
  deleteNote(note_id) {
    if (!this.db) throw new Error('Database not initialized');

    this.db.exec('DELETE FROM notes WHERE note_id = ?', [note_id]);
  }

  deleteMetric(metric_id) {
    if (!this.db) throw new Error('Database not initialized');

    this.db.exec('DELETE FROM metrics WHERE metric_id = ?', [metric_id]);
  }

  deleteEvent(event_id) {
    if (!this.db) throw new Error('Database not initialized');

    this.db.exec('DELETE FROM events WHERE event_id = ?', [event_id]);
  }

  getEvent(event_id) {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM events WHERE event_id = ?', [event_id]);
    if (result.length === 0) return null;
    const values = result[0].values[0];
    return {
      event_id: values[0],
      event_name: values[1],
      event_start_date_time: values[2],
      event_duration: values[3],
      event_type: values[4],
      child_id: values[5]
    };
  }
  
  updateEvent(event) {
    if (!this.db) throw new Error('Database not initialized');

    this.db.exec('UPDATE events SET event_start_date_time = ?, event_duration = ?, event_type = ?, child_id = ?, event_name = ? WHERE event_id = ?', 
      [event.event_start_date_time, event.event_duration, event.event_type, event.child_id, event.event_name, event.event_id]);
  }

  getWeightMetricsInRange(startDate, endDate) {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM metrics WHERE metric_type = ? AND metric_date_time BETWEEN ? AND ?', [3, startDate, endDate]);
    if (result.length === 0) return [];
    return result[0].values.map(row => ({
      metric_id: row[0],
      metric_date_time: row[1],
      metric_type: row[2],
      child_id: row[3],
      metric_record: row[4]
    }));
  }

  getHeightMetricsInRange(startDate, endDate) {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM metrics WHERE metric_type = ? AND metric_date_time BETWEEN ? AND ?', [2, startDate, endDate]);
    if (result.length === 0) return [];
    return result[0].values.map(row => ({
      metric_id: row[0],
      metric_date_time: row[1],
      metric_type: row[2],
      child_id: row[3],
      metric_record: row[4]
    }));
  }

  getFeedingMetricsInRange(startDate, endDate) {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM metrics WHERE metric_type = ? AND metric_date_time BETWEEN ? AND ?', [0, startDate, endDate]);
    if (result.length === 0) return [];
    return result[0].values.map(row => ({
      metric_id: row[0],
      metric_date_time: row[1],
      metric_type: row[2],
      child_id: row[3],
      metric_record: row[4]
    }));
  }

  getSleepMetricsInRange(startDate, endDate) {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM metrics WHERE metric_type = ? AND metric_date_time BETWEEN ? AND ?', [1, startDate, endDate]);
    if (result.length === 0) return [];
    return result[0].values.map(row => ({
      metric_id: row[0],
      metric_date_time: row[1],
      metric_type: row[2],
      child_id: row[3],
      metric_record: row[4]
    }));
  }

  close() {
    if (this.db) {
      this.saveDatabase();
      this.db.close();
      this.db = null;
    }
  }
}

module.exports = { DatabaseService };
