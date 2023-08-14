import { OVMSClient } from '../src';

jest.setTimeout(30000);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('OVMSClient', () => {
  let client: OVMSClient;
  let firmware: string;

  beforeAll(() => {
    client = new OVMSClient('tmc.openvehicles.com', 6867, 'DEMO', 'DEMO');
  });

  afterAll(() => {
    client.disconnect();
  });

  it('to work', () => {
    expect(client).toBeTruthy();
  });

  it('should be able to connect', async () => {
    let connected;
    client.connect();

    client.on('firmware', (fw: string) => {
      firmware = fw;
    });

    await new Promise<void>((resolve) => {
      client.on('connected', () => {
        connected = true;
        resolve();
      });
    });

    expect(connected).toBeTruthy();
  });

  it('should be able to get firmware', async () => {
    await delay(500);
    expect(firmware).toBeTruthy();
  });

  it('should be able to ping', async () => {
    await delay(100);
    client.sendRaw('MP-0 A');
    const ack = await new Promise((resolve) =>
      client.on('serverAck', () => resolve(true))
    );
    expect(ack).toBe(true);
  });

  it('should be able to send messages', async () => {
    await delay(100);
    client.send('stat');
    const status = await new Promise((resolve) => client.on('status', resolve));
    expect(status).toBeTruthy();
  });
});
