import { AppState } from "../state";

// cache track length to not recompute it every update
export function trackLengthState() {
  let lengthStr = '', length = 10000000;

  return (state: AppState) => {
    if (state.weekend.trackLength !== lengthStr) {
      lengthStr = state.weekend.trackLength;
      length = getTrackLengthNumeric(lengthStr);
    }

    return length;
  };
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
