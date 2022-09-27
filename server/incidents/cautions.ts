import { AppStateUpdate, CarState } from "../state";
import { inRange } from '../utils/inRange';
import { trackLengthState } from '../utils/trackLength';

type CautionIncident = { car: CarState; range: number; };
const distanceThreshold = 50;

export function detectCautionIncidents() {
  const getTrackLength = trackLengthState();

  return ({ previous, current }: AppStateUpdate): CautionIncident[] => {
    const trackLength = getTrackLength(current);
    const range = trackLength / distanceThreshold;

    return current.cars.flatMap(car => {
      const prevCar = previous.findCar(car.number) || { xCount: 0 };

      return (car.xCount - prevCar.xCount) >= 2
        ? [{ car, range }]
        : [];
    });
  };
}

// TODO: test this a little more - should work fine? maybe tweak range?
export function hasProximity(incidents: CautionIncident[]) {
  if (incidents.length <= 1)
    return false;

  function otherIncidentsInRange({ car, range }: CautionIncident) {
    return !!incidents.find(other => inRange(car, other.car, range));
  }

  return !!incidents.find(otherIncidentsInRange);
}
