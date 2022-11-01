import { difference } from 'lodash';
import { Flag } from './messages';
import { AppStateUpdate } from "./state";

export function detectFlags({ current, previous }: AppStateUpdate): Flag[] {
  return current.cars.flatMap(car => {
    const prevCar = previous.findCar(car.number);

    if (!prevCar || car.trackSurface === 'NotInWorld')
      return [];

    const diff = difference(car.flags, prevCar.flags);
    
    if (diff.length == 0)
      return [];

    console.log("FLAGS:", diff.join(", "));

    return [{
      car: { number: car.number, driver: car.driver.name },
      flags: diff,
      time: current.session
    }];
  });
}