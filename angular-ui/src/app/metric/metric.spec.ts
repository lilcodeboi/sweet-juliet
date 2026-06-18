import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { MetricComponent } from './metric';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { Metric } from '../../models/metric';
import { Note } from '../../models/note';
import { Child, Gender } from '../../models/child';

describe('MetricComponent', () => {
  let component: MetricComponent;
  let fixture: ComponentFixture<MetricComponent>;
  let mockDatabaseService: any;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockDatabaseService = {
      getMetric: vi.fn(),
      getNotesByMetricId: vi.fn(),
      createMetric: vi.fn(),
      updateMetric: vi.fn(),
      createNote: vi.fn(),
      deleteNote: vi.fn(),
      deleteMetric: vi.fn(),
    };

    mockAuthService = {
      getCurrentChild: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MetricComponent],
      providers: [
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();

    expect(component.metricForm).toBeDefined();
    expect(component.metricForm.get('metricType')).toBeDefined();
    expect(component.metricForm.get('metricTime')).toBeDefined();
    expect(component.metricForm.get('metricValue')).toBeDefined();
    expect(component.metricForm.get('metricNotes')).toBeDefined();
  });

  it('should load existing metric on ngOnInit when id is provided', () => {
    const metric: Metric = {
      metric_id: 1,
      metric_date_time: '2024-01-01T10:00:00',
      metric_type: 0,
      child_id: 1,
      metric_record: 10,
    };
    component.id = '1';
    mockDatabaseService.getMetric.mockResolvedValue(metric);
    mockDatabaseService.getNotesByMetricId.mockResolvedValue([]);

    component.ngOnInit();

    expect(component.metricExists).toBe(true);
    expect(mockDatabaseService.getMetric).toHaveBeenCalledWith(1);
  });

  it('should load notes for existing metric', () => {
    const notes: Note[] = [
      {
        note_id: 1,
        note_record: 'Test note',
        metric_id: 1,
        event_id: null,
      },
    ];
    const metric: Metric = {
      metric_id: 1,
      metric_date_time: '2024-01-01T10:00:00',
      metric_type: 0,
      child_id: 1,
      metric_record: 10,
    };
    component.id = '1';
    mockDatabaseService.getMetric.mockResolvedValue(metric);
    mockDatabaseService.getNotesByMetricId.mockResolvedValue(notes);

    component.ngOnInit();

    expect(mockDatabaseService.getNotesByMetricId).toHaveBeenCalledWith(1);
  });

  it('should submit new metric', () => {
    const child: Child = {
      child_id: 1,
      user_id: 1,
      first_name: 'Test',
      last_name: 'Child',
      gender: Gender.Male,
      birthday: new Date('2024-01-01'),
    };
    mockAuthService.getCurrentChild.mockReturnValue(child);
    mockDatabaseService.createMetric.mockResolvedValue(1);
    component.ngOnInit();
    component.metricForm.setValue({
      metricType: 0,
      metricTime: '10:00',
      metricValue: 10,
      metricNotes: '',
    });

    component.onSubmit();

    expect(mockDatabaseService.createMetric).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/summary']);
  });

  it('should submit metric with note', async () => {
    const child: Child = {
      child_id: 1,
      user_id: 1,
      first_name: 'Test',
      last_name: 'Child',
      gender: Gender.Male,
      birthday: new Date('2024-01-01'),
    };
    mockAuthService.getCurrentChild.mockReturnValue(child);
    mockDatabaseService.createMetric.mockResolvedValue(1);
    component.ngOnInit();
    component.metricForm.setValue({
      metricType: 0,
      metricTime: '10:00',
      metricValue: 10,
      metricNotes: 'Test note',
    });

    component.onSubmit();

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockDatabaseService.createNote).toHaveBeenCalled();
  });

  it('should update existing metric', () => {
    const child: Child = {
      child_id: 1,
      user_id: 1,
      first_name: 'Test',
      last_name: 'Child',
      gender: Gender.Male,
      birthday: new Date('2024-01-01'),
    };
    const metric: Metric = {
      metric_id: 1,
      metric_date_time: '2024-01-01T10:00:00',
      metric_type: 0,
      child_id: 1,
      metric_record: 10,
    };
    mockAuthService.getCurrentChild.mockReturnValue(child);
    component.id = '1';
    component.metric = metric;
    component.metricExists = true;
    mockDatabaseService.getMetric.mockResolvedValue(metric);
    mockDatabaseService.getNotesByMetricId.mockResolvedValue([]);
    component.ngOnInit();
    component.metricForm.setValue({
      metricType: 0,
      metricTime: '10:00',
      metricValue: 15,
      metricNotes: '',
    });

    component.onSubmit();

    expect(mockDatabaseService.updateMetric).toHaveBeenCalled();
  });

  it('should delete metric', () => {
    const metric: Metric = {
      metric_id: 1,
      metric_date_time: '2024-01-01T10:00:00',
      metric_type: 0,
      child_id: 1,
      metric_record: 10,
    };
    component.id = '1';
    mockDatabaseService.getMetric.mockResolvedValue(metric);
    mockDatabaseService.getNotesByMetricId.mockResolvedValue([]);
    component.ngOnInit();
    component.note = { note_id: 1, note_record: 'Test', metric_id: 1, event_id: null };
    mockDatabaseService.deleteMetric.mockResolvedValue(undefined);
    mockDatabaseService.deleteNote.mockResolvedValue(undefined);

    component.onDelete();

    expect(mockDatabaseService.deleteMetric).toHaveBeenCalledWith(1);
    expect(mockDatabaseService.deleteNote).toHaveBeenCalledWith(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/summary']);
  });

  it('should return correct metric unit', () => {
    component.ngOnInit();
    component.metricForm.get('metricType')?.setValue(0);

    const unit = component.getMetricUnit();

    expect(unit).toBe('oz');
  });

  it('should not submit if no child data available', () => {
    mockAuthService.getCurrentChild.mockReturnValue(null);
    component.ngOnInit();
    component.metricForm.setValue({
      metricType: 0,
      metricTime: '10:00',
      metricValue: 10,
      metricNotes: '',
    });

    component.onSubmit();

    expect(mockDatabaseService.createMetric).not.toHaveBeenCalled();
  });
});
