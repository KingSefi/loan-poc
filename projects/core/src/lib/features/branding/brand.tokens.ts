import { InjectionToken } from '@angular/core';

export interface BrandConfiguration {
  readonly name: string;
  readonly primaryColor: string;
  readonly theme: 'light' | 'dark';
}

export const BRAND_CONFIG = new InjectionToken<BrandConfiguration>('BRAND_CONFIG');
