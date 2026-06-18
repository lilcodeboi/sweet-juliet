import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Event } from '../models/event';
import { Child } from '../models/child';
import { Metric } from '../models/metric';
import { Note } from '../models/note';
import { AuthService } from './auth.service';

declare global {
  interface Window {
    electronAPI: {
      createUser: (user: User) => Promise<number>;
      getUserById: (user_id: number) => Promise<User>;
      getUserByUsername: (username: string) => Promise<User>;
      createChild: (child: Child) => Promise<number>;
      getChildrenByUserId: (user_id: number) => Promise<Child[]>;
      createEvent: (event: Event) => Promise<number>;
      getEvent: (event_id: number) => Promise<Event>;
      getEventsByChildId: (child_id: number) => Promise<Event[]>;
      createMetric: (metric: Metric) => Promise<number>;
      getMetricsByChildId: (child_id: number) => Promise<Metric[]>;
      createNote: (note: Note) => Promise<number>;
      getNotesByMetricId: (metric_id: number) => Promise<Note[]>;
      getNotesByEventId: (event_id: number) => Promise<Note[]>;
      updateUser: (user: User) => Promise<void>;
      updateChild: (child: Child) => Promise<void>;
      updateMetric: (metric: Metric) => Promise<void>;
      updateNote: (note: Note) => Promise<void>;
      updateEvent: (event: Event) => Promise<void>;
      getNotesByDayAndChild: (child_id: number, date: Date) => Promise<Note[]>;
      getFeedingByDayAndChild: (child_id: number, date: Date) => Promise<Metric[]>;
      getSleepByDayAndChild: (child_id: number, date: Date) => Promise<Metric[]>;
      getLastWeightByChildBeforeDate: (child_id: number, date: Date) => Promise<Metric | null>;
      getLastHeightByChildBeforeDate: (child_id: number, date: Date) => Promise<Metric | null>;
      getUpcomingEventsByDayAndChild: (child_id: number, date: Date) => Promise<Event[]>;
      getWeightMetrics: () => Promise<Metric[]>;
      getHeightMetrics: () => Promise<Metric[]>;
      getFeedingMetrics: () => Promise<Metric[]>;
      getSleepMetrics: () => Promise<Metric[]>;
      getMetric: (metric_id: number) => Promise<Metric>;
      deleteNote: (note_id: number) => Promise<void>;
      deleteMetric: (metric_id: number) => Promise<void>;
      deleteEvent: (event_id: number) => Promise<void>;
      getWeightMetricsInRange: (startDate: string, endDate: string) => Promise<Metric[]>;
      getHeightMetricsInRange: (startDate: string, endDate: string) => Promise<Metric[]>;
      getFeedingMetricsInRange: (startDate: string, endDate: string) => Promise<Metric[]>;
      getSleepMetricsInRange: (startDate: string, endDate: string) => Promise<Metric[]>;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private authService: AuthService) {
    if (!window.electronAPI) {
      console.error('Electron API not available');
    }
  }

  async createUser(user: User): Promise<number> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    const { hash, salt } = await this.authService.hashPassword(user.password);
    user.password = hash;
    user.salt = salt;
    return window.electronAPI.createUser(user);
  }

  async getUserById(user_id: number): Promise<User> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getUserById(user_id);
  }

  async getUserByUsername(username: string): Promise<User> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getUserByUsername(username);
  }
  
  async createChild(child: Child): Promise<number> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.createChild(child);
  }

  async getChildrenByUserId(user_id: number): Promise<Child[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getChildrenByUserId(user_id);
  }

  async createEvent(event: Event): Promise<number> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.createEvent(event);
  }
  
  async getEvent(event_id: number): Promise<Event> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getEvent(event_id);
  }
  
  async deleteEvent(event_id: number): Promise<void> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.deleteEvent(event_id);
  }

  async getEventsByChildId(child_id: number): Promise<Event[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getEventsByChildId(child_id);
  }

  async createMetric(metric: Metric): Promise<number> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.createMetric(metric);
  }

  async getMetricsByChildId(child_id: number): Promise<Metric[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getMetricsByChildId(child_id);
  }

  async createNote(note: Note): Promise<number> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.createNote(note);
  }

  async getNotesByMetricId(metric_id: number): Promise<Note[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getNotesByMetricId(metric_id);
  }

  async getNotesByEventId(event_id: number): Promise<Note[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getNotesByEventId(event_id);
  }

  async updateUser(user: User): Promise<void> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    const { hash, salt } = await this.authService.hashPassword(user.password);
    user.password = hash;
    user.salt = salt;
    return window.electronAPI.updateUser(user);
  }

  async updatePassword(user: User): Promise<void> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    const { hash, salt } = await this.authService.hashPassword(user.password);
    user.password = hash;
    user.salt = salt;
    return window.electronAPI.updateUser(user);
  }

  async updateChild(child: Child): Promise<void> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.updateChild(child);
  }
  
  async updateMetric(metric: Metric): Promise<void> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.updateMetric(metric);
  }
  
  async updateEvent(event: Event): Promise<void> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.updateEvent(event);
  }
  
  async updateNote(note: Note): Promise<void> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.updateNote(note);
  }
  
  async getNotesByDayAndChild(child_id: number, date: Date): Promise<Note[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getNotesByDayAndChild(child_id, date);
  }

  async getFeedingByDayAndChild(child_id: number, date: Date): Promise<Metric[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getFeedingByDayAndChild(child_id, date);
  }

  async getSleepByDayAndChild(child_id: number, date: Date): Promise<Metric[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getSleepByDayAndChild(child_id, date);
  }
  
  async getLastWeightByChildBeforeDate(child_id: number, date: Date): Promise<Metric | null> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getLastWeightByChildBeforeDate(child_id, date);
  }

  async getLastHeightByChildBeforeDate(child_id: number, date: Date): Promise<Metric | null> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getLastHeightByChildBeforeDate(child_id, date);
  }
  
  async getUpcomingEventsByDayAndChild(child_id: number, date: Date): Promise<Event[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getUpcomingEventsByDayAndChild(child_id, date);
  }

  async getWeightMetrics(): Promise<Metric[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getWeightMetrics();
  }

  async getHeightMetrics(): Promise<Metric[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getHeightMetrics();
  }

  async getFeedingMetrics(): Promise<Metric[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getFeedingMetrics();
  }

  async getSleepMetrics(): Promise<Metric[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getSleepMetrics();
  }

  async getMetric(metric_id: number): Promise<Metric | null> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getMetric(metric_id);
  }
  
  async deleteNote(note_id: number): Promise<void> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.deleteNote(note_id);
  }
  
  async deleteMetric(metric_id: number): Promise<void> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.deleteMetric(metric_id);
  }

  async getWeightMetricsInRange(startDate: string, endDate: string): Promise<Metric[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getWeightMetricsInRange(startDate, endDate);
  }

  async getHeightMetricsInRange(startDate: string, endDate: string): Promise<Metric[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getHeightMetricsInRange(startDate, endDate);
  }

  async getFeedingMetricsInRange(startDate: string, endDate: string): Promise<Metric[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getFeedingMetricsInRange(startDate, endDate);
  }

  async getSleepMetricsInRange(startDate: string, endDate: string): Promise<Metric[]> {
    if (!window.electronAPI) throw new Error('Electron API not available');
    return window.electronAPI.getSleepMetricsInRange(startDate, endDate);
  }
}
