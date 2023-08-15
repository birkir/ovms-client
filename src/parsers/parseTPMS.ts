import { DataStale } from '../data-stale';
import { TPMSResponse } from '../models';


export function parseLegacyTPMS(message: string) {
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

export function parseTPMS(message: string) {
  const parts = message.split(',');
  // raw: '4,FL,FR,RL,RR,4,243.0,241.3,243.0,244.8,
  // 0 // pressure-valid
  // 0, // temperature-count
  // -1, // temperature-valid
  // 0, // health-count
  // -1, // health-valid
  // 0, // alert-count
  // -1' // alert-valid

  const data: TPMSResponse = {};

  const definedWheels = parseInt(parts[0], 10);
  const wheelNames = parts.splice(0, 1 + definedWheels);
  const definedWheelPressure = parseInt(parts[0], 10);
  const wheelPressure = parts.splice(0, 1 + definedWheelPressure);

  const staleTPMSRaw = parseInt(parts.splice(0, 1)[0], 10);
  const staleTPMS =
    staleTPMSRaw < 0
      ? DataStale.NoValue
      : staleTPMSRaw === 0
      ? DataStale.Stale
      : DataStale.Good;

  const definedWheelTemperature = parseInt(parts[0], 10);
  const wheelTemperature = parts.splice(0, 1 + definedWheelTemperature);
  const staleTemperatureRaw = parseInt(parts.splice(0, 1)[0], 10);
  const staleTemperature =
    staleTemperatureRaw < 0
      ? DataStale.NoValue
      : staleTemperatureRaw === 0
      ? DataStale.Stale
      : DataStale.Good;

  const definedWheelHealth = parseInt(parts[0], 10);
  const wheelHealth = parts.splice(0, 1 + definedWheelHealth);

  const staleHealthRaw = parseInt(parts.splice(0, 1)[0], 10);
  const staleHealth =
    staleHealthRaw < 0
      ? DataStale.NoValue
      : staleHealthRaw === 0
      ? DataStale.Stale
      : DataStale.Good;

  const definedWheelAlert = parseInt(parts[0], 10);
  const wheelAlert = parts.splice(0, 1 + definedWheelAlert);
  const staleAlertRaw = parseInt(parts.splice(0, 1)[0], 10);
  const staleAlert =
    staleAlertRaw < 0
      ? DataStale.NoValue
      : staleAlertRaw === 0
      ? DataStale.Stale
      : DataStale.Good;

  const map = {
    FL: 'frontLeftPressureRaw',
    FR: 'frontRightPressureRaw',
    RL: 'rearLeftPressureRaw',
    RR: 'rearRightPressureRaw',
  };

  for (const name of wheelNames.slice(1)) {
    const key = map[name as keyof typeof map] as
      | 'frontRearPressureRaw'
      | 'frontRightPressureRaw'
      | 'rearRightPressureRaw'
      | 'frontLeftPressureRaw'
      | 'rearLeftPressureRaw';
    data[key] = parseFloat(wheelPressure[wheelNames.indexOf(name)]);
  }
  return {
    ...data,
    staleTPMSRaw,
    staleTPMS,
    staleTemperatureRaw,
    staleTemperature,
    staleHealthRaw,
    staleHealth,
    staleAlertRaw,
    staleAlert,
    wheelTemperature,
    wheelHealth,
    wheelAlert,
  };
}
