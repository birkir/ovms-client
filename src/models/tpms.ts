import { DataStale } from '../data-stale';

export type TPMSResponse = {
  // Typo, means right?
  frontRearPressureRaw?: number;
  frontRearTempRaw?: number;
  frontRightPressureRaw?: number;
  frontRightTempRaw?: number;
  rearRightPressureRaw?: number;
  rearRightTempRaw?: number;
  frontLeftPressureRaw?: number;
  frontLeftTempRaw?: number;
  rearLeftPressureRaw?: number;
  rearLeftTempRaw?: number;

  wheelTemperature?: Array<string>;
  wheelHealth?: Array<string>;
  wheelAlert?: Array<string>;

  staleTPMSRaw?: number;
  staleTPMS?: DataStale;
  staleTemperatureRaw?: number;
  staleTemperature?: DataStale;
  staleHealthRaw?: number;
  staleHealth?: DataStale;
  staleAlertRaw?: number;
  staleAlert?: DataStale;
}