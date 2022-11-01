import { xor } from 'lodash';
import { Flag } from './messages';
import { AppStateUpdate } from "./state";

export function detectFlags({ current, previous }: AppStateUpdate): Flag[] {
  return current.cars.flatMap(car => {
    const prevCar = previous.findCar(car.number);

    if (!prevCar || car.trackSurface === 'NotInWorld')
      return [];

    const diff = xor(car.flags, prevCar.flags);
    
    if (diff.length == 0 || car.flags.length < prevCar.flags.length)
      return [];

    return [{
      car: car,
      flags: diff,
      time: current.session
    }];
  });
}