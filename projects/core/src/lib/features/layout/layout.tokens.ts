import { InjectionToken, Type } from '@angular/core';

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

export const ROOT_LAYOUT_TOKEN = new InjectionToken<Type<unknown>>('ROOT_LAYOUT_TOKEN');

export const SIDENAV_CONFIG = new InjectionToken<readonly SidenavSection[]>('SIDENAV_CONFIG');

export const TOPNAV_CONFIG = new InjectionToken<readonly MenuGroup[]>('TOPNAV_CONFIG');
