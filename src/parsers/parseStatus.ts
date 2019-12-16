export interface StatusResponse {
  soc?: number;
  units?: string;
  lineVoltage?: number;
  chargeCurrent?: number;
  chargeState?: string;
  chargeMode?: string;
  idealRange?: number;
  estimatedRange?: number;
  chargeLimit?: number;
  chargeDuration?: number;
  chargeBefore?: number;
  chargeKwh?: number;
  chargeSubstate?: number;
  chargeStateN?: number;
  chargeModeN?: number;
  cac?: string;
  minutesToFull?: number;
  minutesToRangeLimit?: number;
  rangeLimit?: number;
  socLimit?: number;
  chargeType?: number;
}

export function parseStatus(message: string) {
  const parts = message.split(',');
  const data: StatusResponse = {};
  if (parts.length >= 8) {
    data.soc = parseInt(parts[0], 10);
    data.units = parts[1];
    data.lineVoltage = parseInt(parts[2], 10);
    data.chargeCurrent = parseInt(parts[3], 10);
    data.chargeState = parts[4];
    data.chargeMode = parts[5];
    data.idealRange = parseInt(parts[6], 10);
    data.estimatedRange = parseInt(parts[7], 10);
  }
  if (parts.length >= 15) {
    data.chargeLimit = parseInt(parts[8], 10);
    data.chargeDuration = parseInt(parts[9], 10);
    data.chargeBefore = parseInt(parts[10], 10);
    data.chargeKwh = parseInt(parts[11], 10) / 10;
    data.chargeSubstate = parseInt(parts[12], 10);
    data.chargeStateN = parseInt(parts[13], 10);
    data.chargeModeN = parseInt(parts[14], 10);
  }
  if (parts.length >= 19) {
    data.cac = parts[18];
  }
  if (parts.length >= 23) {
    data.minutesToFull = parseInt(parts[19], 10);
    data.minutesToRangeLimit = parseInt(parts[20], 10);
    data.rangeLimit = parseInt(parts[21], 10);
    data.socLimit = parseInt(parts[22], 10);
  }
  if (parts.length >= 31) {
    data.chargeType = parseInt(parts[30], 10);
  }
  return data;
}
