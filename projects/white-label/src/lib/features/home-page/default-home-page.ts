import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BRAND_CONFIG, LOAN_CONFIG } from 'core';

interface QuickAction {
  icon: string;
  label: string;
  description: string;
}

interface PromoOffer {
  title: string;
  subtitle: string;
  highlight: string;
  icon: string;
  cta: string;
}

@Component({
  selector: 'lib-default-home-page',
  imports: [
    CurrencyPipe,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardActions,
    MatButton,
    MatIcon,
    MatDivider,
    RouterLink,
  ],
  templateUrl: './default-home-page.html',
  styleUrl: './default-home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultHomePage {
  private readonly brandConfig = inject(BRAND_CONFIG, { optional: true });
  private readonly loanConfig = inject(LOAN_CONFIG, { optional: true });

  readonly brandName = computed(() => this.brandConfig?.name ?? 'App');
  readonly showLoanCta = !!this.loanConfig;
  readonly netWorth = signal(184_620.45);

  readonly quickActions = signal<QuickAction[]>([
    { icon: 'swap_horiz', label: 'Transfer', description: 'Move money between accounts' },
    { icon: 'send', label: 'Send Money', description: 'Pay friends & family instantly' },
    { icon: 'receipt', label: 'Pay Bills', description: 'One-click bill payments' },
    { icon: 'savings', label: 'Auto-Save', description: 'Set up recurring deposits' },
    { icon: 'credit_card', label: 'Card Controls', description: 'Freeze, limits & alerts' },
    { icon: 'insights', label: 'Spending Insights', description: 'Track where your money goes' },
  ]);

  readonly promoOffers = signal<PromoOffer[]>([
    {
      title: 'Premium Savings',
      subtitle: 'Limited time offer',
      highlight: '4.75% APY',
      icon: 'star',
      cta: 'Open Account',
    },
    {
      title: 'Home Mortgage',
      subtitle: 'Rates starting at',
      highlight: '5.99% APR',
      icon: 'house',
      cta: 'Get Pre-Approved',
    },
    {
      title: 'Travel Rewards Card',
      subtitle: 'Earn on every purchase',
      highlight: '3X Points',
      icon: 'flight',
      cta: 'Apply Now',
    },
  ]);
}
