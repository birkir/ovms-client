// Init OVMS client library:
const { OVMSClient } = require('ovms-client');

// Read client configuration:
const config = require('./config.json');

// Process command line arguments:
if (process.argv.length !== 3) {
  process.stderr.write('Usage: cmd.js "ovms shell command"\n');
  process.exit(1);
}
const command = process.argv[2];

// Connect to OVMS server:
const client = new OVMSClient(config.host, config.port, config.vehicleid, config.password);
client.connect();

client.on('commandReceived', response => {
  // Process command response:
  let [ command, result, message ] = response.split(',');
  if (message) {
    process.stdout.write(message.replace(/\r/g, String.fromCharCode(10)));
  } else {
    const resname = [ 'OK', 'FAILED', 'UNSUPPORTED', 'UNIMPLEMENTED' ];
    process.stdout.write(resname[result] + '\n');
  }
  // Exit:
  process.exit(result);
});

client.on('connected', callback => {
  // Send command:
  client.send('7,' + command);
});
