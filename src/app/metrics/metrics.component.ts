import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { ApiService } from '../api.service'
import { Metrics } from './metrics.model'
import { MetricsDate } from './metrics-date.model'
import { Chart } from './chart.model';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {

  metrics: Metrics;
  chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        stacked: true,
      }]
    }
  }
  chartLabels: string[] = [];
  charts: Chart[] = [];
  colors: any[] = [];
  loading = true;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.loadMetrics()
  }

  loadMetrics() {
    this.loading = true;
    this.apiService.getMetrics().subscribe(
      metrics => {
        this.metrics = metrics;
        metrics.days = this.transformBalance(metrics.days)
        this.chartLabels = this.getLabels(metrics.days);
        this.charts = [
          this.balanceToChart(metrics.days),
          this.usersToChart(metrics.days),
          this.transactionsToChart(metrics.days)
        ]
        this.loading = false;
      },
      err => {
        this.loading = false;
      })
  }

  private balanceToChart(days: MetricsDate[]): Chart {
    return this.chartSkeleton(
      days,
      'Bezahlen/Aufladen',
      ['Aufladen', 'Bezahlen'],
      ['#4caf50', '#f44336'],
      ['chargeBalance', 'payBalance']
    );
  }

  private usersToChart(days: MetricsDate[]): Chart {
    return this.chartSkeleton(
      days,
      'Aktive Nutzer',
      ['Nutzer'],
      ['#3f51b5'],
      ['activeUsers']
    );
  }

  private transactionsToChart(days: MetricsDate[]): Chart {
    return this.chartSkeleton(
      days,
      'Transaktionen',
      ['Transaktionen'],
      ['#ffc107'],
      ['transactions']
    );
  }

  private getLabels(days: MetricsDate[]): string[] {
    return days.map(day => {
      return moment.unix(day.date).format('DD.MM.YYYY')
    })
  }

  private transformBalance(days: MetricsDate[]) {
    days.map(day => {
      day.chargeBalance /= 100
      day.payBalance = -day.payBalance / 100
      return day
    })
    return days
  }

  private chartSkeleton(days: MetricsDate[], title: string, datasets: string[], colors: string[], props: string[]) {
    let chart: Chart = {
      title,
      datasets: datasets.map(label => {
        return { data: [], label }
      }),
      colors: colors.map(backgroundColor => {
        return { backgroundColor }
      })
    }
    props.forEach((prop, i) => {
      days.forEach(day => {
        chart.datasets[i].data.push(day[props[i]])
      })
    })
    return chart;
  }

}

