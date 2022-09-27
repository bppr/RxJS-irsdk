import { xor } from 'lodash';
import { AppStateUpdate } from "./state";

export type Flag = {
  car: string;
  event: 'added' | 'removed';
  flags: string[];
};

export function detectFlags({ current, previous }: AppStateUpdate): Flag[] {
  return current.cars.flatMap(car => {
    const prevCar = previous.findCar(car.number);

    if (!prevCar || car.trackSurface === 'NotInWorld')
      return [];

    const diff = xor(car.flags, prevCar.flags);
    if (diff.length == 0)
      return [];

    return [{
      car: car.number,
      event: car.flags.length > prevCar.flags.length ? 'added' : 'removed',
      flags: diff
    }];
  });
}