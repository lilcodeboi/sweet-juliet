import { Component, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Event } from '../../models/event';
import { Metric, MetricType, MetricUnit } from '../../models/metric';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar {
  databaseService = inject(DatabaseService);
  authService = inject(AuthService);
  router = inject(Router);

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    dayMaxEvents: true,
    moreLinkClick: 'popover',
    events: this.loadEvents.bind(this)
  };

  calendarMetrics: any[] = [];
  calendarEvents: any[] = [];

  constructor() {
    this.calendarOptions.eventClick = this.handleEventClick.bind(this);
    this.calendarOptions.dateClick = this.handleDateClick.bind(this);
  }

  private async loadEvents(info: any) {
    const child = this.authService.getCurrentChild();
    if (!child) {
      return [];
    }

    try {
      const events = await this.databaseService.getEventsByChildId(child.child_id);
      const calendarEvents = events.map((event: Event) => ({
        title: event.event_name,
        start: event.event_start_date_time,
        end: new Date(new Date(event.event_start_date_time).getTime() + event.event_duration * 60000),
        id: event.event_id,
        extendedProps: {
          type: 'event'
        }
      }));

      const metrics = await this.databaseService.getMetricsByChildId(child.child_id);
      const calendarMetrics = metrics.map((metric: Metric) => ({
        title: MetricType[metric.metric_type] + ' - ' + metric.metric_record + ' ' + MetricUnit[metric.metric_type],
        start: metric.metric_date_time,
        end: metric.metric_type === MetricType.Sleep ? new Date(new Date(metric.metric_date_time).getTime() + metric.metric_record * 60000 * 60) : new Date(new Date(metric.metric_date_time).getTime() + 60000),
        id: metric.metric_id,
        extendedProps: {
          type: 'metric',
          metric_type: metric.metric_type
        }
      }));

      this.calendarMetrics = calendarMetrics;
      this.calendarEvents = calendarEvents;
      return [...this.calendarEvents, ...this.calendarMetrics];
    } catch (error) {
      console.error('Error loading events:', error);
      return [];
    }
  }

  onAddEvent() {
    this.router.navigate(['/event']);
  }
  
  private handleEventClick(info: any) {
    if (info.event.extendedProps.type === 'event') {
      this.router.navigate(['/event', info.event.id]);
    } else if (info.event.extendedProps.type === 'metric') {
      this.router.navigate(['/metric', info.event.id, MetricType[info.event.extendedProps.metric_type], new Date(info.event.startStr).toISOString().split('T')[0]]);
    }
  }
  
  private handleDateClick(info: any) {
    this.router.navigate(['/summary', info.dateStr]);
  }
}
