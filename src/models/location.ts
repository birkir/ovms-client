import { DataStale } from '../data-stale';

export type LocationResponse = {
  latitude?: number;
  longitude?: number;
  direction?: number;
  altitude?: number;
  gpsLockRaw?: number;
  gpsLock?: boolean;
  staleGpsRaw?: number;
  staleGps?: DataStale;
  speedRaw?: number;
  tripmeterRaw?: number;
  driveMode?: number;
  power?: number;
  energyUsed?: number;
  energyRecd?: number;
}