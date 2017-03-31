import { Transaction } from '../transactions';

export class Wallet {
  id: number;
  name: string;
  balance: number;
  active: number;
  created: number;
  transactions: Transaction[];
}