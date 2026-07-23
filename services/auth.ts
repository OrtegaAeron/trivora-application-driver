import { MOCK_DRIVER } from './api';
import { DriverProfile } from '../types';

let currentDriver: DriverProfile = { ...MOCK_DRIVER };

export async function loginDriver(email: string, password?: string): Promise<DriverProfile> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(currentDriver);
    }, 1200);
  });
}

export async function updateOnlineStatus(isOnline: boolean): Promise<boolean> {
  currentDriver.isOnline = isOnline;
  return Promise.resolve(isOnline);
}

export function getDriverProfile(): DriverProfile {
  return currentDriver;
}

export async function updateDriverProfile(updated: Partial<DriverProfile>): Promise<DriverProfile> {
  currentDriver = { ...currentDriver, ...updated };
  return Promise.resolve(currentDriver);
}
