import { initSDK } from './sdk';
import { streams } from './streams';
import { initWeb } from './web';


export function main() {
  const irsdk = initSDK();
  
  const { clock, cautions, flags, incidents } = streams(irsdk);
  
  const web = initWeb(irsdk);
  const publishTo = <T>(channel: string) => (data: T) => web.publish(channel, data)

  // clock.subscribe(publishTo('clock'));
  incidents.subscribe(publishTo('incident'));
  cautions.subscribe(publishTo('caution'));
  flags.subscribe(publishTo('flag'));

  web.run();
}