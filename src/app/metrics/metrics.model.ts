import { MetricsDate } from './metrics-date.model';

export class Metrics {
  transactions: number;
  balance: number;
  users: number;
  days: MetricsDate[];
}
