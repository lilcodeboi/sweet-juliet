import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { EventComponent } from './event';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { Event } from '../../models/event';
import { Note } from '../../models/note';
import { Child, Gender } from '../../models/child';
import { EventType } from '../../models/event';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;
  let mockDatabaseService: any;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockDatabaseService = {
      getEvent: vi.fn(),
      getNotesByEventId: vi.fn(),
      createEvent: vi.fn(),
      updateEvent: vi.fn(),
      createNote: vi.fn(),
      updateNote: vi.fn(),
      deleteNote: vi.fn(),
      deleteEvent: vi.fn(),
    };

    mockAuthService = {
      getCurrentChild: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [EventComponent],
      providers: [
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();

    expect(component.eventForm).toBeDefined();
    expect(component.eventForm.get('eventType')).toBeDefined();
    expect(component.eventForm.get('eventDateTime')).toBeDefined();
    expect(component.eventForm.get('eventDuration')).toBeDefined();
    expect(component.eventForm.get('eventName')).toBeDefined();
    expect(component.eventForm.get('eventNotes')).toBeDefined();
  });

  it('should load existing event on ngOnInit when id is provided', () => {
    const event: Event = {
      event_id: 1,
      event_name: 'Test Event',
      event_start_date_time: '2024-01-01T10:00:00',
      event_duration: 60,
      event_type: EventType.Appointment,
      child_id: 1,
    };
    component.id = '1';
    mockDatabaseService.getEvent.mockResolvedValue(event);
    mockDatabaseService.getNotesByEventId.mockResolvedValue([]);

    component.ngOnInit();

    expect(component.eventExists).toBe(true);
    expect(mockDatabaseService.getEvent).toHaveBeenCalledWith(1);
  });

  it('should load notes for existing event', () => {
    const notes: Note[] = [
      {
        note_id: 1,
        note_record: 'Test note',
        metric_id: null,
        event_id: 1,
      },
    ];
    const event: Event = {
      event_id: 1,
      event_name: 'Test Event',
      event_start_date_time: '2024-01-01T10:00:00',
      event_duration: 60,
      event_type: EventType.Appointment,
      child_id: 1,
    };
    component.id = '1';
    mockDatabaseService.getEvent.mockResolvedValue(event);
    mockDatabaseService.getNotesByEventId.mockResolvedValue(notes);

    component.ngOnInit();

    expect(mockDatabaseService.getNotesByEventId).toHaveBeenCalledWith(1);
  });

  it('should submit new event', () => {
    const child: Child = {
      child_id: 1,
      user_id: 1,
      first_name: 'Test',
      last_name: 'Child',
      gender: Gender.Male,
      birthday: new Date('2024-01-01'),
    };
    mockAuthService.getCurrentChild.mockReturnValue(child);
    mockDatabaseService.createEvent.mockResolvedValue(1);
    component.ngOnInit();
    component.eventForm.setValue({
      eventType: EventType.Appointment,
      eventDateTime: '2024-01-01T10:00',
      eventDuration: 60,
      eventName: 'Test Event',
      eventNotes: '',
    });

    component.onSubmit();

    expect(mockDatabaseService.createEvent).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/summary']);
  });

  it('should submit event with note', async () => {
    const child: Child = {
      child_id: 1,
      user_id: 1,
      first_name: 'Test',
      last_name: 'Child',
      gender: Gender.Male,
      birthday: new Date('2024-01-01'),
    };
    mockAuthService.getCurrentChild.mockReturnValue(child);
    mockDatabaseService.createEvent.mockResolvedValue(1);
    component.ngOnInit();
    component.eventForm.setValue({
      eventType: EventType.Appointment,
      eventDateTime: '2024-01-01T10:00',
      eventDuration: 60,
      eventName: 'Test Event',
      eventNotes: 'Test note',
    });

    component.onSubmit();

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockDatabaseService.createNote).toHaveBeenCalled();
  });

  it('should update existing event', () => {
    const child: Child = {
      child_id: 1,
      user_id: 1,
      first_name: 'Test',
      last_name: 'Child',
      gender: Gender.Male,
      birthday: new Date('2024-01-01'),
    };
    const event: Event = {
      event_id: 1,
      event_name: 'Test Event',
      event_start_date_time: '2024-01-01T10:00:00',
      event_duration: 60,
      event_type: EventType.Appointment,
      child_id: 1,
    };
    mockAuthService.getCurrentChild.mockReturnValue(child);
    component.id = '1';
    component.event = event;
    component.eventExists = true;
    mockDatabaseService.getEvent.mockResolvedValue(event);
    mockDatabaseService.getNotesByEventId.mockResolvedValue([]);
    component.ngOnInit();
    component.eventForm.setValue({
      eventType: EventType.Milestone,
      eventDateTime: '2024-01-01T10:00',
      eventDuration: 90,
      eventName: 'Updated Event',
      eventNotes: '',
    });

    component.onSubmit();

    expect(mockDatabaseService.updateEvent).toHaveBeenCalled();
  });

  it('should delete event', () => {
    const event: Event = {
      event_id: 1,
      event_name: 'Test Event',
      event_start_date_time: '2024-01-01T10:00:00',
      event_duration: 60,
      event_type: EventType.Appointment,
      child_id: 1,
    };
    component.id = '1';
    mockDatabaseService.getEvent.mockResolvedValue(event);
    mockDatabaseService.getNotesByEventId.mockResolvedValue([]);
    component.ngOnInit();
    component.note = { note_id: 1, note_record: 'Test', metric_id: null, event_id: 1 };
    mockDatabaseService.deleteEvent.mockResolvedValue(undefined);
    mockDatabaseService.deleteNote.mockResolvedValue(undefined);

    component.onDelete();

    expect(mockDatabaseService.deleteEvent).toHaveBeenCalledWith(1);
    expect(mockDatabaseService.deleteNote).toHaveBeenCalledWith(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/summary']);
  });

  it('should not submit if no child data available', () => {
    mockAuthService.getCurrentChild.mockReturnValue(null);
    component.ngOnInit();
    component.eventForm.setValue({
      eventType: EventType.Appointment,
      eventDateTime: '2024-01-01T10:00',
      eventDuration: 60,
      eventName: 'Test Event',
      eventNotes: '',
    });

    component.onSubmit();

    expect(mockDatabaseService.createEvent).not.toHaveBeenCalled();
  });
});
