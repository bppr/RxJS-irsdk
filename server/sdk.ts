import * as SDK from 'node-irsdk-2021';

const opts = {
  sessionInfoUpdateInterval: 100,
  telemetryUpdateInterval: 50,
};

export function initSDK() {
  const irsdk = SDK.init(opts);

  irsdk.on('connected', () => console.log('iRacing connection'));
  irsdk.on('disconnected', () => console.log('iRacing disconnection'));

  return irsdk;
}