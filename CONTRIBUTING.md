# White-Label POC — Contributing Guide

## Architecture Overview

```
white-label-poc/
├── projects/
│   ├── core/                  # Contracts: DI tokens, interfaces, services
│   ├── white-label/           # Shared UI: layouts, pages, components
│   ├── green-bank/            # Brand app: config-only (sidenav + light theme)
│   ├── purple-bank/           # Brand app: config-only (topnav + dark theme)
│   ├── blue-bank/             # Brand app: config + 1 custom component (topnav + wizard + simulator)
│   └── dev-shell/             # Tooling: side-by-side brand preview
└── tsconfig.json              # Source paths for hot reload
```

### The Golden Rule

**Absolutely zero code duplication.** Every piece of UI that appears in more than one app MUST live in `white-label` (or `core` for contracts). Brand apps contain ONLY configuration and DI providers — never templates, styles, or component logic.

### Layer Responsibilities

| Layer | Contains | Never Contains |
|-------|----------|----------------|
| **core** | Interfaces, DI tokens, services (business logic) | Components, templates, styles |
| **white-label** | Default UI components, layouts, pages, services | Business logic, brand-specific config |
| **Brand apps** | DI provider values, Material theme SCSS, brand-specific override components | Shared logic, components used by more than one brand |
| **dev-shell** | Brand wrappers for side-by-side preview | Production code (never imported by brand apps) |

### Angular Coding Rules

All code in this workspace follows these conventions:

- `inject()` function — never constructor injection
- `ChangeDetectionStrategy.OnPush` — on every component
- `input()` / `output()` / `model()` functions — never `@Input()` / `@Output()` decorators
- `@if` / `@for` / `@switch` — never `*ngIf` / `*ngFor` / `*ngSwitch`
- `computed()` for derived state, `signal()` for mutable state
- `providedIn: 'root'` for all services
- No `standalone: true` (it's the default)
- No `any` type — use `unknown` or a proper type
- No `@HostBinding` / `@HostListener` — use the `host` object in `@Component`
- Lazy loading via `loadComponent` for all feature routes
- ARIA labels on all interactive elements

### Hot Reload

The `tsconfig.json` paths point to library **source** files, not `dist/`:

```json
"core": ["./projects/core/src/public-api.ts"],
"white-label": ["./projects/white-label/src/public-api.ts"]
```

This means `ng serve` hot-reloads library changes instantly. No need to rebuild libraries during development. The `ng build core && ng build white-label` step is only required in CI for ng-packagr validation.

---

## How To: Add a New Brand App

Adding a new brand requires **zero new components**. You only provide configuration values.

### Step 1 — Generate the app

```bash
ng generate application blue-bank --style=scss --routing
```

### Step 2 — `app.component.ts`

The root component simply renders the white-label shell. No custom template.

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WhiteLabelRoot } from 'white-label';

