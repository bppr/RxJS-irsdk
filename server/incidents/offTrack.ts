import { IncidentMapper } from "./index";
import { AppState, CarState } from "../state";
import { createTargetStateTimer } from './targetStateTimer';
import { trackLengthState } from "../utils/trackLength";
import { inRange } from "../utils/inRange";

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
    inTargetState: (car) => car.trackSurface === "OffTrack",
    onTimeout: (car, appState) => [{ car, time: appState.session, type: "Off-Track" }],
    onStateExited(car, appState, __duration, __timeExceeded) {
      if (car.trackSurface !== "OnTrack" || appState.session.type === "Lone Qualify")
        return []; // don't create incidents for reset | disappear | lone quali

      return getNearbyCars(appState, car).length > 0
        ? [{ car, time: appState.session, type: "Unsafe Rejoin" }]
        : [];
    }
  });
}
