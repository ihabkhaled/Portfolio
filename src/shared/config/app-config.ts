import { publicEnv } from '@/packages/env';

export interface AppConfig {
  readonly appName: string;
  readonly appEnv: 'local' | 'test' | 'staging' | 'production';
  readonly appUrl: string;
  readonly contactEmail: string | null;
  readonly isProduction: boolean;
}

/** Derived, validated application configuration. */
export const appConfig: AppConfig = {
  appName: 'Ihab Khaled',
  appEnv: publicEnv.appEnv,
  appUrl: publicEnv.appUrl,
  contactEmail: publicEnv.contactEmail,
  isProduction: publicEnv.appEnv === 'production',
};
