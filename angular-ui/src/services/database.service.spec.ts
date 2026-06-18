import { TestBed } from '@angular/core/testing';
import { DatabaseService } from './database.service';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { Child, Gender } from '../models/child';
import { Event, EventType } from '../models/event';
import { Metric, MetricType } from '../models/metric';
import { Note } from '../models/note';
import { vi } from 'vitest';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let authService: AuthService;
  let mockElectronAPI: any;

  beforeEach(() => {
    mockElectronAPI = {
      createUser: vi.fn(),
      getUserById: vi.fn(),
      getUserByUsername: vi.fn(),
      createChild: vi.fn(),
      getChildrenByUserId: vi.fn(),
      createEvent: vi.fn(),
      getEvent: vi.fn(),
      getEventsByChildId: vi.fn(),
      createMetric: vi.fn(),
      getMetricsByChildId: vi.fn(),
      createNote: vi.fn(),
      getNotesByMetricId: vi.fn(),
      getNotesByEventId: vi.fn(),
      updateUser: vi.fn(),
      updateChild: vi.fn(),
      updateMetric: vi.fn(),
      updateNote: vi.fn(),
      updateEvent: vi.fn(),
      getNotesByDayAndChild: vi.fn(),
      getFeedingByDayAndChild: vi.fn(),
      getSleepByDayAndChild: vi.fn(),
      getLastWeightByChildBeforeDate: vi.fn(),
      getLastHeightByChildBeforeDate: vi.fn(),
      getUpcomingEventsByDayAndChild: vi.fn(),
      getWeightMetrics: vi.fn(),
      getHeightMetrics: vi.fn(),
      getFeedingMetrics: vi.fn(),
      getSleepMetrics: vi.fn(),
      getMetric: vi.fn(),
      deleteNote: vi.fn(),
      deleteMetric: vi.fn(),
      deleteEvent: vi.fn(),
      getWeightMetricsInRange: vi.fn(),
      getHeightMetricsInRange: vi.fn(),
      getFeedingMetricsInRange: vi.fn(),
      getSleepMetricsInRange: vi.fn(),
    };

    (globalThis as any).window = {
      electronAPI: mockElectronAPI,
    };

    authService = new AuthService();
    service = new DatabaseService(authService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUser', () => {
    it('should hash password and create user', async () => {
      const user: User = {
        user_id: 1,
        username: 'testuser',
        password: 'password123',
        salt: '',
        first_name: 'Test',
        last_name: 'User',
        email_addr: 'test@example.com',
      };
      mockElectronAPI.createUser.mockResolvedValue(1);
      authService.hashPassword = vi.fn().mockResolvedValue({ hash: 'newhash', salt: 'newsalt' });

      const result = await service.createUser(user);

      expect(authService.hashPassword).toHaveBeenCalled();
      expect(mockElectronAPI.createUser).toHaveBeenCalled();
      expect(result).toBe(1);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;
      const user: User = {
        user_id: 1,
        username: 'testuser',
        password: 'password123',
        salt: '',
        first_name: 'Test',
        last_name: 'User',
        email_addr: 'test@example.com',
      };

      await expect(service.createUser(user)).rejects.toThrow('Electron API not available');
    });
  });

  describe('getUserById', () => {
    it('should get user by id', async () => {
      const user: User = {
        user_id: 1,
        username: 'testuser',
        password: 'hashed',
        salt: 'salt',
        first_name: 'Test',
        last_name: 'User',
        email_addr: 'test@example.com',
      };
      mockElectronAPI.getUserById.mockResolvedValue(user);

      const result = await service.getUserById(1);

      expect(mockElectronAPI.getUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getUserById(1)).rejects.toThrow('Electron API not available');
    });
  });

  describe('getUserByUsername', () => {
    it('should get user by username', async () => {
      const user: User = {
        user_id: 1,
        username: 'testuser',
        password: 'hashed',
        salt: 'salt',
        first_name: 'Test',
        last_name: 'User',
        email_addr: 'test@example.com',
      };
      mockElectronAPI.getUserByUsername.mockResolvedValue(user);

      const result = await service.getUserByUsername('testuser');

      expect(mockElectronAPI.getUserByUsername).toHaveBeenCalledWith('testuser');
      expect(result).toEqual(user);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getUserByUsername('testuser')).rejects.toThrow('Electron API not available');
    });
  });

  describe('createChild', () => {
    it('should create child', async () => {
      const child: Child = {
        child_id: 1,
        user_id: 1,
        first_name: 'Test',
        last_name: 'Child',
        gender: Gender.Male,
        birthday: new Date('2024-01-01'),
      };
      mockElectronAPI.createChild.mockResolvedValue(1);

      const result = await service.createChild(child);

      expect(mockElectronAPI.createChild).toHaveBeenCalledWith(child);
      expect(result).toBe(1);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;
      const child: Child = {
        child_id: 1,
        user_id: 1,
        first_name: 'Test',
        last_name: 'Child',
        gender: Gender.Male,
        birthday: new Date('2024-01-01'),
      };

      await expect(service.createChild(child)).rejects.toThrow('Electron API not available');
    });
  });

  describe('getChildrenByUserId', () => {
    it('should get children by user id', async () => {
      const children: Child[] = [
        {
          child_id: 1,
          user_id: 1,
          first_name: 'Test',
          last_name: 'Child',
          gender: Gender.Male,
          birthday: new Date('2024-01-01'),
        },
      ];
      mockElectronAPI.getChildrenByUserId.mockResolvedValue(children);

      const result = await service.getChildrenByUserId(1);

      expect(mockElectronAPI.getChildrenByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual(children);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getChildrenByUserId(1)).rejects.toThrow('Electron API not available');
    });
  });

  describe('createEvent', () => {
    it('should create event', async () => {
      const event: Event = {
        event_id: 1,
        child_id: 1,
        event_name: 'Test Event',
        event_start_date_time: '2024-01-01T10:00:00',
        event_duration: 60,
        event_type: EventType.Appointment,
      };
      mockElectronAPI.createEvent.mockResolvedValue(1);

      const result = await service.createEvent(event);

      expect(mockElectronAPI.createEvent).toHaveBeenCalledWith(event);
      expect(result).toBe(1);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;
      const event: Event = {
        event_id: 1,
        child_id: 1,
        event_name: 'Test Event',
        event_start_date_time: '2024-01-01T10:00:00',
        event_duration: 60,
        event_type: EventType.Appointment,
      };

      await expect(service.createEvent(event)).rejects.toThrow('Electron API not available');
    });
  });

  describe('getEvent', () => {
    it('should get event by id', async () => {
      const event: Event = {
        event_id: 1,
        child_id: 1,
        event_name: 'Test Event',
        event_start_date_time: '2024-01-01T10:00:00',
        event_duration: 60,
        event_type: EventType.Appointment,
      };
      mockElectronAPI.getEvent.mockResolvedValue(event);

      const result = await service.getEvent(1);

      expect(mockElectronAPI.getEvent).toHaveBeenCalledWith(1);
      expect(result).toEqual(event);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getEvent(1)).rejects.toThrow('Electron API not available');
    });
  });

  describe('deleteEvent', () => {
    it('should delete event', async () => {
      mockElectronAPI.deleteEvent.mockResolvedValue(undefined);

      await service.deleteEvent(1);

      expect(mockElectronAPI.deleteEvent).toHaveBeenCalledWith(1);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.deleteEvent(1)).rejects.toThrow('Electron API not available');
    });
  });

  describe('getEventsByChildId', () => {
    it('should get events by child id', async () => {
      const events: Event[] = [
        {
          event_id: 1,
          child_id: 1,
          event_name: 'Event 1',
          event_start_date_time: '2024-01-01T10:00:00',
          event_duration: 60,
          event_type: EventType.Appointment,
        },
      ];
      mockElectronAPI.getEventsByChildId.mockResolvedValue(events);

      const result = await service.getEventsByChildId(1);

      expect(mockElectronAPI.getEventsByChildId).toHaveBeenCalledWith(1);
      expect(result).toEqual(events);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getEventsByChildId(1)).rejects.toThrow('Electron API not available');
    });
  });

  describe('createMetric', () => {
    it('should create metric', async () => {
      const metric: Metric = {
        metric_id: 1,
        child_id: 1,
        metric_type: MetricType.Weight,
        metric_record: 10,
        metric_date_time: '2024-01-01T10:00:00',
      };
      mockElectronAPI.createMetric.mockResolvedValue(1);

      const result = await service.createMetric(metric);

      expect(mockElectronAPI.createMetric).toHaveBeenCalledWith(metric);
      expect(result).toBe(1);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;
      const metric: Metric = {
        metric_id: 1,
        child_id: 1,
        metric_type: MetricType.Weight,
        metric_record: 10,
        metric_date_time: '2024-01-01T10:00:00',
      };

      await expect(service.createMetric(metric)).rejects.toThrow('Electron API not available');
    });
  });

  describe('getMetricsByChildId', () => {
    it('should get metrics by child id', async () => {
      const metrics: Metric[] = [
        {
          metric_id: 1,
          child_id: 1,
          metric_type: MetricType.Weight,
          metric_record: 10,
          metric_date_time: '2024-01-01T10:00:00',
        },
      ];
      mockElectronAPI.getMetricsByChildId.mockResolvedValue(metrics);

      const result = await service.getMetricsByChildId(1);

      expect(mockElectronAPI.getMetricsByChildId).toHaveBeenCalledWith(1);
      expect(result).toEqual(metrics);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getMetricsByChildId(1)).rejects.toThrow('Electron API not available');
    });
  });

  describe('createNote', () => {
    it('should create note', async () => {
      const note: Note = {
        note_id: 1,
        metric_id: 1,
        event_id: null,
        note_record: 'Test note',
      };
      mockElectronAPI.createNote.mockResolvedValue(1);

      const result = await service.createNote(note);

      expect(mockElectronAPI.createNote).toHaveBeenCalledWith(note);
      expect(result).toBe(1);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;
      const note: Note = {
        note_id: 1,
        metric_id: 1,
        event_id: null,
        note_record: 'Test note',
      };

      await expect(service.createNote(note)).rejects.toThrow('Electron API not available');
    });
  });

  describe('getNotesByMetricId', () => {
    it('should get notes by metric id', async () => {
      const notes: Note[] = [
        {
          note_id: 1,
          metric_id: 1,
          event_id: null,
          note_record: 'Note 1',
        },
      ];
      mockElectronAPI.getNotesByMetricId.mockResolvedValue(notes);

      const result = await service.getNotesByMetricId(1);

      expect(mockElectronAPI.getNotesByMetricId).toHaveBeenCalledWith(1);
      expect(result).toEqual(notes);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getNotesByMetricId(1)).rejects.toThrow('Electron API not available');
    });
  });

  describe('getNotesByEventId', () => {
    it('should get notes by event id', async () => {
      const notes: Note[] = [
        {
          note_id: 1,
          metric_id: null,
          event_id: 1,
          note_record: 'Note 1',
        },
      ];
      mockElectronAPI.getNotesByEventId.mockResolvedValue(notes);

      const result = await service.getNotesByEventId(1);

      expect(mockElectronAPI.getNotesByEventId).toHaveBeenCalledWith(1);
      expect(result).toEqual(notes);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getNotesByEventId(1)).rejects.toThrow('Electron API not available');
    });
  });

  describe('updateUser', () => {
    it('should hash password and update user', async () => {
      const user: User = {
        user_id: 1,
        username: 'testuser',
        password: 'newpassword',
        salt: '',
        first_name: 'Test',
        last_name: 'User',
        email_addr: 'test@example.com',
      };
      mockElectronAPI.updateUser.mockResolvedValue(undefined);
      authService.hashPassword = vi.fn().mockResolvedValue({ hash: 'newhash', salt: 'newsalt' });

      await service.updateUser(user);

      expect(authService.hashPassword).toHaveBeenCalled();
      expect(mockElectronAPI.updateUser).toHaveBeenCalled();
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;
      const user: User = {
        user_id: 1,
        username: 'testuser',
        password: 'newpassword',
        salt: '',
        first_name: 'Test',
        last_name: 'User',
        email_addr: 'test@example.com',
      };

      await expect(service.updateUser(user)).rejects.toThrow('Electron API not available');
    });
  });

  describe('updatePassword', () => {
    it('should hash password and update user', async () => {
      const user: User = {
        user_id: 1,
        username: 'testuser',
        password: 'newpassword',
        salt: '',
        first_name: 'Test',
        last_name: 'User',
        email_addr: 'test@example.com',
      };
      mockElectronAPI.updateUser.mockResolvedValue(undefined);
      authService.hashPassword = vi.fn().mockResolvedValue({ hash: 'newhash', salt: 'newsalt' });

      await service.updatePassword(user);

      expect(authService.hashPassword).toHaveBeenCalled();
      expect(mockElectronAPI.updateUser).toHaveBeenCalled();
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;
      const user: User = {
        user_id: 1,
        username: 'testuser',
        password: 'newpassword',
        salt: '',
        first_name: 'Test',
        last_name: 'User',
        email_addr: 'test@example.com',
      };

      await expect(service.updatePassword(user)).rejects.toThrow('Electron API not available');
    });
  });

  describe('updateChild', () => {
    it('should update child', async () => {
      const child: Child = {
        child_id: 1,
        user_id: 1,
        first_name: 'Updated',
        last_name: 'Child',
        gender: Gender.Male,
        birthday: new Date('2024-01-01'),
      };
      mockElectronAPI.updateChild.mockResolvedValue(undefined);

      await service.updateChild(child);

      expect(mockElectronAPI.updateChild).toHaveBeenCalledWith(child);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;
      const child: Child = {
        child_id: 1,
        user_id: 1,
        first_name: 'Updated',
        last_name: 'Child',
        gender: Gender.Male,
        birthday: new Date('2024-01-01'),
      };

      await expect(service.updateChild(child)).rejects.toThrow('Electron API not available');
    });
  });

  describe('updateMetric', () => {
    it('should update metric', async () => {
      const metric: Metric = {
        metric_id: 1,
        child_id: 1,
        metric_type: MetricType.Weight,
        metric_record: 15,
        metric_date_time: '2024-01-01T10:00:00',
      };
      mockElectronAPI.updateMetric.mockResolvedValue(undefined);

      await service.updateMetric(metric);

      expect(mockElectronAPI.updateMetric).toHaveBeenCalledWith(metric);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;
      const metric: Metric = {
        metric_id: 1,
        child_id: 1,
        metric_type: MetricType.Weight,
        metric_record: 15,
        metric_date_time: '2024-01-01T10:00:00',
      };

      await expect(service.updateMetric(metric)).rejects.toThrow('Electron API not available');
    });
  });

  describe('updateEvent', () => {
    it('should update event', async () => {
      const event: Event = {
        event_id: 1,
        child_id: 1,
        event_name: 'Updated Event',
        event_start_date_time: '2024-01-01T10:00:00',
        event_duration: 60,
        event_type: EventType.Appointment,
      };
      mockElectronAPI.updateEvent.mockResolvedValue(undefined);

      await service.updateEvent(event);

      expect(mockElectronAPI.updateEvent).toHaveBeenCalledWith(event);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;
      const event: Event = {
        event_id: 1,
        child_id: 1,
        event_name: 'Updated Event',
        event_start_date_time: '2024-01-01T10:00:00',
        event_duration: 60,
        event_type: EventType.Appointment,
      };

      await expect(service.updateEvent(event)).rejects.toThrow('Electron API not available');
    });
  });

  describe('updateNote', () => {
    it('should update note', async () => {
      const note: Note = {
        note_id: 1,
        metric_id: 1,
        event_id: null,
        note_record: 'Updated note',
      };
      mockElectronAPI.updateNote.mockResolvedValue(undefined);

      await service.updateNote(note);

      expect(mockElectronAPI.updateNote).toHaveBeenCalledWith(note);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;
      const note: Note = {
        note_id: 1,
        metric_id: 1,
        event_id: null,
        note_record: 'Updated note',
      };

      await expect(service.updateNote(note)).rejects.toThrow('Electron API not available');
    });
  });

  describe('deleteNote', () => {
    it('should delete note', async () => {
      mockElectronAPI.deleteNote.mockResolvedValue(undefined);

      await service.deleteNote(1);

      expect(mockElectronAPI.deleteNote).toHaveBeenCalledWith(1);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.deleteNote(1)).rejects.toThrow('Electron API not available');
    });
  });

  describe('deleteMetric', () => {
    it('should delete metric', async () => {
      mockElectronAPI.deleteMetric.mockResolvedValue(undefined);

      await service.deleteMetric(1);

      expect(mockElectronAPI.deleteMetric).toHaveBeenCalledWith(1);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.deleteMetric(1)).rejects.toThrow('Electron API not available');
    });
  });

  describe('getMetric', () => {
    it('should get metric by id', async () => {
      const metric: Metric = {
        metric_id: 1,
        child_id: 1,
        metric_type: MetricType.Weight,
        metric_record: 10,
        metric_date_time: '2024-01-01T10:00:00',
      };
      mockElectronAPI.getMetric.mockResolvedValue(metric);

      const result = await service.getMetric(1);

      expect(mockElectronAPI.getMetric).toHaveBeenCalledWith(1);
      expect(result).toEqual(metric);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getMetric(1)).rejects.toThrow('Electron API not available');
    });
  });

  describe('getWeightMetrics', () => {
    it('should get weight metrics', async () => {
      const metrics: Metric[] = [
        {
          metric_id: 1,
          child_id: 1,
          metric_type: MetricType.Weight,
          metric_record: 10,
          metric_date_time: '2024-01-01T10:00:00',
        },
      ];
      mockElectronAPI.getWeightMetrics.mockResolvedValue(metrics);

      const result = await service.getWeightMetrics();

      expect(mockElectronAPI.getWeightMetrics).toHaveBeenCalled();
      expect(result).toEqual(metrics);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getWeightMetrics()).rejects.toThrow('Electron API not available');
    });
  });

  describe('getHeightMetrics', () => {
    it('should get height metrics', async () => {
      const metrics: Metric[] = [
        {
          metric_id: 1,
          child_id: 1,
          metric_type: MetricType.Height,
          metric_record: 50,
          metric_date_time: '2024-01-01T10:00:00',
        },
      ];
      mockElectronAPI.getHeightMetrics.mockResolvedValue(metrics);

      const result = await service.getHeightMetrics();

      expect(mockElectronAPI.getHeightMetrics).toHaveBeenCalled();
      expect(result).toEqual(metrics);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getHeightMetrics()).rejects.toThrow('Electron API not available');
    });
  });

  describe('getFeedingMetrics', () => {
    it('should get feeding metrics', async () => {
      const metrics: Metric[] = [
        {
          metric_id: 1,
          child_id: 1,
          metric_type: MetricType.Feeding,
          metric_record: 100,
          metric_date_time: '2024-01-01T10:00:00',
        },
      ];
      mockElectronAPI.getFeedingMetrics.mockResolvedValue(metrics);

      const result = await service.getFeedingMetrics();

      expect(mockElectronAPI.getFeedingMetrics).toHaveBeenCalled();
      expect(result).toEqual(metrics);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getFeedingMetrics()).rejects.toThrow('Electron API not available');
    });
  });

  describe('getSleepMetrics', () => {
    it('should get sleep metrics', async () => {
      const metrics: Metric[] = [
        {
          metric_id: 1,
          child_id: 1,
          metric_type: MetricType.Sleep,
          metric_record: 8,
          metric_date_time: '2024-01-01T10:00:00',
        },
      ];
      mockElectronAPI.getSleepMetrics.mockResolvedValue(metrics);

      const result = await service.getSleepMetrics();

      expect(mockElectronAPI.getSleepMetrics).toHaveBeenCalled();
      expect(result).toEqual(metrics);
    });

    it('should throw error when Electron API is not available', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getSleepMetrics()).rejects.toThrow('Electron API not available');
    });
  });

  describe('range query methods', () => {
    it('should get weight metrics in range', async () => {
      const metrics: Metric[] = [];
      mockElectronAPI.getWeightMetricsInRange.mockResolvedValue(metrics);

      const result = await service.getWeightMetricsInRange('2024-01-01', '2024-12-31');

      expect(mockElectronAPI.getWeightMetricsInRange).toHaveBeenCalledWith('2024-01-01', '2024-12-31');
      expect(result).toEqual(metrics);
    });

    it('should get height metrics in range', async () => {
      const metrics: Metric[] = [];
      mockElectronAPI.getHeightMetricsInRange.mockResolvedValue(metrics);

      const result = await service.getHeightMetricsInRange('2024-01-01', '2024-12-31');

      expect(mockElectronAPI.getHeightMetricsInRange).toHaveBeenCalledWith('2024-01-01', '2024-12-31');
      expect(result).toEqual(metrics);
    });

    it('should get feeding metrics in range', async () => {
      const metrics: Metric[] = [];
      mockElectronAPI.getFeedingMetricsInRange.mockResolvedValue(metrics);

      const result = await service.getFeedingMetricsInRange('2024-01-01', '2024-12-31');

      expect(mockElectronAPI.getFeedingMetricsInRange).toHaveBeenCalledWith('2024-01-01', '2024-12-31');
      expect(result).toEqual(metrics);
    });

    it('should get sleep metrics in range', async () => {
      const metrics: Metric[] = [];
      mockElectronAPI.getSleepMetricsInRange.mockResolvedValue(metrics);

      const result = await service.getSleepMetricsInRange('2024-01-01', '2024-12-31');

      expect(mockElectronAPI.getSleepMetricsInRange).toHaveBeenCalledWith('2024-01-01', '2024-12-31');
      expect(result).toEqual(metrics);
    });

    it('should throw error when Electron API is not available for range queries', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getWeightMetricsInRange('2024-01-01', '2024-12-31')).rejects.toThrow(
        'Electron API not available'
      );
    });
  });

  describe('date-based query methods', () => {
    it('should get notes by day and child', async () => {
      const notes: Note[] = [];
      mockElectronAPI.getNotesByDayAndChild.mockResolvedValue(notes);

      const result = await service.getNotesByDayAndChild(1, new Date('2024-01-01'));

      expect(mockElectronAPI.getNotesByDayAndChild).toHaveBeenCalledWith(1, expect.any(Date));
      expect(result).toEqual(notes);
    });

    it('should get feeding by day and child', async () => {
      const metrics: Metric[] = [];
      mockElectronAPI.getFeedingByDayAndChild.mockResolvedValue(metrics);

      const result = await service.getFeedingByDayAndChild(1, new Date('2024-01-01'));

      expect(mockElectronAPI.getFeedingByDayAndChild).toHaveBeenCalledWith(1, expect.any(Date));
      expect(result).toEqual(metrics);
    });

    it('should get sleep by day and child', async () => {
      const metrics: Metric[] = [];
      mockElectronAPI.getSleepByDayAndChild.mockResolvedValue(metrics);

      const result = await service.getSleepByDayAndChild(1, new Date('2024-01-01'));

      expect(mockElectronAPI.getSleepByDayAndChild).toHaveBeenCalledWith(1, expect.any(Date));
      expect(result).toEqual(metrics);
    });

    it('should get last weight by child before date', async () => {
      const metric: Metric = {
        metric_id: 1,
        child_id: 1,
        metric_type: MetricType.Weight,
        metric_record: 10,
        metric_date_time: '2024-01-01T10:00:00',
      };
      mockElectronAPI.getLastWeightByChildBeforeDate.mockResolvedValue(metric);

      const result = await service.getLastWeightByChildBeforeDate(1, new Date('2024-01-01'));

      expect(mockElectronAPI.getLastWeightByChildBeforeDate).toHaveBeenCalledWith(1, expect.any(Date));
      expect(result).toEqual(metric);
    });

    it('should get last height by child before date', async () => {
      const metric: Metric = {
        metric_id: 1,
        child_id: 1,
        metric_type: MetricType.Height,
        metric_record: 50,
        metric_date_time: '2024-01-01T10:00:00',
      };
      mockElectronAPI.getLastHeightByChildBeforeDate.mockResolvedValue(metric);

      const result = await service.getLastHeightByChildBeforeDate(1, new Date('2024-01-01'));

      expect(mockElectronAPI.getLastHeightByChildBeforeDate).toHaveBeenCalledWith(1, expect.any(Date));
      expect(result).toEqual(metric);
    });

    it('should get upcoming events by day and child', async () => {
      const events: Event[] = [];
      mockElectronAPI.getUpcomingEventsByDayAndChild.mockResolvedValue(events);

      const result = await service.getUpcomingEventsByDayAndChild(1, new Date('2024-01-01'));

      expect(mockElectronAPI.getUpcomingEventsByDayAndChild).toHaveBeenCalledWith(1, expect.any(Date));
      expect(result).toEqual(events);
    });

    it('should throw error when Electron API is not available for date-based queries', async () => {
      (globalThis as any).window.electronAPI = undefined;

      await expect(service.getNotesByDayAndChild(1, new Date('2024-01-01'))).rejects.toThrow(
        'Electron API not available'
      );
    });
  });
});
