export enum EventType {
  Appointment = 0,
  Milestone = 1,
  Other = 2
}

export interface Event {
  event_id: number;
  event_name: string;
  event_start_date_time: string;
  event_duration: number;
  event_type: EventType;
  child_id: number;
}