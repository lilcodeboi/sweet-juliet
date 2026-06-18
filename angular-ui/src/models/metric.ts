export enum MetricType {
  Feeding = 0,
  Sleep = 1,
  Height = 2,
  Weight = 3
}

export const MetricUnit = {
  [MetricType.Feeding]: 'oz',
  [MetricType.Sleep]: 'hrs',
  [MetricType.Height]: 'in',
  [MetricType.Weight]: 'lbs'
} as const;

export interface Metric {
  metric_id: number;
  metric_date_time: string;
  metric_type: MetricType;
  child_id: number;
  metric_record: number;
}