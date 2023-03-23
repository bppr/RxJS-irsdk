import { difference } from 'lodash';
import { Flag } from './messages';
import { AppStateUpdate } from "./state";

const WHITELIST = [
  'Furled',
  'Repair',
  'Black'
]

export function detectFlags({ current, previous }: AppStateUpdate): Flag[] {
  return current.cars.flatMap(car => {
    const prevCar = previous.findCar(car.number);

    if (!prevCar || car.trackSurface === 'NotInWorld')
      return [];

    const diff = difference(car.flags, prevCar.flags);
    // console.log(`${car.number} - ${diff}`)
    const flags = diff.filter(f => WHITELIST.includes(f))
    
    return flags.length == 0
      ? []
      : [{ 
          car: { number: car.number, driver: car.driver.name },
          flags,
          time: current.session 
        }];
  });
}