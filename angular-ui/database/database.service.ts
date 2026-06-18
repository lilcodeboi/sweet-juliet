import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../src/models/user';
import { Child } from '../src/models/child';
import { Metric, MetricType } from '../src/models/metric';
import { Event } from '../src/models/event';
import { Note } from '../src/models/note';

export class DatabaseService {
  private db: Database.Database | null = null;

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    try {
      const dbPath = path.join(__dirname, 'sweet-juliet.db');
      this.db = new Database(dbPath);
      
      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        this.db.exec(schema);
      } else {
        throw new Error('Schema file not found: ' + schemaPath);
      }
    } catch (error) {
      throw error;
    }
  }

  public getDatabase(): Database.Database | null {
    return this.db;
  }

  public createUser(user: User): number {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare(`
      INSERT INTO users (username, password, first_name, last_name, email_addr)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(user.username, user.password, user.first_name, user.last_name, user.email_addr);
    return result.lastInsertRowid as number;
  }

  public getUserById(user_id: number): User {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare('SELECT * FROM users WHERE user_id = ?');
    return stmt.get(user_id) as User;
  }

  public getUserByUsername(username: string): User {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User;
  }

  public createChild(child: Child): number {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare(`
      INSERT INTO children (first_name, last_name, gender, user_id, birthday)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(child.first_name, child.last_name, child.gender, child.user_id, child.birthday);
    return result.lastInsertRowid as number;
  }

  public getChildrenByUserId(user_id: number): Child[] {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare('SELECT * FROM children WHERE user_id = ?');
    return stmt.all(user_id) as Child[];
  }

  public createEvent(event: Event): number {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare(`
      INSERT INTO events (event_name, event_start_date_time, event_duration, event_type, child_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(event.event_name, event.event_start_date_time, event.event_duration, event.event_type, event.child_id);
    return result.lastInsertRowid as number;
  }

  public getEventsByChildId(child_id: number): Event[] {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare('SELECT * FROM events WHERE child_id = ?');
    return stmt.all(child_id) as Event[];
  }

  public createMetric(metric: Metric): number {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare(`
      INSERT INTO metrics (metric_date_time, metric_type, child_id, metric_record)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(metric.metric_date_time, metric.metric_type, metric.child_id, metric.metric_record);
    return result.lastInsertRowid as number;
  }

  public getMetricsByChildId(child_id: number): Metric[] {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare('SELECT * FROM metrics WHERE child_id = ?');
    return stmt.all(child_id) as Metric[];
  }

  public createNote(note: Note): number {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare(`
      INSERT INTO notes (note_record, metric_id, event_id)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(note.note_record, note.metric_id, note.event_id);
    return result.lastInsertRowid as number;
  }

  public getNotesByMetricId(metric_id: number): Note[] {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare('SELECT * FROM notes WHERE metric_id = ?');
    return stmt.all(metric_id) as Note[];
  }

  public getNotesByEventId(event_id: number): Note[] {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare('SELECT * FROM notes WHERE event_id = ?');
    return stmt.all(event_id) as Note[];
  }

  public updateUser(user: User): void {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare(`
      UPDATE users 
      SET first_name = ?, last_name = ?, password = ?, username = ?, email_addr = ?
      WHERE user_id = ?
    `);
    
    stmt.run(user.first_name, user.last_name, user.password, user.username, user.email_addr, user.user_id);
  }

  public updatePassword(user: User): void {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare(`
      UPDATE users 
      SET password = ?, salt = ?
      WHERE user_id = ?
    `);
    
    stmt.run(user.password, user.salt, user.user_id);
  }
  
  public updateChild(child: Child): void {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare(`
      UPDATE children 
      SET first_name = ?, last_name = ?, birthday = ?
      WHERE child_id = ?
    `);
    
    stmt.run(child.first_name, child.last_name, child.birthday, child.child_id);
  }
  
  public getNotesByDayAndChild(child_id: number, date: Date): Note[] {
    if (!this.db) throw new Error('Database not initialized');

    return [];
  }

  public getFeedingByDayAndChild(child_id: number, date: Date): Metric[] {
    if (!this.db) throw new Error('Database not initialized');

    const dateStr = date.toISOString().split('T')[0] + '%';
    const stmt = this.db.prepare('SELECT * FROM metrics WHERE child_id = ? AND metric_date_time LIKE ? AND metric_type = 0');
    return stmt.all(child_id, dateStr) as Metric[];
  }
  
  public getSleepByDayAndChild(child_id: number, date: Date): Metric[] {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM metrics WHERE child_id = ? AND metric_date_time LIKE ? AND metric_type = 1');
    return stmt.all(child_id, date.toISOString().split('T')[0] + '%') as Metric[];
  }
  
  public getLastWeightByChildBeforeDate(child_id: number, date: Date): Metric | null {
    if (!this.db) throw new Error('Database not initialized');

    const dateString = date.toISOString();
    const stmt = this.db.prepare('SELECT * FROM metrics WHERE child_id = ? AND metric_type = 3 AND metric_date_time < ? ORDER BY metric_date_time DESC LIMIT 1');
    return stmt.get(child_id, dateString) as Metric | null;
  }
  
  public getLastHeightByChildBeforeDate(child_id: number, date: Date): Metric | null {
    if (!this.db) throw new Error('Database not initialized');

    const dateString = date.toISOString();
    const stmt = this.db.prepare('SELECT * FROM metrics WHERE child_id = ? AND metric_type = 2 AND metric_date_time < ? ORDER BY metric_date_time DESC LIMIT 1');
    return stmt.get(child_id, dateString) as Metric | null;
  }

  public getUpcomingEventsByDayAndChild(child_id: number, date: Date): Event[] {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM events WHERE child_id = ? AND event_start_date_time >= ? ORDER BY event_start_date_time ASC LIMIT 5');
    const result = stmt.all(child_id, date.toISOString()) as Event[];
    return result;
  }
  
  public getWeightMetrics(): Metric[] {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM metrics WHERE metric_type = 3');
    return stmt.all() as Metric[];
  }
  
  public getHeightMetrics(): Metric[] {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM metrics WHERE metric_type = 2');
    return stmt.all() as Metric[];
  }
  
  public getFeedingMetrics(): Metric[] {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM metrics WHERE metric_type = 0');
    return stmt.all() as Metric[];
  }
  
  public getSleepMetrics(): Metric[] {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM metrics WHERE metric_type = 1');
    return stmt.all() as Metric[];
  }
  
  public getMetric(metric_id: number): Metric | null {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM metrics WHERE metric_id = ?');
    const result = stmt.get(metric_id);
    if (!result) return null;
    if (Array.isArray(result)) {
      return {
        metric_id: result[0],
        metric_date_time: result[1],
        metric_type: result[2],
        child_id: result[3],
        metric_record: result[4]
      } as Metric;
    }
    return result as Metric;
  }
  
  public updateMetric(metric: Metric): void {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('UPDATE metrics SET metric_date_time = ?, metric_type = ?, child_id = ?, metric_record = ? WHERE metric_id = ?');
    stmt.run(metric.metric_date_time, metric.metric_type, metric.child_id, metric.metric_record, metric.metric_id);
  }
  
  public updateNote(note: Note): void {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('UPDATE notes SET note_record = ?, metric_id = ?, event_id = ? WHERE note_id = ?');
    stmt.run(note.note_record, note.metric_id, note.event_id, note.note_id);
  }
  
  public deleteNote(note_id: number): void {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('DELETE FROM notes WHERE note_id = ?');
    stmt.run(note_id);
  }
  
  public deleteMetric(metric_id: number): void {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('DELETE FROM metrics WHERE metric_id = ?');
    stmt.run(metric_id);
  }
  
  public deleteEvent(event_id: number): void {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('DELETE FROM events WHERE event_id = ?');
    stmt.run(event_id);
  } 
  
  public getEvent(event_id: number): Event | null {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM events WHERE event_id = ?');
    const result = stmt.get(event_id);
    if (!result) return null;
    if (Array.isArray(result)) {
      return {
        event_id: result[0],
        event_name: result[1],
        event_start_date_time: result[2],
        event_duration: result[3],
        event_type: result[4],
        child_id: result[5]
      } as Event;
    }
    return result as Event;
  }
  
  public updateEvent(event: Event): void {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('UPDATE events SET event_start_date_time = ?, event_duration = ?, event_type = ?, child_id = ?, event_name = ? WHERE event_id = ?');
    stmt.run(event.event_start_date_time, event.event_duration, event.event_type, event.child_id, event.event_name, event.event_id);
  }

  public getWeightMetricsInRange(startDate: Date, endDate: Date): Metric[] {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM metrics WHERE metric_type = ? AND metric_date_time BETWEEN ? AND ?');
    const results = stmt.all(MetricType.Weight, startDate, endDate);
    return results as Metric[];
  }

  public getHeightMetricsInRange(startDate: Date, endDate: Date): Metric[] {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM metrics WHERE metric_type = ? AND metric_date_time BETWEEN ? AND ?');
    const results = stmt.all(MetricType.Height, startDate, endDate);
    return results as Metric[];
  }

  public getFeedingMetricsInRange(startDate: Date, endDate: Date): Metric[] {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM metrics WHERE metric_type = ? AND metric_date_time BETWEEN ? AND ?');
    const results = stmt.all(MetricType.Feeding, startDate, endDate);
    return results as Metric[];
  }

  public getSleepMetricsInRange(startDate: Date, endDate: Date): Metric[] {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM metrics WHERE metric_type = ? AND metric_date_time BETWEEN ? AND ?');
    const results = stmt.all(MetricType.Sleep, startDate, endDate);
    return results as Metric[];
  }
  
  public close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
