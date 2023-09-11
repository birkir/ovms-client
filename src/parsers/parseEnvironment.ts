import { DataStale } from '../data-stale';
import { EnvironmentResponse } from '../models';


/**
 * Parse the environment message
 * raw message format, excluding code (e.g MP-0 D):
 * [
 *  Door state #1 [0]
 *    * bit0 = Left Door (open=1/closed=0)
 *    * bit1 = Right Door (open=1/closed=0)
 *    * bit2 = Charge port (open=1/closed=0)
 *    * bit3 = Pilot present (true=1/false=0) (always 1 on my 2.5)
 *    * bit4 = Charging (true=1/false=0)
 *    * bit5 = always 1
 *    * bit6 = Hand brake applied (true=1/false=0)
 *    * bit7 = Car ON (“ignition”) (true=1/false=0)
 *  Door state #2 [1]
 *    * bit3 = Car Locked (locked=1/unlocked=0)
 *    * bit4 = Valet Mode (active=1/inactive=0)
 *    * bit6 = Bonnet (open=1/closed=0)
 *    * bit7 = Trunk (open=1/closed=0)
 *  lockedRaw (4 = locked, 5 = unlocked) [2]
 *  tempPemRaw (PEM temperature in celsius), [3]
 *  tempMotorRaw (Motor temperature in celsius), [4]
 *  tempBatteryRaw (Battery temperature in celsius), [5]
 *  tripMeterRaw (in 1/10th of a distance unit) [6]
 *  odometerRaw (in 1/10th of a distance unit) [7]
 *  speedRaw (in distance units per hour) [8]
 *  parkedDuration (0 for not parked, or number of seconds car parked for) [9]
 *  tempAmbientRaw (Ambient temperature in celsius), [10]
 *  Door state #3 [11]
 *    * bit0 = Car awake (turned on=1 / off=0)
 *    * bit1 = Cooling pump (on=1/off=0)
 *    * bit6 = 1=Logged into motor controller
 *    * bit7 = 1=Motor controller in configuration mode
 *  staleCarTempsRaw (-1=none, 0=stale, >0 ok) [12]
 *  staleAmbientTempRaw (-1=none, 0=stale, >0 ok) [13]
 *  lineVoltage12v [14]
 *  Door State #4 [15]
 *    * bit2 = alarm sounds (on=1/off=0)
 *  lineRef12v (Reference voltage for 12v power) [16]
 *  Door State #5 [17]
 *    * bit0 = Rear left door (open=1/closed=0)
 *    * bit1 = Rear right door (open=1/closed=0)
 *    * bit2 = Frunk (open=1/closed=0)
 *    * bit4 = 12V battery charging
 *    * bit5 = Auxiliary 12V systems online
 *    * bit7 = HVAC running
 *  tempChargerRaw (Charger temperature in celsius), [18]
 *  current12v (i.e DC converter output) [19]
 *  tempCabinRaw (Cabin temperature in celsius), [20]
 * ]
 * | Status | Status | locked | tempPemRaw | tempMotorRaw | tempBatteryRaw | tripMeterRaw | odometerRaw | speedRaw | parkedTime | tempAmbientRaw | status | staleCarTempsRaw | parkedTime | parkedTime | parkedTime | parkedTime | parkedTime | parkedTime | parkedTime | parkedTime |
 * |---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
 * | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
 * | int | int | int | float | float | float | float | float | float | float | float | float | float | float | float | float | float | float | float | float | float |
 * @param message
 */
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
    data.hvacRunning = (status & 0x80) === 0x80;
  }

  if (parts.length >= 19) {
    data.tempChargerRaw = parseFloat(parts[18]);
  }

  if (parts.length >= 20) {
    data.current12v = parseFloat(parts[19]);
  }

  if (parts.length >= 21) {
    data.tempCabinRaw = parseFloat(parts[20]);
  }

  return data;
}
