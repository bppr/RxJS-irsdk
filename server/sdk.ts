// import * as SDK from 'node-irsdk-2021';

// this is needed to hack around .node file for build
const SDK = require('node-irsdk-2021');

const opts = {
  sessionInfoUpdateInterval: 100,
  telemetryUpdateInterval: 50,
};

export function initSDK() {
  const irsdk = SDK.init(opts);

  irsdk.on('Connected', () => console.log('iRacing connection'));
  irsdk.on('Disconnected', () => console.log('iRacing disconnection'));

  return irsdk;
}