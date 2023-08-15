import { FirmwareResponse } from '../models';

export function parseFirmware(message: string) {
  const parts = message.split(',');
  const data: FirmwareResponse = {};
  if (parts.length >= 3) {
    data.firmware = parts[0];
    data.vin = parts[1];
    data.gsmSignalRaw = parseInt(parts[2], 10);
    data.gsmDbm = 0;
    if (data.gsmSignalRaw <= 31) {
      data.gsmDbm = -113 + data.gsmSignalRaw * 2;
      data.gsmSignal = `${data.gsmDbm.toFixed(0)} dBm`;
    }
    if (data.gsmDbm < -121 || data.gsmDbm >= 0) {
      data.gsmBars = 0;
    } else if (data.gsmDbm < -107) {
      data.gsmBars = 1;
    } else if (data.gsmDbm < -98) {
      data.gsmBars = 2;
    } else if (data.gsmDbm < -87) {
      data.gsmBars = 3;
    } else if (data.gsmDbm < -76) {
      data.gsmBars = 4;
    } else {
      data.gsmBars = 5;
    }
  }
  if (parts.length >= 5) {
    data.writeEnabled = Boolean(parseInt(parts[3], 10));
    data.type = parts[4];
  }
  if (parts.length >= 6) {
    data.gsmLock = parts[5];
  }
  return data;
}
