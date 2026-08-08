import { publicEnvironment } from '@/packages/env';

export interface AppConfig {
  readonly appName: string;
  readonly appEnv: 'local' | 'test' | 'staging' | 'production';
  readonly appUrl: string;
  readonly contactEmail: string | null;
  readonly isProduction: boolean;
}

/**
Derived, validated application configuration.
*/
export const appConfig: AppConfig = {
  appName: 'Ihab Khaled',
  appEnv: publicEnvironment.appEnv,
  appUrl: publicEnvironment.appUrl,
  contactEmail: publicEnvironment.contactEmail,
  isProduction: publicEnvironment.appEnv === 'production',
};