@Component({
  selector: 'app-root',
  imports: [WhiteLabelRoot],
  template: '<lib-white-label-root />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
```

### Step 3 — `app.config.ts`

This is where your brand lives. You choose your layout, your nav structure, your auth provider — all via DI tokens.

**Example with sidenav layout (like green-bank):**

```typescript
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  AUTH_CONFIG,
  BRAND_CONFIG,
  LOAN_CONFIG,
  ROOT_LAYOUT_TOKEN,
  SIDENAV_CONFIG,
  SidenavSection,
} from 'core';
import { DefaultSidenavLayout } from 'white-label';

import { routes } from './app.routes';

const SIDENAV_SECTIONS: readonly SidenavSection[] = [
  {
    header: 'Overview',
    items: [
      { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
      { icon: 'account_balance', label: 'Accounts', route: '/accounts' },
      { icon: 'receipt_long', label: 'Transactions', route: '/transactions' },
    ],
  },
  {
    header: 'Services',
    items: [
      { icon: 'swap_horiz', label: 'Transfers', route: '/transfers' },
      { icon: 'payment', label: 'Payments', route: '/payments' },
      { icon: 'request_quote', label: 'Loans', route: '/loans' },
      { icon: 'credit_card', label: 'Cards', route: '/cards' },
    ],
  },
  {
    header: 'Settings',
    items: [
      { icon: 'person', label: 'Profile', route: '/profile' },
      { icon: 'security', label: 'Security', route: '/security' },
    ],
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: BRAND_CONFIG, useValue: { name: 'GreenBank', primaryColor: '#0f5132', theme: 'light' as const } },
    { provide: AUTH_CONFIG, useValue: { provider: 'google' as const, sessionDurationSeconds: 3600, loginUrl: '/api/auth/login' } },
    { provide: ROOT_LAYOUT_TOKEN, useValue: DefaultSidenavLayout },
    { provide: SIDENAV_CONFIG, useValue: SIDENAV_SECTIONS },
    {
      provide: LOAN_CONFIG,
      useValue: {
        minAmount: 1000,
        maxAmount: 50_000,
        minTermMonths: 12,
        maxTermMonths: 60,
        purposes: ['Home Improvement', 'Debt Consolidation', 'Education', 'Medical Expenses', 'Vehicle Purchase', 'Other'],
        incomeVerification: 'self-declared' as const,
        requiresEmployerVerification: false,
      },
    },
  ],
};
```

**Example with topnav layout (like purple-bank):**

```typescript
import {
  AUTH_CONFIG,
  BRAND_CONFIG,
  LOAN_CONFIG,
  MenuGroup,
  ROOT_LAYOUT_TOKEN,
  TOPNAV_CONFIG,
} from 'core';
import { DefaultTopNavLayout } from 'white-label';

const TOPNAV_MENUS: readonly MenuGroup[] = [
  { icon: 'home', label: 'Home', route: '/home' },
  {
    icon: 'account_balance',
    label: 'Accounts',
    children: [
      { icon: 'account_balance_wallet', label: 'Checking' },
      { icon: 'savings', label: 'Savings' },
      { icon: 'credit_card', label: 'Credit Cards' },
      { icon: 'account_balance', label: 'Certificates of Deposit' },
    ],
  },
  {
    icon: 'payment',
    label: 'Payments',
    children: [
      { icon: 'swap_horiz', label: 'Transfer Funds' },
      { icon: 'send', label: 'Send Money' },
      { icon: 'receipt', label: 'Pay Bills' },
      { icon: 'schedule', label: 'Scheduled Payments' },
    ],
  },
  // ... more menu groups (Invest, Loans, Support)
];

// In providers array:
{ provide: BRAND_CONFIG, useValue: { name: 'PurpleBank', primaryColor: '#6b21a8', theme: 'dark' as const } },
{ provide: AUTH_CONFIG, useValue: { provider: 'microsoft' as const, sessionDurationSeconds: 7200, loginUrl: '/api/auth/login' } },
{ provide: ROOT_LAYOUT_TOKEN, useValue: DefaultTopNavLayout },
{ provide: TOPNAV_CONFIG, useValue: TOPNAV_MENUS },
{ provide: LOAN_CONFIG, useValue: { /* ... loan config ... */ } },
```

### Step 4 — `app.routes.ts`

Point routes to white-label page components. Always use lazy loading.

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('white-label').then((m) => m.DefaultDashboard),
  },
  {
    path: 'loans/apply',
    loadComponent: () => import('white-label').then((m) => m.LoanApplication),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
```

### Step 5 — `styles.scss`

Define your Material M3 theme. This is the only place where brand visual identity lives.

```scss
@use '@angular/material' as mat;

$blue-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$blue-palette,
    tertiary: mat.$cyan-palette,
  ),
));

$blue-dark-theme: mat.define-theme((
  color: (
    theme-type: dark,
    primary: mat.$blue-palette,
    tertiary: mat.$cyan-palette,
  ),
));

html {
  @include mat.all-component-themes($blue-theme);
  color-scheme: light;
}

html.dark-theme {
  @include mat.all-component-colors($blue-dark-theme);
  color-scheme: dark;
}

body {
  margin: 0;
  font-family: Roboto, "Helvetica Neue", sans-serif;
}
```

> **Note:** Material SCSS mixins (`mat.all-component-themes`, etc.) can only be used in app `styles.scss`, not in library components. This is an ng-packagr limitation. Material TypeScript imports (MatCard, MatIcon, etc.) work fine in libraries.

### Step 6 — `index.html`

Add font links and the initial theme class.

```html
<!doctype html>
<html lang="en" class="light-theme">
<head>
  <meta charset="utf-8">
  <title>BlueBank</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

### That's it

Six files. Zero components. Run `ng serve blue-bank` and you have a fully themed, fully functional app using the shared white-label UI.

---

## How To: Add a New Feature / Page

A "feature" is a page component that gets lazy-loaded via routing. It lives in `white-label` so every brand app can use it.

### Step 1 — Create the component in white-label

```bash
ng generate component features/transfers/default-transfers --project=white-label --flat
```

### Step 2 — Implement the component

```typescript
// projects/white-label/src/lib/features/transfers/default-transfers.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { BRAND_CONFIG } from 'core';

@Component({
  selector: 'lib-default-transfers',
  imports: [MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatIcon],
  templateUrl: './default-transfers.html',
  styleUrl: './default-transfers.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultTransfers {
  private readonly brandConfig = inject(BRAND_CONFIG);

  readonly brandName = this.brandConfig.name;
  readonly recentTransfers = signal([
    { to: 'Alice Johnson', amount: 250, date: new Date() },
    { to: 'Bob Smith', amount: 1200, date: new Date() },
  ]);
}
```

```html
<!-- projects/white-label/src/lib/features/transfers/default-transfers.html -->
<h1>Transfers</h1>

<mat-card>
  <mat-card-header>
    <mat-card-title>Recent Transfers</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    @for (transfer of recentTransfers(); track transfer.to) {
      <div class="transfer-row">
        <mat-icon>send</mat-icon>
        <span>{{ transfer.to }}</span>
        <span>{{ transfer.amount | currency }}</span>
      </div>
    }
  </mat-card-content>
</mat-card>
```

### Step 3 — Export from public API

```typescript
// projects/white-label/src/public-api.ts
export { DefaultTransfers } from './lib/features/transfers/default-transfers';
```

### Step 4 — Add the route in brand apps

```typescript
// In any brand app's app.routes.ts
{
  path: 'transfers',
  loadComponent: () => import('white-label').then((m) => m.DefaultTransfers),
},
```

Every brand app that adds this route gets the transfers page — zero duplication.

---

## How To: Add a Shared UI Component

A shared component is a reusable piece of UI (not a full page). It lives in `white-label` and is used by other white-label components or directly by brand apps.

### Step 1 — Create the component

```bash
ng generate component features/account-card/default-account-card --project=white-label --flat
```

### Step 2 — Implement with `input()` signals

```typescript
// projects/white-label/src/lib/features/account-card/default-account-card.ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'lib-account-card',
  imports: [CurrencyPipe, MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle, MatIcon],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-icon mat-card-avatar>{{ icon() }}</mat-icon>
        <mat-card-title>{{ balance() | currency }}</mat-card-title>
        <mat-card-subtitle>{{ label() }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <span [class.positive]="trendIsPositive()" [class.negative]="!trendIsPositive()">
          {{ trend() }}
        </span>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .positive { color: #2e7d32; }
    .negative { color: #c62828; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultAccountCard {
  readonly label = input.required<string>();
  readonly balance = input.required<number>();
  readonly icon = input<string>('account_balance');
  readonly trend = input<string>();

  readonly trendIsPositive = computed(() => !this.trend()?.startsWith('-'));
}
```

### Step 3 — Export from public API

```typescript
// projects/white-label/src/public-api.ts
export { DefaultAccountCard } from './lib/features/account-card/default-account-card';
```

### Step 4 — Use in other white-label components

```html
<!-- Inside any white-label page template -->
@for (account of accounts(); track account.label) {
  <lib-account-card
    [label]="account.label"
    [balance]="account.balance"
    [icon]="account.icon"
    [trend]="account.trend"
  />
}
```

---

## How To: Add a Shared Service

Services that contain business logic or state management go in `core`. Services that are UI-specific (like theming) go in `white-label`.

### Example: Core service (business logic)

```bash
ng generate service features/notifications/notification --project=core
```

#### Step 1 — Define the contract in core

```typescript
// projects/core/src/lib/features/notifications/notification.tokens.ts
import { InjectionToken } from '@angular/core';

export interface NotificationConfig {
  readonly pollingIntervalMs: number;
  readonly maxVisible: number;
}

export const NOTIFICATION_CONFIG = new InjectionToken<NotificationConfig>('NOTIFICATION_CONFIG');
```

#### Step 2 — Implement the service in core

```typescript
// projects/core/src/lib/features/notifications/notification.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { NOTIFICATION_CONFIG } from './notification.tokens';

export interface Notification {
  readonly id: string;
  readonly message: string;
  readonly read: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly config = inject(NOTIFICATION_CONFIG);

  readonly notifications = signal<readonly Notification[]>([]);
  readonly unreadCount = computed(() =>
    this.notifications().filter((n) => !n.read).length
  );

  markAsRead(id: string): void {
    this.notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }
}
```

#### Step 3 — Export from core's public API

```typescript
// projects/core/src/public-api.ts
export * from './lib/features/notifications';
```

#### Step 4 — Provide config in brand apps

```typescript
// In any brand app's app.config.ts providers array:
{ provide: NOTIFICATION_CONFIG, useValue: { pollingIntervalMs: 30_000, maxVisible: 5 } },
```

### Example: UI service (white-label)

The `ThemeService` is a good reference — it lives in `white-label` because it manages UI state (dark/light mode, brand CSS classes), not business logic.

```typescript
// projects/white-label/src/lib/services/theme.service.ts
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly brandConfig = inject(BRAND_CONFIG, { optional: true });

  readonly theme = signal<'light' | 'dark'>(this.brandConfig?.theme ?? 'light');
  readonly isDark = computed(() => this.theme() === 'dark');
  readonly brandClass = signal<string | null>(null);

  constructor() {
    effect(() => {
      const dark = this.isDark();
      const doc = document.documentElement;
      doc.classList.toggle('dark-theme', dark);
      doc.classList.toggle('light-theme', !dark);
    });

    effect((onCleanup) => {
      const cls = this.brandClass();
      if (cls) {
        document.documentElement.classList.add(cls);
        onCleanup(() => document.documentElement.classList.remove(cls));
      }
    });
  }

  toggle(): void {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }
}
```

Key distinction: if it touches HTTP, data, or auth — it goes in **core**. If it touches DOM, themes, or component state — it goes in **white-label**.

---

## How To: Add a Guided Wizard Flow

The wizard system supports **config-driven steps** (shared defaults) with **brand-specific overrides** (custom components). Blue Bank demonstrates this pattern: steps 2-5 use shared default components, while step 1 is a brand-specific override.

### Step 1 — Define wizard steps in `app.config.ts`

```typescript
import { WIZARD_STEPS, WIZARD_STEP_OVERRIDES } from 'core';
import {
  DefaultProfileStep,
  DefaultBudgetStep,
  DefaultInsuranceStep,
  DefaultPropositionStep,
} from 'white-label';
import { MyCustomProjectStep } from './features/my-custom-project-step';

// In providers array:
{
  provide: WIZARD_STEPS,
  useValue: [
    { id: 'project', label: 'Your Project', component: MyCustomProjectStep },
    { id: 'profile', label: 'Your Profile', component: DefaultProfileStep },
    { id: 'budget', label: 'Your Budget', component: DefaultBudgetStep },
    { id: 'insurance', label: 'Your Insurance', component: DefaultInsuranceStep },
    { id: 'proposition', label: 'Our Proposals', component: DefaultPropositionStep },
  ],
},
// Optional: override specific steps with brand-custom components
{
  provide: WIZARD_STEP_OVERRIDES,
  useValue: { project: MyCustomProjectStep },
},
```

### Step 2 — Add the route

```typescript
{
  path: 'mortgage/apply',
  loadComponent: () => import('white-label').then((m) => m.GuidedWizard),
},
```

### Step 3 — (Optional) Create a custom step component

Custom step components should implement the `WizardStep` interface and use shared UI primitives:

```typescript
import { CardSelector, QuestionBlock, ToggleSelector, type WizardStep } from 'white-label';

@Component({ /* ... */ })
export class MyCustomProjectStep implements WizardStep {
  readonly form = new FormGroup({ /* ... */ });
  // Use CardSelector, ToggleSelector, QuestionBlock for consistent UI
}
```

### Step 4 — Configure step behavior via DI tokens

Each default step reads optional config tokens with sensible defaults:

```typescript
{ provide: PROFILE_STEP_CONFIG, useValue: { borrowerModes: ['Seul', 'À deux'], ... } },
{ provide: BUDGET_STEP_CONFIG, useValue: { revenueFields: [...], chargeFields: [...] } },
{ provide: INSURANCE_STEP_CONFIG, useValue: { coverageOptions: [...], toggleQuestions: [...] } },
```

### Key pattern

The `GuidedWizard` orchestrator resolves steps at runtime: for each step in `WIZARD_STEPS`, it checks `WIZARD_STEP_OVERRIDES` for a matching `id`. If found, it renders the override component; otherwise, it renders the default. This means brand apps can override any subset of steps while inheriting the rest.

---

## Available DI Tokens

| Token | Type | Library | Purpose |
|-------|------|---------|---------|
| `BRAND_CONFIG` | `BrandConfiguration` | core | Brand name, primary color, default theme |
| `AUTH_CONFIG` | `AuthConfig` | core | OAuth provider, session duration, login URL |
| `ROOT_LAYOUT_TOKEN` | `Type<unknown>` | core | Which layout component to render (sidenav or topnav) |
| `SIDENAV_CONFIG` | `readonly SidenavSection[]` | core | Navigation sections for sidenav layout |
| `TOPNAV_CONFIG` | `readonly MenuGroup[]` | core | Menu groups for topnav layout |
| `WIZARD_STEPS` | `readonly WizardStepConfig[]` | core | Ordered wizard step definitions (id, label, component) |
| `WIZARD_STEP_OVERRIDES` | `Record<string, Type<unknown>>` | core | Maps step id to brand-custom override component |
| `PROFILE_STEP_CONFIG` | `ProfileStepConfig` | core | Borrower modes, fields, residence options |
| `BUDGET_STEP_CONFIG` | `BudgetStepConfig` | core | Revenue/charge field definitions |
| `INSURANCE_STEP_CONFIG` | `InsuranceStepConfig` | core | Coverage options, toggle questions |
| `LOAN_CONFIG` | `LoanConfig` | core | Loan amount/term ranges, purposes, income verification type |
| `SIMULATOR_CONFIG` | `SimulatorConfig` | core | Project types, slider ranges for loan simulator |

## Available White-Label Components

| Component | Selector | Purpose |
|-----------|----------|---------|
| `WhiteLabelRoot` | `lib-white-label-root` | App shell — renders the layout from `ROOT_LAYOUT_TOKEN` |
| `DefaultSidenavLayout` | `lib-sidenav-layout` | Side navigation layout (reads `SIDENAV_CONFIG`) |
| `DefaultTopNavLayout` | `lib-topnav-layout` | Top navigation with mega menus (reads `TOPNAV_CONFIG`) |
| `DefaultHeader` | `lib-default-header` | Toolbar with brand name + theme toggle |
| `DefaultDashboard` | `lib-default-dashboard` | Dashboard page with accounts, transactions, stepper |
| `DefaultHomePage` | `lib-default-home-page` | Home page with hero, quick actions, promo offers |
| `DefaultStepper` | `lib-default-stepper` | Reusable Material stepper with projected content |
| `GuidedWizard` | `lib-guided-wizard` | Config-driven multi-step wizard with override support |
| `LoanApplication` | `lib-loan-application` | Multi-step loan application form (reads `LOAN_CONFIG`) |
| `LoanSimulator` | `lib-loan-simulator` | Loan simulator with linked sliders |
| `DefaultProfileStep` | `lib-profile-step` | Wizard step: borrower profile form |
| `DefaultBudgetStep` | `lib-budget-step` | Wizard step: revenues & charges with computed totals |
| `DefaultInsuranceStep` | `lib-insurance-step` | Wizard step: insurance coverage options |
| `DefaultPropositionStep` | `lib-proposition-step` | Wizard step: result/confirmation page |
| `CardSelector` | `lib-card-selector` | Shared primitive: selectable card grid |
| `ToggleSelector` | `lib-toggle-selector` | Shared primitive: horizontal button toggle group |
| `QuestionBlock` | `lib-question-block` | Shared primitive: labeled question with animated reveal |
| `DynamicList` | `lib-dynamic-list` | Shared primitive: add/remove list of form items |
| `LinkedSliders` | `lib-linked-sliders` | Shared primitive: interdependent amount/monthly/duration sliders |
| `ThemeSwitch` | `lib-theme-switch` | Dark/light mode toggle |

## CI Pipeline

Even though development uses source paths for hot reload, CI should validate the ng-packagr build:

```bash
ng build core
ng build white-label
ng build green-bank --configuration production
ng build purple-bank --configuration production
ng build blue-bank --configuration production
ng build dev-shell --configuration production
ng test core
ng test white-label
```
