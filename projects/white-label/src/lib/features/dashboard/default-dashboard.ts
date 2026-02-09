import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatChip } from '@angular/material/chips';

import { DefaultStepper } from '../stepper/default-stepper';
import { StepDefinition } from '../stepper/step-definition';

interface AccountSummary {
  label: string;
  balance: number;
  icon: string;
  trend: string;
}

interface Transaction {
  date: Date;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
}

@Component({
  selector: 'lib-default-dashboard',
  imports: [
    CurrencyPipe, DatePipe,
    MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle,
    MatIcon, MatDivider, MatChip,
    DefaultStepper,
  ],
  templateUrl: './default-dashboard.html',
  styleUrl: './default-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultDashboard {
  readonly accounts = signal<AccountSummary[]>([
    { label: 'Checking Account', balance: 12_450.80, icon: 'account_balance_wallet', trend: '+2.4%' },
    { label: 'Savings Account', balance: 48_320.15, icon: 'savings', trend: '+5.1%' },
    { label: 'Investment Portfolio', balance: 125_890.00, icon: 'trending_up', trend: '+12.7%' },
    { label: 'Credit Card', balance: -2_340.50, icon: 'credit_card', trend: '-18.3%' },
  ]);

  readonly recentTransactions = signal<Transaction[]>([
    { date: new Date(2026, 1, 8), description: 'Salary Deposit - Acme Corp', amount: 5_200.00, type: 'credit', category: 'Income' },
    { date: new Date(2026, 1, 7), description: 'Whole Foods Market', amount: -127.43, type: 'debit', category: 'Groceries' },
    { date: new Date(2026, 1, 7), description: 'Netflix Subscription', amount: -15.99, type: 'debit', category: 'Entertainment' },
    { date: new Date(2026, 1, 6), description: 'Transfer to Savings', amount: -1_000.00, type: 'debit', category: 'Transfer' },
    { date: new Date(2026, 1, 5), description: 'Freelance Payment - Design', amount: 850.00, type: 'credit', category: 'Income' },
    { date: new Date(2026, 1, 5), description: 'Electric Bill - ConEd', amount: -142.30, type: 'debit', category: 'Utilities' },
    { date: new Date(2026, 1, 4), description: 'Amazon Purchase', amount: -67.89, type: 'debit', category: 'Shopping' },
    { date: new Date(2026, 1, 3), description: 'Gym Membership', amount: -49.99, type: 'debit', category: 'Health' },
  ]);

  readonly loanSteps = signal<StepDefinition[]>([
    { label: 'Personal Info' },
    { label: 'Income Details' },
    { label: 'Loan Amount' },
    { label: 'Review & Submit' },
  ]);
}
