import { DataStale } from '../OVMSClient';

export interface EnvironmentResponse {
  doors1Raw?: number;
  frontLeftDoorOpen?: boolean;
  frontRightDoorOpen?: boolean;
  chargePortOpen?: boolean;
  pilotPresent?: boolean;
  charging?: boolean;
  handbrakeOn?: boolean;
  started?: boolean;
  doors2Raw?: number;
  bonnetOpen?: boolean;
  trunkOpen?: boolean;
  headlightsOn?: boolean;
  valetMode?: boolean;
  locked?: boolean;
  lockUnlockRaw?: number;
  tempPemRaw?: number;
  tempMotorRaw?: number;
  tempBatteryRaw?: number;
  tripMeterRaw?: number;
  odometerRaw?: number;
  speedRaw?: number;
  parkedTime?: Date;
  tempAmbientRaw?: number;
  doors3Raw?: number;
  awake?: boolean;
  staleCarTempsRaw?: number;
  staleCarTemps?: DataStale;
  staleAmbientTempRaw?: number;
  staleAmbientTemp?: DataStale;
  lineVoltage12v?: number;
  doors4Raw?: number;
  alarmSounding?: boolean;
  lineRef12v?: number;
  doors5Raw?: number;
  charging12v?: boolean;
  rearLeftDoorOpen?: boolean;
  rearRightDoorOpen?: boolean;
  tempChargerRaw?: number;
  current12v?: number;
}

export function parseEnvironment(message: string) {
  const parts = message.split(',');
  const data: EnvironmentResponse = {};
  let status = 0;
  if (parts.length >= 9) {
    status = parseInt(parts[0], 10);
    data.doors1Raw = status;
    data.frontLeftDoorOpen = (status & 0x1) === 0x1;
    data.frontRightDoorOpen = (status & 0x2) === 0x2;
    data.chargePortOpen = (status & 0x4) === 0x4;
    data.pilotPresent = (status & 0x8) === 0x8;
    data.charging = (status & 0x10) === 0x10;
    data.handbrakeOn = (status & 0x40) === 0x40;
    data.started = (status & 0x80) === 0x80;
    status = parseInt(parts[1], 10);
    data.doors2Raw = status;
    data.bonnetOpen = (status & 0x40) === 0x40;
    data.trunkOpen = (status & 0x80) === 0x80;
    data.headlightsOn = (status & 0x20) === 0x20;
    data.valetMode = (status & 0x10) === 0x10;
    data.locked = (status & 0x08) === 0x08;

    data.lockUnlockRaw = parseInt(parts[2], 10);

    data.tempPemRaw = parseFloat(parts[3]);
    data.tempMotorRaw = parseFloat(parts[4]);
    data.tempBatteryRaw = parseFloat(parts[5]);

    data.tripMeterRaw = parseFloat(parts[6]);
    data.odometerRaw = parseFloat(parts[7]);
    data.speedRaw = parseFloat(parts[8]);
  }

  if (parts.length >= 14) {
    data.parkedTime = new Date(
      new Date().getTime() - parseFloat(parts[9]) * 1000
    );
    data.tempAmbientRaw = parseFloat(parts[10]);

    status = parseInt(parts[11], 10);
    data.doors3Raw = status;
    data.awake = (status & 0x02) === 0x02;

    data.staleCarTempsRaw = parseInt(parts[12], 10);
    if (data.staleCarTempsRaw < 0) {
      data.staleCarTemps = DataStale.NoValue;
    } else if (data.staleCarTempsRaw === 0) {
      data.staleCarTemps = DataStale.Stale;
    } else {
      data.staleCarTemps = DataStale.Good;
    }

    data.staleAmbientTempRaw = parseFloat(parts[13]);
    if (data.staleAmbientTempRaw < 0) {
      data.staleAmbientTemp = DataStale.NoValue;
    } else if (data.staleAmbientTempRaw === 0) {
      data.staleAmbientTemp = DataStale.Stale;
    } else {
      data.staleAmbientTemp = DataStale.Good;
    }
  }

  if (parts.length >= 16) {
    data.lineVoltage12v = parseFloat(parts[14]);
    status = parseInt(parts[15], 10);
    data.doors4Raw = status;
    data.alarmSounding = (status & 0x02) === 0x02;
  }

  if (parts.length >= 18) {
    data.lineRef12v = parseFloat(parts[16]);
    status = parseInt(parts[17], 10);
    data.doors5Raw = status;
    data.charging12v = (status & 0x10) === 0x10;
    data.rearLeftDoorOpen = (status & 0x1) === 0x1;
    data.rearRightDoorOpen = (status & 0x2) === 0x2;
  }

  if (parts.length >= 19) {
    data.tempChargerRaw = parseFloat(parts[18]);
  }

  if (parts.length >= 20) {
    data.current12v = parseFloat(parts[19]);
  }

  return data;
}
