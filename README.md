# OVMS Client

This is a simple OVMS client written for NodeJS.

## Usage

```js
// host, port, vehicle id, password
const client = new OVMSClient('tmc.openvehicles.com', 6867, 'DEMO', 'DEMO');

// connect
client.connect();

// subscribe to specific messages:
//   status,location,firmware,environment,tpms
//   serverAck,commandReceived,pushNotification
//   carsConnected,lastUpdated
client.on('status', status => {
  console.log('status', status);
});

// raw messages
client.on('raw', msg => {
  console.log('raw message', msg);
})

// send command
client.send('stat');

// Send raw command
client.sendRaw('MP-0 A');
```

## Contribute

Feel free to send pull-requests

## License

MIT
