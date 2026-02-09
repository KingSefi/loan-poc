import { InjectionToken, Type } from '@angular/core';

export interface BrandConfiguration {
  readonly name: string;
  readonly primaryColor: string;
  readonly theme: 'light' | 'dark';
}

export interface AuthConfig {
  readonly provider: 'google' | 'microsoft' | 'github';
  readonly sessionDurationSeconds: number;
  readonly loginUrl: string;
}

export interface NavItem {
  readonly icon: string;
  readonly label: string;
  readonly route?: string;
}

export interface SidenavSection {
  readonly header: string;
  readonly items: readonly NavItem[];
}

export interface MenuGroup {
  readonly icon: string;
  readonly label: string;
  readonly route?: string;
  readonly children?: readonly NavItem[];
}

export const BRAND_CONFIG = new InjectionToken<BrandConfiguration>('BRAND_CONFIG');

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');

export const ROOT_LAYOUT_TOKEN = new InjectionToken<Type<unknown>>('ROOT_LAYOUT_TOKEN');

export const SIDENAV_CONFIG = new InjectionToken<readonly SidenavSection[]>('SIDENAV_CONFIG');

export const TOPNAV_CONFIG = new InjectionToken<readonly MenuGroup[]>('TOPNAV_CONFIG');
