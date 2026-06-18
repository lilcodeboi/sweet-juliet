import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { Summary } from './summary';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { Note } from '../../models/note';
import { Event } from '../../models/event';
import { Metric, MetricType } from '../../models/metric';
import { Child, Gender } from '../../models/child';

describe('Summary', () => {
  let component: Summary;
  let fixture: ComponentFixture<Summary>;
  let mockDatabaseService: any;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockDatabaseService = {
      getNotesByDayAndChild: vi.fn(),
      getFeedingByDayAndChild: vi.fn(),
      getSleepByDayAndChild: vi.fn(),
      getLastWeightByChildBeforeDate: vi.fn(),
      getLastHeightByChildBeforeDate: vi.fn(),
      getUpcomingEventsByDayAndChild: vi.fn(),
    };

    mockAuthService = {
      getCurrentChild: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Summary],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Summary);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize metric units', () => {
    expect(component.feedingUnit).toBeDefined();
    expect(component.sleepUnit).toBeDefined();
    expect(component.heightUnit).toBeDefined();
    expect(component.weightUnit).toBeDefined();
  });

  it('should load data on ngOnInit', () => {
    const child: Child = {
      child_id: 1,
      user_id: 1,
      first_name: 'Test',
      last_name: 'Child',
      gender: Gender.Male,
      birthday: new Date('2024-01-01'),
    };
    mockAuthService.getCurrentChild.mockReturnValue(child);
    mockDatabaseService.getNotesByDayAndChild.mockResolvedValue([]);
    mockDatabaseService.getFeedingByDayAndChild.mockResolvedValue([]);
    mockDatabaseService.getSleepByDayAndChild.mockResolvedValue([]);
    mockDatabaseService.getLastWeightByChildBeforeDate.mockResolvedValue(null);
    mockDatabaseService.getLastHeightByChildBeforeDate.mockResolvedValue(null);
    mockDatabaseService.getUpcomingEventsByDayAndChild.mockResolvedValue([]);

    component.ngOnInit();

    expect(mockAuthService.getCurrentChild).toHaveBeenCalled();
  });

  it('should not load data if no child', () => {
    mockAuthService.getCurrentChild.mockReturnValue(null);

    component.loadData();

    expect(mockDatabaseService.getNotesByDayAndChild).not.toHaveBeenCalled();
  });

  it('should navigate to add feeding', () => {
    component.onAddFeeding();

    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should navigate to add sleep', () => {
    component.onAddSleep();

    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should navigate to add biometrics', () => {
    component.onAddBiometrics();

    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should navigate to add event', () => {
    component.onAddEvent();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/event']);
  });

  it('should format date for URL', () => {
    const date = new Date(2024, 0, 15);
    const result = (component as any).formatDateForUrl(date);

    expect(result).toBe('2024-01-15');
  });

  it('should navigate to previous day', () => {
    const originalDate = new Date(component.summaryDate);
    component.onPrevious();

    expect(component.summaryDate.getTime()).toBeLessThan(originalDate.getTime());
  });

  it('should navigate to next day', () => {
    const originalDate = new Date(component.summaryDate);
    component.onNext();

    expect(component.summaryDate.getTime()).toBeGreaterThan(originalDate.getTime());
  });

  it('should identify event correctly', () => {
    const event: Event = {
      event_id: 1,
      event_name: 'Test',
      event_start_date_time: '2024-01-01T10:00:00',
      event_duration: 60,
      event_type: 0,
      child_id: 1,
    };

    expect(component.isEvent(event)).toBe(true);
  });

  it('should identify metric correctly', () => {
    const metric: Metric = {
      metric_id: 1,
      metric_date_time: '2024-01-01T10:00:00',
      metric_type: MetricType.Sleep,
      child_id: 1,
      metric_record: 8,
    };

    expect(component.isEvent(metric)).toBe(false);
  });

  it('should handle null in isEvent', () => {
    expect(component.isEvent(null)).toBe(false);
    expect(component.isEvent(undefined)).toBe(false);
  });
});
