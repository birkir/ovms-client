import { DataStale } from '../OVMSClient';

export interface LocationResponse {
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

export function parseLocation(message: string) {
  const parts = message.split(',');
  const data: LocationResponse = {};

  if (parts.length >= 2) {
    data.latitude = parseFloat(parts[0]);
    data.longitude = parseFloat(parts[1]);
  }
  if (parts.length >= 6) {
    data.direction = parseFloat(parts[2]);
    data.altitude = parseFloat(parts[3]);
    data.gpsLockRaw = parseInt(parts[4], 10);
    data.gpsLock = data.gpsLockRaw > 0;
    data.staleGpsRaw = parseInt(parts[5], 10);
    if (data.staleGpsRaw < 0) {
      data.staleGps = DataStale.NoValue;
    } else if (data.staleGpsRaw === 0) {
      data.staleGps = DataStale.Stale;
    } else {
      data.staleGps = DataStale.Good;
    }
  }
  if (parts.length >= 8) {
    data.speedRaw = parseFloat(parts[6]);
    data.tripmeterRaw = parseFloat(parts[7]);
  }
  if (parts.length >= 12) {
    data.driveMode = parseInt(parts[8], 16);
    data.power = parseFloat(parts[9]);
    data.energyUsed = parseFloat(parts[10]);
    data.energyRecd = parseFloat(parts[11]);
  }

  return data;
}
