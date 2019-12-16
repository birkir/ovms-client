import { DataStale } from '../OVMSClient';

interface TPMSResponse {
  frontRearPressureRaw?: number;
  frontRearTempRaw?: number;
  rearRightPressureRaw?: number;
  rearRightTempRaw?: number;
  frontLeftPressureRaw?: number;
  frontLeftTempRaw?: number;
  rearLeftPressureRaw?: number;
  rearLeftTempRaw?: number;
  staleTPMSRaw?: number;
  staleTPMS?: DataStale;
}

export function parseTPMS(message: string) {
  const parts = message.split(',');
  const data: TPMSResponse = {};

  if (parts.length >= 9) {
    data.frontRearPressureRaw = parseFloat(parts[0]);
    data.frontRearTempRaw = parseFloat(parts[1]);
    data.rearRightPressureRaw = parseFloat(parts[2]);
    data.rearRightTempRaw = parseFloat(parts[3]);
    data.frontLeftPressureRaw = parseFloat(parts[4]);
    data.frontLeftTempRaw = parseFloat(parts[5]);
    data.rearLeftPressureRaw = parseFloat(parts[6]);
    data.rearLeftTempRaw = parseFloat(parts[7]);
    data.staleTPMSRaw = parseInt(parts[8], 10);
    if (data.staleTPMSRaw < 0) {
      data.staleTPMS = DataStale.NoValue;
    } else if (data.staleTPMSRaw === 0) {
      data.staleTPMS = DataStale.Stale;
    } else {
      data.staleTPMS = DataStale.Good;
    }
  }

  return data;
}
