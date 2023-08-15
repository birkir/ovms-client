export type FirmwareResponse = {
  firmware?: string;
  vin?: string;
  gsmSignalRaw?: number;
  gsmDbm?: number;
  gsmSignal?: string;
  gsmBars?: number;
  gsmLock?: string;
  writeEnabled?: boolean;
  type?: string;
}