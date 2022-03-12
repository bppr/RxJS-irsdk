import { IncidentMapper } from "app/main";
import { AppState, CarState } from "../state";
import { createTargetStateTimer } from './targetStateTimer';

type OffTrackConfig = {
  timeLimit: number
  rejoinRange: number
}

export function offTrack({ timeLimit, rejoinRange }: OffTrackConfig): IncidentMapper {
  const getTrackLength = trackLengthState();

  function getNearbyCars(state: AppState, car: CarState) {
    const range = rejoinRange / getTrackLength(state);
    return state.cars.filter(otherCar => inRange(car, otherCar, range));
  }

  return createTargetStateTimer({
    timeLimit,
    inTargetState: (car) => car.trackSurface === "Off-Track",
    onTimeout: (car, appState) => [{ car, time: appState.session, type: "Off-Track" }],
    onStateExited(car, appState, __duration, __timeExceeded) {
      if (car.trackSurface !== "OnTrack")
        return []; // don't create incidents for reset | disappear

      return getNearbyCars(appState, car).length > 0
        ? [{ car, time: appState.session, type: "Unsafe Rejoin" }]
        : [];
    }
  });
}

function inRange(car: CarState, otherCar: CarState, range: number) {
  const theirLoc = otherCar.currentLapPct;
  return car.index !== otherCar.index 
    && insideTrackRange(car.currentLapPct, theirLoc - range, theirLoc + range);
}

function insideTrackRange(value: number, min: number, max: number): boolean {
  // modulo all values to get them between 0 and 1
  value -= Math.floor(value);
  min -= Math.floor(min);
  max -= Math.floor(max);

  // adjust min and max so that they're in the proper order
  if (max < min)
    max += 1.0;

  return (value >= min && value <= max) ||
    ((value + 1) >= min && (value + 1) <= max);
}

// cache track length to not recompute it every update
function trackLengthState() {
  let lengthStr = '', length = 10000000;
  
  return (state: AppState) => {
    if(state.weekend.trackLength !== lengthStr) {
      lengthStr = state.weekend.trackLength;
      length = getTrackLengthNumeric(lengthStr);
    }

    return length;
  }
}

function getTrackLengthNumeric(str: string): number {
  const match = new RegExp("^(\\d+(\\.\\d+)?) (\\w+)$")
    .exec(str);

  if (match) {
    const trackLength = +(match[1]);
    const distanceUnit = match[3];

    return trackLength * (distanceUnit == "km" ? 1000 : 1609.344);
  }

  return 10000000;
}
