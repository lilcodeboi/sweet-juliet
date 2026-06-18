import { Component, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Event } from '../../models/event';
import { Note } from '../../models/note';

@Component({
  selector: 'app-event',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './event.html',
  styleUrl: './event.css',
})
export class EventComponent implements OnInit {
  fb = inject(FormBuilder);
  databaseService = inject(DatabaseService);
  authService = inject(AuthService);
  router = inject(Router);

  @Input() id?: string;
  eventId: number = 0;
  event: Event | null = null;
  note: Note | null = null;
  eventExists: boolean = false;
  eventForm!: FormGroup;

  ngOnInit() {
    this.eventId = parseInt(this.id || '0');
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
    this.eventForm = this.fb.group({
      eventType: [0],
      eventDateTime: [currentDateTimeString],
      eventDuration: [0],
      eventName: ['', [Validators.required, Validators.minLength(3)]],
      eventNotes: ['']
    });

    if (this.eventId) {
      this.eventExists = true;
      this.databaseService.getEvent(this.eventId).then((event) => {
        if (!event) {
          return;
        }
        this.event = event;
        const dateTime = new Date(event.event_start_date_time);
        const localDateTime = new Date(dateTime.getTime() - (dateTime.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        this.eventForm.patchValue({
          eventType: event.event_type,
          eventDateTime: localDateTime,
          eventName: event.event_name,
          eventDuration: event.event_duration
        });
      }).catch((error) => {
        console.error('Error loading event:', error);
      });
      this.databaseService.getNotesByEventId(this.eventId).then((notes) => {
        if (notes.length > 0) {
          this.note = notes[0];
          this.eventForm.patchValue({
            eventNotes: notes[0].note_record
          });
        }
      });
    }
  }

  onSubmit() {
      const child = this.authService.getCurrentChild();
      if (!child) {
        console.error('No child data available');
        return;
      }
  
      if (this.eventExists) {
        const event: Event = {
          event_id: this.eventId,
          event_start_date_time: this.eventForm.value.eventDateTime,
          event_type: this.eventForm.value.eventType,
          child_id: child.child_id,
          event_name: this.eventForm.value.eventName,
          event_duration: this.eventForm.value.eventDuration
        };
        
        this.databaseService.updateEvent(event);
        
        if (this.eventForm.value.eventNotes) {
          const note: Note = {
            note_id: this.note?.note_id || 0,
            note_record: this.eventForm.value.eventNotes,
            metric_id: null,
            event_id: this.eventId
          };
          
          this.databaseService.updateNote(note);
        } else if (this.note?.note_id) {
          this.databaseService.deleteNote(this.note.note_id);
        }
      } else {
        const event: Event = {
          event_id: 0,
          event_start_date_time: this.eventForm.value.eventDateTime,
          event_type: this.eventForm.value.eventType,
          child_id: child.child_id,
          event_name: this.eventForm.value.eventName,
          event_duration: this.eventForm.value.eventDuration
        };
  
        const eventId = this.databaseService.createEvent(
          event
        );
  
        if (this.eventForm.value.eventNotes) {
          const note: Note = {
            note_id: this.note?.note_id || 0,
            note_record: this.eventForm.value.eventNotes,
            metric_id: null,
            event_id: null
          };
  
          eventId.then((id) => {
            note.event_id = id;
            this.databaseService.createNote(note);
          });
        }
      }
      this.router.navigate(['/summary']);
    }
    
    onDelete() {
      this.databaseService.deleteEvent(this.eventId);
      if (this.note?.note_id) {
        this.databaseService.deleteNote(this.note.note_id);
      }
      this.router.navigate(['/summary']);
    }
}
