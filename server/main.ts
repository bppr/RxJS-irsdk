import { initializeStreams } from './streams';
import { startServer, publish } from './web';
import * as SDK from 'node-irsdk-2021';

export function main() {
  const irsdk = SDK.init({
    sessionInfoUpdateInterval: 100,
    telemetryUpdateInterval: 50,
  });

  irsdk.on('Connected', () => console.log('Connection!'));

  const { clock, referrals } = initializeStreams(irsdk);
  const { server, sockets } = startServer(message => {
    console.log('Received %s', message);

    // irsdk.camControls.switchToCar(message)
  });

  clock.subscribe(session => publish(sockets.system, session));
  referrals.subscribe(ref => publish(sockets.referral, ref));

  server.listen(3000, () => console.log("Server started."));
}