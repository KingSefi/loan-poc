import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  AUTH_CONFIG,
  BRAND_CONFIG,
  BUDGET_STEP_CONFIG,
  INSURANCE_STEP_CONFIG,
  MenuGroup,
  PROFILE_STEP_CONFIG,
  ROOT_LAYOUT_TOKEN,
  SIMULATOR_CONFIG,
  TOPNAV_CONFIG,
  WIZARD_STEP_OVERRIDES,
  WIZARD_STEPS,
} from 'core';
import {
  DefaultBudgetStep,
  DefaultInsuranceStep,
  DefaultProfileStep,
  DefaultPropositionStep,
  DefaultTopNavLayout,
} from 'white-label';

import { BlueProjectStep } from './features/blue-project-step';
import { routes } from './app.routes';

const TOPNAV_MENUS: readonly MenuGroup[] = [
  { icon: 'home', label: 'Accueil', route: '/home' },
  { icon: 'calculate', label: 'Simulateur', route: '/simulator' },
  { icon: 'request_quote', label: 'Demande de prêt', route: '/mortgage/apply' },
  { icon: 'support_agent', label: 'Contact', route: '/contact' },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: BRAND_CONFIG,
      useValue: {
        name: 'BlueBank',
        primaryColor: '#1e40af',
        theme: 'light' as const,
      },
    },
    {
      provide: AUTH_CONFIG,
      useValue: {
        provider: 'github' as const,
        sessionDurationSeconds: 3600,
        loginUrl: '/api/auth/login',
      },
    },
    {
      provide: ROOT_LAYOUT_TOKEN,
      useValue: DefaultTopNavLayout,
    },
    {
      provide: TOPNAV_CONFIG,
      useValue: TOPNAV_MENUS,
    },
    {
      provide: WIZARD_STEPS,
      useValue: [
        { id: 'project', label: 'Votre Projet', component: BlueProjectStep },
        { id: 'profile', label: 'Votre Profil', component: DefaultProfileStep },
        { id: 'budget', label: 'Votre Budget', component: DefaultBudgetStep },
        { id: 'insurance', label: 'Votre Assurance', component: DefaultInsuranceStep },
        { id: 'proposition', label: 'Nos Propositions', component: DefaultPropositionStep },
      ],
    },
    {
      provide: WIZARD_STEP_OVERRIDES,
      useValue: {
        project: BlueProjectStep,
      },
    },
    {
      provide: PROFILE_STEP_CONFIG,
      useValue: {
        borrowerModes: ['Seul', 'À deux'],
        fields: [
          { name: 'civility', label: 'Civilité', type: 'select', required: true, options: ['M.', 'Mme'] },
          { name: 'firstName', label: 'Prénom', type: 'text', required: true },
          { name: 'lastName', label: 'Nom', type: 'text', required: true },
          { name: 'birthDate', label: 'Date de naissance', type: 'date', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phone', label: 'Téléphone', type: 'tel', required: true },
        ],
        residenceOptions: ['Propriétaire', 'Locataire', 'Hébergé'],
      },
    },
    {
      provide: BUDGET_STEP_CONFIG,
      useValue: {
        revenueFields: [
          { name: 'salary', label: 'Revenus professionnels nets', suffix: '€/mois' },
          { name: 'rental', label: 'Revenus locatifs', suffix: '€/mois' },
        ],
        chargeFields: [
          { name: 'rent', label: 'Loyer actuel', suffix: '€/mois' },
          { name: 'taxes', label: 'Impôts', suffix: '€/mois' },
          { name: 'otherLoans', label: 'Crédits en cours', suffix: '€/mois' },
        ],
      },
    },
    {
      provide: INSURANCE_STEP_CONFIG,
      useValue: {
        coverageOptions: [
          { id: 'death', label: 'Décès', description: 'Couverture en cas de décès' },
          { id: 'disability', label: 'Invalidité', description: 'Couverture en cas d\'invalidité permanente' },
          { id: 'workStop', label: 'Arrêt de travail', description: 'Couverture en cas d\'incapacité temporaire' },
        ],
        toggleQuestions: [
          { id: 'jobLoss', label: 'Souhaitez-vous une couverture perte d\'emploi ?' },
          { id: 'riskyActivity', label: 'Pratiquez-vous un sport à risque ?' },
          { id: 'travel', label: 'Voyagez-vous fréquemment à l\'étranger ?' },
        ],
        infoText: 'L\'assurance emprunteur protège vous et votre famille en cas d\'imprévu. Elle est généralement requise par les établissements prêteurs.',
      },
    },
    {
      provide: SIMULATOR_CONFIG,
      useValue: {
        projectTypes: [
          { id: 'auto', label: 'Auto', icon: 'directions_car', hasSubCategory: true },
          { id: 'travaux', label: 'Travaux', icon: 'construction' },
          { id: 'projet', label: 'Projet', icon: 'lightbulb' },
          { id: 'etudiant', label: 'Étudiant', icon: 'school' },
        ],
        amountRange: { min: 1_000, max: 75_000, step: 500 },
        monthlyRange: { min: 50, max: 2_000, step: 10 },
        durationRange: { min: 6, max: 84, step: 6 },
      },
    },
  ],
};
