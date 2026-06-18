import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { Note } from '../../models/note';
import { Event } from '../../models/event';
import { Metric, MetricType, MetricUnit } from '../../models/metric';

@Component({
  selector: 'app-summary',
  imports: [CommonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
})
export class Summary implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  database = inject(DatabaseService);
  authService = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  protected readonly MetricType = MetricType;

  feedingUnit = MetricUnit[MetricType.Feeding];
  sleepUnit = MetricUnit[MetricType.Sleep];
  heightUnit = MetricUnit[MetricType.Height];
  weightUnit = MetricUnit[MetricType.Weight];

  summaryDate = new Date();
  summaryDateString = '';

  feedingCount = 0;
  sleepCount = 0;
  lastWeight = 0;
  lastHeight = 0;

  upcomingEvents: Event[] = [];
  notes: Note[] = [];
  feedings: Metric[] = [];
  sleep: Metric[] = [];
  weight: Metric = {} as Metric;
  height: Metric = {} as Metric;

  notesWithAssociations: { note: Note; associated: Event | Metric | null }[] = [];

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['date']) {
        const [year, month, day] = params['date'].split('-').map(Number);
        this.summaryDate = new Date(year, month - 1, day);
      }
      this.summaryDateString = this.summaryDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      this.loadData();
    });
  }

  loadData() {
    this.sleepCount = 0;
    this.feedingCount = 0;
    this.lastWeight = 0;
    this.lastHeight = 0;
    this.notesWithAssociations = [];
    const child = this.authService.getCurrentChild();
    if (!child) {
      return;
    }

    Promise.all([
      this.database.getNotesByDayAndChild(child.child_id, this.summaryDate),
      this.database.getFeedingByDayAndChild(child.child_id, this.summaryDate),
      this.database.getSleepByDayAndChild(child.child_id, this.summaryDate),
      this.database.getLastWeightByChildBeforeDate(child.child_id, this.summaryDate),
      this.database.getLastHeightByChildBeforeDate(child.child_id, this.summaryDate),
      this.database.getUpcomingEventsByDayAndChild(child.child_id, this.summaryDate)
    ]).then(([notes, feedings, sleeps, weight, height, events]) => {
      this.notes = notes;
      this.feedings = feedings;
      this.sleep = sleeps;
      this.weight = weight || {} as Metric;
      this.height = height || {} as Metric;
      this.upcomingEvents = events;

      for (const feeding of feedings) {
        this.feedingCount += feeding.metric_record;
      }
      for (const sleep of sleeps) {
        this.sleepCount += sleep.metric_record;
      }
      this.lastWeight = weight?.metric_record || 0;
      this.lastHeight = height?.metric_record || 0;

      for (const note of notes) {
        let associated: Event | Metric | null = null;
        if (note.event_id) {
          associated = this.upcomingEvents.find(e => e.event_id === note.event_id) || null;
        } else if (note.metric_id) {
          associated = this.feedings.find(m => m.metric_id === note.metric_id) ||
                       this.sleep.find(m => m.metric_id === note.metric_id) ||
                       (this.weight.metric_id === note.metric_id ? this.weight : null) ||
                       (this.height.metric_id === note.metric_id ? this.height : null);
        }
        this.notesWithAssociations.push({ note, associated });
      }

      this.cdr.detectChanges();
    });
  }

  onAddFeeding() { 
    this.router.navigate(['/metric', '-1', '0', this.formatDateForUrl(this.summaryDate)]);
  }

  onAddSleep() {
    this.router.navigate(['/metric', '-1', '1', this.formatDateForUrl(this.summaryDate)]);
  }

  onAddBiometrics() {
    this.router.navigate(['/metric', '-1', '2', this.formatDateForUrl(this.summaryDate)]);
  }

  onAddEvent() {
    this.router.navigate(['/event']);
  }

  private formatDateForUrl(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    return `${year}-${month}-${day}`;
  }
  
  onPrevious() {
    this.summaryDate = new Date(this.summaryDate.getTime() - 24 * 60 * 60 * 1000);
    this.summaryDateString = this.summaryDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    this.loadData();
  }

  onNext() {
    this.summaryDate = new Date(this.summaryDate.getTime() + 24 * 60 * 60 * 1000);
    this.summaryDateString = this.summaryDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    this.loadData();
  }

  isEvent(item: any): boolean {
    return item !== null && item !== undefined && 'event_start_date_time' in item;
  }
}