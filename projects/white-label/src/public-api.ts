/*
 * Public API Surface of white-label
 */

export { DEFAULT_AUTH_CONFIG } from './lib/config/default-auth.config';
export { DEFAULT_BRAND_CONFIG } from './lib/config/default-brand.config';
export { DefaultDashboard } from './lib/features/dashboard/default-dashboard';
export { DefaultHeader } from './lib/features/header/default-header/default-header';
export { DefaultHomePage } from './lib/features/home-page/default-home-page';
export { DefaultSidenavLayout } from './lib/features/layout/sidenav-layout/sidenav-layout';
export { DefaultTopNavLayout } from './lib/features/layout/topnav-layout/topnav-layout';
export { LoanApplication } from './lib/features/loan-application/loan-application';
export { DefaultStepper } from './lib/features/stepper/default-stepper';
export type { StepDefinition } from './lib/features/stepper/step-definition';
export { ThemeSwitch } from './lib/features/theme-switch';
export { ThemeService } from './lib/services/theme.service';
export { WhiteLabelRoot } from './lib/white-label-root/white-label-root';
