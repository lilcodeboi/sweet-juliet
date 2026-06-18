import { Component, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MetricType, MetricUnit } from '../../models/metric';
import 'chartjs-adapter-date-fns'; 

@Component({
  selector: 'app-progression',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './progression.html',
  styleUrl: './progression.css',
})
export class Progression implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | null = null;
  authService = inject(AuthService);
  databaseService = inject(DatabaseService);
  fb = inject(FormBuilder);
  metricsCount = 0;
  chartData: any[] = [];
  timeUnit = 'day';

  private primaryTextColor = '#5b7a8a';
  private accentColor = '#bcead5';
  private taskbarColor = '#f1e6da';
  private hoverAccentColor = '#a8d8c2';

  private aggregateMetricsByTimeUnit(metrics: any[]): any[] {
    const aggregateTotals: { [key: string]: number } = {};
    
    metrics.forEach(metric => {
      const date = new Date(metric.metric_date_time);
      if (!isNaN(date.getTime())) {
        switch (this.timeUnit) {
          case 'day':
            const dateStr = date.toDateString();
            if (aggregateTotals[dateStr]) {
              aggregateTotals[dateStr] += metric.metric_record;
            } else {
              aggregateTotals[dateStr] = metric.metric_record;
            }
            break;
          case 'week':
            const week = this.getSundayOfCurrentWeek(date);
            if (aggregateTotals[week]) {
              aggregateTotals[week] += metric.metric_record;
            } else {
              aggregateTotals[week] = metric.metric_record;
            }
            break;
          case 'month':
            const month = date.toISOString().slice(0, 7);
            if (aggregateTotals[month]) {
              aggregateTotals[month] += metric.metric_record;
            } else {
              aggregateTotals[month] = metric.metric_record;
            }
            break;
          case 'year':
            const year = date.getFullYear().toString();
            if (aggregateTotals[year]) {
              aggregateTotals[year] += metric.metric_record;
            } else {
              aggregateTotals[year] = metric.metric_record;
            }
            break;
        }
      }
    });

    return Object.entries(aggregateTotals).map(([dateStr, total]) => ({
      x: new Date(dateStr).getTime(),
      y: total
    })).sort((a, b) => a.x - b.x);
  }

  private aggregateMetricsByHighest(metrics: any[]): any[] {
    const highestValues: { [key: string]: number } = {};
    
    metrics.forEach(metric => {
      const date = new Date(metric.metric_date_time);
      if (!isNaN(date.getTime())) {
        let dateStr: string | undefined;
        switch (this.timeUnit) {
          case 'day':
            dateStr = date.toDateString();
            break;
          case 'week':
            const week = this.getSundayOfCurrentWeek(date);
            dateStr = week;
            break;
          case 'month':
            const month = date.toISOString().slice(0, 7);
            dateStr = month;
            break;
          case 'year':
            const year = date.getFullYear().toString();
            dateStr = year;
            break;
        }
        if (dateStr && highestValues[dateStr]) {
          if (metric.metric_record > highestValues[dateStr]) {
            highestValues[dateStr] = metric.metric_record;
          }
        } else if (dateStr) {
          highestValues[dateStr] = metric.metric_record;
        }
      }
    });

    return Object.entries(highestValues).map(([dateStr, total]) => ({
      x: new Date(dateStr).getTime(),
      y: total
    })).sort((a, b) => a.x - b.x);
  }

  getSundayOfCurrentWeek(inputDate: Date = new Date()): string {
    const dateCopy = new Date(inputDate.getTime());
    const currentDayIndex = dateCopy.getDay();
    
    dateCopy.setDate(dateCopy.getDate() - currentDayIndex);
    
    dateCopy.setHours(0, 0, 0, 0); 
    
    return dateCopy.toDateString();
  }

  changeTimeUnit(newUnit: string) {
    if (this.chart) {
      (this.chart.options.scales as any)['x'].time.unit = newUnit;
      switch (newUnit) {
        case 'day':
          (this.chart.options.scales as any)['x'].time.displayFormats = { day: 'MMM d, yyyy' };
          break;
        case 'week':
          (this.chart.options.scales as any)['x'].time.displayFormats = { week: 'MMM d, yyyy' };
          break;
        case 'month':
          (this.chart.options.scales as any)['x'].time.displayFormats = { month: 'MMM yyyy' };
          break;
        case 'year':
          (this.chart.options.scales as any)['x'].time.displayFormats = { year: 'yyyy' };
          break;
      }
      this.chart.update();
    }
    this.timeUnit = newUnit;
  }

  formGroup = this.fb.group({
    metricType: '3',
    startDate: '',
    endDate: '',
    timeUnit: 'day'
  });

  ngAfterViewInit() {
    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            data: [],
            borderColor: this.primaryTextColor,
            backgroundColor: 'rgba(188, 234, 213, 0.4)',
            pointBackgroundColor: this.accentColor,
            pointBorderColor: this.primaryTextColor,
            pointHoverBackgroundColor: this.hoverAccentColor,
            pointHoverBorderColor: this.primaryTextColor,
            tension: 0.2,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: this.primaryTextColor,
                font: { weight: 'bold' }
              }
            },
            tooltip: {
              backgroundColor: this.primaryTextColor,
              titleColor: '#f8f2ed',
              bodyColor: '#f8f2ed'
            }
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: this.timeUnit as any,
                displayFormats: { day: 'MMM d, yyyy' }
              },
              grid: {
                color: this.taskbarColor
              },
              ticks: {
                color: this.primaryTextColor
              }
            },
            y: {
              beginAtZero: false,
              grid: {
                color: this.taskbarColor
              },
              ticks: {
                color: this.primaryTextColor
              }
            }
          }
        }
      });
      this.databaseService.getWeightMetrics().then(metrics => {
        this.metricsCount = metrics.length;
        if (this.chart) {
          this.chartData = this.aggregateMetricsByHighest(metrics);
          this.chart.data.datasets[0].data = this.chartData;
          this.chart.data.datasets[0].label = 'Weight (' + MetricUnit[MetricType.Weight] + ')';
          this.chart.update();
        }
      });
    }
  }
  
  onSubmit() {
    const metricType = this.formGroup.value.metricType;
    const metricTypeNum = parseInt(metricType as string);
    const startDate = this.formGroup.value.startDate;
    const endDate = this.formGroup.value.endDate;
    this.changeTimeUnit(this.formGroup.value.timeUnit as string);
    let startDateStr = null;
    let endDateStr = null;
    if (startDate && typeof startDate === 'string' && startDate.trim() !== '') {
      const start = new Date(startDate + 'T00:00:00');
      if (!isNaN(start.getTime())) {
        startDateStr = start.toISOString();
      }
    }
    if (endDate && typeof endDate === 'string' && endDate.trim() !== '') {
      const end = new Date(endDate + 'T23:59:59');
      if (!isNaN(end.getTime())) {
        endDateStr = end.toISOString();
      }
    }
    switch (metricType) {
      case '0':
        if (startDateStr && endDateStr) {
          this.databaseService.getFeedingMetricsInRange(startDateStr, endDateStr).then(metrics => {
            if (this.chart) {
              this.chartData = this.aggregateMetricsByTimeUnit(metrics);
              this.chart.data.datasets[0].data = this.chartData;
              this.chart.data.datasets[0].label = 'Feeding (' + MetricUnit[metricTypeNum as MetricType] + ')';
              this.chart.update();
            }
          });
        } else {
          this.databaseService.getFeedingMetrics().then(metrics => {
            if (this.chart) {
              this.chartData = this.aggregateMetricsByTimeUnit(metrics);
              this.chart.data.datasets[0].data = this.chartData;
              this.chart.data.datasets[0].label = 'Feeding (' + MetricUnit[metricTypeNum as MetricType] + ')';
              this.chart.update();
            }
          });
        }
        break;
      case '1':
        if (startDateStr && endDateStr) {
          this.databaseService.getSleepMetricsInRange(startDateStr, endDateStr).then(metrics => {
            if (this.chart) {
              this.chartData = this.aggregateMetricsByTimeUnit(metrics);
              this.chart.data.datasets[0].data = this.chartData;
              this.chart.data.datasets[0].label = 'Sleep (' + MetricUnit[MetricType.Sleep] + ')';
              this.chart.update();
            }
          });
        } else {
          this.databaseService.getSleepMetrics().then(metrics => {
            if (this.chart) {
              this.chartData = this.aggregateMetricsByTimeUnit(metrics);
              this.chart.data.datasets[0].data = this.chartData;
              this.chart.data.datasets[0].label = 'Sleep (' + MetricUnit[MetricType.Sleep] + ')';
              this.chart.update();
            }
          });
        }
        break;
      case '2':
        if (startDateStr && endDateStr) {
          this.databaseService.getHeightMetricsInRange(startDateStr, endDateStr).then(metrics => {
            if (this.chart) {
              this.chartData = this.aggregateMetricsByHighest(metrics);
              this.chart.data.datasets[0].data = this.chartData;
              this.chart.data.datasets[0].label = 'Height (' + MetricUnit[MetricType.Height] + ')';
              this.chart.update();
            }
          });
        } else {
          this.databaseService.getHeightMetrics().then(metrics => {
            if (this.chart) {
              this.chartData = this.aggregateMetricsByHighest(metrics);
              this.chart.data.datasets[0].data = this.chartData;
              this.chart.data.datasets[0].label = 'Height (' + MetricUnit[MetricType.Height] + ')';
              this.chart.update();
            }
          });
        }
        break;
      case '3':
        if (startDateStr && endDateStr) {
          this.databaseService.getWeightMetricsInRange(startDateStr, endDateStr).then(metrics => {
            if (this.chart) {
              this.chartData = this.aggregateMetricsByHighest(metrics);
              this.chart.data.datasets[0].data = this.chartData;
              this.chart.data.datasets[0].label = 'Weight (' + MetricUnit[MetricType.Weight] + ')';
              this.chart.update();
            }
          });
        } else {
          this.databaseService.getWeightMetrics().then(metrics => {
            if (this.chart) {
              this.chartData = this.aggregateMetricsByHighest(metrics);
              this.chart.data.datasets[0].data = this.chartData;
              this.chart.data.datasets[0].label = 'Weight (' + MetricUnit[MetricType.Weight] + ')';
              this.chart.update();
            }
          });
        }
        break;
      default:
        break;
    }
  }
}
