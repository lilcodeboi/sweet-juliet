import { Component, inject, OnInit, Input } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Metric } from '../../models/metric';
import { Note } from '../../models/note';
import { CommonModule } from '@angular/common';
import { MetricUnit, MetricType } from '../../models/metric';

@Component({
  selector: 'app-metric',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './metric.html',
  styleUrl: './metric.css',
})
export class MetricComponent implements OnInit {
  protected readonly MetricType = MetricType;
  protected readonly MetricUnit = MetricUnit;
  protected readonly Number = Number;
  fb = inject(FormBuilder);
  databaseService = inject(DatabaseService);
  authService = inject(AuthService);
  router = inject(Router);
  
  metricExists = false;
  metric: Metric | null = null;
  note: Note | null = null;
  metricForm!: FormGroup;
  @Input() id?: string;
  @Input() type?: string;
  @Input() date?: string;
  metricId: number = 0;
  dbResult: any = null;
  metricDate = new Date();

  ngOnInit() {
    if (this.date) {
      const [year, month, day] = this.date.split('-').map(Number);
      this.metricDate = new Date(year, month - 1, day);
    }
    this.metricId = parseInt(this.id || '0');
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeString = `${currentHours}:${currentMinutes}`;
    this.metricForm = this.fb.group({
      metricType: [this.type ? parseInt(this.type) : 0],
      metricTime: [currentTimeString],
      metricValue: [0, [Validators.required, Validators.min(0.1)]],
      metricNotes: ['']
    });    

    if (this.metricId && this.metricId !== -1) {
      this.metricExists = true;
      this.databaseService.getMetric(this.metricId).then((metric) => {
        this.dbResult = metric;
        if (!metric) {
          console.error('Metric not found');
          return;
        }
        this.metric = metric;
        const dateTime = new Date(metric.metric_date_time);
        const localTime = dateTime.toTimeString().slice(0, 5);
        this.metricForm.patchValue({
          metricType: metric.metric_type,
          metricTime: localTime,
          metricValue: metric.metric_record
        });
      }).catch((error) => {
        this.dbResult = error;
        console.error('Error loading metric:', error);
      });
      this.databaseService.getNotesByMetricId(this.metricId).then((notes) => {
        if (notes.length > 0) {
          this.note = notes[0];
          this.metricForm.patchValue({
            metricNotes: notes[0].note_record
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

    if (this.metricExists) {
      const metric: Metric = {
        metric_id: this.metricId,
        metric_date_time: `${this.metric?.metric_date_time.split('T')[0]} ${this.metricForm.value.metricTime}`,
        metric_type: this.metricForm.value.metricType,
        child_id: child.child_id,
        metric_record: this.metricForm.value.metricValue
      };
      
      this.databaseService.updateMetric(metric);
      
      if (this.metricForm.value.metricNotes) {
        const note: Note = {
          note_id: this.note?.note_id || 0,
          note_record: this.metricForm.value.metricNotes,
          metric_id: this.metricId,
          event_id: null
        };
        
        this.databaseService.updateNote(note);
      } else if (this.note?.note_id) {
        this.databaseService.deleteNote(this.note.note_id);
      }
    } else {
      const metric: Metric = {
        metric_id: 0,
        metric_date_time: `${this.metricDate.toISOString().split('T')[0]} ${this.metricForm.value.metricTime}`,
        metric_type: this.metricForm.value.metricType,
        child_id: child.child_id,
        metric_record: this.metricForm.value.metricValue
      };

      const metricId = this.databaseService.createMetric(
        metric
      );

      if (this.metricForm.value.metricNotes) {
        const note: Note = {
          note_id: this.note?.note_id || 0,
          note_record: this.metricForm.value.metricNotes,
          metric_id: null,
          event_id: null
        };

        metricId.then((id) => {
          note.metric_id = id;
          this.databaseService.createNote(note);
        });
      }
    }
    this.router.navigate(['/summary']);
  }
  
  onDelete() {
    this.databaseService.deleteMetric(this.metricId);
    if (this.note?.note_id) {
      this.databaseService.deleteNote(this.note.note_id);
    }
    this.router.navigate(['/summary']);
  }

  getMetricUnit(): string {
    const formValue = this.metricForm.get('metricType')?.value;
    
    const typeKey = Number(formValue) as MetricType;
    
    return MetricUnit[typeKey] || '';
  }
}
