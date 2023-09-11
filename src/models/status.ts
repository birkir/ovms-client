export type StatusResponse = {
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