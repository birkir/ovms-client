# OVMS Client

This is a simple OVMS client written for NodeJS.

## Usage

```js
const { OVMSClient } = require('ovms-client');

// host, port, vehicle id, password
const client = new OVMSClient('api.openvehicles.com', 6867, 'DEMO', 'DEMO');
// Note: commands won't work with the DEMO vehicle

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

// command responses:
client.on('commandReceived', response => {
  // see https://docs.openvehicles.com/en/latest/protocol_v2/messages.html#command-response-0x63-c
  let [ command, result, message ] = response.split(',');
  console.log('command', command, 'result', result);
  if (message) {
    console.log(message.replace(/\r/g, String.fromCharCode(10)));
  }
});

// wait for connection:
client.on('connected', callback => {

  // Send a ping
  // (see https://docs.openvehicles.com/en/latest/protocol_v2/messages.html)
  client.sendRaw('MP-0 A');

  // Send a shell command
  // (see https://docs.openvehicles.com/en/latest/protocol_v2/commands.html)
  client.send('7,stat');

  // Send a lock command using PIN 1234
  client.send('20,1234');

});
```

## Contribute

Feel free to send pull-requests

## License

MIT